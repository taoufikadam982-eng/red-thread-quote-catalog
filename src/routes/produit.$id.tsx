import { createFileRoute } from '@tanstack/react-router';
import { ProductPage } from '@/components/product-page';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/produit/$id')({
  component: ProductDetail,
  head: ({ params }) => pageHead(`Fiche matériel ${params.id}`, 'Découvrez la référence SESA, ses caractéristiques et son prix TTC. Préparez votre devis ; achat et paiement au showroom de Rabat.'),
});
function ProductDetail() { const { id } = Route.useParams(); return <ProductPage key={id} id={id}/>; }