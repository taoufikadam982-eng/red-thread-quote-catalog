import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import type { Product } from '@/lib/catalog';
export function ProductGallery({ product }: { product: Product }) {
  const images = product.images?.length ? product.images : [product.image];
  const [selected, setSelected] = useState(0);
  const touch = useRef<number | null>(null);
  const active = selected < images.length ? selected : 0;
  const move = (delta: number) => setSelected((active + delta + images.length) % images.length);
  return <div className="product-display">{product.availability !== '' && <span className={`product-stock ${product.availability === 'En stock' ? 'is-stock' : product.availability === 'Sur commande' ? 'is-order' : ''}`}><span aria-hidden="true">●</span> {product.availability || 'Disponibilité sur demande'}</span>}
    <div className="product-gallery-view" onTouchStart={event => { touch.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={event => { const x = event.changedTouches[0]?.clientX; if (touch.current !== null && x !== undefined && Math.abs(x-touch.current)>40) move(x<touch.current?1:-1); touch.current=null; }} onTouchCancel={() => { touch.current=null; }}>
      <img key={images[active]} src={images[active]} alt={`${product.name} — photo ${active+1}`} width={600} height={600}/>
      {images.length>1 && <><Button type="button" variant="outline" size="icon" className="product-gallery-prev" aria-label="Photo précédente" onClick={() => move(-1)}><ChevronLeft/></Button><Button type="button" variant="outline" size="icon" className="product-gallery-next" aria-label="Photo suivante" onClick={() => move(1)}><ChevronRight/></Button></>}
    </div>
    {images.length>1 && <div className="product-gallery-thumbs" aria-label="Photos du produit">{images.map((image,index) => <Button type="button" variant="outline" className={index===active?'is-active':''} aria-label={`Afficher la photo ${index+1}`} aria-pressed={index===active} key={image} onClick={() => setSelected(index)}><img src={image} alt="" width={80} height={80}/></Button>)}</div>}
    <p><strong>{product.name}</strong><br/>Visuel d’illustration · Réf. {product.reference}</p>
  </div>;
}