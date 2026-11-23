import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/magasin')({ staticData: { sitemap: true }, component: MagasinPage, head: () => pageHead('Notre Magasin à Hassan, Rabat', 'Retrouvez SESA Informatique au Boulevard Al Alaouiyine 30, Hassan, Rabat. Adresse, horaires, itinéraire et conseil pour votre matériel.', '/magasin') });
function MagasinPage() {
  useEffect(() => { document.getElementById('sesa-showroom')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }, []);
  return <section className="site-width py-8"><p className="eyebrow">VOTRE RENDEZ-VOUS IT À RABAT</p><h1 className="section-title mt-3">Showroom SESA Informatique à Hassan, Rabat</h1></section>;
}