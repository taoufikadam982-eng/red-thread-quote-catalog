import { describe, expect, it } from 'vitest';
import { getFinderDiagnostic } from '@/lib/finder-diagnostic';

describe('live finder diagnostic', () => {
  it('starts with no criteria at step 01', () => {
    expect(getFinderDiagnostic([], 0, '')).toEqual({ choices: [], profile: 'initial', counter: '01' });
  });
  it('identifies office work immediately on selection', () => {
    expect(getFinderDiagnostic([], 0, 'Travailler et gérer mon activité').profile).toBe('productivity');
  });
  it('identifies demanding 3D applications', () => {
    expect(getFinderDiagnostic(['Travailler et gérer mon activité'], 3, 'Applications 3D exigeantes').profile).toBe('performance');
  });
  it('prioritizes team deployment over performance', () => {
    expect(getFinderDiagnostic(['Créer des visuels ou des vidéos'], 4, '6 à 20 collaborateurs').profile).toBe('enterprise');
  });
  it('replaces a revisited answer without showing stale future criteria', () => {
    expect(getFinderDiagnostic(['Jouer', 'Au bureau', 'Une workstation'], 1, 'En déplacement')).toEqual({ choices: ['Jouer', 'En déplacement'], profile: 'performance', counter: '02' });
  });
  it('keeps all eight criteria at completion and caps the counter at 08', () => {
    expect(getFinderDiagnostic(Array.from({ length: 8 }, (_, i) => `Choix ${i}`), 8, '').choices).toHaveLength(8);
    expect(getFinderDiagnostic([], 8, '').counter).toBe('08');
  });
});