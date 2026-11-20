import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from '@/components/sesa-site';

const title = 'SESA Informatique Rabat — Matériel informatique professionnel au Maroc';
const description = 'PC portables, ordinateurs de bureau, workstations, imprimantes et écrans pour entreprises et administrations. Devis B2B, bons de commande et marchés publics — showroom à Hassan, Rabat.';
const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'ComputerStore',
  name: 'SESA Informatique',
  url: 'https://sesa.ma',
  telephone: '+212537765777',
  email: 'sesa@menara.ma',
  image: 'https://sesa.ma/icons/sesa-512.png',
  priceRange: 'DH',
  address: { '@type': 'PostalAddress', streetAddress: 'Boulevard Al Alaouiyine 30', addressLocality: 'Rabat', addressRegion: 'Hassan', postalCode: '10020', addressCountry: 'MA' },
  areaServed: 'Maroc',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.6', reviewCount: '15' },
};

// The home route ships no og:image, so serve-time hosting can inject the project's social preview.
export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [{ title }, { name: 'description', content: description }, { name: 'keywords', content: 'matériel informatique Rabat, PC portable Maroc, workstation, imprimante, devis B2B, marchés publics, SESA Informatique' }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { property: 'og:url', content: 'https://sesa.ma/' }, { property: 'og:locale', content: 'fr_MA' }, { name: 'twitter:card', content: 'summary_large_image' }, { name: 'twitter:title', content: title }, { name: 'twitter:description', content: description }],
    links: [{ rel: 'canonical', href: 'https://sesa.ma/' }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(localBusiness) }],
  }),
});
