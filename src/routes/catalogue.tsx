import { pageUrl } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';
import { CategoryGrid, ProductCatalog } from '@/components/sesa-site';
import { useState } from 'react';
import type { CategorySelection } from '@/lib/catalogue-navigation';
export const Route = createFileRoute('/catalogue')({ staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>): { category?: string; q?: string } => ({ ...(typeof search['category'] === 'string' ? { category: search['category'] } : {}), ...(typeof search['q'] === 'string' ? { q: search['q'] } : {}) }),
  head: () => ({ links: [{ rel: 'canonical', href: pageUrl('/catalogue') }], meta: [{ property: 'og:url', content: pageUrl('/catalogue') }, { title: 'Catalogue professionnel — SESA Informatique' }, { name: 'description', content: 'Découvrez le matériel professionnel SESA : portables, tours, workstations, imprimantes et écrans. Prix indicatifs TTC et demandes de devis.' }, { property: 'og:title', content: 'Catalogue professionnel — SESA Informatique' }, { property: 'og:description', content: 'Votre sélection de matériel informatique professionnel à Rabat.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Catalogue,
});
function Catalogue() { const { category, q } = Route.useSearch(); return <CatalogueContent key={`${category}-${q}`} category={category ?? ''} query={q ?? ''}/>; }
function CatalogueContent({ category, query }: { category: string; query: string }) { const [selection, setSelection] = useState<CategorySelection | null>(null); return <><section className="site-width py-8"><h1 className="section-title">Catalogue informatique professionnel SESA</h1></section><CategoryGrid onSelect={category => setSelection(previous => ({ category, revision: (previous?.revision ?? 0) + 1 }))}/><ProductCatalog initialCategory={category} initialSearch={query} categorySelection={selection}/></>; }