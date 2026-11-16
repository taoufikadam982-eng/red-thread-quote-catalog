import { useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitQuote } from '@/lib/quote.functions';
import { quoteSchema } from '@/lib/quote-schema';
import { useQuote } from './quote-context';

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const { items, setItems } = useQuote();
  const submit = useServerFn(submitQuote);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = quoteSchema.safeParse({ name: form.get('name'), email: form.get('email'), phone: form.get('phone'), request_type: form.get('request_type'), message: form.get('message'), website: form.get('website'), items });
    if (!result.success) { setError(result.error.issues[0]?.message ?? 'Vérifiez les informations.'); return; }
    setPending(true); setError('');
    try { const response = await submit({ data: result.data }); setSaved(response.id); setItems([]); }
    catch (error) { setError(error instanceof Error ? error.message : 'Veuillez réessayer.'); }
    finally { setPending(false); }
  }
  if (saved) return <div role="status" className="py-10 text-center"><CheckCircle2 className="mx-auto mb-4 size-10 text-primary"/><h3 className="text-xl font-bold">Votre demande est enregistrée.</h3><p className="mt-3 text-sm text-muted-foreground">Référence : {saved.slice(0, 8).toUpperCase()}</p><Button variant="outline" className="mt-6" onClick={() => setSaved('')}>Nouvelle demande</Button></div>;
  return <form onSubmit={send} className="contact-form space-y-4">
    <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}><div><label htmlFor={compact ? 'quote-name' : 'contact-name'}>Nom / Société *</label><input id={compact ? 'quote-name' : 'contact-name'} name="name" placeholder="Votre nom ou votre entreprise" minLength={2} maxLength={150} required /></div><div><label htmlFor={compact ? 'quote-email' : 'contact-email'}>Email *</label><input id={compact ? 'quote-email' : 'contact-email'} name="email" type="email" placeholder="vous@entreprise.ma" maxLength={254} required /></div></div>
    <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}><div><label htmlFor={compact ? 'quote-phone' : 'contact-phone'}>Téléphone *</label><input id={compact ? 'quote-phone' : 'contact-phone'} name="phone" type="tel" placeholder="06 XX XX XX XX" minLength={8} maxLength={30} required /></div><div><label htmlFor={compact ? 'quote-type' : 'contact-type'}>Type de demande</label><select id={compact ? 'quote-type' : 'contact-type'} name="request_type"><option>Devis</option><option>Bon de commande</option><option>Marché</option><option>Magasin</option></select></div></div>
    <div><label htmlFor={compact ? 'quote-message' : 'contact-message'}>Votre projet *</label><textarea id={compact ? 'quote-message' : 'contact-message'} name="message" rows={3} placeholder="Matériel recherché, quantités, besoins de votre équipe…" minLength={5} maxLength={5000} required /></div>
    <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    {items.length > 0 && <p className="text-xs text-muted-foreground">{items.reduce((sum, item) => sum + item.quantity, 0)} produit(s) joint(s) à votre demande.</p>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button type="submit" disabled={pending} className="h-11 w-full">{pending ? 'Envoi en cours…' : 'Envoyer ma demande'}<Send/></Button>
    <p className="text-center text-[10px] text-muted-foreground">Aucun paiement en ligne. Vos coordonnées sont utilisées pour traiter votre demande.</p>
  </form>;
}