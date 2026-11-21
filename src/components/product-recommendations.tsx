import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/lib/catalog';
import { pickRecommendations } from '@/lib/recommendations';
import { getAiRecommendations } from '@/lib/recommendations.functions';
import { ProductCard } from './product-card';

export function ProductRecommendations({ product, products }: { product: Product; products: Product[] }) {
  const query = useQuery({ queryKey: ['ai-recommendations', product.id], queryFn: () => getAiRecommendations({ data: { id: product.id } }), staleTime: 30 * 60 * 1000, retry: false });
  const items = pickRecommendations(query.data?.ids ?? [], product, products);
  if (!items.length) return null;
  return <section className="site-width product-related" aria-busy={query.isPending}><p className="eyebrow">SÉLECTION PERSONNALISÉE</p><h2 className="section-title">Vous aimerez aussi</h2><div>{items.map(item => <ProductCard key={item.id} product={item}/>)}</div></section>;
}
