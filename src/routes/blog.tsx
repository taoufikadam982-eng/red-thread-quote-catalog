import { createFileRoute } from '@tanstack/react-router';
import { BlogPage, blogQueryOptions } from '@/components/blog-page';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/blog')({ staticData: { sitemap: true },
  loader: ({ context }) => context.queryClient.ensureQueryData(blogQueryOptions),
  component: BlogPage,
  errorComponent: () => <main className="site-width editorial-page"><h1>Blog</h1><p role="alert">Les articles sont momentanément indisponibles. Réessayez dans un instant.</p></main>,
  notFoundComponent: () => <main className="site-width editorial-page"><p>Article introuvable.</p></main>,
  head: () => pageHead('Blog · Conseils & Guides IT', 'Conseils SESA pour choisir vos postes professionnels, optimiser l’impression et préparer un cahier des charges informatique.', '/blog'),
});
