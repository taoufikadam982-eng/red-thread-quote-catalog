import type { Product } from './catalog';
export const showroomPlaceId = 'ChIJmeCKg4Vrpw0RLUhPWhyhU3c';
export const showroomDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('SESA Informatique, Boulevard Al Alaouiyine 30, Rabat')}&destination_place_id=${showroomPlaceId}`;
export const showroomEmbedUrl = 'https://maps.google.com/maps?cid=8598393256726710317&z=16&output=embed';
export const store = { address: 'Boulevard Al Alaouiyine 30, 10020 Hassan, Rabat, Maroc', email: 'sesa@menara.ma', phones: ['05 37 76 57 77', '05 37 76 57 78'], hours: { weekday: '8h30–16h30', saturday: '9h30–13h' }, quoteHours: 24 };
export const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/sesainformatique' },
  { name: 'Facebook', href: 'https://www.facebook.com/sesainformatique' },
  { name: 'X', href: 'https://x.com/sesainformatique' },
] as const;
export function filterCatalogue(products: Product[], category: string, brand: string, query: string) {
  return products.filter(p => !p.hidden && (!category || p.category === category) && (!brand || p.brand === brand) && `${p.name} ${p.reference} ${p.brand}`.toLowerCase().includes(query.toLowerCase()));
}