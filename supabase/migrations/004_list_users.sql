-- Temporary: just to see what users exist
CREATE OR REPLACE FUNCTION public.list_auth_emails()
RETURNS TABLE(email text, created_at timestamptz) AS $$
  SELECT email, created_at FROM auth.users ORDER BY created_at;
$$ LANGUAGE sql SECURITY DEFINER;
