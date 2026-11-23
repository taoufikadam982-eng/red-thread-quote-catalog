import { createFileRoute, Link } from '@tanstack/react-router';
import { ProductPage } from '@/components/product-page';
import { catalogueQuery } from '@/components/catalog-context';
import { productSeo, resolveSeoProduct } from '@/lib/seo';

export const Route = createFileRoute('/produit/$id')({ staticData: { sitemap: true },
  component: ProductDetail,
  loader: async ({ context, params }) => {
    let list;
    try {
      list = await context.queryClient.ensureQueryData(catalogueQuery);
    } catch {
      // Cached known products remain usable during an outage; unknown IDs are not 404s.
      const cached = context.queryClient.getQueryData<Awaited<ReturnType<typeof catalogueQuery.queryFn>>>(catalogueQuery.queryKey);
      const product = cached?.find(item => item.id === params.id && !item.hidden);
      return resolveSeoProduct(product ? [product] : undefined, params.id);
    }
    return resolveSeoProduct(list, params.id);
  },
  notFoundComponent: () => <section className="site-width py-14"><h1 className="section-title">Référence introuvable</h1><p className="my-6">Cette référence n’est pas publiée dans le catalogue SESA.</p><Link to="/boutique">Retour à la Boutique</Link></section>,
  errorComponent: () => <section className="site-width py-14"><h1 className="section-title">Fiche momentanément indisponible</h1><p className="my-6" role="alert">Le catalogue ne peut pas être consulté pour le moment. Réessayez dans un instant.</p><Link to="/boutique">Retour à la Boutique</Link></section>,
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: 'Fiche indisponible — SESA Informatique' }, { name: 'description', content: 'Cette fiche ne peut pas être consultée actuellement.' }, { property: 'og:title', content: 'Fiche indisponible — SESA Informatique' }, { property: 'og:description', content: 'Retrouvez les références publiées dans la Boutique SESA.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' }] };
    const { title, description, url, scripts } = productSeo(loaderData);
    return {
      meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'product' }, { property: 'og:url', content: url }, { name: 'twitter:card', content: 'summary_large_image' }],
      links: [{ rel: 'canonical', href: url }],
      scripts,
    };
  },
});
function ProductDetail() { const { id } = Route.useParams(); return <ProductPage key={id} id={id}/>; }
