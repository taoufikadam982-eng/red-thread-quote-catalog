import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/sesa-site';
import { z } from 'zod';
export const Route=createFileRoute('/auth')({component:AdminLogin,head:()=>({meta:[{title:'Connexion administrateur — SESA Informatique'},{name:'description',content:'Connexion sécurisée à l’administration SESA Informatique.'},{property:'og:title',content:'Connexion administrateur SESA'},{property:'og:description',content:'Accès privé à l’administration SESA Informatique.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'},{name:'robots',content:'noindex'}]})});
function AdminLogin(){
 const navigate=useNavigate();const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
 async function login(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage('');try{
  z.object({email:z.string().email().max(254),password:z.string().min(1).max(200)}).parse({email,password});
  const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;
  await navigate({to:'/admin'});
 }catch{setMessage('Connexion refusée. Vérifiez votre adresse e-mail et votre mot de passe.');}finally{setBusy(false);}}
 async function forgot(){if(!z.string().email().safeParse(email).success){setMessage('Indiquez votre adresse e-mail.');return;}setBusy(true);const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/reset-password'});setMessage(error?error.message:'Si ce compte existe, un lien de réinitialisation vous a été envoyé.');setBusy(false);}
 return <main className="admin-login min-h-screen bg-ink text-on-ink"><div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-12"><Logo/><div className="mt-12 flex items-center gap-3 text-primary"><LockKeyhole className="size-5"/><span className="text-xs font-bold uppercase">Administration</span></div><h1 className="mt-4 text-3xl font-extrabold">Bienvenue chez SESA.</h1><form onSubmit={login} className="mt-8 space-y-5"><label className="block text-xs">Adresse e-mail<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 h-12 w-full rounded-md border border-on-ink/20 bg-ink-soft px-4 text-sm"/></label><label className="block text-xs">Mot de passe<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 h-12 w-full rounded-md border border-on-ink/20 bg-ink-soft px-4 text-sm"/></label>{message&&<p role="status" className="text-sm text-on-ink-muted">{message}</p>}<Button disabled={busy} className="h-12 w-full">{busy?'Connexion…':'Se connecter'}<ArrowRight/></Button><Button type="button" variant="nav" onClick={forgot} disabled={busy} className="w-full text-xs">Mot de passe oublié ?</Button></form><Link to="/" className="mt-10 text-center text-xs text-on-ink-muted">← Voir la boutique</Link></div></main>;
}
