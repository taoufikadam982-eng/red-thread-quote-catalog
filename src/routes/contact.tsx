import { pageUrl } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';
import { QuoteForm } from '@/components/quote-form';
export const Route = createFileRoute('/contact')({ staticData: { sitemap: true }, component: ContactPage, head: () => ({ links: [{ rel: 'canonical', href: pageUrl('/contact') }], meta: [{ property: 'og:url', content: pageUrl('/contact') }, { title: 'Contacter SESA Informatique — Conseil & Devis' }, { name: 'description', content: 'Contactez SESA à Rabat pour un devis, une disponibilité ou votre projet informatique.' }, { property: 'og:title', content: 'Contact et devis SESA Informatique' }, { property: 'og:description', content: 'Téléphones, e-mail, horaires du magasin et demande de devis à Rabat.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }) });

function ContactPage() {
  return <section className="site-width b2b-intake"><div><p className="eyebrow">CONTACT SESA</p><h1 className="section-title">Parlons de votre projet informatique</h1><p>Demandez un devis, une disponibilité ou un conseil pour votre matériel.</p></div><QuoteForm/></section>;
}