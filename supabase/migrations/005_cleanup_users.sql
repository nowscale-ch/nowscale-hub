DO $$
DECLARE
  user_ids UUID[];
  simon_id UUID;
  r RECORD;
BEGIN
  SELECT id INTO simon_id FROM auth.users WHERE email = 'simon@nowscale.ch';
  SELECT ARRAY_AGG(id) INTO user_ids FROM auth.users WHERE email != 'simon@nowscale.ch';
  
  IF user_ids IS NULL THEN RETURN; END IF;

  -- Delete rows referencing these users from ALL public tables with FK to auth.users
  FOR r IN 
    SELECT tc.table_name, kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND ((ccu.table_schema = 'auth' AND ccu.table_name = 'users') OR (ccu.table_schema = 'public' AND ccu.table_name = 'profiles'))
    AND tc.table_schema = 'public'
    AND tc.table_name != 'ns_users'
  LOOP
    EXECUTE format('DELETE FROM %I WHERE %I = ANY($1)', r.table_name, r.column_name) USING user_ids;
  END LOOP;

  -- Clean ns_users
  DELETE FROM ns_users WHERE email != 'simon@nowscale.ch';
  
  -- Delete auth users
  DELETE FROM auth.users WHERE id = ANY(user_ids);
END $$;

UPDATE ns_users SET role = 'admin' WHERE email = 'simon@nowscale.ch';
DROP FUNCTION IF EXISTS public.list_auth_emails();
