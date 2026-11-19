ALTER TABLE public.products ADD COLUMN is_clearance boolean NOT NULL DEFAULT false;
ALTER TABLE public.products ADD COLUMN clearance_badge text;
ALTER TABLE public.products ADD CONSTRAINT products_clearance_badge_length CHECK (clearance_badge IS NULL OR char_length(clearance_badge) <= 40);
CREATE INDEX products_clearance_visible ON public.products(is_clearance) WHERE NOT hidden;
CREATE OR REPLACE FUNCTION public.save_product_batch(rows jsonb) RETURNS void LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
 INSERT INTO public.products(id,name,reference,category,categories,specs,brand,usage,image_path,images,price,old_price,availability,hidden,indicative,is_clearance,clearance_badge)
 SELECT p.id,p.name,p.reference,p.category,
 COALESCE(p.categories,ARRAY[p.category] || COALESCE((SELECT categories[2:7] FROM public.products WHERE id=p.id),'{}'::text[])),
 p.specs,p.brand,p.usage,p.image_path,COALESCE(p.images,(SELECT images FROM public.products WHERE id=p.id),'{}'::text[]),p.price,p.old_price,p.availability,p.hidden,p.indicative,
 COALESCE(p.is_clearance,(SELECT is_clearance FROM public.products WHERE id=p.id),false),
 CASE WHEN r.value ? 'clearance_badge' THEN NULLIF(btrim(p.clearance_badge),'') ELSE (SELECT clearance_badge FROM public.products WHERE id=p.id) END
 FROM jsonb_array_elements(rows) r CROSS JOIN LATERAL jsonb_populate_record(NULL::public.products,r.value) p
 ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,reference=EXCLUDED.reference,category=EXCLUDED.category,categories=EXCLUDED.categories,specs=EXCLUDED.specs,brand=EXCLUDED.brand,usage=EXCLUDED.usage,image_path=EXCLUDED.image_path,images=EXCLUDED.images,price=EXCLUDED.price,old_price=EXCLUDED.old_price,availability=EXCLUDED.availability,hidden=EXCLUDED.hidden,indicative=EXCLUDED.indicative,is_clearance=EXCLUDED.is_clearance,clearance_badge=EXCLUDED.clearance_badge;
END $$;