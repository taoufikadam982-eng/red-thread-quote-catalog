import type { Product } from './catalog';
import { productPlainText } from './product-text';
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
  return products.filter(item => !item.hidden && item.id !== product.id && item.category === product.category).slice(0, 4);
}
export function productSpecPills(product: Product): string[] {
  const rows = publishedSpecGroups(product).flatMap(group => group.rows);
  const priorities = [/processeur|\bcpu\b|\bcore\b|ryzen|apple\s+m\d/i, /mémoire|\bram\b|ddr[345]/i, /stockage|\bssd\b|disque|\bhdd\b/i, /écran|pouces|résolution|\d\s*["″]/i];
  const chosen = priorities.flatMap(pattern => {
    const row = rows.find(item => pattern.test(`${item.label} ${item.value}`) && item.value.length <= 72);
    return row ? [row.value] : [];
  });
  const other = rows.filter(row => row.label !== 'Caractéristique' && row.value.length <= 72 && row.value.length > 0).map(row => row.value);
  return [...new Set([...chosen, ...other])].slice(0, 4);
}