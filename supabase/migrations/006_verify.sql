CREATE OR REPLACE FUNCTION public.list_auth_emails()
RETURNS TABLE(email text) AS $$
  SELECT email FROM auth.users ORDER BY created_at;
$$ LANGUAGE sql SECURITY DEFINER;
