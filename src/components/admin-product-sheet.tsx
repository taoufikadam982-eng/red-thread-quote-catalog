import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { saveProductSheet } from '@/lib/admin.functions';
import { missingKeySpecs, readSpecGroups, type ProductSheet, type SpecGroup } from '@/lib/product-sheet';

type Source = { id: string; name: string; intro?: string | null; highlights?: string[] | null; use_cases?: string | null; extra_info?: string | null; spec_groups?: unknown };
const move = <T,>(list: T[], from: number, to: number) => { if (to < 0 || to >= list.length) return list; const next = [...list]; const [item] = next.splice(from, 1); next.splice(to, 0, item as T); return next; };

export function AdminProductSheet({ product }: { product: Source }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sheet, setSheet] = useState<ProductSheet | null>(null);
  const save = useServerFn(saveProductSheet);
  const qc = useQueryClient();
  const start = () => { setSheet({ intro: product.intro ?? '', highlights: product.highlights ?? [], use_cases: product.use_cases ?? '', extra_info: product.extra_info ?? '', spec_groups: readSpecGroups(product.spec_groups) }); setOpen(true); };
  const groups = (fn: (g: SpecGroup[]) => SpecGroup[]) => setSheet(s => s && { ...s, spec_groups: fn(s.spec_groups) });
  const group = (i: number, fn: (g: SpecGroup) => SpecGroup) => groups(list => list.map((g, j) => j === i ? fn(g) : g));
  const submit = async () => { if (!sheet) return; setBusy(true); try { await save({ data: { id: product.id, sheet } }); await Promise.all([qc.invalidateQueries({ queryKey: ['admin'] }), qc.invalidateQueries({ queryKey: ['catalogue'] })]); toast.success('Fiche détaillée enregistrée.'); } catch (e) { toast.error(e instanceof Error ? e.message : 'Erreur'); } finally { setBusy(false); } };
  return <>
    <Button variant="link" className="px-0 text-xs text-foreground underline" onClick={start}>Fiche détaillée</Button>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
      <DialogTitle>Fiche détaillée</DialogTitle><DialogDescription>{product.name} · les lignes vides ne sont pas publiées.</DialogDescription>{sheet && missingKeySpecs(sheet.spec_groups).length > 0 && <p role="status" className="rounded-md border border-border bg-muted px-3 py-2 text-xs"><strong>À vérifier :</strong> {missingKeySpecs(sheet.spec_groups).join(', ')} non renseigné(s).</p>}
      {sheet && <div className="admin-form space-y-4">
        <label>Présentation du produit<textarea rows={4} maxLength={2000} value={sheet.intro} onChange={e => setSheet({ ...sheet, intro: e.target.value })}/></label>
        <div className="space-y-2"><strong className="text-sm">Points forts</strong>{sheet.highlights.map((h, i) => <div key={i} className="flex gap-2"><input aria-label={`Point fort ${i + 1}`} className="admin-input flex-1" maxLength={240} value={h} onChange={e => setSheet({ ...sheet, highlights: sheet.highlights.map((x, j) => j === i ? e.target.value : x) })}/><Button type="button" variant="ghost" size="icon" aria-label="Supprimer le point fort" onClick={() => setSheet({ ...sheet, highlights: sheet.highlights.filter((_, j) => j !== i) })}><Trash2/></Button></div>)}<Button type="button" variant="outline" size="sm" disabled={sheet.highlights.length >= 8} onClick={() => setSheet({ ...sheet, highlights: [...sheet.highlights, ''] })}><Plus/>Ajouter un point fort</Button></div>
        <label>Utilisation recommandée<textarea rows={3} maxLength={2000} value={sheet.use_cases} onChange={e => setSheet({ ...sheet, use_cases: e.target.value })}/></label>
        <div className="space-y-3"><strong className="text-sm">Fiche technique</strong>{sheet.spec_groups.map((g, i) => <div key={i} className="rounded-md border border-border p-3 space-y-2">
          <div className="flex gap-2"><input aria-label={`Titre du groupe ${i + 1}`} className="admin-input flex-1 font-semibold" placeholder="Ex. PERFORMANCES" value={g.title} onChange={e => group(i, x => ({ ...x, title: e.target.value }))}/><Button type="button" variant="ghost" size="icon" aria-label="Monter le groupe" onClick={() => groups(l => move(l, i, i - 1))}><ArrowUp/></Button><Button type="button" variant="ghost" size="icon" aria-label="Descendre le groupe" onClick={() => groups(l => move(l, i, i + 1))}><ArrowDown/></Button><Button type="button" variant="ghost" size="icon" aria-label="Supprimer le groupe" onClick={() => groups(l => l.filter((_, j) => j !== i))}><Trash2/></Button></div>
          {g.rows.map((r, k) => <div key={k} className="grid grid-cols-[1fr_1.4fr_auto] gap-2 max-sm:grid-cols-1"><input aria-label="Libellé" className="admin-input" placeholder="Libellé" value={r.label} onChange={e => group(i, x => ({ ...x, rows: x.rows.map((y, m) => m === k ? { ...y, label: e.target.value } : y) }))}/><input aria-label="Valeur" className="admin-input" placeholder="Valeur" value={r.value} onChange={e => group(i, x => ({ ...x, rows: x.rows.map((y, m) => m === k ? { ...y, value: e.target.value } : y) }))}/><div className="flex"><Button type="button" variant="ghost" size="icon" aria-label="Monter la ligne" onClick={() => group(i, x => ({ ...x, rows: move(x.rows, k, k - 1) }))}><ArrowUp/></Button><Button type="button" variant="ghost" size="icon" aria-label="Descendre la ligne" onClick={() => group(i, x => ({ ...x, rows: move(x.rows, k, k + 1) }))}><ArrowDown/></Button><Button type="button" variant="ghost" size="icon" aria-label="Supprimer la ligne" onClick={() => group(i, x => ({ ...x, rows: x.rows.filter((_, m) => m !== k) }))}><Trash2/></Button></div></div>)}
          <Button type="button" variant="outline" size="sm" onClick={() => group(i, x => ({ ...x, rows: [...x.rows, { label: '', value: '' }] }))}><Plus/>Ajouter une ligne</Button></div>)}
          <Button type="button" variant="outline" size="sm" disabled={sheet.spec_groups.length >= 12} onClick={() => groups(l => [...l, { title: '', rows: [{ label: '', value: '' }] }])}><Plus/>Ajouter un groupe</Button></div>
        <label>Informations complémentaires<textarea rows={3} maxLength={2000} value={sheet.extra_info} onChange={e => setSheet({ ...sheet, extra_info: e.target.value })}/></label>
        <div className="flex flex-wrap items-center gap-3"><Button type="button" disabled={busy} onClick={submit}><Save/>{busy ? 'Enregistrement…' : 'Enregistrer la fiche'}</Button><Link to="/produit/$id" params={{ id: product.id }} target="_blank" className="text-sm underline">Voir la fiche</Link></div>
      </div>}
    </DialogContent></Dialog>
  </>;
}
