import { createFileRoute } from '@tanstack/react-router';
import { getRouterInstance } from '@tanstack/react-start';
import { isSitemapRouteIncluded, sitemapPathForLocation, sitemapStaticPaths, sitemapXML, type SitemapEntry } from '@/lib/sitemap';
import { allSitemapRows } from '@/lib/sitemap-source';
import { publicSiteOrigin } from '@/lib/seo';

export const Route = createFileRoute('/sitemap.xml')({
  staticData: { sitemap: false },
  server: { handlers: { GET: async () => {
    try {
      const router = await getRouterInstance();
      const entries: SitemapEntry[] = sitemapStaticPaths(router).map(path => ({ path }));
      const routeId = '/produit/$id';
      if (isSitemapRouteIncluded(router.routesById[routeId])) {
        const { createClient } = await import('@supabase/supabase-js');
        const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
        const url = process.env['SUPABASE_URL'];
        if (!key || !url) throw new Error('Public catalogue unavailable');
        const client = createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: { fetch: (input, init) => {
            const headers = new Headers(init?.headers);
            if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
            headers.set('apikey', key);
            return fetch(input, { ...init, headers });
          } },
        });
        const products = await allSitemapRows<{ id: string }>(async (from, to) => {
          const { data, error } = await client.from('products').select('id').eq('hidden', false).order('id').range(from, to);
          return { data, error };
        });
        for (const product of products) {
          const location = router.buildLocation({ to: '/produit/$id', params: { id: product.id }, search: () => ({}), hash: '' });
          const path = sitemapPathForLocation(router, location, routeId);
          if (path) entries.push({ path });
        }
      }
      if (!entries.length) return new Response('Sitemap unavailable', { status: 404, headers: { 'Cache-Control': 'no-store' } });
      return new Response(sitemapXML(publicSiteOrigin, entries), { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
    } catch {
      return new Response('Sitemap momentanément indisponible.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }
  } } },
});