import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getPublicProducts } from './products.functions';
import { parseRecommendationIds } from './recommendations';

const cache = new Map<string, { ids: string[]; at: number }>();
const cacheMs = 6 * 60 * 60 * 1000;

export const getAiRecommendations = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string().min(1).max(100) }))
  .handler(async ({ data }): Promise<{ ids: string[] }> => {
    const cached = cache.get(data.id);
    if (cached && Date.now() - cached.at < cacheMs) return { ids: cached.ids };
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) return { ids: [] };
    const products = await getPublicProducts();
    const product = products.find(item => item.id === data.id);
    if (!product) return { ids: [] };
    const others = products.filter(item => item.id !== product.id).slice(0, 120)
      .map(item => ({ id: item.id, name: item.name, brand: item.brand, categories: item.categories, price: item.price, specs: String(item.specs ?? '').slice(0, 160) }));
    const describe = { name: product.name, brand: product.brand, categories: product.categories, price: product.price, specs: String(product.specs ?? '').slice(0, 400), usage: product.usage };
    try {
      const [{ createOpenAI }, { streamText }, { createLovableAiGatewayRunIdFetch }] = await Promise.all([import('@ai-sdk/openai'), import('ai'), import('./assistant/run-id.server.ts')]);
      const runIdFetch = createLovableAiGatewayRunIdFetch();
      const provider = createOpenAI({ baseURL: 'https://ai.gateway.lovable.dev/v1', apiKey, headers: { 'Lovable-API-Key': apiKey, 'X-Lovable-AIG-SDK': 'vercel-ai-sdk' }, fetch: runIdFetch.fetch });
      const result = streamText({
        model: provider.responses('openai/gpt-6-astra'),
        maxRetries: 0,
        system: 'You recommend related IT products for a B2B store. Choose up to 4 products a buyer of the current product would also like: complementary accessories, peripherals or close alternatives. Only use ids from the catalogue given. Reply with a JSON array of id strings only.',
        prompt: `Current product: ${JSON.stringify(describe)}\nCatalogue: ${JSON.stringify(others)}`,
        providerOptions: { openai: { forceReasoning: true, reasoningEffort: 'low', store: false } },
      });
      const valid = new Set(others.map(item => item.id));
      const ids = parseRecommendationIds(await result.text).filter(id => valid.has(id)).slice(0, 4);
      cache.set(data.id, { ids, at: Date.now() });
      return { ids };
    } catch (error) {
      console.error('Recommendations unavailable', error instanceof Error ? error.message : 'unknown');
      return { ids: [] };
    }
  });
