import { describe, expect, it } from 'vitest';
import { products } from '@/lib/catalog';
import { clearanceProducts, clearanceLabel } from '@/lib/product-offers';
import { blankProduct, productSchema } from '@/lib/product-schema';
import { mapImportRows } from '@/lib/product-import';

describe('clearance rules', () => {
  it('leaves omitted legacy offer fields unspecified so saved offers survive imports', () => {
    const row = mapImportRows([{ Titre: 'Test', Référence: 'TEST', Prix: 11900 }])[0];
    expect(row?.is_clearance).toBeUndefined();
    expect(row?.clearance_badge).toBeUndefined();
  });
  it('imports an explicit offer switch and urgency badge', () => {
    const row = mapImportRows([{ Titre: 'Test', Référence: 'TEST', Prix: 11900, Déstockage: 'oui', 'Badge urgence': 'Quantité limitée' }])[0];
    expect(row?.is_clearance).toBe(true);
    expect(row?.clearance_badge).toBe('Quantité limitée');
  });
  it('includes only flagged visible products', () => {
    const base = products[0];
    if (!base) throw new Error('Fixture required');
    expect(clearanceProducts([{ ...base, id: 'offer', is_clearance: true }, { ...base, id: 'hidden', is_clearance: true, hidden: true }, { ...base, id: 'regular', is_clearance: false }]).map(p => p.id)).toEqual(['offer']);
  });
  it('uses the supplied urgency badge before calculated savings', () => {
    expect(clearanceLabel({ is_clearance: true, clearance_badge: 'Dernière pièce', price: 11900, old_price: 14500 })).toBe('Dernière pièce');
  });
  it('calculates savings only from an actual higher original price', () => {
    expect(clearanceLabel({ is_clearance: true, price: 11900, old_price: 14500 })).toBe('−17%');
    expect(clearanceLabel({ is_clearance: true, price: 0, old_price: 14500 })).toBe('Offre spéciale');
    expect(clearanceLabel({ is_clearance: false, price: 11900, old_price: 14500 })).toBe('');
  });
  it('defaults new products to no offer with an optional original price and badge', () => {
    const value = productSchema.parse({ ...blankProduct(), name: 'Test', reference: 'TEST', price: 11900 });
    expect(value.is_clearance).toBe(false);
    expect(value.clearance_badge).toBeNull();
    expect(value.old_price).toBeNull();
  });
  it('accepts offer settings and rejects an original price below the current price', () => {
    const value = { ...blankProduct(), name: 'Test', reference: 'TEST', price: 11900, is_clearance: true, clearance_badge: 'Fin de série', old_price: 14500 };
    expect(productSchema.parse(value).is_clearance).toBe(true);
    expect(productSchema.safeParse({ ...value, old_price: 11000 }).success).toBe(false);
  });
});