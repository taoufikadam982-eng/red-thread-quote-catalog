import { describe, expect, it } from 'vitest';
import { products } from '@/lib/catalog';
import { clearanceProducts, clearanceLabel, isClearance, markImportedOffers, clearanceCategory } from '@/lib/product-offers';
import { officialCategories, hasCategory } from '@/lib/product-categories';
import { filterCatalogue } from '@/lib/storefront';
import { selectBoutiqueProducts } from '@/lib/boutique-filters';
import { blankProduct, productSchema } from '@/lib/product-schema';
import { mapImportRows } from '@/lib/product-import';

describe('clearance rules', () => {
  it('uses automatic offer detection for category searches in every catalogue filter', () => {
    const base=products[0];
    if (!base) throw new Error('Fixture required');
    const offer={...base,is_clearance:false,old_price:20000};
    expect(hasCategory(offer,'OFFRES & DÉSTOCKAGE')).toBe(true);
    expect(filterCatalogue([offer],clearanceCategory,'','')).toEqual([offer]);
    expect(selectBoutiqueProducts([offer],{category:clearanceCategory,query:'',min:0,max:999999,selected:{},sort:'name'})).toEqual([offer]);
  });
  it('recognizes a higher old price even when the manual flag is off', () => {
    expect(isClearance({price:11900,old_price:14500,is_clearance:false})).toBe(true);
    expect(isClearance({price:11900,old_price:11900,is_clearance:false})).toBe(false);
    expect(isClearance({price:11900,old_price:11000,is_clearance:false})).toBe(false);
  });
  it('recognizes the offer category without a flag or old price', () => {
    expect(isClearance({price:100,categories:[clearanceCategory],is_clearance:false})).toBe(true);
  });
  it('hides hidden automatically detected offers from public selections', () => {
    const base = products[0];
    if (!base) throw new Error('Fixture required');
    expect(clearanceProducts([{...base,old_price:20000,hidden:true}])).toEqual([]);
  });
  it('marks every imported product only when the bulk choice is enabled', () => {
    const rows=[{price:100,is_clearance:false},{price:100,old_price:200,is_clearance:false}];
    expect(markImportedOffers(rows,true).map(p=>p.is_clearance)).toEqual([true,true]);
    expect(markImportedOffers(rows,false).map(p=>p.is_clearance)).toEqual([false,true]);
  });
  it.each(['Prix barré','Ancien prix','Ancien prix DH'])('detects imported %s', key => {
    expect(mapImportRows([{Titre:'Test',Référence:'AUTO',Prix:11900,[key]:14500}])[0]?.is_clearance).toBe(true);
  });
  it('detects imported urgency tags and offer categories', () => {
    expect(mapImportRows([{Titre:'Test',Référence:'TAG',Prix:100,'Badge urgence':'Fin de série'}])[0]?.is_clearance).toBe(true);
    expect(mapImportRows([{Titre:'Test',Référence:'CAT',Prix:100,Catégories:clearanceCategory}])[0]?.is_clearance).toBe(true);
  });
  it('accepts the offer tag alongside all ten equipment categories', () => {
    expect(productSchema.parse({...blankProduct(),name:'Test',reference:'ALL',categories:[...officialCategories,clearanceCategory]}).categories).toHaveLength(11);
  });
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
    expect(clearanceLabel({ is_clearance: false, price: 11900, old_price: 14500 })).toBe('−17%');
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