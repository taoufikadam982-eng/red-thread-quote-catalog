import { describe, it, expect } from 'vitest';
import { products, addQuoteItem, recommendProducts } from '@/lib/catalog';
import { quoteSchema } from '@/lib/quote-schema';
describe('SESA commercial rules', () => {
  it.each([['probook', 11800], ['dell-tower', 8290], ['zbook', 24950], ['laserjet', 4200], ['hp-monitor', 2390]])('keeps the indicative TTC price for %s', (id, price) => { expect(products.find(p => p.id === id)?.price).toBe(price); });
  it('collects products into a single quote with quantities', () => { expect(addQuoteItem(addQuoteItem([], 'probook'), 'probook')).toEqual([{ id: 'probook', quantity: 2 }]); });
  it('does not add an unknown product', () => { expect(addQuoteItem([], 'unknown')).toEqual([]); });
  it('rejects checkout and payment request types', () => { expect(quoteSchema.safeParse({ name: 'Test SESA', email: 'test@example.com', phone: '0537765777', request_type: 'Checkout', message: 'Test devis', items: [] }).success).toBe(false); });
  it('recommends the workstation for creative work', () => { expect(recommendProducts(['Créer des visuels ou des vidéos']).map(p => p.id)).toContain('zbook'); });
  it('keeps recommendations under a selected 10000 DH budget', () => { expect(recommendProducts(['Travailler', 'Moins de 10 000 DH']).map(p => p.price)).toEqual([8290]); });
});