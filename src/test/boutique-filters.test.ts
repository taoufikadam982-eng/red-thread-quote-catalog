import { describe, expect, it } from 'vitest';
import { products, type Product } from '@/lib/catalog';
import { productFacets, selectBoutiqueProducts, type BoutiqueFilters } from '@/lib/boutique-filters';
import { brandOptions } from '@/lib/product-brands';
import { filterCatalogue } from '@/lib/storefront';

const filters: BoutiqueFilters = { category: '', query: '', min: 0, max: 100000, selected: {}, sort: 'price-up' };
describe('Boutique product selection', () => {
  it('finds the published Asus product from the ASUS menu on both catalogue paths', () => {
    const fixture = products[0];
    if (!fixture) throw new Error('Missing fixture');
    const asus = { ...fixture, id: 'asus-zenbook', brand: 'Asus' };
    for (const brand of ['ASUS', 'asus', ' Asus ']) {
      expect(selectBoutiqueProducts([asus, ...products], { ...filters, selected: { Marque: [brand] } }).map(p => p.id)).toEqual(['asus-zenbook']);
      expect(filterCatalogue([asus, ...products], '', brand, '').map(p => p.id)).toEqual(['asus-zenbook']);
    }
    expect(selectBoutiqueProducts([{ ...asus, hidden: true }], { ...filters, selected: { Marque: ['ASUS'] } })).toEqual([]);
  });
  it('groups casing and spacing variants into one brand option without merging other brands', () => {
    expect(brandOptions(['ASUS', ' Asus ', 'HP', ''])).toEqual(['Asus', 'HP']);
  });
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
  it('keeps blank availability visible without treating it as a stock or order state', () => {
    const product = products[0];
    if (!product) throw new Error('Missing fixture');
    const blank: Product = { ...product, availability: '' };
    expect(selectBoutiqueProducts([blank], filters)).toEqual([blank]);
    for (const state of ['En stock', 'Sur commande', 'Rupture de stock', 'Sur demande']) {
      expect(selectBoutiqueProducts([blank], { ...filters, selected: { Disponibilité: [state] } })).toEqual([]);
    }
  });
});