import { useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from './ui/button';
import { Conversation, ConversationContent, ConversationScrollButton } from './ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from './ai-elements/message';
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from './ai-elements/prompt-input';
import { Shimmer } from './ai-elements/shimmer';
import { Reasoning, ReasoningTrigger, ReasoningContent } from './ai-elements/reasoning';
import { LogOut, ArrowRight } from 'lucide-react';
import logo from '@/assets/sesa-logo-white.png';

async function authenticatedFetch(input: RequestInfo | URL, init?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error('Connectez-vous pour poser votre question.');
  const headers = new Headers(init?.headers); headers.set('Authorization', `Bearer ${data.session.access_token}`);
  const response = await fetch(input, { ...init, headers });
  if (!response.ok) { const error = await response.json().catch(() => ({})); throw new Error(error.message ?? 'Assistant momentanément indisponible.'); }
  return response;
}
export function SesaAssistant() {
  const session = useQuery({ queryKey: ['assistant-session'], queryFn: async () => { const { data } = await supabase.auth.getUser(); return data.user; } });
  const [error, setError] = useState('');
  async function login(provider: 'google' | 'lovable') {
    sessionStorage.setItem('sesa-assistant-return', '1');
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (result.error) setError(result.error.message);
    else await session.refetch();
  }
  return <main className="assistant-page site-width">
    <header className="assistant-page-heading"><p className="eyebrow">CONSEIL SESA</p><h1>Votre interlocuteur informatique.</h1><p>Services, showroom et avis de nos clients.</p></header>
    {session.isPending ? <p role="status">Chargement…</p> : session.data ? <SavedAssistant key={session.data.id} userId={session.data.id} email={session.data.email ?? ''}/> : <section className="assistant-signin"><h2>Bienvenue chez SESA.</h2><p>Connectez-vous pour conserver votre conversation dans votre compte.</p><div><Button onClick={() => login('google')}>Continuer avec Google<ArrowRight/></Button><Button variant="outline" onClick={() => login('lovable')}>Continuer avec Lovable<ArrowRight/></Button></div>{error && <p role="alert">{error}</p>}</section>}
  </main>;
}
function SavedAssistant({ userId, email }: { userId: string; email: string }) {
  const history = useQuery({ queryKey: ['assistant-history', userId], queryFn: async () => { const response = await authenticatedFetch('/api/public/assistant'); const result = await response.json(); return result.messages as UIMessage[]; } });
  if (history.isPending) return <p role="status">Votre conversation…</p>;
  if (history.error) return <p role="alert">{history.error.message}</p>;
  return <AssistantChat userId={userId} email={email} initialMessages={history.data ?? []}/>;
}
function AssistantChat({ userId, email, initialMessages }: { userId: string; email: string; initialMessages: UIMessage[] }) {
  const [text, setText] = useState(''); const input = useRef<HTMLTextAreaElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/public/assistant', fetch: authenticatedFetch, prepareSendMessagesRequest: ({ messages }) => ({ body: { messages: messages.map(message => ({ id: message.id, role: message.role, parts: message.parts.filter(part => part.type === 'text') })).filter(message => message.parts.length) } }) }), []);
  const { messages, status, sendMessage, stop, error } = useChat({ id: userId, messages: initialMessages, transport });
  const busy = status === 'submitted' || status === 'streaming';
  useEffect(() => { if (!busy) input.current?.focus(); }, [busy]);
  return <section className="assistant-workspace">
    <div className="assistant-topline"><div className="assistant-identity"><img src={logo} alt="SESA Informatique"/><span>Conseiller SESA <small>Assistant IA</small></span></div><Button variant="dark" size="icon" title="Se déconnecter" aria-label="Se déconnecter" onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}><LogOut/></Button></div>
    <Conversation className="assistant-conversation"><ConversationContent>
      {!messages.length && <div className="assistant-empty"><h2>Bonjour, comment puis-je vous aider ?</h2><div>{['Que disent vos clients ?', 'Quels sont vos horaires ?', 'Comment demander un devis ?'].map(question => <Button variant="outline" key={question} onClick={() => { void sendMessage({ text: question }); input.current?.focus(); }}>{question}</Button>)}</div></div>}
      {messages.map(message => <Message key={message.id} from={message.role}><MessageContent className={message.role === 'user' ? 'assistant-user-message' : ''}>{message.parts.map((part, i) => part.type === 'text' ? <MessageResponse key={i}>{part.text}</MessageResponse> : part.type === 'reasoning' ? <Reasoning key={i} isStreaming={busy} defaultOpen={false}><ReasoningTrigger/><ReasoningContent>{part.text}</ReasoningContent></Reasoning> : null)}</MessageContent></Message>)}
      {busy && <Shimmer>SESA prépare votre réponse…</Shimmer>}
      {error && <p role="alert" className="assistant-error">{error.message}</p>}
    </ConversationContent><ConversationScrollButton/></Conversation>
    <div className="assistant-composer"><PromptInput onSubmit={({ text: question }) => { if (!question.trim() || busy) return; void sendMessage({ text: question }); setText(''); input.current?.focus(); }}><PromptInputTextarea ref={input} autoFocus aria-label="Votre question à SESA" placeholder="Votre question…" value={text} onChange={event => setText(event.target.value)}/><PromptInputFooter className="justify-end"><PromptInputSubmit aria-label={busy ? 'Arrêter la réponse' : 'Envoyer la question'} title={busy ? 'Arrêter' : 'Envoyer'} status={status} onStop={stop} disabled={!busy && !text.trim()}/></PromptInputFooter></PromptInput><p className="assistant-disclosure">{email} · Conversation privée enregistrée · Réponses IA à confirmer auprès de SESA.</p></div>
  </section>;
}