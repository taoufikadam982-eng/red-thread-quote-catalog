import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProduct } from '@/lib/admin.functions';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

export function AdminDeleteProduct({ product, disabled, onBusy, onDeleted }: {
  product: { id: string; name: string; reference: string };
  disabled: boolean;
  onBusy: (busy: boolean) => void;
  onDeleted: (id: string) => Promise<void>;
}) {
  const remove = useServerFn(deleteProduct);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  async function confirmDelete() {
    if (busy) return;
    setBusy(true);
    onBusy(true);
    try {
      await remove({ data: product.id });
      await onDeleted(product.id);
      setOpen(false);
      toast.success('Produit supprimé. La boutique est à jour.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Suppression impossible. Réessayez.');
    } finally {
      setBusy(false);
      onBusy(false);
    }
  }
  return <>
    <Button variant="ghost" size="icon" className="size-9 text-destructive" title={`Supprimer ${product.name}`} aria-label={`Supprimer ${product.reference}`} disabled={disabled || busy} onClick={() => setOpen(true)}><Trash2 className="size-4"/></Button>
    <Dialog open={open} onOpenChange={value => { if (!busy) setOpen(value); }}>
      <DialogContent className="sm:max-w-md" onEscapeKeyDown={event => { if (busy) event.preventDefault(); }} onPointerDownOutside={event => { if (busy) event.preventDefault(); }}>
        <DialogTitle>Supprimer ce produit ?</DialogTitle>
        <DialogDescription>Cette suppression est définitive. Le produit sera retiré du catalogue, de la Boutique et des offres. Les demandes de devis déjà reçues sont conservées.</DialogDescription>
        <div className="min-w-0 border-y border-border py-3"><p className="break-words text-sm font-semibold">{product.name}</p><p className="mt-1 break-words text-xs text-muted-foreground">Réf. {product.reference}</p></div>
        <div className="flex justify-end gap-2"><Button variant="outline" disabled={busy} onClick={() => setOpen(false)}>Annuler</Button><Button variant="destructive" disabled={busy} onClick={() => void confirmDelete()}><Trash2/>{busy ? 'Suppression…' : 'Supprimer le produit'}</Button></div>
      </DialogContent>
    </Dialog>
  </>;
}