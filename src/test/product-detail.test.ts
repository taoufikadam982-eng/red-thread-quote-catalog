import { describe, expect, it } from 'vitest';
import { products } from '@/lib/catalog';
import { printerQuickSpecs, scannerQuickSpecs, publishedSpecGroups, sameCategoryProducts, splitScannerSpecRow, splitSpecRow } from '@/lib/product-detail';
describe('published product details', () => {
  it('keeps scanner numbers, units and comma-separated values intact', () => {
    expect(splitScannerSpecRow('Résolution optique maximale 4 800 x 4 800 ppp (optique)')).toEqual({ label: 'Résolution optique maximale', value: '4 800 x 4 800 ppp (optique)' });
    expect(splitScannerSpecRow('Vitesse de numérisation à plat 12 s par page en monochrome et 29 s en couleur (A4, 600 ppp)')).toEqual({ label: 'Vitesse de numérisation à plat', value: '12 s par page en monochrome et 29 s en couleur (A4, 600 ppp)' });
    expect(splitScannerSpecRow('Type de scanner Scanner à plat')).toEqual({ label: 'Type de scanner', value: 'Scanner à plat' });
    expect(splitScannerSpecRow('Vitesse de numérisation Jusqu’à 20 ppm, Photo couleur : environ 6,8 s')).toEqual({ label: 'Vitesse de numérisation', value: 'Jusqu’à 20 ppm, Photo couleur : environ 6,8 s' });
  });
  it('groups scanner facts by their labels rather than incidental accessory keywords', () => {
    const base = products[0];
    if (!base) throw new Error('Missing fixture');
    const groups = publishedSpecGroups({ ...base, category: 'Scanners', categories: ['Scanners'], detail: 'Type de scanner Scanner à plat · Résolution optique 4800 ppp · Logiciels inclus Epson Scan · Consommation d\'énergie Numérisation 2,5 W · Poids net 1,5 kg · Contenu de la boîte Pilote, Câble USB' });
    expect(groups.map(group => group.title)).toEqual(['NUMÉRISATION ET COPIE', 'CONNECTIVITÉ ET SYSTÈME', 'ÉNERGIE ET BRUIT', 'FORMAT ET USAGE', 'AUTRES INFORMATIONS']);
    expect(groups.find(group => group.title === 'ÉNERGIE ET BRUIT')?.rows).toEqual([{ label: "Consommation d'énergie Numérisation", value: '2,5 W' }]);
    expect(groups.flatMap(group => group.rows)).toHaveLength(6);
  });
  it('selects scanner type, sensor, format and speed without misleading prose matches', () => {
    const rows = [
      { label: 'Niveau sonore', value: '5,4 B(A) en fonctionnement' },
      { label: 'Contenu de la boîte', value: 'Pilote et câble USB' },
      { label: 'Recto verso', value: 'Non' },
      { label: 'Type de scanner', value: 'Scanner à plat' },
      { label: 'Type de capteur', value: "CIS (capteur d'image par contact)" },
      { label: 'Format papier maxi', value: "Jusqu'au A4" },
      { label: 'Vitesse de numérisation à plat', value: '12 s par page' },
    ];
    expect(scannerQuickSpecs(rows)).toEqual([
      { label: 'Type', value: 'Scanner à plat' },
      { label: 'Technologie', value: "CIS (capteur d'image par contact)" },
      { label: 'Format', value: "Jusqu'au A4" },
      { label: 'Vitesse', value: '12 s par page' },
    ]);
    expect(scannerQuickSpecs(rows.slice(0, 3))).toEqual([]);
  });
  it('extracts clean published HTML specifications without rendering markup', () => {
    const base = products[0];
    if (!base) throw new Error('Missing fixture');
    const rows = publishedSpecGroups({ ...base, detail: '<p>Description officielle</p><ul><li><strong>Processeur :</strong> Intel Core 5</li><li><strong>Mémoire :</strong> 8 Go DDR5</li></ul>' }).flatMap(group => group.rows);
    expect(rows).toContainEqual({ label: 'Processeur', value: 'Intel Core 5' });
    expect(rows).toContainEqual({ label: 'Mémoire', value: '8 Go DDR5' });
    expect(rows.some(row => /<\/?(?:p|strong|li)>/.test(row.value))).toBe(false);
  });
  it('keeps all published specs without adding specifications', () => {
    const product = { ...products[0], detail: 'Processeur: Intel Core Ultra 7 · Écran: 14 pouces · USB-C · Garantie: 3 ans' } as typeof products[number];
    const groups = publishedSpecGroups(product);
    expect(groups.map(group => group.title)).toEqual(['PERFORMANCES', 'ÉCRAN ET MULTIMÉDIA', 'CONNECTIQUE & RÉSEAU', 'MOBILITÉ & GARANTIE']);
    expect(groups.flatMap(group => group.rows).map(row => row.value)).toEqual(['Intel Core Ultra 7', '14 pouces', 'USB-C', '3 ans']);
  });
  it('groups printer specifications into print-oriented sections with clean labels', () => {
    const printer = products.find(item => item.category === 'Imprimantes');
    if (!printer) throw new Error('Missing printer fixture');
    const detail = [
      "Vitesse d'impression noir Jusqu'à 29 ppm (A4)",
      'Technologie d\'impression Toner (laser)',
      'Cartouches compatibles W1360A — toner noir HP 136A',
      'Format Jusqu\'au format A4',
      'Connectivité: USB, Wi-Fi',
      'Consommation Impression: 420 W',
      'Fax Non',
    ].join(' · ');
    const groups = publishedSpecGroups({ ...printer, detail });
    const titles = groups.map(group => group.title);
    expect(titles).toEqual(['CONSOMMABLES ET COMPATIBILITÉ', 'NUMÉRISATION ET COPIE', 'ÉNERGIE ET BRUIT', 'IMPRESSION', 'PAPIER ET SUPPORTS', 'CONNECTIVITÉ ET LOGICIELS']);
    const rows = groups.flatMap(group => group.rows);
    expect(rows).toContainEqual({ label: 'Vitesse d\'impression noir', value: 'Jusqu\'à 29 ppm (A4)' });
    expect(rows).toContainEqual({ label: 'Fax', value: 'Non' });
    expect(rows).toContainEqual({ label: 'Consommation Impression', value: '420 W' });
    expect(rows.filter(row => row.label === 'Caractéristique').length).toBeLessThanOrEqual(2);
  });
  it('splits label-less spec sentences before the first value word', () => {
    expect(splitSpecRow('Fréquence du processeur 500 MHz')).toEqual({ label: 'Fréquence du processeur', value: '500 MHz' });
    expect(splitSpecRow('Format Jusqu\'au format A4')).toEqual({ label: 'Format', value: 'Jusqu\'au format A4' });
    expect(splitSpecRow('Logiciels téléchargeables depuis le site de HP.')).toEqual({ label: 'Caractéristique', value: 'Logiciels téléchargeables depuis le site de HP.' });
  });
  it('picks printer quick specs for the summary cards', () => {
    const quick = printerQuickSpecs([
      { label: 'Technologie d\'impression', value: 'Toner (laser)' },
      { label: 'Vitesse d\'impression noir', value: 'Jusqu\'à 29 ppm' },
      { label: 'Connectivité', value: 'USB, Wi-Fi' },
      { label: 'Format', value: 'A4' },
    ]);
    expect(quick.map(item => item.label)).toEqual(['Fonctions', 'Vitesse', 'Connectivité', 'Papier']);
  });
  it('recommends only visible products in the same category', () => {
    const current = products[0];
    if (!current) throw new Error('Missing fixture');
    const peer = { ...current, id: 'peer' };
    expect(sameCategoryProducts(current, [...products, peer, { ...peer, id: 'hidden', hidden: true }])).toEqual([peer]);
  });
});