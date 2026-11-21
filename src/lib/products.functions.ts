import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { repairDeep } from './text-repair';
import type { Database } from '@/integrations/supabase/types';

export const getPublicProducts = createServerFn({ method: 'GET' }).handler(async () => {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  const url = process.env['SUPABASE_URL'];
  if (!key || !url) throw new Error('Catalogue momentanément indisponible.');
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
      headers.set('apikey', key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await client.from('products').select('id,name,reference,category,categories,specs,brand,usage,image_path,images,price,old_price,availability,hidden,indicative,is_clearance,clearance_badge,intro,highlights,use_cases,extra_info,spec_groups').eq('hidden', false).order('created_at');
  if (error) throw new Error('Impossible de charger le catalogue.');
  return repairDeep(data ?? []);
});