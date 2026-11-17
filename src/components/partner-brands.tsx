import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import desktopLogos from '@/assets/partner-logos-transparent.png.asset.json';
import hp from '@/assets/partners/hp.png.asset.json';
import dell from '@/assets/partners/dell.png.asset.json';
import lenovo from '@/assets/partners/lenovo.png.asset.json';
import apple from '@/assets/partners/apple.png.asset.json';
import samsung from '@/assets/partners/samsung.png.asset.json';
import asus from '@/assets/partners/asus.png.asset.json';
import msi from '@/assets/partners/msi.png.asset.json';
import epson from '@/assets/partners/epson.svg.asset.json';
import eaton from '@/assets/partners/eaton.svg.asset.json';

const partners = [
  { brand: 'HP', image: hp }, { brand: 'Dell', image: dell },
  { brand: 'Lenovo', image: lenovo }, { brand: 'Apple', image: apple },
  { brand: 'Samsung', image: samsung }, { brand: 'ASUS', image: asus },
  { brand: 'MSI', image: msi }, { brand: 'Epson', image: epson },
  { brand: 'Eaton', image: eaton },
];

export function PartnerBrands() {
  const [touching, setTouching] = useState(false);
  return <section className="partner-band" aria-label="Nos marques partenaires"><div className="site-width partner-row">
    <h2 className="partner-heading">Nos marques<br/>partenaires</h2>
    <div className="partner-logo-scroll hidden md:block"><img src={desktopLogos.url} alt="HP, Dell, Lenovo, Apple, Samsung, ASUS et MSI" width={800} height={53} className="partner-logos"/></div>
    <div className="partner-marquee md:hidden" onTouchStart={() => setTouching(true)} onTouchEnd={() => setTouching(false)} onTouchCancel={() => setTouching(false)}>
      <div className={`partner-marquee-track${touching ? ' is-touching' : ''}`}>
        {[0, 1].map(copy => <div className="partner-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {partners.map(({ brand, image }) => <Button asChild variant="ghost" className="partner-marquee-logo" key={brand}><Link to="/boutique" search={{ brand }} tabIndex={copy === 1 ? -1 : 0} aria-label={`Voir les produits ${brand}`}><img src={image.url} alt={brand} width={112} height={48}/></Link></Button>)}
        </div>)}
      </div>
    </div>
    <Button asChild variant="ghost" className="partner-all"><Link to="/marques">Voir toutes les marques<ArrowRight className="size-4"/></Link></Button>
  </div></section>;
}