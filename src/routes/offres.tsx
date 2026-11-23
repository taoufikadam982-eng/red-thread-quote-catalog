import { pageUrl } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';
import { BoutiquePage } from '@/components/boutique-page';

export const Route = createFileRoute('/offres')({ staticData: { sitemap: true },
  component: OffersPage,
  head: () => ({ links: [{ rel: 'canonical', href: pageUrl('/offres') }], meta: [{ property: 'og:url', content: pageUrl('/offres') },
    { title: 'Offres & Déstockage Pro — SESA Informatique Rabat' },
    { name: 'description', content: 'Les offres spéciales et fins de série du showroom SESA à Rabat : matériel professionnel neuf sous garantie constructeur, sur devis.' },
    { property: 'og:title', content: 'Offres & Déstockage Pro — SESA Informatique' },
    { property: 'og:description', content: 'Découvrez les offres actives du showroom SESA à Rabat et préparez votre devis professionnel.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
});
function OffersPage() { return <BoutiquePage offersOnly/>; }
