import type { Product } from './catalog';
import { assignedCategories, hasCategory } from './product-categories';
import { productPlainText } from './product-text';
import { extractProductSpecPills } from './product-specs';
export function publishedSpecGroups(product: Product) {
  const groups = [
    { title: 'PERFORMANCES', pattern: /processeur|core|ryzen|mémoire|ram|ssd|stockage|capacité|vitesse|laser|ppm/i },
    { title: 'ÉCRAN ET MULTIMÉDIA', pattern: /écran|pouces|résolution|graphique|rtx|webcam|audio/i },
    { title: 'CONNECTIQUE & RÉSEAU', pattern: /usb|hdmi|ethernet|wi.?fi|bluetooth|réseau|connect/i },
    { title: 'MOBILITÉ & GARANTIE', pattern: /poids|batterie|autonomie|garantie|dimensions/i },
    { title: 'CONFIGURATION PUBLIÉE', pattern: /./ },
  ];
  const plain = productPlainText(product.detail);
  const rows = plain.split(/[·;\n]/).map(value => value.trim()).filter(Boolean);
  return groups.map((group, index) => ({ title: group.title, rows: rows.filter(value => groups.findIndex(candidate => candidate.pattern.test(value)) === index).map(value => {
    const separator = value.indexOf(':');
    return separator > 0 ? { label: value.slice(0, separator).trim(), value: value.slice(separator + 1).trim() } : { label: 'Caractéristique', value };
  }) })).filter(group => group.rows.length);
}
export function sameCategoryProducts(product: Product, products: Product[]) {
  return products.filter(item => !item.hidden && item.id !== product.id && assignedCategories(product).some(category => hasCategory(item, category))).slice(0, 4);
}
export function productSpecPills(product: Product): string[] {
  return extractProductSpecPills(product);
}