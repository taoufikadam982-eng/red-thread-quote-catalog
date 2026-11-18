import { describe, expect, it } from 'vitest';
import { blogPostSchema, coverUrl, parseContent, slugify } from '@/lib/blog';
describe('blog rules', () => {
  it('slugifies French titles', () => expect(slugify('Cahier des charges : éléments à préciser')).toBe('cahier-des-charges-elements-a-preciser'));
  it('serves uploaded covers through the public image handler', () => expect(coverUrl({ cover_image_url: 'blog/abc.jpg', category: "Guides d'achat" })).toBe('/api/public/catalogue-image?path=blog%2Fabc.jpg'));
  it('rejects non-https cover URLs', () => expect(blogPostSchema.safeParse({ title: 'Titre ok', category: "Guides d'achat", excerpt: '', content: 'x', cover_image_url: 'http://x.com/a.jpg', published: true }).success).toBe(false));
  it('turns ## lines into headings', () => expect(parseContent('## A\nTexte')[0]).toEqual({ type: 'heading', text: 'A' }));
});
