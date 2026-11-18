import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Database } from '@/integrations/supabase/types';
import { requireAdmin } from './admin.functions';
import { blogPostSchema, slugify } from './blog';

export const getPublishedPosts = createServerFn({ method: 'GET' }).handler(async () => {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  const url = process.env['SUPABASE_URL'];
  if (!key || !url) throw new Error('Blog momentanément indisponible.');
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
      headers.set('apikey', key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await client.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false });
  if (error) throw new Error('Impossible de charger les articles.');
  return data ?? [];
});
export const getAdminPosts = createServerFn({ method: 'GET' }).middleware([requireAdmin]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});
export const saveBlogPost = createServerFn({ method: 'POST' }).middleware([requireAdmin])
  .inputValidator((input: unknown) => blogPostSchema.parse(input))
  .handler(async ({ data, context }) => {
    const base = slugify(data.title);
    const { data: clash } = await context.supabase.from('blog_posts').select('id').eq('slug', base);
    const slug = clash?.some(r => r.id !== data.id) ? `${base}-${crypto.randomUUID().slice(0, 6)}` : base;
    const { id: _id, ...fields } = data;
    const row = { ...fields, slug };
    const { error } = data.id
      ? await context.supabase.from('blog_posts').update(row).eq('id', data.id)
      : await context.supabase.from('blog_posts').insert(row);
    if (error) throw new Error(error.message);
    return true;
  });
export const deleteBlogPost = createServerFn({ method: 'POST' }).middleware([requireAdmin])
  .inputValidator((input: unknown) => z.string().uuid().parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from('blog_posts').delete().eq('id', data);
    if (error) throw new Error(error.message);
    return true;
  });
