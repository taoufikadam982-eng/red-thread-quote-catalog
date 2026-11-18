import type { Product } from './catalog';
export const showroomPlaceId = 'ChIJmeCKg4Vrpw0RLUhPWhyhU3c';
export const showroomDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('SESA Informatique, Boulevard Al Alaouiyine 30, Rabat')}&destination_place_id=${showroomPlaceId}`;
export const showroomEmbedUrl = 'https://maps.google.com/maps?cid=8598393256726710317&z=16&output=embed';
export const store = { address: 'Boulevard Al Alaouiyine 30, 10020 Hassan, Rabat, Maroc', email: 'sesa@menara.ma', phones: ['05 37 76 57 77', '05 37 76 57 78'], hours: { weekday: '8h30–16h30' }, quoteHours: 24 };
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
export const socialLinks: ReadonlyArray<{ name: 'Instagram' | 'Facebook' | 'X'; href: string | null }> = [
  { name: 'Instagram', href: null },
  { name: 'Facebook', href: null },
  { name: 'X', href: null },
];
export function filterCatalogue(products: Product[], category: string, brand: string, query: string) {
  return products.filter(p => !p.hidden && (!category || p.category === category) && (!brand || p.brand === brand) && `${p.name} ${p.reference} ${p.brand}`.toLowerCase().includes(query.toLowerCase()));
}