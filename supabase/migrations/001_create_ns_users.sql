CREATE TABLE IF NOT EXISTS ns_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  tools JSONB DEFAULT '["leadfinder","ads","finance","leads"]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ns_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read" ON ns_users FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can do everything" ON ns_users FOR ALL USING (
  EXISTS (SELECT 1 FROM ns_users WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Seed: Simon als Admin
INSERT INTO ns_users (email, name, role) VALUES ('simon@nowscale.ch', 'Simon Stecher', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin', name = 'Simon Stecher';
