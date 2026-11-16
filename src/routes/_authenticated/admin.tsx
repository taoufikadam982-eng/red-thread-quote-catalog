import {createFileRoute} from '@tanstack/react-router';
import {supabase} from '@/integrations/supabase/client';
import {AdminDashboard,adminSections} from '@/components/admin-dashboard';
export const Route=createFileRoute('/_authenticated/admin')({
 validateSearch:(search:Record<string,unknown>):{p?:string}=>({p:typeof search['p']==='string'&&adminSections.includes(search['p'])?search['p']:'products'}),
 beforeLoad:async()=>{const {data,error}=await supabase.rpc('has_role',{_user_id:(await supabase.auth.getUser()).data.user?.id??'',_role:'admin'});if(error||!data)throw new Error('Accès réservé aux administrateurs.');},
 component:AdminPage,
 head:()=>({meta:[{title:'Administration — SESA Informatique'},{name:'description',content:'Gestion des produits, prix, devis et contacts SESA Informatique.'},{property:'og:title',content:'Administration SESA Informatique'},{property:'og:description',content:'Espace privé de gestion SESA.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'},{name:'robots',content:'noindex'}]}),
});
function AdminPage(){const {p}=Route.useSearch();return <AdminDashboard section={p??'products'}/>;}