import type { Product } from './catalog';
import { sameCategoryProducts } from './product-detail';

export const recommendationLimit = 4;

/** Keeps only real, visible catalogue ids suggested by the model, then tops up with same-category items. */
export function pickRecommendations(ids: string[], product: Product, products: Product[]): Product[] {
  const visible = new Map(products.filter(item => !item.hidden && item.id !== product.id).map(item => [item.id, item]));
  const picked: Product[] = [];
  for (const id of ids) {
    const item = visible.get(id);
    if (item && !picked.includes(item)) picked.push(item);
    if (picked.length === recommendationLimit) return picked;
  }
  for (const item of sameCategoryProducts(product, products)) {
    if (picked.length === recommendationLimit) break;
    if (!picked.includes(item)) picked.push(item);
  }
  return picked;
}

export function parseRecommendationIds(text: string): string[] {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    const value: unknown = JSON.parse(match[0]);
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  } catch { return []; }
}
