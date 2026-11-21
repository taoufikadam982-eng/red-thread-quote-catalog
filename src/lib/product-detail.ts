import type { Product } from './catalog';
import { assignedCategories, hasCategory } from './product-categories';
import { productPlainText } from './product-text';
import { extractProductSpecPills } from './product-specs';
import { monitorGroups, monitorSpecRows } from './product-monitor';

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

const scannerGroups: SpecGroupDef[] = [
  { title: 'IMPRESSION', pattern: /impression|imprimante|toner|cartouche/i },
  { title: 'NUMÉRISATION ET COPIE', pattern: /^(?!consommation|énergie|alimentation).*(?:scanner|numéris|résolution|capteur|profondeur|source lumineuse|recto.?verso|copie|chargeur|bouton)/i },
  { title: 'CONNECTIVITÉ ET SYSTÈME', pattern: /connect|usb|ethernet|wi.?fi|bluetooth|logiciel|pilote|système|windows|macos/i },
  { title: 'ÉNERGIE ET BRUIT', pattern: /consommation|énergie|alimentation|prêt|arrêt|veille|sonore/i },
  { title: 'FORMAT ET USAGE', pattern: /dimensions|poids|format|papier|taille|garantie/i },
  { title: 'AUTRES INFORMATIONS', pattern: /./ },
];

// Longest published labels first: numbers and commas remain in the complete value.
const scannerLabels = [
  'Taille maximale de numérisation scanner à plat', 'Taille maximale de numérisation chargeur auto',
  'Formats de fichiers pour la numérisation Du texte et des images', 'Formats de fichiers pour la numérisation',
  'Grammage de support (chargeur auto)', 'Vitesse de numérisation chargeur auto',
  'Consommation électrique', 'Puissance consommée', 'Supports pris en charge',
  'Niveaux de gris', 'Taux d’utilisation', 'Version Twain', 'Câble fourni', 'Options de numérisation (ADF)',
  'Caractéristiques complémentaires', 'Consommation d’énergie Numérisation', "Consommation d'énergie Numérisation",
  'Vitesse de numérisation à plat', 'Vitesse de numérisation', 'Boutons de numérisation',
  'Numérisation recto-verso', 'Résolution optique maximale', 'Résolution optique', 'Résolutions de sortie',
  "Systèmes d'exploitation compatibles", 'Systèmes d’exploitation compatibles',
  'Dimensions (l x p x h)', 'Type de scanner', 'Technologie de numérisation', 'Type scanner',
  'Type de capteur', 'Profondeur en bits', 'Profondeur', 'Source lumineuse',
  'Chargeur automatique', 'Format papier maxi', 'Formats de papier', 'Niveau sonore',
  'Contenu de la boîte', 'Logiciels inclus', 'Connectivité', 'Interface', 'Format',
  'Poids net', 'Poids', 'Garantie', 'Ethernet', 'Wi-Fi', 'Recto verso', 'Prêt', 'Arrêt',
].sort((a, b) => b.length - a.length);

export function splitScannerSpecRow(text: string): SpecRow {
  const label = scannerLabels.find(candidate => {
    const lower = text.toLocaleLowerCase('fr');
    const prefix = candidate.toLocaleLowerCase('fr');
    return lower.startsWith(`${prefix} `) || lower.startsWith(`${prefix}:`);
  });
  if (label) return { label: text.slice(0, label.length), value: text.slice(label.length).trim().replace(/^:\s*/, '') };
  if (text.includes(':')) return splitSpecRow(text);
  // Unknown prose is preserved verbatim, not guessed or split around arbitrary numbers.
  return { label: 'Information complémentaire', value: text };
}

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
  const scanner = hasCategory(product, 'Scanners');
  const monitor = hasCategory(product, 'Écrans');
  const groups = scanner ? scannerGroups : monitor ? monitorGroups : isPrintProduct(product) ? printerGroups : computerGroups;
  const plain = productPlainText(product.detail);
  const rows = plain.split(monitor ? /[·\n]/ : /[·;\n]/).map(value => value.trim()).filter(Boolean);
  const entries = monitor ? monitorSpecRows(plain).map(row => ({ text: row.value, row })) : rows.map(text => ({ text, row: scanner ? splitScannerSpecRow(text) : splitSpecRow(text) }));
  return groups.map((group, index) => ({
    title: group.title,
    rows: entries
      .filter(({ text, row }) => groups.findIndex(candidate => candidate.pattern.test(scanner || monitor ? row.label : text)) === index)
      .map(({ row }) => row),
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

/** Scanner summary uses published labels only, never keywords from accessory prose. */
export function scannerQuickSpecs(rows: SpecRow[]): SpecRow[] {
  const order: [string, RegExp][] = [
    ['Type', /^type (?:de )?scanner$/i],
    ['Technologie', /^(?:type de capteur|technologie de numérisation)$/i],
    ['Format', /^(?:format papier maxi|formats de papier|format|taille maximale de numérisation scanner à plat)$/i],
    ['Vitesse', /^vitesse de numérisation/i],
    ['Résolution', /^résolution optique/i],
    ['Connectivité', /^(?:connectivité|interface)$/i],
  ];
  return order.flatMap(([label, pattern]) => {
    const row = rows.find(item => pattern.test(item.label));
    return row ? [{ label, value: row.value }] : [];
  }).slice(0, 4);
}

export function sameCategoryProducts(product: Product, products: Product[]) {
  return products.filter(item => !item.hidden && item.id !== product.id && assignedCategories(product).some(category => hasCategory(item, category))).slice(0, 4);
}
export function productSpecPills(product: Product): string[] {
  return extractProductSpecPills(product);
}
