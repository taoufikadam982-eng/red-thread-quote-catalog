import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from '@/components/sesa-site';

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({ meta: [{ title: 'SESA Informatique — Matériel IT professionnel à Rabat' }, { name: 'description', content: 'PC portables, workstations, imprimantes et solutions IT pour les entreprises et administrations au Maroc. Demandez votre devis SESA.' }, { property: 'og:title', content: 'SESA Informatique — Votre partenaire IT au Maroc' }, { property: 'og:description', content: 'Matériel informatique professionnel, marchés et bons de commande. Showroom à Hassan, Rabat.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }], links: [{ rel: 'canonical', href: '/' }] }),
});
