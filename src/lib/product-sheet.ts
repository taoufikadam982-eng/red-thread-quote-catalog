import { z } from 'zod';
import { repairDeep } from './text-repair';

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
  const parsed = productSheetSchema.parse(repairDeep(input));
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

const cpu: [string, RegExp] = ['Processeur', /^processeur$|^cpu$/i];
const ram: [string, RegExp] = ['Mémoire RAM', /\bram\b|^mémoire( vive)?$/i];
const storage: [string, RegExp] = ['Stockage', /stockage|ssd|disque/i];
const screen: [string, RegExp] = ['Écran', /écran|diagonale/i];
const gpu: [string, RegExp] = ['Carte graphique', /graphique|gpu/i];
const os: [string, RegExp] = ['Système', /système d.exploitation|^système$/i];
/** Top cards: laptops show processor, RAM, storage, display; desktops show graphics instead of display. Missing ones are replaced by the next verified spec. */
export function sheetQuickSpecs(groups: SpecGroup[], desktop = false) {
  const rows = groups.flatMap(group => group.rows);
  const order = desktop ? [cpu, ram, storage, gpu, screen, os] : [cpu, ram, storage, screen, gpu, os];
  return order.flatMap(([label, pattern]) => { const row = rows.find(item => pattern.test(item.label)); return row ? [{ label, value: row.value }] : []; }).slice(0, 4);
}
const reviewKeys: [string, RegExp][] = [cpu, ram, storage, screen, gpu, os];
/** Key PC specifications absent from the sheet, shown to administrators for review. */
export function missingKeySpecs(groups: SpecGroup[], desktop = false) {
  const rows = groups.flatMap(group => group.rows);
  return reviewKeys.filter(([label]) => !(desktop && label === 'Écran')).filter(([, p]) => !rows.some(r => p.test(r.label))).map(([label]) => label);
}
