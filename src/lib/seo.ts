import { notFound } from '@tanstack/react-router';
import { productPlainText } from './product-text';

export const publicSiteOrigin = 'https://red-thread-quote-catalog.lovable.app';
export function pageUrl(path: string) { return new URL(path, publicSiteOrigin).href; }

export const storeStructuredData = {
  '@context': 'https://schema.org', '@type': 'ComputerStore', name: 'SESA Informatique',
  url: pageUrl('/'), telephone: '+212537765777', email: 'sesa@menara.ma',
  image: pageUrl('/icons/sesa-512.png'), priceRange: 'DH',
  address: { '@type': 'PostalAddress', streetAddress: 'Boulevard Al Alaouiyine 30', addressLocality: 'Rabat', addressRegion: 'Hassan', postalCode: '10020', addressCountry: 'MA' },
  areaServed: 'Maroc',
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:30', closes: '16:30' }],
};

export interface SeoProduct { id: string; name: string; reference: string; brand: string; category: string; hidden?: boolean; image_path?: string }

// Only a successful authoritative catalogue read can establish a definitive absence.
export function resolveSeoProduct<T extends SeoProduct>(list: T[] | undefined, id: string): T {
  if (!list) throw new Error('Catalogue momentanément indisponible. Réessayez dans un instant.');
  const product = list.find(item => item.id === id && !item.hidden);
  if (!product) throw notFound();
  return product;
}

export function productSeo(product: SeoProduct) {
  const name = productPlainText(product.name);
  const reference = productPlainText(product.reference);
  const brand = productPlainText(product.brand);
  const title = `${name}${reference && !name.toLowerCase().includes(reference.toLowerCase()) ? ` (${reference})` : ''} — SESA Informatique Rabat`;
  // Do not truncate imported prose or turn indicative prices into firm Offers.
  const description = `${name}${reference && !name.includes(reference) ? ` · Réf. ${reference}` : ''}. Informations et demande de devis auprès de SESA Informatique à Rabat.`;
  const url = pageUrl(`/produit/${encodeURIComponent(product.id)}`);
  return { title, description, url, scripts: [
    { type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name, url, ...(reference ? { sku: reference } : {}), ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}), category: product.category, ...(product.image_path ? { image: pageUrl(`/api/public/catalogue-image?path=${encodeURIComponent(product.image_path)}`) } : {}) }) },
    { type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: pageUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Boutique', item: pageUrl('/boutique') },
      { '@type': 'ListItem', position: 3, name, item: url },
    ] }) },
  ] };
}