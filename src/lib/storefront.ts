import type { Product } from './catalog';
import { hasCategory } from './product-categories';
export const showroomPlaceId = 'ChIJmeCKg4Vrpw0RLUhPWhyhU3c';
export const showroomDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('SESA Informatique, Boulevard Al Alaouiyine 30, Rabat')}&destination_place_id=${showroomPlaceId}`;
export const showroomEmbedUrl = 'https://maps.google.com/maps?cid=8598393256726710317&z=16&output=embed';
export const store = { address: 'Boulevard Al Alaouiyine 30, 10020 Hassan, Rabat, Maroc', email: 'sesa@menara.ma', phones: ['05 37 76 57 77', '05 37 76 57 78'] as const, hours: { weekday: '8h30–16h30' }, quoteHours: 24 };
// Digits-only dial target: the visible label may keep spaces, slashes or a second line.
export const phoneHref = (display: string) => {
  const digits = display.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return `tel:+${digits.slice(2)}`;
  if (digits.startsWith('0')) return `tel:+212${digits.slice(1)}`;
  return `tel:+${digits}`;
};
export const primaryPhoneHref = phoneHref(store.phones[0]);
export const googleReviews = {
  url: 'https://www.google.com/maps/place/Sesa+Informatique/@34.0191587,-6.8298335,17z/data=!4m8!3m7!1s0xda76b85838ae099:0x7753a11c5a4f482d!8m2!3d34.0191543!4d-6.8272586!9m1!1b1!16s%2Fg%2F11b6j0h0bt?entry=ttu',
  rating: 4.6,
  ratingLabel: '4,6',
  reviewCount: 15,
  featured: {
    author: 'Docteur Bouazzaoui',
    role: 'Local Guide · Avis Google',
    stars: 5,
    quote: 'Extrêmement professionnel. Disponibilité immédiate. Prêts à vous rendre service. Adresse que je recommande vivement pour leur réactivité.',
  },
} as const;
// The owner confirmed these five testimonials are real Google reviews; no independent API check was performed.
export const customerReviews = [
  { ...googleReviews.featured, source: 'google' },
  { author: 'Mehdi Bennani', role: 'Responsable Achats, Rabat', stars: 5, source: 'google', quote: 'Devis reçu le jour même pour 12 postes HP et deux imprimantes réseau. Matériel neuf sous garantie constructeur et livraison ponctuelle à Hassan.' },
  { author: 'Youssef El Amrani', role: 'Client Magasin', stars: 5, source: 'google', quote: 'Saraha nass mzyanin o ma3qoulin f l-bi3 o chra. Mchit 3endhom l-mahal f Hassan neshoni b PC portable 3la hsab khedmti bla ma y-zido 3liya.' },
  { author: 'Salma Tazi', role: 'Architecte', stars: 4, source: 'google', quote: 'Bon accueil et conseils techniques pertinents pour choisir ma station de travail. Les prix sont corrects pour du matériel officiel garanti.' },
  { author: 'Karim Chraibi', role: 'Gérant PME', stars: 4, source: 'google', quote: 'Khedma nqiya o réception rapide dyal l-matériel. Khdit men 3endhom PC de bureau o écran l-l-bureau, kolchi khdam mzyan.' },
] as const;
export const socialLinks: ReadonlyArray<{ name: 'Instagram' | 'Facebook' | 'X'; href: string | null }> = [
  { name: 'Instagram', href: null },
  { name: 'Facebook', href: null },
  { name: 'X', href: null },
];
export function filterCatalogue(products: Product[], category: string, brand: string, query: string) {
  return products.filter(p => !p.hidden && hasCategory(p, category) && (!brand || p.brand === brand) && `${p.name} ${p.reference} ${p.brand}`.toLowerCase().includes(query.toLowerCase()));
}