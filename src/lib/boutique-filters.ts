import type { Product } from './catalog';
import { hasCategory } from './product-categories';
import { productPlainText } from './product-text';
import { matchesProductSearch } from './product-search';
import { sameBrand } from './product-brands';

export const technicalFacets = ['Processeur', 'Mémoire vive', 'Stockage SSD', 'Carte graphique', 'Taille de l’écran', 'Système d’exploitation'] as const;
export function productFacets(product: Product): Record<string, string[]> {
  const text = productPlainText(`${product.name} ${product.detail}`);
  const matches = (pattern: RegExp) => [...new Set((text.match(pattern) ?? []).map(value => value.replace(/\s+/g, ' ').trim()))];
  return {
    Processeur: matches(/(?:Intel\s+)?Core\s+(?:Ultra\s+)?[3579]|(?:AMD\s+)?Ryzen\s+[3579]|Apple\s+M[1-9]/gi),
    'Mémoire vive': matches(/\b(?:4|8|16|24|32|64|128)\s*Go\b/gi),
    'Stockage SSD': matches(/\b(?:128|256|512)\s*(?:Go|GB)\b|\b[1248]\s*To\b/gi),
    'Carte graphique': matches(/NVIDIA\s+(?:GeForce\s+)?RTX\s*\d*|Intel\s+(?:Arc|UHD|Graphics)|AMD\s+Radeon/gi),
    'Taille de l’écran': matches(/\b\d{2}(?:[.,]\d)?\s*(?:pouces|"|″)/gi),
    'Système d’exploitation': matches(/Windows\s+11\s*(?:Pro|Famille|Home)?|FreeDOS|macOS/gi),
  };
}
export type BoutiqueFilters = { category: string; query: string; min: number; max: number; selected: Record<string, string[]>; sort: string };
export function selectBoutiqueProducts(products: Product[], filters: BoutiqueFilters) {
  const query = filters.query.toLocaleLowerCase('fr').trim();
  return products.filter(product => {
    if (product.hidden || !hasCategory(product, filters.category) || product.price < filters.min || product.price > filters.max) return false;
    if (!matchesProductSearch(product, query)) return false;
    const facets: Record<string, string[]> = { ...productFacets(product), Marque: [product.brand], Disponibilité: [product.availability || 'Sur demande'] };
    return Object.entries(filters.selected).every(([key, values]) => values.length === 0 || values.some(value => key === 'Marque' ? sameBrand(product.brand, value) : (facets[key] ?? []).includes(value)));
  }).sort((a, b) => filters.sort === 'price-up' ? a.price - b.price : filters.sort === 'price-down' ? b.price - a.price : filters.sort === 'name' ? a.name.localeCompare(b.name, 'fr') : 0);
}