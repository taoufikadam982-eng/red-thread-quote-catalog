import { z } from 'zod';

export const specRowSchema = z.object({ label: z.string().trim().max(120), value: z.string().trim().max(500) });
export const specGroupSchema = z.object({ title: z.string().trim().max(120), rows: z.array(specRowSchema).max(60) });
export const productSheetSchema = z.object({
  intro: z.string().trim().max(2000).default(''),
  highlights: z.array(z.string().trim().max(240)).max(8).default([]),
  use_cases: z.string().trim().max(2000).default(''),
  extra_info: z.string().trim().max(2000).default(''),
  spec_groups: z.array(specGroupSchema).max(12).default([]),
});
export type SpecGroup = z.infer<typeof specGroupSchema>;
export type ProductSheet = z.infer<typeof productSheetSchema>;

/** Drops empty rows, empty groups and blank highlights so only filled data is published. */
export function cleanSheet(input: Partial<ProductSheet>): ProductSheet {
  const parsed = productSheetSchema.parse(input);
  return {
    ...parsed,
    highlights: parsed.highlights.filter(Boolean),
    spec_groups: parsed.spec_groups
      .map(group => ({ title: group.title || 'CARACTÉRISTIQUES', rows: group.rows.filter(row => row.label && row.value) }))
      .filter(group => group.rows.length),
  };
}

export function readSpecGroups(value: unknown): SpecGroup[] {
  const parsed = z.array(specGroupSchema).safeParse(value);
  return parsed.success ? cleanSheet({ spec_groups: parsed.data }).spec_groups : [];
}

const quick: [string, RegExp][] = [['Processeur', /^processeur$|^cpu$/i], ['Mémoire RAM', /\bram\b|^mémoire( vive)?$/i], ['Stockage', /stockage|ssd|disque/i], ['Écran', /écran|diagonale|taille de l.écran/i]];
/** The four top cards: processor, RAM, storage and display, read from the structured sheet. */
export function sheetQuickSpecs(groups: SpecGroup[]) {
  const rows = groups.flatMap(group => group.rows);
  return quick.flatMap(([label, pattern]) => { const row = rows.find(item => pattern.test(item.label)); return row ? [{ label, value: row.value }] : []; });
}
