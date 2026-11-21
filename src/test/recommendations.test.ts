import { describe, expect, it } from 'vitest';
import { parseRecommendationIds, pickRecommendations } from '@/lib/recommendations';
import type { Product } from '@/lib/catalog';

const p = (id: string, extra: Partial<Product> = {}) => ({ id, name: id, reference: id, category: 'Écrans', categories: ['Écrans'], specs: '', brand: 'HP', price: 1, hidden: false, ...extra }) as unknown as Product;

describe('AI recommendations', () => {
  it('drops unknown, hidden and current ids and keeps at most 4', () => {
    const all = [p('a'), p('b'), p('c', { hidden: true }), p('d'), p('e'), p('f'), p('g')];
    expect(pickRecommendations(['zzz', 'a', 'c', 'b', 'b', 'd', 'e', 'f'], all[0]!, all).map(i => i.id)).toEqual(['b', 'd', 'e', 'f']);
  });
  it('parses a JSON id array from model text', () => {
    expect(parseRecommendationIds('Voici: ["x","y", 3]')).toEqual(['x', 'y']);
    expect(parseRecommendationIds('none')).toEqual([]);
  });
});
