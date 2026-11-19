import { useEffect, useState } from 'react';
import { Star, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { MAX_PRODUCT_IMAGES, promoteImage } from '@/lib/product-images';
function GalleryThumbnail({ path }: { path: string }) {
  const [url,setUrl]=useState('');
  useEffect(() => { let active=true; void supabase.storage.from('catalogue-images').createSignedUrl(path,3600).then(({data,error}) => { if(active) { setUrl(data?.signedUrl??''); if(error) toast.error('Aperçu indisponible.'); } }); return () => { active=false; }; },[path]);
  return url ? <img src={url} alt="Photo du produit" width={120} height={120}/> : <span role="status">Chargement…</span>;
}
export function AdminProductGallery({ images, onChange, busy, onBusy }: { images:string[]; onChange:(images:string[])=>void; busy:boolean; onBusy:(busy:boolean)=>void }) {
  async function upload(files:File[]) {
    if(!files.length || busy) return;
    if(images.length+files.length>MAX_PRODUCT_IMAGES) { toast.error('6 images maximum par produit.'); return; }
    if(files.some(file => !['image/png','image/jpeg','image/webp'].includes(file.type) || file.size>5*1024*1024)) { toast.error('Choisissez des images JPG, PNG ou WebP de moins de 5 Mo.'); return; }
    onBusy(true);
    const added:string[]=[];
    try {
      for(const file of files) {
        const ext=file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
        const path=`products/${crypto.randomUUID()}.${ext}`;
        const {error}=await supabase.storage.from('catalogue-images').upload(path,file,{contentType:file.type});
        if(error) throw new Error(error.message);
        added.push(path);
      }
      onChange([...images,...added]);
    } catch(error) {
      if(added.length) await supabase.storage.from('catalogue-images').remove(added);
      toast.error(error instanceof Error ? error.message : 'Téléchargement impossible.');
    } finally { onBusy(false); }
  }
  return <div className="admin-product-gallery sm:col-span-2"><label>Photos du produit ({images.length}/6)<input type="file" aria-label="Photos du produit" multiple disabled={busy || images.length>=MAX_PRODUCT_IMAGES} accept="image/png,image/jpeg,image/webp" onChange={event => { void upload(Array.from(event.target.files??[])); event.target.value=''; }}/></label>
    {busy && <p role="status">Téléchargement des photos…</p>}
    <div className="admin-gallery-grid">{images.map((path,index) => <div className="admin-gallery-item" key={path}><GalleryThumbnail path={path}/>{index===0 && <span className="admin-gallery-primary">Principale</span>}<div><Button type="button" variant={index===0?'secondary':'outline'} size="icon" disabled={busy || index===0} aria-label={`Définir principale la photo ${index+1}`} title="Définir principale" onClick={() => onChange(promoteImage(images,index))}><Star/></Button><Button type="button" variant="outline" size="icon" disabled={busy} aria-label={`Supprimer la photo ${index+1}`} title="Supprimer" onClick={() => onChange(images.filter((_,i)=>i!==index))}><X/></Button></div></div>)}</div>
  </div>;
}