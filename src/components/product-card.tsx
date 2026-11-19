import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { priceLabel, type Product } from '@/lib/catalog';
import { productSpecPills } from '@/lib/product-detail';
import { productPlainText } from '@/lib/product-text';

export function ProductCard({ product }: { product: Product }) {
  const specs = productSpecPills(product);
  const name = productPlainText(product.name);
  const stock = product.availability === 'En stock';
  const unavailable = product.availability === 'Rupture de stock';
  return <article className="sesa-product-card">
    <div className="sesa-card-media">
      <span className={`sesa-card-stock ${stock ? 'is-stock' : unavailable ? 'is-unavailable' : 'is-order'}`}>● {stock ? 'En stock' : unavailable ? 'Rupture de stock' : 'Sur commande'}</span>
      <Link className="sesa-card-image" to="/produit/$id" params={{ id: product.id }} aria-label={`Voir le produit : ${name}`}><img src={product.image} alt={name} width={480} height={360} loading="lazy"/></Link>
    </div>
    <div className="sesa-card-copy">
      <p className="sesa-card-brand">{productPlainText(product.brand)}</p>
      <Link className="sesa-card-title" to="/produit/$id" params={{ id: product.id }}><h3>{name}</h3></Link>
      <p className="sesa-card-reference">Réf. {productPlainText(product.reference)}</p>
      <div className="sesa-card-specs">{specs.length ? specs.map(spec => <span key={spec}>{spec}</span>) : <span>Fiche technique disponible</span>}</div>
      <div className="sesa-card-bottom"><div className="sesa-card-price"><p>Prix indicatif TTC</p><strong>{product.price > 0 ? <>{priceLabel(product.price)} <small>DH</small></> : 'Sur devis'}</strong></div><Button variant="dark" className="sesa-card-action" asChild><Link to="/produit/$id" params={{ id: product.id }}>Voir le produit<ArrowRight/></Link></Button></div>
    </div>
  </article>;
}