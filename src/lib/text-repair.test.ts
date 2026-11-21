import { describe, expect, it } from 'vitest';
import { repairText } from './text-repair';
describe('repairText', () => {
  it('fixes accents', () => expect(repairText('rÃ©fÃ©rence dotÃ© mÃ©moire')).toBe('référence doté mémoire'));
  it('fixes apostrophes and œ', () => expect(repairText('d\u00e2\u0080\u0099un, 10 cÅ\u0093urs, jusquâ€™Ã  5 GHz')).toBe('d’un, 10 cœurs, jusqu’à 5 GHz'));
  it('keeps correct text', () => expect(repairText('Écran 16 pouces, Ça marche')).toBe('Écran 16 pouces, Ça marche'));
});
