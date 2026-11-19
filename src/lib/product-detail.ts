import type { Product } from './catalog';
export function publishedSpecGroups(product: Product) {
  const groups = [
    { title: 'PERFORMANCES', pattern: /processeur|core|ryzen|mémoire|ram|ssd|stockage|capacité|vitesse|laser|ppm/i },
    { title: 'ÉCRAN ET MULTIMÉDIA', pattern: /écran|pouces|résolution|graphique|rtx|webcam|audio/i },
    { title: 'CONNECTIQUE & RÉSEAU', pattern: /usb|hdmi|ethernet|wi.?fi|bluetooth|réseau|connect/i },
    { title: 'MOBILITÉ & GARANTIE', pattern: /poids|batterie|autonomie|garantie|dimensions/i },
    { title: 'CONFIGURATION PUBLIÉE', pattern: /./ },
  ];
  const plain = product.detail
    .replace(/<\s*(script|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*br\s*\/?\s*>|<\s*\/(?:p|li|tr|div|h[1-6])\s*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
  const rows = plain.split(/[·;\n]/).map(value => value.trim()).filter(Boolean);
  return groups.map((group, index) => ({ title: group.title, rows: rows.filter(value => groups.findIndex(candidate => candidate.pattern.test(value)) === index).map(value => {
    const separator = value.indexOf(':');
    return separator > 0 ? { label: value.slice(0, separator).trim(), value: value.slice(separator + 1).trim() } : { label: 'Caractéristique', value };
  }) })).filter(group => group.rows.length);
}
export function sameCategoryProducts(product: Product, products: Product[]) {
  return products.filter(item => !item.hidden && item.id !== product.id && item.category === product.category).slice(0, 4);
}