import type { Product } from './catalog';
import { productPlainText } from './product-text';

export const clearanceBadgeOptions = ['Fin de série', 'Dernière pièce', 'Quantité limitée', 'Offre spéciale'];
export function clearanceProducts(products: Product[]) {
  return products.filter(product => product.is_clearance === true && !product.hidden);
}
export function clearanceLabel(product: Pick<Product, 'is_clearance' | 'clearance_badge' | 'price' | 'old_price'>) {
  if (!product.is_clearance) return '';
  const badge = productPlainText(product.clearance_badge ?? '').trim();
  if (badge) return badge;
  if (product.price > 0 && product.old_price && product.old_price > product.price) {
    const percent = Math.floor((1 - product.price / product.old_price) * 100);
    if (percent > 0) return `−${percent}%`;
  }
  return 'Offre spéciale';
}