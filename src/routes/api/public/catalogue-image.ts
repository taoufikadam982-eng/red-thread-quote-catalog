import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
export const Route=createFileRoute('/api/public/catalogue-image')({ staticData: { sitemap: false },server:{handlers:{GET:async({request})=>{
  const parsed=z.string().regex(/^[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp)$/).max(200).safeParse(new URL(request.url).searchParams.get('path'));
  if(!parsed.success)return new Response('Invalid image',{status:400});
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  // Only media attached to visible products or published blog posts can be served anonymously.
  const {data:product}=parsed.data.startsWith('blog/')
    ? await supabaseAdmin.from('blog_posts').select('id').eq('cover_image_url',parsed.data).eq('published',true).limit(1)
    : await supabaseAdmin.from('products').select('id').or(`image_path.eq.${parsed.data},images.cs.{${parsed.data}}`).eq('hidden',false).limit(1);
  if(!product?.length)return new Response('Not found',{status:404});
  const {data,error}=await supabaseAdmin.storage.from('catalogue-images').download(parsed.data);
  if(error||!data)return new Response('Not found',{status:404});
  return new Response(data,{headers:{'Content-Type':data.type,'Cache-Control':'public, max-age=60','X-Content-Type-Options':'nosniff'}});
}}}});