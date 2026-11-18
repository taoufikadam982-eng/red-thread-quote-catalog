import { describe, expect, it } from 'vitest';
import { products, categories } from '@/lib/catalog';
import { filterCatalogue } from '@/lib/storefront';
import { categoryQuoteMessage } from '@/lib/catalogue-navigation';

describe('category catalogue selection', () => {
  it.each(categories.map(category => category.name))('shows only products matching %s', category => {
    expect(filterCatalogue(products, category, '', '').map(product => product.id)).toEqual(products.filter(product => product.category === category).map(product => product.id));
  });
  it('restores all visible products for Tous', () => {
    expect(filterCatalogue(products, '', '', '').length).toBe(products.length);
  });
  it.each(['Réseau & Serveurs', 'Onduleurs Eaton', 'Périphériques', 'Logiciels'])('prefills a quote for %s', category => {
    expect(categoryQuoteMessage(category)).toBe(`Bonjour SESA, je souhaite un devis pour la catégorie : ${category}.`);
  });
});