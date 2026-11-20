import { createFileRoute } from '@tanstack/react-router';
import { ProductPage } from '@/components/product-page';
import { catalogueQuery } from '@/components/catalog-context';
import { productPlainText } from '@/lib/product-text';

const site = 'https://sesa.ma';

export const Route = createFileRoute('/produit/$id')({
  component: ProductDetail,
  loader: async ({ context, params }) => {
    try {
      const list = await context.queryClient.ensureQueryData(catalogueQuery);
      const p = list.find(item => item.id === params.id);
      return p ? { name: p.name, brand: p.brand, specs: productPlainText(p.specs ?? '').slice(0, 150) } : null;
    } catch { return null; }
  },
  head: ({ params, loaderData }) => {
    const title = loaderData ? `${loaderData.name} | SESA Informatique Rabat` : 'Fiche produit | SESA Informatique Rabat';
    const description = loaderData
      ? `${loaderData.name}${loaderData.brand ? ` (${loaderData.brand})` : ''} — ${loaderData.specs || 'matériel informatique professionnel neuf'}. Devis B2B et retrait au showroom SESA de Rabat.`
      : 'Matériel informatique professionnel neuf, prix TTC et devis B2B au showroom SESA de Hassan, Rabat.';
    const url = `${site}/produit/${params.id}`;
    return {
      meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'product' }, { property: 'og:url', content: url }, { name: 'twitter:card', content: 'summary_large_image' }],
      links: [{ rel: 'canonical', href: url }],
    };
  },
});
function ProductDetail() { const { id } = Route.useParams(); return <ProductPage key={id} id={id}/>; }
