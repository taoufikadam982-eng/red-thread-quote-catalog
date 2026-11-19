CREATE OR REPLACE FUNCTION public.save_product_batch(rows jsonb) RETURNS void LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
 INSERT INTO public.products(id,name,reference,category,categories,specs,brand,usage,image_path,images,price,old_price,availability,hidden,indicative)
 SELECT p.id,p.name,p.reference,p.category,
 COALESCE(p.categories,ARRAY[p.category] || COALESCE((SELECT categories[2:7] FROM public.products WHERE id=p.id),'{}'::text[])),
 p.specs,p.brand,p.usage,p.image_path,COALESCE(p.images,(SELECT images FROM public.products WHERE id=p.id),'{}'::text[]),p.price,p.old_price,p.availability,p.hidden,p.indicative
 FROM jsonb_populate_recordset(NULL::public.products,rows) p
 ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,reference=EXCLUDED.reference,category=EXCLUDED.category,categories=EXCLUDED.categories,specs=EXCLUDED.specs,brand=EXCLUDED.brand,usage=EXCLUDED.usage,image_path=EXCLUDED.image_path,images=EXCLUDED.images,price=EXCLUDED.price,old_price=EXCLUDED.old_price,availability=EXCLUDED.availability,hidden=EXCLUDED.hidden,indicative=EXCLUDED.indicative;
END $$;