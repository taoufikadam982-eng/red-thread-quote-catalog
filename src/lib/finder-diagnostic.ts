export function getFinderDiagnostic(answers: string[], step: number, selected: string) {
  const choices = [...answers.slice(0, step), ...(selected ? [selected] : [])];
  const team = choices.some(choice => /collaborateurs/.test(choice));
  const performance = choices.some(choice => /visuels|vidéo|techniques|3D|workstation|performance|Jouer/.test(choice));
  const profile: 'initial' | 'enterprise' | 'performance' | 'productivity' = choices.length === 0 ? 'initial' : team ? 'enterprise' : performance ? 'performance' : 'productivity';
  return { choices, profile, counter: String(Math.min(step + 1, 8)).padStart(2, '0') };
}