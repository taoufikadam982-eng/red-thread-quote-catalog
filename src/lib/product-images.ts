import { z } from 'zod';
export const MAX_PRODUCT_IMAGES = 6;
export const imagePathSchema = z.string().regex(/^products\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp)$/).max(200);
export function galleryPaths(images: string[] | undefined, cover: string) { return images?.length ? images : cover ? [cover] : []; }
export function publicProductImage(path: string) { return `/api/public/catalogue-image?path=${encodeURIComponent(path)}`; }
export function promoteImage(images: string[], index: number) { const selected = images[index]; return selected ? [selected, ...images.filter((_, i) => i !== index)] : images; }