import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useProducts } from './catalog-context';
import { featuredBrands } from '@/lib/header-menu';
import { sameBrand } from '@/lib/product-brands';
import laptop from '@/assets/laptop.jpg';
import desktop from '@/assets/desktop.jpg';
import printer from '@/assets/printer.jpg';
import ups from '@/assets/ups.jpg';
import accessories from '@/assets/accessories.jpg';

const lines = [
  { text: 'ProBook, EliteBook, stations HP Z, LaserJet et écrans professionnels.', image: laptop },
  { text: 'Portables et tours Dell Pro pour les équipes et postes de travail.', image: desktop },
  { text: 'ThinkPad et ThinkCentre pour la mobilité et la bureautique.', image: laptop },
  { text: 'Portables, ordinateurs et écrans pour les usages professionnels.', image: desktop },
  { text: 'Solutions d’impression et de numérisation de documents.', image: printer },
  { text: 'Onduleurs et protection électrique pour vos équipements IT.', image: ups },
  { text: 'Mémoire, SSD et stockage pour faire évoluer vos configurations.', image: accessories },
];
export function BrandsPage() {
  const products = useProducts();
  return <main className="site-width editorial-page"><p className="eyebrow">L’ÉCOSYSTÈME SESA</p><h1>Nos Marques</h1><p className="editorial-intro">Des gammes professionnelles pour équiper vos équipes. Références et disponibilités confirmées sur devis.</p><div className="brand-showcase">{featuredBrands.map((brand, index) => {
    const line = lines[index]; if (!line) return null;
    const count = products.filter(p => !p.hidden && sameBrand(p.brand, brand)).length;
    return <article key={brand} className="brand-showcase-item"><img src={line.image} alt={`Matériel ${brand} — visuel d’illustration`} width={384} height={260}/><div><h2>{brand}</h2><p>{line.text}</p><small>{count ? `${count} références au catalogue` : 'Références sur demande'}</small><Button asChild variant="outline"><Link to="/boutique" search={{ brand }}>Voir la sélection {brand}<ArrowRight/></Link></Button></div></article>;
  })}</div></main>;
}