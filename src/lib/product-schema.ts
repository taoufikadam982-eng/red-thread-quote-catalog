import { z } from 'zod';
import { assignedCategories, normalizeCategory, officialCategories } from './product-categories';
import { imagePathSchema, MAX_PRODUCT_IMAGES } from './product-images';

export const availabilityOptions = ['En stock', 'Sur commande', 'Rupture de stock'] as const;
export const adminCategories = ['Tous', ...officialCategories];
export const productSchema = z.object({
  id: z.string().min(1).max(60),
  name: z.string().trim().min(1, 'Le titre est obligatoire.').max(200),
  reference: z.string().trim().min(1, 'La référence est obligatoire.').max(120),
  category: z.string().trim().max(100).default(''),
  categories: z.array(z.string().trim().min(1).max(100)).min(1, 'Choisissez au moins une catégorie.').max(officialCategories.length).optional(),
  specs: z.string().max(10000).default(''),
  brand: z.string().max(100).default(''),
  usage: z.string().max(1000).default(''),
  image_path: z.string().max(500).default(''),
  images: z.array(imagePathSchema).max(MAX_PRODUCT_IMAGES).optional(),
  price: z.number().finite().min(0).max(9999999999),
  old_price: z.number().finite().positive().max(9999999999).nullable().default(null),
  is_clearance: z.boolean().optional(),
  clearance_badge: z.string().trim().max(40).nullable().optional(),
  availability: z.enum(availabilityOptions),
  hidden: z.boolean(),
  indicative: z.boolean(),
}).transform(p => { const categories = assignedCategories(p); return { ...p, categories, category: categories[0] ?? normalizeCategory(p.category) }; }).refine(p=>p.categories.length>0,{path:['categories'],message:'Choisissez au moins une catégorie.'}).refine(p => p.old_price === null || p.old_price > p.price, { path: ['old_price'], message: 'Le prix barré doit être supérieur au prix actuel.' });
export type AdminProduct = z.infer<typeof productSchema>;
export function canAdminister(role: unknown) { return role === 'admin'; }
export function blankProduct(): AdminProduct {
  return { id: crypto.randomUUID(), name: '', reference: '', category: 'Ordinateurs portables', categories: ['Ordinateurs portables'], specs: '', brand: '', usage: '', image_path: '', price: 0, old_price: null, is_clearance: false, clearance_badge: null, availability: 'En stock', hidden: false, indicative: true };
}