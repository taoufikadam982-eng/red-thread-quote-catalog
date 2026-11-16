import type { Product } from './catalog';
export const store = { address: 'Boulevard Al Alaouiyine 30, 10020 Hassan, Rabat, Maroc', email: 'sesa@menara.ma', phones: ['05 37 76 57 77', '05 37 76 57 78'], hours: { weekday: '9h–18h30', saturday: '9h30–13h' }, quoteHours: 24 };
export function filterCatalogue(products: Product[], category: string, brand: string, query: string) {
  return products.filter(p => !p.hidden && (!category || p.category === category) && (!brand || p.brand === brand) && `${p.name} ${p.reference} ${p.brand}`.toLowerCase().includes(query.toLowerCase()));
}