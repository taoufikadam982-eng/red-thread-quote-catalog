import { createFileRoute } from '@tanstack/react-router';
import { BrandsPage } from '@/components/brands-page';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/marques')({ staticData: { sitemap: true }, component: BrandsPage, head: () => pageHead('Nos Marques', 'Les gammes HP, Dell, Lenovo, ASUS, Epson, Eaton et ADATA chez SESA à Rabat. Découvrez les équipements et demandez un devis.', '/marques') });