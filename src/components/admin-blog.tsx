import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Plus, Trash2, Upload, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { deleteBlogPost, getAdminPosts, saveBlogPost } from '@/lib/blog.functions';
import { coverUrl, blogCategories, blogPostSchema, storagePathPattern, type BlogPost, type BlogPostInput } from '@/lib/blog';

const blank = (): BlogPostInput => ({ title: '', category: blogCategories[0], excerpt: '', content: '', cover_image_url: '', published: false });

function Thumb({ post }: { post: Pick<BlogPost, 'cover_image_url' | 'category'> }) {
  const path = post.cover_image_url;
  const { data } = useQuery({ queryKey: ['blog-thumb', path], enabled: storagePathPattern.test(path), staleTime: 3_000_000,
    queryFn: async () => (await supabase.storage.from('catalogue-images').createSignedUrl(path, 3600)).data?.signedUrl ?? '' });
  const src = storagePathPattern.test(path) ? data : coverUrl(post);
  return src ? <img src={src} alt="" className="size-12 shrink-0 rounded object-cover" /> : <span className="size-12 shrink-0 rounded bg-muted" />;
}

export function BlogAdminView() {
  const qc = useQueryClient();
  const list = useServerFn(getAdminPosts); const save = useServerFn(saveBlogPost); const remove = useServerFn(deleteBlogPost);
  const { data: posts = [], isPending } = useQuery({ queryKey: ['admin-blog'], queryFn: () => list() });
  const [editor, setEditor] = useState<BlogPostInput | null>(null);
  const [uploading, setUploading] = useState(false);
  const refresh = () => Promise.all([qc.invalidateQueries({ queryKey: ['admin-blog'] }), qc.invalidateQueries({ queryKey: ['blog'] })]);
  const saving = useMutation({ mutationFn: (post: BlogPostInput) => save({ data: post }), onSuccess: async () => { await refresh(); setEditor(null); toast.success('Article enregistré.'); }, onError: e => toast.error(e instanceof Error ? e.message : 'Enregistrement impossible.') });
  const deleting = useMutation({ mutationFn: (id: string) => remove({ data: id }), onSuccess: async () => { await refresh(); toast.success('Article supprimé.'); }, onError: e => toast.error(e instanceof Error ? e.message : 'Suppression impossible.') });

  async function upload(file: File | undefined) {
    if (!file || !editor) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { toast.error('Choisissez une image JPG, PNG ou WebP de moins de 5 Mo.'); return; }
    setUploading(true);
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `blog/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('catalogue-images').upload(path, file, { contentType: file.type });
    setUploading(false);
    if (error) { toast.error('Téléversement impossible.'); return; }
    setEditor({ ...editor, cover_image_url: path });
  }
  function submit() {
    if (!editor) return;
    const result = blogPostSchema.safeParse(editor);
    if (!result.success) { toast.error(result.error.issues[0]?.message ?? 'Vérifiez l’article.'); return; }
    saving.mutate(result.data);
  }
  const edit = (p: BlogPost) => setEditor({ id: p.id, title: p.title, category: (blogCategories as readonly string[]).includes(p.category) ? p.category as BlogPostInput['category'] : blogCategories[0], excerpt: p.excerpt, content: p.content, cover_image_url: p.cover_image_url, published: p.published });

  return <>
    <div className="admin-heading"><h1>Gestion du Blog</h1><Button onClick={() => setEditor(blank())} className="admin-action"><Plus />Nouvel article</Button></div>
    <p className="admin-note">Les articles publiés apparaissent aussitôt sur la page Blog. Dans le contenu, commencez une ligne par « ## » pour créer un intertitre.</p>
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ARTICLE</th><th>DATE</th><th>STATUT</th><th></th></tr></thead><tbody>
      {posts.map(p => <tr key={p.id}><td><div className="admin-product"><Thumb post={p} /><div><strong>{p.title}</strong><small>{p.category}</small></div></div></td><td className="whitespace-nowrap text-xs">{new Date(p.created_at).toLocaleDateString('fr-MA')}</td><td><span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${p.published ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{p.published ? 'Publié' : 'Brouillon'}</span></td><td><div className="flex gap-1"><Button variant="link" className="px-0 text-xs text-foreground underline" onClick={() => edit(p)}>Modifier</Button><Button variant="ghost" size="icon" aria-label={`Supprimer ${p.title}`} disabled={deleting.isPending} onClick={() => { if (window.confirm('Supprimer définitivement cet article ?')) deleting.mutate(p.id); }}><Trash2 /></Button></div></td></tr>)}
    </tbody></table>{isPending ? <p role="status" className="py-12 text-center text-sm text-muted-foreground">Chargement…</p> : !posts.length && <p className="py-12 text-center text-sm text-muted-foreground">Aucun article pour le moment.</p>}</div>
    <Dialog open={editor !== null} onOpenChange={o => { if (!o) setEditor(null); }}><DialogContent className="max-h-[92dvh] w-[calc(100vw-1.5rem)] max-w-2xl overflow-y-auto">{editor && <>
      <DialogTitle>{editor.id ? 'Modifier l’article' : 'Nouvel article'}</DialogTitle><DialogDescription>Rédigez l’article puis choisissez Publié ou Brouillon.</DialogDescription>
      <form className="admin-form space-y-4" onSubmit={e => { e.preventDefault(); submit(); }}>
        <label className="block text-sm font-medium">Titre<input className="admin-input mt-1 w-full" required maxLength={200} value={editor.title} onChange={e => setEditor({ ...editor, title: e.target.value })} /></label>
        <label className="block text-sm font-medium">Catégorie<select className="admin-input mt-1 w-full" value={editor.category} onChange={e => setEditor({ ...editor, category: e.target.value as BlogPostInput['category'] })}>{blogCategories.map(c => <option key={c}>{c}</option>)}</select></label>
        <div className="text-sm font-medium">Image de couverture<div className="mt-1 flex flex-wrap items-center gap-2"><Thumb post={editor} /><input className="admin-input min-w-0 flex-1" placeholder="https://… ou téléversez" value={editor.cover_image_url} onChange={e => setEditor({ ...editor, cover_image_url: e.target.value })} /><Button asChild variant="outline" size="sm"><label className="cursor-pointer"><Upload />{uploading ? 'Envoi…' : 'Téléverser'}<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={e => void upload(e.target.files?.[0])} /></label></Button></div></div>
        <label className="block text-sm font-medium">Extrait<textarea className="admin-input mt-1 w-full" rows={2} maxLength={400} value={editor.excerpt} onChange={e => setEditor({ ...editor, excerpt: e.target.value })} /></label>
        <label className="block text-sm font-medium">Contenu de l’article<textarea className="admin-input mt-1 w-full font-mono text-xs" rows={12} required value={editor.content} onChange={e => setEditor({ ...editor, content: e.target.value })} /></label>
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex gap-1" role="group" aria-label="Statut"><Button type="button" size="sm" variant={editor.published ? 'default' : 'outline'} aria-pressed={editor.published} onClick={() => setEditor({ ...editor, published: true })}>Publié</Button><Button type="button" size="sm" variant={!editor.published ? 'dark' : 'outline'} aria-pressed={!editor.published} onClick={() => setEditor({ ...editor, published: false })}>Brouillon</Button></div><Button type="submit" disabled={saving.isPending || uploading}><Save />{saving.isPending ? 'Enregistrement…' : 'Enregistrer'}</Button></div>
      </form></>}</DialogContent></Dialog>
  </>;
}
