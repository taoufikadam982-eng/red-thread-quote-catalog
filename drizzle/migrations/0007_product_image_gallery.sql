ALTER TABLE public.products ADD COLUMN images text[] NOT NULL DEFAULT '{}';
UPDATE public.products SET images = ARRAY[image_path] WHERE image_path <> '';
ALTER TABLE public.products ADD CONSTRAINT product_images_limit CHECK (cardinality(images) <= 6);
CREATE OR REPLACE FUNCTION public.sync_product_gallery() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF TG_OP = 'INSERT' THEN
   IF cardinality(NEW.images) = 0 AND NEW.image_path <> '' THEN NEW.images := ARRAY[NEW.image_path]; END IF;
 ELSIF NEW.images IS NOT DISTINCT FROM OLD.images AND NEW.image_path IS DISTINCT FROM OLD.image_path THEN
   IF NEW.image_path = '' THEN NEW.images := '{}';
   ELSE NEW.images := ARRAY[NEW.image_path] || COALESCE(OLD.images[2:6], '{}'::text[]); END IF;
 END IF;
 NEW.image_path := COALESCE(NEW.images[1], '');
 RETURN NEW;
END $$;
CREATE TRIGGER sync_product_gallery BEFORE INSERT OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.sync_product_gallery();
CREATE OR REPLACE FUNCTION public.save_product_batch(rows jsonb) RETURNS void LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
 INSERT INTO public.products(id,name,reference,category,specs,brand,usage,image_path,images,price,old_price,availability,hidden,indicative)
 SELECT p.id,p.name,p.reference,p.category,p.specs,p.brand,p.usage,p.image_path,COALESCE(p.images,(SELECT images FROM public.products WHERE id=p.id),'{}'::text[]),p.price,p.old_price,p.availability,p.hidden,p.indicative FROM jsonb_populate_recordset(NULL::public.products,rows) p
 ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,reference=EXCLUDED.reference,category=EXCLUDED.category,specs=EXCLUDED.specs,brand=EXCLUDED.brand,usage=EXCLUDED.usage,image_path=EXCLUDED.image_path,images=EXCLUDED.images,price=EXCLUDED.price,old_price=EXCLUDED.old_price,availability=EXCLUDED.availability,hidden=EXCLUDED.hidden,indicative=EXCLUDED.indicative;
END $$;