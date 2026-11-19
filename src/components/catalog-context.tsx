import { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { getPublicProducts } from '@/lib/products.functions';
import { products as initialProducts, categories, type Product } from '@/lib/catalog';
import { productPlainText } from '@/lib/product-text';
import { galleryPaths, publicProductImage } from '@/lib/product-images';

export const catalogueQuery = { queryKey:['catalogue'], queryFn:()=>getPublicProducts(), staleTime:0, refetchInterval:3000 };
const CatalogContext=createContext<Product[]>([]);
export function CatalogProvider({children,initialData}:{children:ReactNode;initialData?:Awaited<ReturnType<typeof getPublicProducts>>}) {
  const {data,error,refetch,isFetching}=useQuery({...catalogueQuery,...(initialData ? {initialData} : {}),throwOnError:false});
  const products:Product[]=(data??[]).map(p=>({...p,name:productPlainText(p.name),brand:productPlainText(p.brand),reference:productPlainText(p.reference),usage:productPlainText(p.usage),specs:productPlainText(p.specs),images:galleryPaths(p.images,p.image_path).map(publicProductImage),price:Number(p.price),old_price:p.old_price===null?null:Number(p.old_price),detail:productPlainText(p.specs),image:p.image_path?publicProductImage(p.image_path):initialProducts.find(i=>i.id===p.id)?.image ?? categories.find(c=>c.name===p.category)?.image ?? categories[0]?.image ?? ''}));
  return <CatalogContext.Provider value={products}>{error&&<div role="alert" className="flex flex-wrap items-center justify-center gap-3 border-b bg-card p-3 text-sm text-foreground"><span>Connexion au catalogue interrompue. Les derniers prix disponibles sont conservés.</span><Button variant="outline" size="sm" disabled={isFetching} onClick={()=>void refetch()}>Réessayer</Button></div>}{children}</CatalogContext.Provider>;
}
export function useProducts(){return useContext(CatalogContext);}