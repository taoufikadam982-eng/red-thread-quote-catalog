import { clearanceCategory, isClearance } from './product-offers';
export const officialCategories = ['Ordinateurs portables', 'Ordinateurs de bureau', 'Workstations', 'Imprimantes', 'Scanners', 'Écrans', 'Réseau & Serveurs', 'Onduleurs Eaton', 'Périphériques', 'Logiciels'] as const;
export function normalizeCategory(value: string) {
  const key = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (key === 'tous' || key === 'tous les produits') return '';
  if (key === 'offres destockage') return clearanceCategory;
  if (/^ordinateurs? portables?$/.test(key)) return 'Ordinateurs portables';
  if (/^ordinateurs? (?:de bureau|bureautiques?)$/.test(key)) return 'Ordinateurs de bureau';
  if (/^workstations?(?: fixes?| mobiles?)?$/.test(key)) return 'Workstations';
  if (/^imprimantes?$/.test(key)) return 'Imprimantes';
  if (/^scanners?$/.test(key)) return 'Scanners';
  if (/^ecrans?$/.test(key)) return 'Écrans';
  if (/^(?:reseaux?(?: serveurs?)?|serveurs?)$/.test(key)) return 'Réseau & Serveurs';
  if (/^onduleurs?(?: eaton)?$/.test(key)) return 'Onduleurs Eaton';
  if (/^(?:peripheriques?|accessoires?)$/.test(key)) return 'Périphériques';
  if (/^logiciels?$/.test(key)) return 'Logiciels';
  return value.trim();
}
export function assignedCategories(product: { category: string; categories?: string[] | null | undefined }) {
  const values = product.categories?.length ? product.categories : [product.category];
  return [...new Set(values.map(normalizeCategory).filter(Boolean))];
}
export function hasCategory(product: { category: string; categories?: string[] | null | undefined; price?: number; old_price?: number | null | undefined; is_clearance?: boolean | undefined }, category: string) {
  if (normalizeCategory(category) === clearanceCategory) return isClearance({ price: product.price ?? 0, old_price: product.old_price, is_clearance: product.is_clearance, categories: assignedCategories(product) });
  return !category || category === 'Tous' || assignedCategories(product).includes(normalizeCategory(category));
}