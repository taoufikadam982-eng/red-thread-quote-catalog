import { createContext, useContext, type ReactNode } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getPublicProducts } from '@/lib/products.functions';
import { products as initialProducts, categories, type Product } from '@/lib/catalog';

export const catalogueQuery = { queryKey:['catalogue'], queryFn:()=>getPublicProducts(), staleTime:0, refetchInterval:3000 };
const CatalogContext=createContext<Product[]>([]);
export function CatalogProvider({children}:{children:ReactNode}) {
  const {data}=useSuspenseQuery(catalogueQuery);
  const products:Product[]=data.map(p=>({...p,price:Number(p.price),old_price:p.old_price===null?null:Number(p.old_price),detail:p.specs,image:p.image_path?`/api/public/catalogue-image?path=${encodeURIComponent(p.image_path)}`:initialProducts.find(i=>i.id===p.id)?.image ?? categories.find(c=>c.name===p.category)?.image ?? categories[0]?.image ?? ''}));
  return <CatalogContext.Provider value={products}>{children}</CatalogContext.Provider>;
}
export function useProducts(){return useContext(CatalogContext);}