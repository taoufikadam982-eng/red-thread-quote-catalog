import { describe, expect, it } from 'vitest';
import { assignedCategories, hasCategory, officialCategories } from '@/lib/product-categories';
import { products } from '@/lib/catalog';
import { productSchema } from '@/lib/product-schema';
import { filterCatalogue } from '@/lib/storefront';
import { selectBoutiqueProducts } from '@/lib/boutique-filters';
import { mapImportRows } from '@/lib/product-import';
const base = products[0];
if (!base) throw new Error('Missing fixture');
describe('multiple product categories', () => {
  it('shares the exact seven official categories', () => {
    expect(officialCategories).toEqual(['Ordinateurs portables','Ordinateurs de bureau','Workstations','Imprimantes','Scanners','Écrans','Accessoires & Réseau']);
  });
  it.each(['Ordinateur portable','Ordinateurs portable','Ordinateurs portables','ORDINATEUR PORTABLE'])('matches laptop spelling %s', category => {
    expect(hasCategory({category}, 'Ordinateurs portables')).toBe(true);
  });
  it('matches accentless singular category labels', () => {
    expect(hasCategory({ category:'ECRAN' }, 'Écrans')).toBe(true);
    expect(hasCategory({ category:'Workstation fixe' }, 'Workstations')).toBe(true);
  });
  it('shows a dual-category product under both categories without duplicates in Tous', () => {
    const product = {...base,categories:['Ordinateurs portables','Workstations']};
    for (const category of ['', 'Ordinateurs portables', 'Workstations']) {
      expect(filterCatalogue([product],category,'','').map(p=>p.id)).toEqual([product.id]);
      expect(selectBoutiqueProducts([product],{category,query:'',min:0,max:999999,selected:{},sort:'name'}).map(p=>p.id)).toEqual([product.id]);
    }
    expect(filterCatalogue([product],'Imprimantes','','')).toEqual([]);
  });
  it('normalizes and deduplicates assignments while keeping the primary category first', () => {
    expect(assignedCategories({category:'Workstations',categories:['Ordinateurs portable','Workstation','Ordinateur portable']})).toEqual(['Ordinateurs portables','Workstations']);
    const parsed=productSchema.parse({...base,categories:['Workstation','Ordinateur portable'],old_price:null,availability:'En stock',hidden:false,indicative:true});
    expect(parsed.category).toBe('Workstations');
    expect(parsed.categories).toEqual(['Workstations','Ordinateurs portables']);
  });
  it('requires at least one selected category', () => {
    expect(productSchema.safeParse({...base,categories:[],old_price:null,availability:'En stock',hidden:false,indicative:true}).success).toBe(false);
  });
  it('imports a legacy single category and multiple category cells', () => {
    expect(mapImportRows([{Titre:'Laptop',Référence:'SINGLE',Catégorie:'Ordinateurs portable',Prix:100}])[0]?.categories).toEqual(['Ordinateurs portables']);
    expect(mapImportRows([{Titre:'Laptop',Référence:'MULTI',Catégories:'Ordinateur portable;Workstation',Prix:100}])[0]?.categories).toEqual(['Ordinateurs portables','Workstations']);
  });
});