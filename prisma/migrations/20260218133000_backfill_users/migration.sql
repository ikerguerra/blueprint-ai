-- Backfill missing users from auth.users to public.users
INSERT INTO public.users (id, email, tenant_id, updated_at)
SELECT 
  id, 
  email, 
  id::text, 
  created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;
