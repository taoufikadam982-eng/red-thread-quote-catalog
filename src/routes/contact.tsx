import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/contact')({ component: ContactPage, head: () => ({ meta: [{ title: 'Contacter SESA Informatique — Conseil & Devis' }, { name: 'description', content: 'Contactez SESA à Rabat pour un devis, une disponibilité ou votre projet informatique.' }, { property: 'og:title', content: 'Contact et devis SESA Informatique' }, { property: 'og:description', content: 'Téléphones, e-mail, horaires du magasin et demande de devis à Rabat.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }) });

function ContactPage() {
  return <section className="bg-ink text-on-ink"><div className="site-width py-8"><h1 className="section-title">Contact & magasin SESA</h1></div></section>;
}