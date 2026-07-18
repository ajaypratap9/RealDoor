import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.join('=').trim();
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceRole = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

// REST API call directly to Supabase via Postgres to patch the schema
// Since we don't have direct SQL RPC access without a pre-existing function, 
// we will just use the standard Supabase REST endpoint by passing SQL to the query endpoint if possible,
// BUT Supabase REST doesn't allow DDL (ALTER TABLE) directly via HTTP unless using postgres meta API.

// Since we cannot run ALTER TABLE directly via JS, we will log the SQL here so the user can run it.
const sqlPatch = `
ALTER TABLE documents ADD COLUMN IF NOT EXISTS user_id uuid references auth.users;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS filename text;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS mime_type text;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS created_at timestamp with time zone default timezone('utc'::text, now());

ALTER TABLE extracted_fields ADD COLUMN IF NOT EXISTS extracted_value text;

-- Update existing documents policy for user_id
CREATE POLICY "Users can manage documents directly" ON public.documents
    FOR ALL USING (auth.uid() = user_id);
`;

console.log(sqlPatch);
