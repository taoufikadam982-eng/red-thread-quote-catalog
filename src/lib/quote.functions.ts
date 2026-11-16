import { createServerFn } from '@tanstack/react-start';
import { quoteSchema } from './quote-schema';
import { products } from './catalog';

export const submitQuote = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => quoteSchema.parse(input))
  .handler(async ({ data }) => {
    // Public, write-only lead intake. No caller-supplied prices or private reads.
    const items = data.items.map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) throw new Error('Produit non reconnu.');
      return { id: product.id, name: product.name, reference: product.reference, quantity: item.quantity, indicative_price: product.price };
    });
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: recent, error: countError } = await supabaseAdmin.from('quote_requests').select('id', { count: 'exact', head: true }).eq('email', data.email).gte('created_at', new Date(Date.now() - 3600000).toISOString());
    void recent;
    if (countError) throw new Error('La réception des demandes est momentanément indisponible.');
    const { count } = await supabaseAdmin.from('quote_requests').select('id', { count: 'exact', head: true }).eq('email', data.email).gte('created_at', new Date(Date.now() - 3600000).toISOString());
    if ((count ?? 0) >= 5) throw new Error('Plusieurs demandes ont déjà été envoyées. Contactez-nous par téléphone.');
    const { data: saved, error } = await supabaseAdmin.from('quote_requests').insert({ name: data.name, email: data.email, phone: data.phone, request_type: data.request_type, message: data.message, items }).select('id').single();
    if (error || !saved) throw new Error('Votre demande n’a pas pu être enregistrée. Veuillez réessayer.');
    return { id: saved.id };
  });