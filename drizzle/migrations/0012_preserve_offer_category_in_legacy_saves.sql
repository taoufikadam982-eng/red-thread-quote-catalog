DO $$
DECLARE definition text;
BEGIN
 SELECT pg_get_functiondef('public.sync_product_categories()'::regprocedure) INTO definition;
 EXECUTE replace(definition, '[2:10]', '[2:11]');
 SELECT pg_get_functiondef('public.save_product_batch(jsonb)'::regprocedure) INTO definition;
 EXECUTE replace(definition, '[2:10]', '[2:11]');
END $$;