import { describe, expect, it } from 'vitest';
import { products, type Product } from '@/lib/catalog';
import { productFacets, selectBoutiqueProducts, type BoutiqueFilters } from '@/lib/boutique-filters';

const filters: BoutiqueFilters = { category: '', query: '', min: 0, max: 100000, selected: {}, sort: 'price-up' };
describe('Boutique product selection', () => {
  it('filters by brand and sorts real prices ascending', () => {
    expect(selectBoutiqueProducts(products, { ...filters, selected: { Marque: ['HP'] } }).map(p => p.price)).toEqual([2390, 4200, 4690, 11800, 24950]);
  });
  it('combines budget and category', () => {
    expect(selectBoutiqueProducts(products, { ...filters, category: 'Ordinateurs portables', max: 10000 })).toEqual([]);
  });
  it('searches references regardless of case', () => {
    expect(selectBoutiqueProducts(products, { ...filters, query: 'c84s1at' }).map(p => p.id)).toEqual(['probook']);
  });
  it('does not invent technical specifications', () => {
    const product = products[0];
    if (!product) throw new Error('Missing fixture');
    expect(productFacets(product)['Mémoire vive']).toEqual([]);
    expect(productFacets(product)['Taille de l’écran']).toEqual(['14 pouces']);
  });
  it('uses availability and technical facets together', () => {
    const product = products[0];
    if (!product) throw new Error('Missing fixture');
    const configured: Product = { ...product, detail: 'Intel Core Ultra 7 · 16 Go · 512 Go SSD · Windows 11 Pro', availability: 'En stock' };
    expect(selectBoutiqueProducts([configured], { ...filters, selected: { Disponibilité: ['En stock'], 'Mémoire vive': ['16 Go'] } })).toEqual([configured]);
    expect(selectBoutiqueProducts([configured], { ...filters, selected: { 'Mémoire vive': ['32 Go'] } })).toEqual([]);
  });
});