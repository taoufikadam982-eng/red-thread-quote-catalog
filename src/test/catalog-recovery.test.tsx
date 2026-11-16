import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, expect, it, vi } from 'vitest';
import { CatalogProvider, useProducts } from '@/components/catalog-context';
import { QuoteProvider, useQuote } from '@/components/quote-context';

vi.mock('@/lib/products.functions',()=>({getPublicProducts:vi.fn(async()=>{throw new TypeError('Failed to fetch');})}));
afterEach(cleanup);
function Consumer(){const products=useProducts();const quote=useQuote();return <div><span>{products[0]?.price??'empty'}</span><span>{quote.items.length}</span><a href="/auth">Connexion</a></div>;}
it('keeps cached catalogue and quote provider mounted when refresh fails',async()=>{
 const client=new QueryClient({defaultOptions:{queries:{retry:false}}});
 client.setQueryData(['catalogue'],[{id:'probook',name:'ProBook',reference:'C84S1AT',category:'Ordinateurs portables',price:11800,old_price:null,specs:'',brand:'HP',usage:'',image_path:'',hidden:false,indicative:true,availability:'En stock'}]);
 render(<QueryClientProvider client={client}><CatalogProvider><QuoteProvider><Consumer/></QuoteProvider></CatalogProvider></QueryClientProvider>);
 await waitFor(()=>expect(screen.getByRole('alert')).toBeVisible());
 expect(screen.getByText('11800')).toBeVisible();expect(screen.getByRole('link',{name:'Connexion'})).toBeVisible();
 client.clear();
});