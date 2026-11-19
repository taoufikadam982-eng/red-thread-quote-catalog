import type { Product } from './catalog';
import { productPlainText } from './product-text';

export const clearanceBadgeOptions = ['Fin de série', 'Dernière pièce', 'Quantité limitée', 'Offre spéciale'];
export const clearanceCategory = 'Offres & Déstockage';
type OfferProduct = { price: number; is_clearance?: boolean | undefined; old_price?: number | null | undefined; categories?: string[] | undefined };
export function isClearance(product: OfferProduct) {
  return product.is_clearance === true || (product.old_price != null && product.old_price > product.price) || (product.categories ?? []).some(value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]+/g, ' ').trim() === 'offres destockage');
}
export function markImportedOffers<T extends OfferProduct & { clearance_badge?: string | null | undefined }>(rows: T[], all = false): T[] {
  return rows.map(row => all || isClearance(row) || row.clearance_badge?.trim() ? { ...row, is_clearance: true } : row);
}
export function clearanceProducts(products: Product[]) {
  return products.filter(product => isClearance(product) && !product.hidden);
}
export function clearanceLabel(product: OfferProduct & Pick<Product, 'clearance_badge'>) {
  if (!isClearance(product)) return '';
  const badge = productPlainText(product.clearance_badge ?? '').trim();
  if (badge) return badge;
  if (product.price > 0 && product.old_price && product.old_price > product.price) {
    const percent = Math.floor((1 - product.price / product.old_price) * 100);
    if (percent > 0) return `−${percent}%`;
  }
  return 'Offre spéciale';
}