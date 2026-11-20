import { describe, expect, it } from 'vitest';
import { products } from '@/lib/catalog';
import { groupedProductSearch, matchesProductSearch, SEARCH_DEBOUNCE_MS, searchPrice } from '@/lib/product-search';
import { selectBoutiqueProducts } from '@/lib/boutique-filters';

const base = products[0];
if (!base) throw new Error('Missing fixture');
describe('header live search', () => {
  it('uses a 150ms debounce', () => { expect(SEARCH_DEBOUNCE_MS).toBe(150); });
  it('matches one character, accents, case, brands, references, categories and specifications', () => {
    const product = { ...base, name: 'Écran professionnel', category: 'Écrans', reference: 'REF-É', brand: 'Dell', detail: '<p>IPS · USB-C</p>' };
    for (const query of ['e', 'ECRAN', 'dell', 'ref-e', 'ecrans', 'usb-c']) expect(matchesProductSearch(product, query)).toBe(true);
    expect(matchesProductSearch(product, 'introuvable')).toBe(false);
  });
  it('excludes hidden products and caps each group at four while counting every match', () => {
    const pool = Array.from({ length: 6 }, (_, index) => ({ ...base, id: `item-${index}`, hidden: index === 5 }));
    const result = groupedProductSearch(pool, 'HP');
    expect(result.total).toBe(5);
    expect(result.groups[0]?.count).toBe(5);
    expect(result.groups[0]?.products).toHaveLength(4);
  });
  it('orders groups by official category and counts multi-category products once', () => {
    const result = groupedProductSearch([{ ...base, id: 'monitor', category: 'Écrans', name: 'HP Écran' }, { ...base, categories: ['Ordinateurs portables', 'Workstations'] }], 'HP');
    expect(result.total).toBe(2);
    expect(result.groups.map(group => group.category)).toEqual(['Ordinateurs portables', 'Écrans']);
  });
  it('returns no suggestions for an empty query', () => { expect(groupedProductSearch([base], ' ')).toEqual({ total: 0, groups: [] }); });
  it('keeps Boutique results consistent for accent-insensitive category searches', () => {
    const monitor = { ...base, category: 'Écrans', name: 'Dell P2222H' };
    expect(selectBoutiqueProducts([monitor], { category: 'Écrans', query: 'ecrans', min: 0, max: 20000, selected: {}, sort: 'name' })).toEqual([monitor]);
  });
  it('formats DH prices with dotted thousands and uses Sur devis for zero prices', () => {
    expect(searchPrice(11800)).toBe('11.800 DH');
    expect(searchPrice(0)).toBe('Sur devis');
  });
});