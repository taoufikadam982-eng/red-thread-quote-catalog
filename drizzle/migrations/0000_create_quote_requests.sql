CREATE TABLE public.quote_requests (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_at timestamptz NOT NULL DEFAULT now(), name text NOT NULL, email text NOT NULL, phone text NOT NULL, request_type text NOT NULL, message text NOT NULL, items jsonb NOT NULL DEFAULT '[]'::jsonb);
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;