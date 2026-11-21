const cp1252: Record<string, number> = { '€':0x80,'‚':0x82,'ƒ':0x83,'„':0x84,'…':0x85,'†':0x86,'‡':0x87,'ˆ':0x88,'‰':0x89,'Š':0x8a,'‹':0x8b,'Œ':0x8c,'Ž':0x8e,'‘':0x91,'’':0x92,'“':0x93,'”':0x94,'•':0x95,'–':0x96,'—':0x97,'˜':0x98,'™':0x99,'š':0x9a,'›':0x9b,'œ':0x9c,'ž':0x9e,'Ÿ':0x9f };
const suspect = /[ÃÂâÅ][\u0080-\u00bf\u0152-\u2122]/;

/** Repairs UTF-8 text that was decoded as Latin-1/Windows-1252 (e.g. "rÃ©fÃ©rence" → "référence"); leaves correct text untouched. */
export function repairText(value: string): string {
  if (!suspect.test(value)) return value;
  // Repair each run of high Latin-1/cp1252 chars separately so one stray char cannot block the rest.
  return value.replace(/Ã[\u00a0 ]/g, 'Ã\u00a0').replace(/[\u0080-\u00ff\u0152-\u2122]+/g, run => {
    let text = run;
    for (let pass = 0; pass < 3; pass++) {
      const bytes: number[] = [];
      for (const ch of text) { const code = ch.codePointAt(0)!; const b = code < 256 ? code : cp1252[ch]; if (b === undefined) return text; bytes.push(b); }
      try { const next = new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes)); if (next === text) break; text = next; } catch { break; }
    }
    return text;
  }).replace(/\u00a0 /g, ' ');
}

/** Applies repairText to every string inside arrays/objects. */
export function repairDeep<T>(value: T): T {
  if (typeof value === 'string') return repairText(value) as T;
  if (Array.isArray(value)) return value.map(repairDeep) as T;
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, repairDeep(v)])) as T;
  return value;
}
