import { describe, expect, it } from 'vitest';
import { cleanSheet, readSpecGroups, sheetQuickSpecs } from '@/lib/product-sheet';

describe('product sheet', () => {
  it('drops empty rows, empty groups and blank highlights', () => {
    const s = cleanSheet({ highlights: ['A', ''], spec_groups: [{ title: 'Perf', rows: [{ label: 'Processeur', value: 'i5' }, { label: 'RAM', value: '' }] }, { title: 'Vide', rows: [] }] });
    expect(s.highlights).toEqual(['A']);
    expect(s.spec_groups).toEqual([{ title: 'Perf', rows: [{ label: 'Processeur', value: 'i5' }] }]);
  });
  it('an empty or invalid sheet yields no groups so the old display is kept', () => {
    expect(readSpecGroups([])).toEqual([]);
    expect(readSpecGroups('nope')).toEqual([]);
  });
  it('builds the quick cards from processor, RAM, storage and display', () => {
    const q = sheetQuickSpecs([{ title: 'P', rows: [{ label: 'Processeur', value: 'Ultra 5' }, { label: 'Mémoire cache', value: '12 Mo' }, { label: 'Mémoire RAM installée', value: '16 Go' }, { label: 'Stockage', value: '512 Go SSD' }, { label: "Taille de l'écran", value: '14"' }] }]);
    expect(q[1]?.value).toBe('16 Go');
    expect(q.map(x => x.label)).toEqual(['Processeur', 'Mémoire RAM', 'Stockage', 'Écran']);
  });
});
