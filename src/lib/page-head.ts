import { pageUrl } from './seo';
export function pageHead(title: string, description: string, path: string) {
  return { links: [{ rel: 'canonical', href: pageUrl(path) }], meta: [{ title: `${title} — SESA Informatique` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} — SESA Informatique` }, { property: 'og:description', content: description }, { property: 'og:url', content: pageUrl(path) }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] };
}