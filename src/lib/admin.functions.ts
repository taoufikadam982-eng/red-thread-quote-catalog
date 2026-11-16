import { createServerFn, createMiddleware } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { productSchema } from './product-schema';

export const requireAdmin = createMiddleware({ type: 'function' }).middleware([requireSupabaseAuth]).server(async ({ context, next }) => {
  const { data, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (error || data !== true) throw new Error('Accès réservé aux administrateurs.');
  return next();
});
export const getAdminData = createServerFn({ method: 'GET' }).middleware([requireAdmin]).handler(async ({ context }) => {
  const [products, quotes, content, profiles, roles, settings] = await Promise.all([
    context.supabase.from('products').select('*').order('created_at'),
    context.supabase.from('quote_requests').select('*').order('created_at', { ascending: false }),
    context.supabase.from('admin_content').select('*').order('created_at', { ascending: false }),
    context.supabase.from('profiles').select('*'),
    context.supabase.from('user_roles').select('*'),
    context.supabase.from('store_settings').select('*').eq('id','store').maybeSingle(),
  ]);
  for (const result of [products,quotes,content,profiles,roles,settings]) if (result.error) throw new Error(result.error.message);
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const users = await supabaseAdmin.auth.admin.listUsers({ perPage: 100 });
  if (users.error) throw new Error('Impossible de charger les utilisateurs.');
  return { products: products.data ?? [], quotes: quotes.data ?? [], content: content.data ?? [], profiles: profiles.data ?? [], roles: roles.data ?? [], settings: settings.data?.data ?? {}, users: users.data.users.map(u => ({ id:u.id, email:u.email ?? '', confirmed:!!u.email_confirmed_at })), userId:context.userId };
});
export const saveProducts = createServerFn({ method: 'POST' }).middleware([requireAdmin])
  .inputValidator((input: unknown) => z.array(productSchema).min(1).max(500).parse(input))
  .handler(async ({ data, context }) => {
    if (new Set(data.map(p => p.reference)).size !== data.length) throw new Error('Chaque produit doit avoir une référence unique.');
    const { data:existing,error:lookupError } = await context.supabase.from('products').select('id,reference').in('reference',data.map(p=>p.reference));
    if(lookupError)throw new Error(lookupError.message);
    const rows=data.map(p=>({...p,id:existing?.find(e=>e.reference===p.reference)?.id??p.id}));
    const { error } = await context.supabase.rpc('save_product_batch', { rows });
    if (error) throw new Error(error.message);
    return { count:data.length };
  });
export const markQuoteRead = createServerFn({ method:'POST' }).middleware([requireAdmin])
  .inputValidator((input:unknown)=>z.object({ id:z.string().uuid(), is_read:z.boolean() }).parse(input))
  .handler(async ({data,context})=> { const {error}=await context.supabase.from('quote_requests').update({is_read:data.is_read}).eq('id',data.id); if(error)throw new Error(error.message); return true; });
export const saveContent = createServerFn({method:'POST'}).middleware([requireAdmin])
  .inputValidator((input:unknown)=>z.object({id:z.string().uuid().optional(),kind:z.enum(['banner','review','newsletter','email']),title:z.string().trim().min(1).max(200),body:z.string().max(10000),image_path:z.string().max(500).default(''),active:z.boolean()}).parse(input))
  .handler(async ({data,context})=>{const {error}=await context.supabase.from('admin_content').upsert({...data,id:data.id??crypto.randomUUID()});if(error)throw new Error(error.message);return true;});
export const deleteContent = createServerFn({method:'POST'}).middleware([requireAdmin]).inputValidator((input:unknown)=>z.string().uuid().parse(input))
  .handler(async ({data,context})=>{const {error}=await context.supabase.from('admin_content').delete().eq('id',data);if(error)throw new Error(error.message);return true;});
export const saveSettings = createServerFn({method:'POST'}).middleware([requireAdmin])
  .inputValidator((input:unknown)=>z.object({company:z.string().max(200),email:z.string().email().max(254),phone:z.string().max(30),address:z.string().max(500)}).parse(input))
  .handler(async({data,context})=>{const {error}=await context.supabase.from('store_settings').upsert({id:'store',data});if(error)throw new Error(error.message);return true;});
export const saveProfile = createServerFn({method:'POST'}).middleware([requireAdmin])
  .inputValidator((input:unknown)=>z.object({display_name:z.string().trim().max(150),avatar_url:z.string().max(500)}).parse(input))
  .handler(async({data,context})=>{const {error}=await context.supabase.from('profiles').update(data).eq('id',context.userId);if(error)throw new Error(error.message);return true;});
export const inviteAdmin = createServerFn({method:'POST'}).middleware([requireAdmin])
  .inputValidator((input:unknown)=>z.object({email:z.string().email().max(254),redirectTo:z.string().url().max(1000)}).parse(input))
  .handler(async({data,context})=>{
    const { getRequest } = await import('@tanstack/react-start/server');
    const origin=getRequest().headers.get('origin');
    if(!origin || new URL(data.redirectTo).origin!==origin || new URL(data.redirectTo).pathname!=='/reset-password')throw new Error('Adresse de retour invalide.');
    const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
    const result=await supabaseAdmin.auth.admin.inviteUserByEmail(data.email,{redirectTo:data.redirectTo});
    if(result.error)throw new Error(result.error.message);
    const {error}=await supabaseAdmin.from('user_roles').insert({user_id:result.data.user.id,role:'admin'});
    if(error)throw new Error(error.message);
    return true;
  });