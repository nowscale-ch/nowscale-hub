-- Fix: Remove recursive policy and replace with simpler ones
DROP POLICY IF EXISTS "Admins can do everything" ON ns_users;
DROP POLICY IF EXISTS "Authenticated can read" ON ns_users;

-- Everyone authenticated can read
CREATE POLICY "Authenticated can read ns_users" ON ns_users 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Everyone authenticated can insert (for signUp flow)
CREATE POLICY "Authenticated can insert ns_users" ON ns_users 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Everyone authenticated can update (admin check in app layer)
CREATE POLICY "Authenticated can update ns_users" ON ns_users 
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Everyone authenticated can delete (admin check in app layer)
CREATE POLICY "Authenticated can delete ns_users" ON ns_users 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Also allow anon insert for signUp flow
CREATE POLICY "Anon can insert ns_users" ON ns_users 
  FOR INSERT WITH CHECK (true);

-- Fix Simon: Set auth_id if missing
UPDATE ns_users SET auth_id = (SELECT id FROM auth.users WHERE email = 'simon@nowscale.ch' LIMIT 1)
WHERE email = 'simon@nowscale.ch' AND auth_id IS NULL;
