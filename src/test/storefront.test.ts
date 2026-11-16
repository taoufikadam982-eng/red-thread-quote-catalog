import { describe, expect, it } from 'vitest';
import { products } from '@/lib/catalog';
import { filterCatalogue, store } from '@/lib/storefront';
import { newsletterSchema } from '@/lib/newsletter-schema';
describe('new storefront business rules', () => {
  it('lists the scanner at 4690 DH', () => expect(products.find(p => p.id === 'scanjet')?.price).toBe(4690));
  it('uses the supplied ZBook reference', () => expect(products.find(p => p.id === 'zbook')?.reference).toBe('D2TE5AT'));
  it('keeps weekday showroom hours', () => expect(store.hours.weekday).toBe('9h–18h30'));
  it('keeps Saturday showroom hours', () => expect(store.hours.saturday).toBe('9h30–13h'));
  it('keeps the quote response target', () => expect(store.quoteHours).toBe(24));
  it('filters category and brand together', () => expect(filterCatalogue(products, 'Scanners', 'HP', '').map(p => p.id)).toEqual(['scanjet']));
  it('rejects newsletter signup without consent', () => expect(newsletterSchema.safeParse({ email: 'person@example.com', consent: false }).success).toBe(false));
  it('rejects newsletter signup with a filled honeypot', () => expect(newsletterSchema.safeParse({ email: 'person@example.com', consent: true, website: 'spam' }).success).toBe(false));
});