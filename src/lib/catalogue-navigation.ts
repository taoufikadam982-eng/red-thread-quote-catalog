export type CategorySelection = { category: string; revision: number };
export function categoryQuoteMessage(category: string) {
  return `Bonjour SESA, je souhaite un devis pour la catégorie : ${category}.`;
}
export function scrollToCatalogue(element: HTMLElement) {
  const headerHeight = document.querySelector('.store-header')?.getBoundingClientRect().height ?? 0;
  element.style.setProperty('--catalogue-header-offset', `${Math.ceil(headerHeight + 12)}px`);
  element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
}