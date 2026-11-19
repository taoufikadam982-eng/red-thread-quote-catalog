import { describe, expect, it } from 'vitest';
import { galleryPaths, promoteImage } from '@/lib/product-images';
import { blankProduct, productSchema } from '@/lib/product-schema';
describe('product image gallery', () => {
  it('allows six photos and rejects seven', () => {
    const product={...blankProduct(),name:'Test',reference:'TEST',images:Array.from({length:6},(_,i)=>`products/photo${i}.jpg`)};
    expect(productSchema.safeParse(product).success).toBe(true);
    expect(productSchema.safeParse({...product,images:[...product.images,'products/seventh.jpg']}).success).toBe(false);
  });
  it('promotes any photo while preserving the others', () => expect(promoteImage(['a','b','c'],2)).toEqual(['c','a','b']));
  it('preserves a legacy cover as a single photo', () => expect(galleryPaths(undefined,'products/legacy.jpg')).toEqual(['products/legacy.jpg']));
  it('rejects unsafe image paths', () => expect(productSchema.safeParse({...blankProduct(),name:'Test',reference:'TEST',images:['../private.txt']}).success).toBe(false));
});