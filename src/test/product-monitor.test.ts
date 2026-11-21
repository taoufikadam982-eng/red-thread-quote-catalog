import { describe, expect, it } from 'vitest';
import { products } from '@/lib/catalog';
import { publishedSpecGroups } from '@/lib/product-detail';
import { monitorQuickSpecs, monitorSpecRows, splitMonitorSpecRow } from '@/lib/product-monitor';

describe('published monitor datasheets', () => {
  it('keeps imported bullet continuations in the same field and excludes section headings', () => {
    expect(monitorSpecRows('CONNECTEURS · Ports: 1x HDMI 1.4 · 1x DisplayPort 1.2 · 1x USB Type-A · ERGONOMIE · Réglages du pied Inclinaison / Hauteur 150 mm')).toEqual([
      { label: 'Ports', value: '1x HDMI 1.4 ; 1x DisplayPort 1.2 ; 1x USB Type-A' },
      { label: 'Réglages du pied', value: 'Inclinaison / Hauteur 150 mm' },
    ]);
  });
  it('preserves decimal sizes, full resolutions and connector versions', () => {
    expect(splitMonitorSpecRow('Taille de la diagonale 23,8 pouces')).toEqual({ label: 'Taille de la diagonale', value: '23,8 pouces' });
    expect(splitMonitorSpecRow('Résolution optimale Full HD 1920x1080')).toEqual({ label: 'Résolution optimale', value: 'Full HD 1920x1080' });
    expect(splitMonitorSpecRow('Connectivité 2x HDMI 2.0b, 1x DisplayPort 1.2a')).toEqual({ label: 'Connectivité', value: '2x HDMI 2.0b, 1x DisplayPort 1.2a' });
  });
  it('groups monitor facts by label without losing rows or misclassifying supplied cables', () => {
    const base = products[0];
    if (!base) throw new Error('Missing fixture');
    const groups = publishedSpecGroups({ ...base, category: 'Écrans', categories: ['Écrans'], detail: 'Taille de la diagonale 23,8 pouces · Type de dalle Rapid IPS · Résolution optimale Full HD 1920x1080 · Taux de rafraîchissement 240 Hz · Poids net 3,25 kg · Connectivité HDMI, DisplayPort · Câbles fournis HDMI · Garantie: 3 ans' });
    expect(groups.map(group => group.title)).toEqual(['IMAGE', 'FORMAT ET ERGONOMIE', 'CONNECTIQUE ET USAGE', 'AUTRES INFORMATIONS']);
    expect(groups.flatMap(group => group.rows)).toHaveLength(8);
    expect(groups.find(group => group.title === 'AUTRES INFORMATIONS')?.rows).toContainEqual({ label: 'Câbles fournis', value: 'HDMI' });
    expect(monitorQuickSpecs(groups.flatMap(group => group.rows))).toEqual([
      { label: 'Taille', value: '23,8 pouces' }, { label: 'Définition', value: 'Full HD 1920x1080' },
      { label: 'Fréquence', value: '240 Hz' }, { label: 'Dalle', value: 'Rapid IPS' },
    ]);
  });
  it('does not invent missing monitor specifications from model or accessory text', () => {
    expect(splitMonitorSpecRow('Écran professionnel livré avec câble HDMI')).toEqual({ label: 'Information complémentaire', value: 'Écran professionnel livré avec câble HDMI' });
    expect(monitorQuickSpecs([{ label: 'Information complémentaire', value: 'Écran IPS 24 pouces' }])).toEqual([]);
  });
  it('keeps semicolon-separated connector lists and contrast ratios in their complete values', () => {
    const base = products[0];
    if (!base) throw new Error('Missing fixture');
    const rows = publishedSpecGroups({ ...base, category: 'Écrans', categories: ['Écrans'], detail: 'Ports: HDMI 1.4; DisplayPort 1.2; VGA · Taux de contraste de l’écran (dynamique) 8000000:1 · Résolution (native) FHD (1920 x 1080)' }).flatMap(group => group.rows);
    expect(rows).toEqual([
      { label: 'Taux de contraste de l’écran (dynamique)', value: '8000000:1' },
      { label: 'Résolution (native)', value: 'FHD (1920 x 1080)' },
      { label: 'Ports', value: 'HDMI 1.4; DisplayPort 1.2; VGA' },
    ]);
  });
});