import { createFileRoute } from '@tanstack/react-router';
import { CategoryGrid, ProductCatalog } from '@/components/sesa-site';
import { useState } from 'react';
import type { CategorySelection } from '@/lib/catalogue-navigation';
export const Route = createFileRoute('/catalogue')({
  validateSearch: (search: Record<string, unknown>): { category?: string; q?: string } => ({ ...(typeof search['category'] === 'string' ? { category: search['category'] } : {}), ...(typeof search['q'] === 'string' ? { q: search['q'] } : {}) }),
  head: () => ({ meta: [{ title: 'Catalogue professionnel — SESA Informatique' }, { name: 'description', content: 'Découvrez le matériel professionnel SESA : portables, tours, workstations, imprimantes et écrans. Prix indicatifs TTC et demandes de devis.' }, { property: 'og:title', content: 'Catalogue professionnel — SESA Informatique' }, { property: 'og:description', content: 'Votre sélection de matériel informatique professionnel à Rabat.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Catalogue,
});
function Catalogue() { const { category, q } = Route.useSearch(); return <CatalogueContent key={`${category}-${q}`} category={category ?? ''} query={q ?? ''}/>; }
function CatalogueContent({ category, query }: { category: string; query: string }) { const [selection, setSelection] = useState<CategorySelection | null>(null); return <><CategoryGrid onSelect={category => setSelection(previous => ({ category, revision: (previous?.revision ?? 0) + 1 }))}/><ProductCatalog initialCategory={category} initialSearch={query} categorySelection={selection}/></>; }