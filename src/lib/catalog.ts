import { officialCategories, hasCategory } from './product-categories';
import laptop from '@/assets/laptop.jpg';
import desktop from '@/assets/desktop.jpg';
import workstation from '@/assets/workstation.jpg';
import printer from '@/assets/printer.jpg';
import scanner from '@/assets/scanner.jpg';
import monitor from '@/assets/monitor.jpg';
import accessories from '@/assets/accessories.jpg';

export const categories = officialCategories.map((name, index) => ({ name, image: [laptop, desktop, workstation, printer, scanner, monitor, accessories][index] ?? accessories }));
export const products = [
  { id: 'probook', name: 'HP ProBook 4 G1iR 14', reference: 'C84S1AT', price: 11800, category: 'Ordinateurs portables', image: laptop, brand: 'HP', detail: 'Ordinateur portable professionnel · Format 14 pouces', usage: 'Bureautique, gestion et mobilité professionnelle' },
  { id: 'dell-tower', name: 'Dell Pro Tower QCT1250', reference: 'QCT1250', price: 8290, category: 'Ordinateurs de bureau', image: desktop, brand: 'Dell', detail: 'Ordinateur de bureau professionnel · Format tour', usage: 'Postes de travail, gestion et équipement des équipes' },
  { id: 'zbook', name: 'HP ZBook 8 G1i 14', reference: 'D2TE5AT', price: 24950, category: 'Workstations', image: laptop, brand: 'HP', detail: 'Station de travail mobile · Format 14 pouces', usage: 'Création, développement et applications métiers exigeantes' },
  { id: 'laserjet', name: 'HP LaserJet Enterprise M506dn', reference: 'M506dn', price: 4200, category: 'Imprimantes', image: printer, brand: 'HP', detail: 'Imprimante laser monochrome professionnelle', usage: 'Impression de documents pour les équipes et administrations' },
  { id: 'hp-monitor', name: 'Écran HP Series 7 Pro 724pf', reference: '724pf', price: 2390, category: 'Écrans', image: monitor, brand: 'HP', detail: 'Écran professionnel · Gamme HP Series 7 Pro', usage: 'Poste de travail et confort visuel au quotidien' },
  { id: 'scanjet', name: 'HP ScanJet Pro 3000 s4', reference: '3000 s4', price: 4690, category: 'Scanners', image: scanner, brand: 'HP', detail: 'Scanner de documents professionnel · Gamme HP ScanJet Pro', usage: 'Numérisation de documents pour les équipes et administrations' },
];
export type Product = typeof products[number] & { categories?: string[]; old_price?: number | null; availability?: string; hidden?: boolean; indicative?: boolean; image_path?: string; images?: string[] };
export type QuoteItem = { id: string; quantity: number };
export const priceLabel = (price: number) => new Intl.NumberFormat('fr-MA').format(price);
export function addQuoteItem(items: QuoteItem[], id: string, catalogue: Product[] = products): QuoteItem[] {
  if (!catalogue.some(p => p.id === id && !p.hidden)) return items;
  const existing = items.find(item => item.id === id);
  return existing ? items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { id, quantity: 1 }];
}
export function recommendProducts(answers: string[], catalogue: Product[] = products) {
  const creative = answers.some(a => /Créer|Développer|3D|exigeantes/.test(a));
  const budget = answers.find(a => a.includes('DH'));
  const visible = catalogue.filter(p => !p.hidden);
  const candidates = creative ? visible.filter(p => hasCategory(p, 'Workstations') || p.id === 'probook') : visible.filter(p => hasCategory(p, 'Ordinateurs portables') || hasCategory(p, 'Ordinateurs de bureau'));
  return budget === 'Moins de 10 000 DH' ? candidates.filter(p => p.price < 10000) : candidates;
}