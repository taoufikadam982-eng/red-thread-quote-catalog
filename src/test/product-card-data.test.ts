import { describe, expect, it } from 'vitest';
import { products } from '@/lib/catalog';
import { productSpecPills } from '@/lib/product-detail';
import { productPlainText } from '@/lib/product-text';

const base = products[0];
if (!base) throw new Error('Missing fixture');
describe('published card data', () => {
  it('removes direct, encoded and nested encoded HTML and unsafe content', () => {
    expect(productPlainText('<p><strong>Mémoire</strong> : 8&nbsp;Go</p><script>alert(1)</script>&amp;lt;h3&amp;gt;SSD&amp;lt;/h3&amp;gt;')).toBe('Mémoire : 8 Go\nSSD');
    expect(productPlainText('&#60;p&#62;Intel Core&#60;/p&#62;')).toBe('Intel Core');
  });
  it('prioritizes processor, RAM, storage and screen, with at most four published values', () => {
    expect(productSpecPills({ ...base, detail: '<p>Description générale</p><p>Garantie: 3 ans</p><ul><li>Écran: 14 pouces</li><li>Stockage: 512 Go SSD</li><li>Mémoire: 8 Go DDR5</li><li>Processeur: Intel Core 5-120U</li><li>Ports: USB-C</li></ul>' })).toEqual(['Intel Core 5-120U', '8 Go DDR5', '512 Go SSD', '14"']);
  });
  it('does not turn unstructured marketing paragraphs into technical pills', () => {
    expect(productSpecPills({ ...base, detail: '<h3>Un ordinateur pour votre entreprise</h3><p>Un excellent choix au quotidien.</p>' })).toEqual([]);
  });
  it('keeps published non-PC specifications without inventing PC attributes', () => {
    expect(productSpecPills({ ...base, detail: 'Vitesse: 45 ppm · Recto verso: Automatique · Réseau: Ethernet' })).toEqual(['45 ppm', 'Réseau · Recto-Verso']);
  });
  it('extracts monitor facts without splitting decimal commas or response-time prose', () => {
    expect(productSpecPills({ ...base, name: 'Écran Dell P2222H, 21,5 pouces', category: 'Écrans', detail: 'Écran Dell P2222H, 21,5 pouces, résolution 1920 x 1080, dalle IPS, 60 Hz, contraste 1000:1, temps de réponse 5 ms (mode rapide), couverture 99 % sRGB, HDMI, DisplayPort, VGA', is_clearance: true })).toEqual(['21,5" Full HD', 'Dalle IPS · 60 Hz', 'HDMI · DP · VGA']);
  });
  it('normalizes imported PC keywords into four specifications', () => {
    expect(productSpecPills({ ...base, detail: 'Intel Core 5-120U, 8 Go DDR5, 512 Go SSD, écran 14 pouces WUXGA, idéal pour votre entreprise' })).toEqual(['Intel Core 5-120U', '8 Go DDR5', '512 Go SSD', '14" WUXGA']);
  });
  it('extracts printer type, speed and complete connectivity groups', () => {
    expect(productSpecPills({ ...base, category: 'Imprimantes', detail: 'Imprimante laser monochrome, 38 ppm, USB, Ethernet, recto-verso automatique' })).toEqual(['Laser Monochrome', '38 ppm', 'USB · Réseau', 'Recto-Verso']);
  });
  it('handles scanner speed without converting images per minute to pages', () => {
    expect(productSpecPills({ ...base, category: 'Scanners', detail: 'Scanner de documents, 60 ipm, USB' })).toEqual(['Scanner', '60 ipm', 'USB']);
  });
  it('omits unavailable monitor facts rather than fabricating three pills', () => {
    expect(productSpecPills({ ...base, name: 'Écran Dell', category: 'Écrans', detail: 'Écran 27 pouces, dalle VA, 75 Hz' })).toEqual(['27"', 'Dalle VA · 75 Hz']);
  });
  it('keeps every extracted pill within 24 characters and never cuts port names', () => {
    const pills = productSpecPills({ ...base, category: 'Écrans', detail: '27 pouces QHD, IPS 144 Hz, HDMI, DP, VGA, USB-C' });
    expect(pills).toEqual(['27" QHD', 'Dalle IPS · 144 Hz', 'HDMI · DP · VGA · USB-C']);
    expect(pills.every(pill => pill.length <= 24)).toBe(true);
  });
  it('does not infer duplex when the description explicitly excludes it', () => {
    expect(productSpecPills({ ...base, category: 'Imprimantes', detail: 'Laser monochrome, USB, sans recto-verso' })).toEqual(['Laser Monochrome', 'USB']);
  });
  it('does not confuse UHD graphics or an HD webcam with the display resolution', () => {
    expect(productSpecPills({ ...base, detail: 'Processeur: Intel Core i3-10110U\nMémoire: 4 Go de RAM DDR4\nStockage: disque dur de 1 To\nÉcran: 14 pouces, webcam HD 720p\nGraphisme: Intel UHD Graphics' })).toEqual(['Intel Core i3-10110U', '4 Go DDR4', '1 To HDD', '14"']);
  });
});