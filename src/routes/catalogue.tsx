import { createFileRoute } from '@tanstack/react-router';
import { CategoryGrid, ProductCatalog } from '@/components/sesa-site';
export const Route = createFileRoute('/catalogue')({
  validateSearch: (search: Record<string, unknown>): { category?: string; q?: string } => ({ category: typeof search.category === 'string' ? search.category : undefined, q: typeof search.q === 'string' ? search.q : undefined }),
  head: () => ({ meta: [{ title: 'Catalogue professionnel — SESA Informatique' }, { name: 'description', content: 'Découvrez le matériel professionnel SESA : portables, tours, workstations, imprimantes et écrans. Prix indicatifs TTC et demandes de devis.' }, { property: 'og:title', content: 'Catalogue professionnel — SESA Informatique' }, { property: 'og:description', content: 'Votre sélection de matériel informatique professionnel à Rabat.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Catalogue,
});
function Catalogue() { const { category, q } = Route.useSearch(); return <><CategoryGrid/><ProductCatalog key={`${category}-${q}`} initialCategory={category} initialSearch={q}/></>; }