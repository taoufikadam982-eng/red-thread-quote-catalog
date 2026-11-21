type SpecRow = { label: string; value: string };

const labels = [
  'Taux de contraste de l’écran (dynamique)', 'Résolution (native)', 'Résolution du panneau',
  'Angle de vision horizontale', 'Angle de vision verticale', 'Temps de réponse (standard)',
  "Fréquence de balayage de l'écran (horizontal/vertical)", 'Pixels par pouce (ppi)', 'Pas de masque',
  'Traitement de l’écran', 'Type de rétroéclairage', 'Profondeur de couleur', "Calibration d'usine",
  'Plage de réglage en hauteur', 'Pied amovible', 'Pied', 'Cadre', 'Écran tactile', 'Écran incurvé',
  "Fonctions d'affichage", 'Anti-scintillement', 'Faible Lumière bleue', 'Écran de confidentialité intégré',
  'Sécurité physique', "Type d'entrée d'affichage", "Connecteurs d'entrée", 'DisplayPort™', 'VGA', 'HDCP',
  'Appareil photo', 'Caméra', 'Microphone', 'Type de haut-parleur', 'Entrées', 'Hub USB',
  'Consommation normale', 'Plage de températures en fonctionnement', "Plage d'humidité de fonctionnement",
  'Certifications et conformités', 'Certification Energy Star', 'Contenu de l’emballage', "Contenu de l'emballage",
  'Spécifications relatives à l’impact sur le développement durable', 'Garantie fabricant',
  'Dimensions minimales (L x P x H)', 'Dimensions avec socle (L x P x H)',
  'Dimensions (l x p x h) en mm', 'Poids net en kg', 'Dalle', 'Fréquence',
  'Réglages du pied', 'Couleur', 'Verrouillage', 'Énergie', 'Classe énergétique',
  'Consommation', 'Certifications', 'Référence', 'Adaptateur VESA',
  'Taille de l’écran (diagonale)', "Taille de l'écran (diagonale)", 'Taille de la diagonale',
  'Technologie de rétroéclairage', 'Technologie de la dalle', 'Type de dalle', 'Type de panneau',
  'Résolution optimale', 'Résolution native', 'Résolution maximale', 'Résolution',
  'Taux de rafraîchissement', 'Fréquence de rafraîchissement', 'Fréquence verticale',
  'Temps de réponse', 'Format de l’image', "Format de l'image", 'Rapport de contraste', 'Contraste',
  'Luminosité', 'Angle de vision', 'Angles de vision', 'Couverture colorimétrique', 'Couleurs affichées',
  'Surface de l’écran', "Surface de l'écran", 'Surface active', 'Surface de l’affichage',
  'Taille de pixel', 'Pas de pixel', 'Fréquence de balayage de l’écran (horizontal/vertical)',
  'Fréquence de balayage', 'Courbure de l’écran', "Courbure de l'écran", 'Courbure',
  'Réglages de la position de l’écran', "Réglages de la position de l'écran", 'Réglage en hauteur',
  'Dimensions (l x p x h)', 'Dimensions avec pied', 'Dimensions sans pied', 'Dimensions',
  'Poids avec pied', 'Poids sans pied', 'Poids net', 'Poids', 'Fixation VESA', 'Montage VESA',
  'Inclinaison', 'Rotation', 'Pivot', 'Connectivité', 'Connectique', 'Ports et connecteurs', 'Ports',
  'Haut-parleurs intégrés', 'Haut-parleurs', 'Sortie audio', 'Webcam',
  'Consommation électrique', 'Consommation en veille', 'Consommation nominale', 'Alimentation',
  'Technologie', 'Taille', 'Diagonale', 'Garantie', 'Câbles fournis', 'Contenu de la boîte',
  'Marque', 'Modèle', 'Référence constructeur', 'HDMI', 'DisplayPort', 'USB-C',
].sort((a, b) => b.length - a.length);

/** Published values stay whole: decimal sizes, connector versions and resolutions are never split. */
export function splitMonitorSpecRow(text: string): SpecRow {
  const lower = text.toLocaleLowerCase('fr');
  const label = labels.find(candidate => {
    const prefix = candidate.toLocaleLowerCase('fr');
    return lower.startsWith(`${prefix} `) || lower.startsWith(`${prefix}:`);
  });
  if (label) return { label: text.slice(0, label.length), value: text.slice(label.length).trim().replace(/^:\s*/, '') };
  const colon = text.indexOf(':');
  if (colon > 0 && !/\d$/.test(text.slice(0, colon))) return { label: text.slice(0, colon).trim(), value: text.slice(colon + 1).trim() };
  return { label: 'Information complémentaire', value: text };
}

export const monitorGroups = [
  { title: 'IMAGE', pattern: /taille|diagonale|dalle|panneau|rétroéclairage|résolution|rafraîchissement|réponse|contraste|luminosité|vision|colorim|couleur|surface|pixel|balayage|technologie|format de l.image|fréquence|masque|traitement|profondeur|calibration|affichage|scintillement|lumière bleue|écran tactile|écran de confidentialité/i },
  { title: 'FORMAT ET ERGONOMIE', pattern: /courbure|réglage|dimensions|poids|vesa|inclinaison|rotation|pivot|pied|cadre|incurvé|sécurité physique/i },
  { title: 'CONNECTIQUE ET USAGE', pattern: /connect|ports|hdmi|displayport|usb|audio|haut.parleur|webcam|consommation|alimentation|entrée|vga|hdcp|appareil photo|caméra|microphone/i },
  { title: 'AUTRES INFORMATIONS', pattern: /./ },
];

/** Imported bullet continuations belong to their preceding field, not fabricated extra characteristics. */
export function monitorSpecRows(text: string): SpecRow[] {
  const rows: SpecRow[] = [];
  let previous: SpecRow | undefined;
  for (const part of text.split(/[·\n]/).map(value => value.trim()).filter(Boolean)) {
    if (/^(?:AFFICHAGE|IMAGE|CONNECTEURS|CONNECTIQUE|ERGONOMIE|DESIGN|ALIMENTATION|CERTIFICATIONS|INFORMATIONS MODÈLE|ÉNERGIE|SÉCURITÉ|GARANTIE(?:\s*&\s*SERVICE)?|AUTRES INFORMATIONS)$/i.test(part)) {
      previous = undefined;
      continue;
    }
    const row = splitMonitorSpecRow(part);
    if (row.label === 'Information complémentaire' && previous) {
      previous.value += ` ; ${part}`;
    } else {
      rows.push(row);
      previous = row;
    }
  }
  return rows;
}

/** Four category-specific summary cards; absent facts are omitted, not inferred from the model name. */
export function monitorQuickSpecs(rows: SpecRow[]): SpecRow[] {
  const order: [string, RegExp][] = [
    ['Taille', /^(?:taille|diagonale)/i],
    ['Définition', /^résolution/i],
    ['Fréquence', /^(?:(?:taux|fréquence) de rafraîchissement|fréquence$)/i],
    ['Dalle', /^(?:type de dalle|type de panneau|technologie de la dalle|dalle)$/i],
    ['Connectique', /^(?:connectivité|connectique|ports et connecteurs|ports|entrées)$/i],
  ];
  return order.flatMap(([label, pattern]) => {
    const row = rows.find(item => pattern.test(item.label));
    return row ? [{ label, value: row.value }] : [];
  }).slice(0, 4);
}