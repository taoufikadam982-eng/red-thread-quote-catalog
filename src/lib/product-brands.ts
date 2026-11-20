// Preserve published labels while comparing menu and imported brand values consistently.
export const normalizeBrand = (value: string) => value.trim().toLocaleLowerCase('fr');
export const sameBrand = (a: string, b: string) => normalizeBrand(a) === normalizeBrand(b);
export function brandOptions(values: string[]) {
  return [...new Map(values.filter(value => value.trim()).map(value => [normalizeBrand(value), value.trim()])).values()].sort();
}