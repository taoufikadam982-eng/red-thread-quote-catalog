ALTER TABLE public.products ADD COLUMN categories text[] NOT NULL DEFAULT '{}';
CREATE OR REPLACE FUNCTION public.normalize_product_category(value text) RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
WITH k AS (SELECT trim(regexp_replace(translate(lower(value),'éèêëàâäîïôöùûüç','eeeeaaaiioouuuc'),'[^a-z0-9]+',' ','g')) AS name)
SELECT CASE
WHEN name ~ '^ordinateurs? portables?$' THEN 'Ordinateurs portables'
WHEN name ~ '^ordinateurs? (de bureau|bureautiques?)$' THEN 'Ordinateurs de bureau'
WHEN name ~ '^workstations?( fixes?| mobiles?)?$' THEN 'Workstations'
WHEN name ~ '^imprimantes?$' THEN 'Imprimantes'
WHEN name ~ '^scanners?$' THEN 'Scanners'
WHEN name ~ '^ecrans?$' THEN 'Écrans'
WHEN name ~ '^(accessoires?( reseaux?)?|peripheriques?|reseaux?( serveurs?)?|onduleurs?( eaton)?)$' THEN 'Accessoires & Réseau'
ELSE trim(value) END FROM k;
$$;
UPDATE public.products SET categories = ARRAY[public.normalize_product_category(category)], category = public.normalize_product_category(category);
CREATE OR REPLACE FUNCTION public.sync_product_categories() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF TG_OP = 'UPDATE' THEN
  IF NEW.categories IS NOT DISTINCT FROM OLD.categories AND NEW.category IS DISTINCT FROM OLD.category THEN
   NEW.categories := ARRAY[NEW.category] || COALESCE(OLD.categories[2:7], '{}'::text[]);
  END IF;
 END IF;
 IF cardinality(NEW.categories) = 0 THEN NEW.categories := ARRAY[NEW.category]; END IF;
 SELECT array_agg(name ORDER BY position) INTO NEW.categories FROM (
  SELECT public.normalize_product_category(value) name, min(ordinality) position
  FROM unnest(NEW.categories) WITH ORDINALITY AS c(value,ordinality)
  WHERE trim(value) <> '' GROUP BY public.normalize_product_category(value)
 ) normalized;
 IF COALESCE(cardinality(NEW.categories),0) = 0 THEN RAISE EXCEPTION 'At least one category is required'; END IF;
 NEW.category := NEW.categories[1];
 RETURN NEW;
END $$;
CREATE TRIGGER sync_product_categories BEFORE INSERT OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.sync_product_categories();
CREATE INDEX products_categories_gin ON public.products USING gin(categories);
CREATE OR REPLACE FUNCTION public.save_product_batch(rows jsonb) RETURNS void LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
 INSERT INTO public.products(id,name,reference,category,categories,specs,brand,usage,image_path,images,price,old_price,availability,hidden,indicative)
 SELECT p.id,p.name,p.reference,p.category,COALESCE(p.categories,ARRAY[p.category]),p.specs,p.brand,p.usage,p.image_path,COALESCE(p.images,(SELECT images FROM public.products WHERE id=p.id),'{}'::text[]),p.price,p.old_price,p.availability,p.hidden,p.indicative FROM jsonb_populate_recordset(NULL::public.products,rows) p
 ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,reference=EXCLUDED.reference,category=EXCLUDED.category,categories=EXCLUDED.categories,specs=EXCLUDED.specs,brand=EXCLUDED.brand,usage=EXCLUDED.usage,image_path=EXCLUDED.image_path,images=EXCLUDED.images,price=EXCLUDED.price,old_price=EXCLUDED.old_price,availability=EXCLUDED.availability,hidden=EXCLUDED.hidden,indicative=EXCLUDED.indicative;
END $$;