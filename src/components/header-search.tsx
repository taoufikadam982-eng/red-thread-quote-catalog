import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { ArrowRight, Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { useProducts } from './catalog-context';
import { useQuote } from './quote-context';
import { groupedProductSearch, SEARCH_DEBOUNCE_MS, searchPrice } from '@/lib/product-search';

export function HeaderSearch() {
  const products = useProducts();
  const quote = useQuote();
  const navigate = useNavigate();
  const location = useRouterState({ select: state => state.location.href });
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const result = groupedProductSearch(products, debounced);
  const visible = open && Boolean(query.trim()) && debounced === query;
  useEffect(() => { const timer = setTimeout(() => setDebounced(query), SEARCH_DEBOUNCE_MS); return () => clearTimeout(timer); }, [query]);
  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => {
    function outside(event: PointerEvent) { if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false); }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') { event.preventDefault(); input.current?.focus(); setOpen(false); }
    if (!visible || !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const items = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-search-link]') ?? []);
    if (!items.length) return;
    const index = items.findIndex(item => item === document.activeElement);
    const next = event.key === 'ArrowDown' ? (index + 1) % items.length : index <= 0 ? items.length - 1 : index - 1;
    items[next]?.focus();
  }
  function submit() { setOpen(false); void navigate({ to: '/boutique', search: { search: query.trim() } }); }
  return <div ref={root} className="header-search order-3 col-span-2 min-w-0 md:order-none md:col-span-1" onKeyDown={keyboard} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <form className="header-search-form flex h-11 overflow-hidden bg-card text-foreground" role="search" onSubmit={event => { event.preventDefault(); submit(); }}>
      <input ref={input} aria-label="Rechercher un produit" aria-expanded={visible} aria-controls={visible ? panelId : undefined} aria-haspopup="dialog" autoComplete="off" maxLength={200} name="search" value={query} onFocus={() => setOpen(true)} onChange={event => { setQuery(event.target.value); setOpen(true); }} placeholder="Produit, marque ou référence…" className="w-full min-w-0 bg-transparent px-5 text-xs outline-none"/>
      {query && <Button type="button" variant="ghost" size="icon" className="header-search-clear shrink-0" aria-label="Effacer la recherche du header" title="Effacer la recherche" onClick={() => { setQuery(''); setDebounced(''); setOpen(false); input.current?.focus(); }}><X className="size-4"/></Button>}
      <Button type="submit" className="header-search-submit h-full shrink-0 rounded-none px-5" aria-label="Rechercher"><Search/></Button>
    </form>
    {visible && <div id={panelId} role="dialog" aria-label="Résultats de recherche instantanée" className="header-search-panel">
      <p role="status" className="sr-only">{result.total} résultats pour {query}</p>
      {result.groups.map(group => <section key={group.category} className="header-search-group" aria-label={group.category}>
        <div className="header-search-group-heading"><h2>{group.category}</h2><Link data-search-link to="/boutique" search={{ category: group.category, search: query }} onClick={() => setOpen(false)}>{group.count} résultats <ArrowRight/></Link></div>
        {group.products.map(product => <Link data-search-link key={product.id} to="/produit/$id" params={{ id: product.id }} className="header-search-result" onClick={() => setOpen(false)}>
          <img src={product.image} alt="" width={44} height={44}/><span className="header-search-product-copy"><strong>{product.name}</strong><span>Réf. {product.reference}</span><small>{product.brand}</small></span><span className="header-search-price" title="Prix indicatif TTC">{searchPrice(product.price)}</span>
        </Link>)}
      </section>)}
      {result.total ? <Link data-search-link to="/boutique" search={{ search: query }} className="header-search-footer" onClick={() => setOpen(false)}>Voir tous les résultats pour « {query} » ({result.total}) <ArrowRight/></Link> : <div className="header-search-empty"><p>Aucun produit trouvé pour « {query} »</p><Button variant="link" onClick={() => { setOpen(false); quote.setInitialMessage(`Recherche de matériel : ${query}`); quote.setOpen(true); }}>Demander un devis sur mesure <ArrowRight/></Button></div>}
    </div>}
  </div>;
}