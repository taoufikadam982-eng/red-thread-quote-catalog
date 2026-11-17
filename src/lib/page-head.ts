export function pageHead(title: string, description: string) {
  return { meta: [{ title: `${title} — SESA Informatique` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} — SESA Informatique` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] };
}