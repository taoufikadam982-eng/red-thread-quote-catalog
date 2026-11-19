import { useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ChevronDown, Menu, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useProducts } from './catalog-context';
import { useQuote } from './quote-context';
import { hasCategory } from '@/lib/product-categories';
import { categories } from '@/lib/catalog';
import { featuredBrands, mainMenu, menuIcons } from '@/lib/header-menu';

export function CategoryLinks({ onSelect }: { onSelect: () => void }) {
  const products = useProducts();
  return <div className="mega-categories">{categories.map((category, index) => {
    const Icon = menuIcons[index] ?? Menu;
    const count = products.filter(product => !product.hidden && hasCategory(product, category.name)).length;
    return <Button asChild variant="ghost" className="mega-category" key={category.name}><Link to="/boutique" search={{ category: category.name }} onClick={onSelect}><Icon/><span><strong>{category.name}</strong><small>{count} référence{count === 1 ? '' : 's'} au catalogue</small></span><ArrowRight/></Link></Button>;
  })}</div>;
}

export function HeaderNavigation() {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setOpen: openQuote } = useQuote();
  const cancelClose = () => { if (timeout.current) clearTimeout(timeout.current); };
  const delayClose = () => { cancelClose(); timeout.current = setTimeout(() => setOpen(false), 180); };
  return <nav className="executive-nav max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
    <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><Button className="mega-trigger" onPointerEnter={event => { if (event.pointerType === 'mouse') { cancelClose(); setOpen(true); } }} onPointerLeave={delayClose}><Menu/>Catalogue<ChevronDown/></Button></PopoverTrigger>
      <PopoverContent align="start" sideOffset={12} className="catalogue-mega" aria-label="Catégories du catalogue" onPointerEnter={cancelClose} onPointerLeave={delayClose} onOpenAutoFocus={event => event.preventDefault()}>
        <div className="mega-heading"><div><p className="eyebrow">LE MATÉRIEL SESA</p><h2>Votre catalogue professionnel</h2></div><Button asChild variant="ghost"><Link to="/boutique" onClick={() => setOpen(false)}>Tout voir<ArrowRight/></Link></Button></div>
        <CategoryLinks onSelect={() => setOpen(false)}/><div className="mega-brands"><strong>Accès par marque</strong>{featuredBrands.slice(0, 6).map(brand => <Button asChild variant="outline" size="sm" key={brand}><Link to="/boutique" search={{ brand }} onClick={() => setOpen(false)}>{brand}</Link></Button>)}</div>
      </PopoverContent>
    </Popover>
    <div className="executive-links">{mainMenu.map(item => <Link key={item.to} to={item.to} activeOptions={{ exact: true }}>{item.label}</Link>)}</div>
    <div className="executive-actions"><a href="tel:+212537765777"><Phone/><span>05 37 76 57 77 / 78</span></a><Button onClick={() => openQuote(true)}>Demander un devis<ArrowRight/></Button></div>
  </nav>;
}