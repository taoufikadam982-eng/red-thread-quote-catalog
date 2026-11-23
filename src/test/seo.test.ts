import { describe, it, expect } from 'vitest';
import { isNotFound } from '@tanstack/react-router';
import { pageUrl, productSeo, resolveSeoProduct, storeStructuredData } from '@/lib/seo';
import { applyIndexingPolicy } from '@/lib/indexing-policy';

const product = { id: 'pc-1', name: 'PC SESA', brand: 'HP', reference: 'REF-1', category: 'Ordinateurs portables', hidden: false };
describe('SEO lot A policies', () => {
  it('self-references the current public origin, not the unconnected domain', () => {
    expect(pageUrl('/boutique')).toBe('https://red-thread-quote-catalog.lovable.app/boutique');
    expect(productSeo(product).url).toBe('https://red-thread-quote-catalog.lovable.app/produit/pc-1');
  });
  it('returns notFound only for definitive missing references', () => {
    try { resolveSeoProduct([], 'missing'); throw new Error('Expected 404'); }
    catch (error) { expect(isNotFound(error)).toBe(true); }
  });
  it('never publishes a hidden reference', () => {
    try { resolveSeoProduct([{ ...product, hidden: true }], product.id); throw new Error('Expected 404'); }
    catch (error) { expect(isNotFound(error)).toBe(true); }
  });
  it('does not interpret a transport failure as a missing product', () => {
    try { resolveSeoProduct(undefined, product.id); throw new Error('Expected unavailable error'); }
    catch (error) { expect(isNotFound(error)).toBe(false); expect(error).toBeInstanceOf(Error); }
    expect(resolveSeoProduct([product], product.id)).toEqual(product);
  });
  it('uses confirmed weekday hours and omits ratings removed from the page', () => {
    expect(storeStructuredData.openingHoursSpecification).toEqual([{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:30', closes: '16:30' }]);
    expect(storeStructuredData).not.toHaveProperty('aggregateRating');
  });
  it('publishes product identity and breadcrumbs without fictitious offers or reviews', () => {
    const schemas = productSeo(product).scripts.map(script => JSON.parse(script.children));
    expect(schemas[0]).toMatchObject({ '@type': 'Product', name: 'PC SESA', sku: 'REF-1', brand: { name: 'HP' } });
    expect(schemas[0]).not.toHaveProperty('offers');
    expect(schemas[0]).not.toHaveProperty('aggregateRating');
    expect(schemas[1]?.itemListElement.at(-1)?.item).toBe(productSeo(product).url);
  });
  it('excludes only personal pages from indexing without blocking commercial filters', () => {
    for (const path of ['/admin', '/admin/', '/auth', '/reset-password', '/assistant']) {
      expect(applyIndexingPolicy(new Request(`https://example.com${path}`), new Response('ok')).headers.get('X-Robots-Tag')).toBe('noindex');
    }
    for (const path of ['/', '/boutique?brand=ASUS', '/catalogue', '/marques', '/produit/pc-1']) {
      expect(applyIndexingPolicy(new Request(`https://example.com${path}`), new Response('ok')).headers.get('X-Robots-Tag')).toBeNull();
    }
  });
});