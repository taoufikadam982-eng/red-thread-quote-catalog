import { createServerFn } from '@tanstack/react-start';
import { newsletterSchema } from './newsletter-schema';
export const subscribeNewsletter = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => newsletterSchema.parse(input))
  .handler(async ({ data }) => {
    // Public write-only consent intake. Subscriber records remain admin-only.
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: existing, error: readError } = await supabaseAdmin.from('admin_content').select('id').eq('kind', 'newsletter').eq('title', data.email).limit(1);
    if (readError) throw new Error('Inscription momentanément indisponible.');
    if (!existing?.length) {
      const { error } = await supabaseAdmin.from('admin_content').insert({ kind: 'newsletter', title: data.email, body: `Consentement aux offres SESA reçu le ${new Date().toISOString()}.`, active: true, image_path: '' });
      if (error) throw new Error('Votre inscription n’a pas pu être enregistrée.');
    }
    return { success: true };
  });