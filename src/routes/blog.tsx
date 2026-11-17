import { createFileRoute } from '@tanstack/react-router';
import { BlogPage } from '@/components/blog-page';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/blog')({ component: BlogPage, head: () => pageHead('Blog · Conseils & Guides IT', 'Conseils SESA pour choisir vos postes professionnels, optimiser l’impression et préparer un cahier des charges informatique.') });