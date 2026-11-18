import { z } from 'zod';
import workstation from '@/assets/sesa-workstation-feature.jpg';
import printer from '@/assets/printer.jpg';
import enterprise from '@/assets/sesa-enterprise-scene.jpg';

export const blogCategories = ["Guides d'achat", 'Entreprises & Marchés', 'Nouveautés Matériel'] as const;
const fallbackCovers: Record<string, string> = { "Guides d'achat": workstation, 'Entreprises & Marchés': enterprise, 'Nouveautés Matériel': printer };

export type BlogPost = { id: string; title: string; slug: string; category: string; excerpt: string; content: string; cover_image_url: string; published: boolean; created_at: string };

export function slugify(title: string) {
  return title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'article';
}
export const storagePathPattern = /^blog\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp)$/;
/** A cover is either an https URL or a private-bucket path served through the public image handler. */
export function coverUrl(post: Pick<BlogPost, 'cover_image_url' | 'category'>) {
  const value = post.cover_image_url.trim();
  if (/^https:\/\//.test(value)) return value;
  if (storagePathPattern.test(value)) return `/api/public/catalogue-image?path=${encodeURIComponent(value)}`;
  return fallbackCovers[post.category] ?? workstation;
}
export type ArticleBlock = { type: 'heading' | 'paragraph'; text: string };
export function parseContent(content: string): ArticleBlock[] {
  return content.split(/\n+/).map(l => l.trim()).filter(Boolean).map(l => l.startsWith('## ') ? { type: 'heading', text: l.slice(3).trim() } : { type: 'paragraph', text: l });
}
export function readingMinutes(content: string) { return Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 200)); }

export const blogPostSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3, 'Le titre est requis.').max(200),
  category: z.enum(blogCategories),
  excerpt: z.string().trim().max(400),
  content: z.string().trim().min(1, 'Le contenu est requis.').max(50000),
  cover_image_url: z.string().trim().max(1000).refine(v => v === '' || /^https:\/\//.test(v) || storagePathPattern.test(v), 'Image : utilisez une adresse https ou téléversez un fichier.'),
  published: z.boolean(),
});
export type BlogPostInput = z.infer<typeof blogPostSchema>;
