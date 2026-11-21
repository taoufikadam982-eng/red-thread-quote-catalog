import type { Product } from './catalog';
import { assignedCategories, hasCategory } from './product-categories';
import { productPlainText } from './product-text';
import { extractProductSpecPills } from './product-specs';

type SpecRow = { label: string; value: string };
type SpecGroupDef = { title: string; pattern: RegExp };

const computerGroups: SpecGroupDef[] = [
  { title: 'PERFORMANCES', pattern: /processeur|core|ryzen|mémoire|ram|ssd|stockage|capacité|vitesse|laser|ppm/i },
  { title: 'ÉCRAN ET MULTIMÉDIA', pattern: /écran|pouces|résolution|graphique|rtx|webcam|audio/i },
  { title: 'CONNECTIQUE & RÉSEAU', pattern: /usb|hdmi|ethernet|wi.?fi|bluetooth|réseau|connect/i },
  { title: 'MOBILITÉ & GARANTIE', pattern: /poids|batterie|autonomie|garantie|dimensions/i },
  { title: 'CONFIGURATION PUBLIÉE', pattern: /./ },
];

/** Printer and scanner grouping, mirroring manufacturer datasheets (impression, papier, numérisation…). */
const printerGroups: SpecGroupDef[] = [
  { title: 'CONSOMMABLES ET COMPATIBILITÉ', pattern: /cartouche|consommable|rendement|encre compatible/i },
  { title: 'NUMÉRISATION ET COPIE', pattern: /numéris|scanner|copie|photocopie|\bfax\b/i },
  { title: 'ÉNERGIE ET BRUIT', pattern: /consommation|veille|alimentation|sonore|puissance|arrêt|\bw\b|db\(/i },
  { title: 'IMPRESSION', pattern: /impress|ppm|laser|jet d.encre|recto|toner|encre|dpi|processeur|mémoire|langage|couleur/i },
  { title: 'PAPIER ET SUPPORTS', pattern: /papier|bac|format|grammage|chargeur|support|\ba[34]\b|enveloppe/i },
  { title: 'CONNECTIVITÉ ET LOGICIELS', pattern: /usb|wi.?fi|ethernet|réseau|bluetooth|logiciel|pilote|airprint|mopria|connect/i },
  { title: 'FORMAT ET USAGE', pattern: /dimensions|poids|volume|garantie|mensuel/i },
  { title: 'AUTRES CARACTÉRISTIQUES', pattern: /./ },
];

/** Splits "Label value" text: uses the colon when present, otherwise cuts before the first value-like word (number, Oui, Non, Jusqu'à…). */
export function splitSpecRow(text: string): SpecRow {
  const colon = text.indexOf(':');
  if (colon > 0) return { label: text.slice(0, colon).trim(), value: text.slice(colon + 1).trim() };
  const words = text.split(/\s+/);
  const unit = /^(?:mhz|ghz|w|ppm|go|mo|to|pages?|cartouches?|db\(a\)|hz|pouces|à|par|v\b)/i;
  const start = words.findIndex((word, index) => index > 0 && (
    /^(?:jusqu['’]|oui\b|non\b)/i.test(word) ||
    (index > 1 && /^\(/.test(words[index + 1] ?? '') && words.length - index >= 3) ||
    (/^\d/.test(word) && unit.test(words[index + 1] ?? ''))
  ));
  if (start > 0) return { label: words.slice(0, start).join(' '), value: words.slice(start).join(' ') };
  return { label: 'Caractéristique', value: text };
}

export function isPrintProduct(product: Product) {
  return hasCategory(product, 'Imprimantes') || hasCategory(product, 'Scanners');
}

export function publishedSpecGroups(product: Product) {
  const groups = isPrintProduct(product) ? printerGroups : computerGroups;
  const plain = productPlainText(product.detail);
  const rows = plain.split(/[·;\n]/).map(value => value.trim()).filter(Boolean);
  return groups.map((group, index) => ({
    title: group.title,
    rows: rows
      .filter(value => groups.findIndex(candidate => candidate.pattern.test(value)) === index)
      .map(splitSpecRow),
  })).filter(group => group.rows.length);
}

/** Top "Configuration en bref" cards for printers and scanners: functions, speed, connectivity, paper. */
export function printerQuickSpecs(rows: SpecRow[]): SpecRow[] {
  const order: [string, RegExp][] = [
    ['Fonctions', /fonction|technologie|couleur d.impression|type/i],
    ['Vitesse', /vitesse|ppm/i],
    ['Connectivité', /connect|wi.?fi|usb|réseau|ethernet/i],
    ['Papier', /format|papier|recto/i],
  ];
  const used = new Set<SpecRow>();
  return order.flatMap(([label, pattern]) => {
    const row = rows.find(item => !used.has(item) && (pattern.test(item.label) || pattern.test(item.value)));
    if (!row) return [];
    used.add(row);
    return [{ label, value: row.value }];
  }).slice(0, 4);
}

export function sameCategoryProducts(product: Product, products: Product[]) {
  return products.filter(item => !item.hidden && item.id !== product.id && assignedCategories(product).some(category => hasCategory(item, category))).slice(0, 4);
}
export function productSpecPills(product: Product): string[] {
  return extractProductSpecPills(product);
}
