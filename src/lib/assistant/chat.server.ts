import { createClient } from '@supabase/supabase-js';
import { convertToModelMessages, validateUIMessages, type UIMessage } from 'ai';
import { assistantRequestSchema } from './request';
import { assistantInstructions } from './knowledge.server';
import { createResponsesCall } from './responses.server';
import { withLovableAiGatewayRunIdHeader } from './run-id.server';

async function customerClient(request: Request) {
  const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  const authorization = request.headers.get('Authorization');
  if (!url || !key) throw new Error('Service indisponible.');
  if (!authorization?.startsWith('Bearer ')) return null;
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: authorization }, fetch: (input, init) => { const headers = new Headers(init?.headers); headers.set('apikey', key); return fetch(input, { ...init, headers }); } } });
  const { data, error } = await client.auth.getUser(authorization.slice(7));
  if (error || !data.user) return null;
  return { client, userId: data.user.id };
}
const jsonError = (message: string, status: number) => Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function handleAssistant(request: Request) {
  try {
    const auth = await customerClient(request);
    if (!auth) return jsonError('Connectez-vous pour retrouver votre conversation SESA.', 401);
    if (request.method === 'GET') {
      const { data, error } = await auth.client.from('assistant_conversations').select('messages').eq('user_id', auth.userId).maybeSingle();
      if (error) return jsonError('Votre conversation ne peut pas être chargée.', 503);
      return Response.json({ messages: data?.messages ?? [] }, { headers: { 'Cache-Control': 'private, no-store' } });
    }
    const origin = request.headers.get('Origin');
    if (origin && origin !== new URL(request.url).origin) return jsonError('Origine de la demande refusée.', 403);
    const parsed = assistantRequestSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError('Question non valide. Envoyez uniquement du texte.', 400);
    const messages = await validateUIMessages<UIMessage>({ messages: parsed.data.messages });
    if (messages.at(-1)?.role !== 'user') return jsonError('Une question est nécessaire.', 400);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: paused, error: stateError } = await supabaseAdmin.from('assistant_gateway_state').select('status,message').eq('id', 'gateway').maybeSingle();
    if (stateError) return jsonError('Assistant momentanément indisponible.', 503);
    if (paused) return jsonError(paused.message, paused.status);
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) return jsonError('Assistant non configuré.', 503);
    const { error: saveError } = await auth.client.from('assistant_conversations').upsert({ user_id: auth.userId, messages, updated_at: new Date().toISOString() });
    if (saveError) return jsonError('Votre question n’a pas pu être enregistrée.', 503);
    const modelMessages = await convertToModelMessages(messages);
    let resolveUpstream: (response: Response) => void = () => {};
    const upstreamReady = new Promise<Response>(resolve => { resolveUpstream = resolve; });
    const { result, runIdFetch } = createResponsesCall(request, { apiKey, baseURL: 'https://ai.gateway.lovable.dev/v1', model: 'openai/gpt-6-astra' }, modelMessages, assistantInstructions(), async response => {
      if (!response.ok) {
        const body = await response.clone().text();
        console.error('AI Gateway failure', response.status, body);
        if ([402, 403].includes(response.status)) {
          let message = 'Assistant temporairement suspendu.';
          try { const parsedBody = JSON.parse(body); message = parsedBody.message ?? parsedBody.error?.message ?? message; } catch { /* Keep safe fallback. */ }
          const { error } = await supabaseAdmin.from('assistant_gateway_state').upsert({ id: 'gateway', status: response.status, message });
          if (error) console.error('Assistant pause save failed', error.code);
        }
      }
      resolveUpstream(response);
    });
    const stream = result.toUIMessageStreamResponse({ originalMessages: messages, sendReasoning: true,
      onError: error => error instanceof Error ? error.message : 'Assistant indisponible.',
      onFinish: async ({ messages: completed }) => {
        const textOnly = completed.map(message => ({ ...message, parts: message.parts.filter(part => part.type === 'text') })).filter(message => message.parts.length);
        const { error } = await auth.client.from('assistant_conversations').upsert({ user_id: auth.userId, messages: textOnly, updated_at: new Date().toISOString() });
        if (error) { console.error('Assistant history save failed', error.code); throw new Error('La réponse n’a pas pu être sauvegardée.'); }
      },
    });
    const upstream = await Promise.race([upstreamReady, runIdFetch.waitForRunId().then(() => upstreamReady)]);
    if (!upstream.ok) {
      const body = await upstream.clone().text();
      let message = 'Assistant indisponible.';
      try { const parsedBody = JSON.parse(body); message = parsedBody.message ?? parsedBody.error?.message ?? message; } catch { /* Keep safe fallback. */ }
      return jsonError(message, upstream.status);
    }
    return withLovableAiGatewayRunIdHeader(stream, runIdFetch, { 'Cache-Control': 'private, no-store' });
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499 });
    const failure = error as { statusCode?: number; responseBody?: string; message?: string };
    const status = failure.statusCode ?? 500;
    let message = failure.message ?? 'Assistant momentanément indisponible.';
    if (failure.responseBody) { try { const body = JSON.parse(failure.responseBody); message = body.message ?? body.error?.message ?? message; } catch { /* Keep SDK safe message. */ } }
    if (status === 402 || status === 403) {
      const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
      const { error: pauseError } = await supabaseAdmin.from('assistant_gateway_state').upsert({ id: 'gateway', status, message });
      if (pauseError) console.error('Assistant pause save failed', pauseError.code);
    }
    console.error('Assistant request failed', status, message);
    return jsonError(message, status);
  }
}