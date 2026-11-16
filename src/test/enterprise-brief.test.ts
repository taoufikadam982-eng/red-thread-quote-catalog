import { expect, it } from 'vitest';
import { formatEnterpriseBrief } from '@/lib/enterprise-brief';

it('carries the selected equipment, sector and market request into the existing quote message', () => {
  expect(formatEnterpriseBrief({ equipment: ['Ordinateurs', 'Écrans'], sector: 'Secteur public', requestType: 'Marché', timing: '30 novembre', details: '  10 portables et 20 écrans  ' })).toBe('Secteur : Secteur public\nÉquipements : Ordinateurs, Écrans\nType de demande : Marché\nÉchéance souhaitée : 30 novembre\n\n10 portables et 20 écrans');
});