import laptop from '@/assets/laptop.jpg';
import desktop from '@/assets/desktop.jpg';
import workstation from '@/assets/workstation.jpg';
import printer from '@/assets/printer.jpg';
import scanner from '@/assets/scanner.jpg';
import monitor from '@/assets/monitor.jpg';
import server from '@/assets/server.jpg';
import ups from '@/assets/ups.jpg';
import accessories from '@/assets/accessories.jpg';
import software from '@/assets/software.jpg';

export const categories = [
  { name: 'Ordinateurs portables', image: laptop },
  { name: 'Ordinateurs bureautiques', image: desktop },
  { name: 'Workstations', image: workstation },
  { name: 'Imprimantes', image: printer },
  { name: 'Scanners', image: scanner },
  { name: 'Écrans', image: monitor },
  { name: 'Réseau & Serveurs', image: server },
  { name: 'Onduleurs Eaton', image: ups },
  { name: 'Périphériques', image: accessories },
  { name: 'Logiciels', image: software },
];
export const products = [
  { id: 'probook', name: 'HP ProBook 4 G1iR 14', reference: 'C84S1AT', price: 11800, category: 'Ordinateurs portables', image: laptop, brand: 'HP', detail: 'Ordinateur portable professionnel · Format 14 pouces', usage: 'Bureautique, gestion et mobilité professionnelle' },
  { id: 'dell-tower', name: 'Dell Pro Tower QCT1250', reference: 'QCT1250', price: 8290, category: 'Ordinateurs bureautiques', image: desktop, brand: 'Dell', detail: 'Ordinateur de bureau professionnel · Format tour', usage: 'Postes de travail, gestion et équipement des équipes' },
  { id: 'zbook', name: 'HP ZBook 8 G1i 14', reference: 'ZBook 8 G1i 14', price: 24950, category: 'Workstations', image: laptop, brand: 'HP', detail: 'Station de travail mobile · Format 14 pouces', usage: 'Création, développement et applications métiers exigeantes' },
  { id: 'laserjet', name: 'HP LaserJet Enterprise M506dn', reference: 'M506dn', price: 4200, category: 'Imprimantes', image: printer, brand: 'HP', detail: 'Imprimante laser monochrome professionnelle', usage: 'Impression de documents pour les équipes et administrations' },
  { id: 'hp-monitor', name: 'Écran HP Series 7 Pro 724pf', reference: '724pf', price: 2390, category: 'Écrans', image: monitor, brand: 'HP', detail: 'Écran professionnel · Gamme HP Series 7 Pro', usage: 'Poste de travail et confort visuel au quotidien' },
];
export type Product = typeof products[number];
export type QuoteItem = { id: string; quantity: number };
export const priceLabel = (price: number) => new Intl.NumberFormat('fr-MA').format(price);
export function addQuoteItem(items: QuoteItem[], id: string): QuoteItem[] {
  if (!products.some(p => p.id === id)) return items;
  const existing = items.find(item => item.id === id);
  return existing ? items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { id, quantity: 1 }];
}
export function recommendProducts(answers: string[]) {
  const creative = answers.some(a => /Créer|Développer|3D|exigeantes/.test(a));
  const budget = answers.find(a => a.includes('DH'));
  const candidates = creative ? products.filter(p => p.id === 'zbook' || p.id === 'probook') : products.filter(p => p.id === 'probook' || p.id === 'dell-tower');
  return budget === 'Moins de 10 000 DH' ? candidates.filter(p => p.price < 10000).concat(candidates.every(p => p.price >= 10000) ? products.filter(p => p.id === 'dell-tower') : []) : candidates;
}