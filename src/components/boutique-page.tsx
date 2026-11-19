import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowDown, ArrowRight, Building2, ChevronRight, FileText, Headphones, Search, ShieldCheck, SlidersHorizontal, Store, X } from 'lucide-react';
import { Button } from './ui/button';
import { useProducts } from './catalog-context';
import { useQuote } from './quote-context';
import { hasCategory, officialCategories, normalizeCategory } from '@/lib/product-categories';
import { ProductCard } from './product-card';
import { productFacets, selectBoutiqueProducts, technicalFacets } from '@/lib/boutique-filters';
import cover from '@/assets/sesa-boutique-cover.jpg';

export function BoutiquePage({ initialBrand = '', initialCategory = '', initialQuery = '' }: { initialBrand?: string; initialCategory?: string; initialQuery?: string }) {
  const products = useProducts();
  const { setOpen } = useQuote();
  const [category, setCategory] = useState(normalizeCategory(initialCategory));
  const [query, setQuery] = useState(initialQuery);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState<number | null>(null);
  const [selected, setSelected] = useState<Record<string, string[]>>(initialBrand ? { Marque: [initialBrand] } : {});
  const [sort, setSort] = useState('price-up');
  const [limit, setLimit] = useState(12);
  const [mobileFilters, setMobileFilters] = useState(false);
  const filtersRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (mobileFilters) filtersRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, [mobileFilters]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const ceiling = Math.max(1, ...products.map(p => p.price));
  const categories = officialCategories;
  const pool = category ? products.filter(p => hasCategory(p, category)) : products;
  const facets: Record<string, string[]> = {
    Marque: [...new Set(pool.map(p => p.brand).filter(Boolean))].sort(),
    ...Object.fromEntries(technicalFacets.map(key => [key, [...new Set(pool.flatMap(p => productFacets(p)[key] ?? []))].sort()])),
    Disponibilité: [...new Set(pool.map(p => p.availability || 'Sur demande'))],
  };
  const shown = selectBoutiqueProducts(products, { category, query, min, max: max ?? ceiling, selected, sort });
  const reset = () => { setMin(0); setMax(null); setSelected({}); setQuery(''); setCategory(''); setLimit(12); };
  const toggle = (key: string, value: string) => {
    setSelected(previous => ({ ...previous, [key]: (previous[key] ?? []).includes(value) ? (previous[key] ?? []).filter(v => v !== value) : [...(previous[key] ?? []), value] }));
    setLimit(12);
  };
  return <main className="boutique-page">
    <div className="site-width boutique-breadcrumb"><Link to="/">Accueil</Link><ChevronRight aria-hidden="true"/><span>Boutique</span></div>
    <section className="boutique-cover" aria-labelledby="boutique-title">
      <img src={cover} alt="Ordinateur portable, tour et écran dans un bureau à Rabat" width={1920} height={640}/>
      <div className="site-width boutique-cover-layout"><div className="boutique-cover-copy"><p className="eyebrow">Catalogue professionnel</p><h1 id="boutique-title">Boutique informatique</h1><p>Matériel neuf garanti, devis sous 24h et retrait en magasin à Rabat.</p></div></div>
    </section>
    <div className="boutique-trust-strip"><ul className="site-width">{[{ icon: Building2, text: 'Devis & Marchés' }, { icon: ShieldCheck, text: 'Matériel neuf garanti' }, { icon: Headphones, text: 'Conseil expert' }, { icon: Store, text: 'Showroom Rabat' }].map(item => <li key={item.text}><item.icon aria-hidden="true"/><span>{item.text}</span></li>)}</ul></div>
    <section className="site-width boutique-selection" aria-label="Sélection de produits">
      <label className="boutique-search"><Search aria-hidden="true"/><input aria-label="Rechercher dans la boutique" placeholder="Un modèle, une marque ou un usage…" value={query} onChange={e => { setQuery(e.target.value); setLimit(12); }}/>{query && <Button variant="ghost" size="icon" aria-label="Effacer la recherche" onClick={() => setQuery('')}><X/></Button>}</label>
      <div className="boutique-tabs" aria-label="Catégories de la boutique">{['', ...categories].map(value => <Button key={value} variant={category === value ? 'default' : 'outline'} aria-pressed={category === value} onClick={() => { setCategory(value); setSelected({}); setLimit(12); }}>{value || 'Tous'}<span>{value ? products.filter(p => hasCategory(p, value)).length : products.length}</span></Button>)}</div>
      <div className="boutique-layout">
        <aside ref={filtersRef} id="boutique-filters" className={`boutique-filters ${mobileFilters ? 'is-open' : ''}`} aria-label="Affiner les produits"><div className="boutique-filter-heading"><div><p className="eyebrow">Affiner</p><h2>Votre sélection.</h2></div><Button variant="ghost" size="icon" className="boutique-filter-close" aria-label="Fermer les filtres" onClick={() => setMobileFilters(false)}><X/></Button></div>
          <fieldset><legend>Budget TTC</legend><input type="range" aria-label="Budget maximum" min={0} max={ceiling} value={Math.min(max ?? ceiling, ceiling)} onChange={e => { setMax(Number(e.target.value)); setLimit(12); }}/><div className="boutique-budget"><label><span className="sr-only">Budget minimum</span><input aria-label="Budget minimum" type="number" min={0} max={max ?? ceiling} value={min} onChange={e => { setMin(Math.max(0, Number(e.target.value))); setLimit(12); }}/></label><span>à</span><label><span className="sr-only">Budget maximum TTC</span><input aria-label="Budget maximum TTC" type="number" min={min} value={max ?? ceiling} onChange={e => { setMax(Math.max(0, Number(e.target.value))); setLimit(12); }}/></label></div><p className="boutique-budget-unit">DH TTC · Prix indicatifs</p></fieldset>
          {Object.entries(facets).filter(([, values]) => values.length > 0).map(([key, values]) => <fieldset key={key}><legend>{key}</legend>{(expanded.includes(key) ? values : values.slice(0, 5)).map(value => <label className="boutique-checkbox" key={value}><input type="checkbox" checked={(selected[key] ?? []).includes(value)} onChange={() => toggle(key, value)}/><span>{value}</span><small>{pool.filter(p => key === 'Marque' ? p.brand === value : key === 'Disponibilité' ? (p.availability || 'Sur demande') === value : (productFacets(p)[key] ?? []).includes(value)).length}</small></label>)}{values.length > 5 && <Button variant="ghost" className="boutique-more-options" onClick={() => setExpanded(previous => previous.includes(key) ? previous.filter(v => v !== key) : [...previous, key])}>{expanded.includes(key) ? 'Afficher moins' : 'Afficher plus d’options'}</Button>}</fieldset>)}
          <Button variant="outline" className="w-full" onClick={reset}>Tout effacer</Button>
        </aside>
        <div className="boutique-results"><div className="boutique-results-toolbar"><p role="status"><strong>{shown.length}</strong> produit{shown.length === 1 ? '' : 's'} trouvé{shown.length === 1 ? '' : 's'}</p><Button variant="outline" className="boutique-filter-trigger" aria-expanded={mobileFilters} aria-controls="boutique-filters" onClick={() => setMobileFilters(!mobileFilters)}><SlidersHorizontal/>Filtres</Button><label>Trier par<select aria-label="Trier les produits" value={sort} onChange={e => setSort(e.target.value)}><option value="price-up">Prix croissant</option><option value="price-down">Prix décroissant</option><option value="name">Nom du produit</option></select></label></div>
          <div className="boutique-product-grid">{shown.slice(0, limit).map(product => <ProductCard key={product.id} product={product}/>)}</div>
          {shown.length === 0 && <div className="boutique-empty"><h3>Aucun produit dans cette sélection.</h3><Button variant="outline" onClick={reset}>Tout effacer</Button><Button onClick={() => setOpen(true)}>Demander un devis<FileText/></Button></div>}
          {shown.length > limit && <div className="boutique-load-more"><Button onClick={() => setLimit(previous => previous + 12)}>Voir plus de produits<ArrowDown/></Button></div>}
        </div>
      </div>
    </section>

  </main>;
}