import type { Product } from './catalog';
import { assignedCategories, officialCategories } from './product-categories';
import { productPlainText } from './product-text';

export const SEARCH_DEBOUNCE_MS = 150;
export const SEARCH_GROUP_LIMIT = 4;
export function normalizeSearch(value: string) {
  return productPlainText(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').replace(/\s+/g, ' ').trim();
}
export function matchesProductSearch(product: Product, query: string) {
  const key = normalizeSearch(query);
  return product.hidden !== true && (!key || normalizeSearch(`${product.name} ${product.brand} ${product.reference} ${assignedCategories(product).join(' ')} ${product.detail} ${product.usage}`).includes(key));
}
export function groupedProductSearch(products: Product[], query: string) {
  if (!normalizeSearch(query)) return { total: 0, groups: [] };
  const matches = products.filter(product => matchesProductSearch(product, query));
  const names = [...officialCategories, ...new Set(matches.map(product => assignedCategories(product)[0] ?? product.category))];
  const groups = [...new Set(names)].flatMap(category => {
    const items = matches.filter(product => (assignedCategories(product)[0] ?? product.category) === category);
    return items.length ? [{ category, count: items.length, products: items.slice(0, SEARCH_GROUP_LIMIT) }] : [];
  });
  return { total: matches.length, groups };
}
export function searchPrice(price: number) {
  return price > 0 ? `${new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 2 }).format(price).replace(/[\s\u00a0\u202f]/g, '.')} DH` : 'Sur devis';
}