import { describe, expect, it } from 'vitest';
import { products } from '@/lib/catalog';
import { printerQuickSpecs, publishedSpecGroups, sameCategoryProducts, splitSpecRow } from '@/lib/product-detail';
describe('published product details', () => {
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