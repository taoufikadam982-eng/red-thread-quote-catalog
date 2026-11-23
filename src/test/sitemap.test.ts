import { describe, expect, it } from 'vitest';
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { sitemapStaticPaths, sitemapPathForLocation, sitemapXML } from '@/lib/sitemap';
import { allSitemapRows } from '@/lib/sitemap-source';

function fixtureRouter() {
  const root = createRootRoute({ staticData: { sitemap: false } });
  const home = createRoute({ getParentRoute: () => root, path: '/', staticData: { sitemap: true } });
  const boutique = createRoute({ getParentRoute: () => root, path: '/boutique', staticData: { sitemap: true } });
  const personal = createRoute({ getParentRoute: () => root, path: '/assistant', staticData: { sitemap: false } });
  const privateLayout = createRoute({ getParentRoute: () => root, id: '_private', staticData: { sitemap: 'exclude-subtree' } });
  const admin = createRoute({ getParentRoute: () => privateLayout, path: '/admin', staticData: { sitemap: true } });
  const product = createRoute({ getParentRoute: () => root, path: '/produit/$id', staticData: { sitemap: true } });
  return createRouter({ routeTree: root.addChildren([home, boutique, personal, privateLayout.addChildren([admin]), product]) });
}
describe('public sitemap', () => {
  it('derives static routes and preserves subtree/personal exclusions', () => {
    expect(sitemapStaticPaths(fixtureRouter())).toEqual(['/', '/boutique']);
  });
  it('allows typed product paths but rejects search URLs', () => {
    const router = fixtureRouter();
    expect(sitemapPathForLocation(router, { pathname: '/produit/pc-1', publicHref: '/produit/pc-1' }, '/produit/$id')).toBe('/produit/pc-1');
    expect(sitemapPathForLocation(router, { pathname: '/boutique', publicHref: '/boutique?brand=ASUS' }, '/boutique')).toBeUndefined();
  });
  it('escapes URLs, deduplicates and omits invented lastmod dates', () => {
    const xml = sitemapXML('https://red-thread-quote-catalog.lovable.app', [{ path: '/' }, { path: '/' }, { path: '/produit/a&b' }]);
    expect(xml.match(/<url>/g)).toHaveLength(2);
    expect(xml).toContain('/produit/a&amp;b');
    expect(xml).not.toContain('lastmod');
  });
  it('reads beyond the first batch using stable offsets', async () => {
    const offsets: number[] = [];
    const result = await allSitemapRows(async from => { offsets.push(from); return { data: from === 0 ? [{ id: 'a' }, { id: 'b' }] : from === 2 ? [{ id: 'c' }] : [], error: null }; }, 2);
    expect(result.map(row => row.id)).toEqual(['a', 'b', 'c']);
    expect(offsets).toEqual([0, 2, 3]);
  });
  it('rejects later-batch failures rather than returning a successful partial sitemap', async () => {
    await expect(allSitemapRows(async from => from === 0 ? { data: [{ id: 'a' }], error: null } : { data: null, error: new Error('Read denied') }, 1)).rejects.toThrow('Read denied');
  });
});