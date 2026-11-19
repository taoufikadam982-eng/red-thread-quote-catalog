import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useProducts } from './catalog-context';
import { ProductCard } from './product-card';
import { Button } from './ui/button';
import { clearanceProducts } from '@/lib/product-offers';

export function ClearanceSection() {
  const products = clearanceProducts(useProducts());
  if (!products.length) return null;
  return <section className="clearance-section" aria-labelledby="clearance-title"><div className="site-width"><div className="clearance-heading"><div><p className="eyebrow">DÉSTOCKAGE & FINS DE SÉRIE · RABAT</p><h2 id="clearance-title" className="section-title">Offres Spéciales & Déstockage Showroom</h2><p className="clearance-intro">Matériel neuf sous garantie constructeur à tarifs remisés, jusqu'à épuisement du stock en magasin.</p></div><Button asChild variant="link"><Link to="/offres">Voir toutes les offres<ArrowRight/></Link></Button></div><div className="catalogue-grid">{products.map(product => <ProductCard key={product.id} product={product}/>)}</div></div></section>;
}