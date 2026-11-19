import { describe, expect, it } from 'vitest';
import { products } from '@/lib/catalog';
import { publishedSpecGroups, sameCategoryProducts } from '@/lib/product-detail';
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
  it('recommends only visible products in the same category', () => {
    const current = products[0];
    if (!current) throw new Error('Missing fixture');
    const peer = { ...current, id: 'peer' };
    expect(sameCategoryProducts(current, [...products, peer, { ...peer, id: 'hidden', hidden: true }])).toEqual([peer]);
  });
});