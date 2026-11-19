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
    expect(productSpecPills({ ...base, detail: '<p>Description générale</p><p>Garantie: 3 ans</p><ul><li>Écran: 14 pouces</li><li>Stockage: 512 Go SSD</li><li>Mémoire: 8 Go DDR5</li><li>Processeur: Intel Core 5-120U</li><li>Ports: USB-C</li></ul>' })).toEqual(['Intel Core 5-120U', '8 Go DDR5', '512 Go SSD', '14 pouces']);
  });
  it('does not turn unstructured marketing paragraphs into technical pills', () => {
    expect(productSpecPills({ ...base, detail: '<h3>Un ordinateur pour votre entreprise</h3><p>Un excellent choix au quotidien.</p>' })).toEqual([]);
  });
  it('keeps published non-PC specifications without inventing PC attributes', () => {
    expect(productSpecPills({ ...base, detail: 'Vitesse: 45 ppm · Recto verso: Automatique · Réseau: Ethernet' })).toEqual(['45 ppm', 'Ethernet', 'Automatique']);
  });
});