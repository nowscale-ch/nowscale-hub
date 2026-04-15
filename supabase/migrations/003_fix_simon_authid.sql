-- Fix: Update Simon's auth_id and ensure data is correct
DO $$
DECLARE
  v_auth_id UUID;
BEGIN
  SELECT id INTO v_auth_id FROM auth.users WHERE email = 'simon@nowscale.ch' LIMIT 1;
  IF v_auth_id IS NOT NULL THEN
    UPDATE ns_users SET auth_id = v_auth_id WHERE email = 'simon@nowscale.ch';
  END IF;
END $$;
