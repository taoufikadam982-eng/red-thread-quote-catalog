import { useState } from 'react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { getPublishedPosts } from '@/lib/blog.functions';
import { coverUrl, parseContent, readingMinutes } from '@/lib/blog';

export const blogQueryOptions = queryOptions({ queryKey: ['blog'], queryFn: () => getPublishedPosts(), staleTime: 30_000 });
const dateLabel = (iso: string) => new Date(iso).toLocaleDateString('fr-MA', { day: 'numeric', month: 'long', year: 'numeric' });

export function BlogPage() {
  const { data: articles } = useSuspenseQuery(blogQueryOptions);
  const [selected, setSelected] = useState<string | null>(null);
  const article = articles.find(a => a.id === selected);
  return <main className="site-width editorial-page"><p className="eyebrow">LES CONSEILS SESA</p><h1>Blog · Conseils & Guides IT</h1><p className="editorial-intro">Des repères concrets pour les responsables IT, les équipes et les acheteurs professionnels.</p>
    {articles.length ? <div className="editorial-grid">{articles.map(item => <article key={item.id} className="editorial-card"><img src={coverUrl(item)} alt="" width={600} height={300} loading="lazy"/><div><p className="eyebrow">{item.category}</p><h2>{item.title}</h2><p>{item.excerpt}</p><span><Clock/>{readingMinutes(item.content)} min de lecture · {dateLabel(item.created_at)}</span><Button variant="ghost" onClick={() => setSelected(item.id)}>Lire l’article<ArrowRight/></Button></div></article>)}</div>
      : <p className="py-16 text-center text-muted-foreground">Nouveaux articles bientôt disponibles.</p>}
    <Dialog open={article !== undefined} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="article-reader">{article && <><DialogTitle>{article.title}</DialogTitle><DialogDescription>{article.category} · {readingMinutes(article.content)} min de lecture · {dateLabel(article.created_at)}</DialogDescription><img src={coverUrl(article)} alt="" width={600} height={300}/>{article.excerpt && <p className="font-medium">{article.excerpt}</p>}{parseContent(article.content).map((block, i) => block.type === 'heading' ? <h2 key={i}>{block.text}</h2> : <p key={i}>{block.text}</p>)}</>}</DialogContent></Dialog></main>;
}
