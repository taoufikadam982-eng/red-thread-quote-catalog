import { createServerFn } from '@tanstack/react-start';
import { defaultWhatsappNumber, normalizeWhatsapp } from './storefront';

export type StorefrontSettings = { whatsapp: string };

// Public read of the single storefront-safe setting. The full store_settings row stays
// admin-only behind RLS; this handler exposes only the WhatsApp line, never the whole row.
export const getStorefrontSettings = createServerFn({ method: 'GET' }).handler(async (): Promise<StorefrontSettings> => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data, error } = await supabaseAdmin.from('store_settings').select('data').eq('id', 'store').maybeSingle();
  if (error) throw new Error('Réglages momentanément indisponibles.');
  const raw = (data?.data as Record<string, unknown> | null)?.['whatsapp'];
  const whatsapp = typeof raw === 'string' ? normalizeWhatsapp(raw) : defaultWhatsappNumber;
  return { whatsapp };
});
