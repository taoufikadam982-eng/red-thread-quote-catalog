import { describe, expect, it } from 'vitest';
import { assignedCategories, hasCategory, officialCategories } from '@/lib/product-categories';
import { products } from '@/lib/catalog';
import { productSchema } from '@/lib/product-schema';
import { filterCatalogue } from '@/lib/storefront';
import { selectBoutiqueProducts } from '@/lib/boutique-filters';
import { mapImportRows, mapImportText } from '@/lib/product-import';
const base = products[0];
if (!base) throw new Error('Missing fixture');
describe('multiple product categories', () => {
  it('shares the exact ten official categories in the requested order', () => {
    expect(officialCategories).toEqual(['Ordinateurs portables','Ordinateurs de bureau','Workstations','Imprimantes','Scanners','Écrans','Réseau & Serveurs','Onduleurs Eaton','Périphériques','Logiciels']);
  });
  it.each(['Réseau & Serveurs','Onduleurs Eaton','Périphériques','Logiciels'])('keeps %s separate in all catalogue filters', category => {
    const product = { ...base, category, categories: [category] };
    for (const candidate of officialCategories.slice(6)) {
      expect(filterCatalogue([product],candidate,'','').length).toBe(candidate === category ? 1 : 0);
      expect(selectBoutiqueProducts([product],{category:candidate,query:'',min:0,max:999999,selected:{},sort:'name'}).length).toBe(candidate === category ? 1 : 0);
    }
  });
  it('accepts all ten category assignments without truncating any', () => {
    expect(productSchema.parse({...base,categories:[...officialCategories],old_price:null,availability:'En stock',hidden:false,indicative:true}).categories).toEqual(officialCategories);
    expect(mapImportRows([{Titre:'Test',Référence:'TEN',Catégories:officialCategories.join(';'),Prix:100}])[0]?.categories).toEqual(officialCategories);
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
  it('derives the legacy primary field from an array-only assignment',()=>{
    const parsed=productSchema.parse({...base,category:undefined,categories:['Workstations','Ordinateurs portables'],old_price:null,availability:'En stock',hidden:false,indicative:true});
    expect(parsed.category).toBe('Workstations');
    expect(productSchema.safeParse({...base,category:'',categories:undefined,old_price:null,availability:'En stock',hidden:false,indicative:true}).success).toBe(false);
  });
  it('imports a legacy single category and multiple category cells', () => {
    expect(mapImportRows([{Titre:'Laptop',Référence:'SINGLE',Catégorie:'Ordinateurs portable',Prix:100}])[0]?.categories).toEqual(['Ordinateurs portables']);
    expect(mapImportRows([{Titre:'Laptop',Référence:'MULTI',Catégories:'Ordinateur portable;Workstation',Prix:100}])[0]?.categories).toEqual(['Ordinateurs portables','Workstations']);
  });
  it('retains multiple categories and empty cells in extracted document tables',()=>{
    const row=mapImportText('Titre\tRéférence\tCatégories\tMarque\tPrix\nLaptop\tTEXT-01\tOrdinateurs portables;Workstations\t\t100')[0];
    expect(row?.categories).toEqual(['Ordinateurs portables','Workstations']);expect(row?.price).toBe(100);expect(row?.brand).toBe('');
  });
  it('rejects ambiguous extracted columns instead of assigning a category to a price',()=>{
    expect(()=>mapImportText('Titre;Référence;Catégories;Prix\nLaptop;TEXT-01;Ordinateurs portables;Workstations;100')).toThrow('Colonnes ambiguës');
  });
  it('normalizes legacy all-products selection',()=>{
    expect(hasCategory(base,'Tous')).toBe(true);
    expect(assignedCategories({category:'Tous'})).toEqual([]);
  });
});