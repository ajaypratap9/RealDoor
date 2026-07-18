import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Simple manual env parser
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

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function checkStorage() {
  console.log("Checking Supabase Storage Buckets...");
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error("Error listing buckets:", listError);
    return;
  }
  
  console.log("Found buckets:", buckets.map(b => b.name));

  const hasDocuments = buckets.find(b => b.name === 'documents');

  if (!hasDocuments) {
    console.log("Bucket 'documents' not found. Creating it using Service Role...");
    const { data: createData, error: createError } = await supabase.storage.createBucket('documents', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (createError) {
      console.error("Failed to create bucket:", createError);
    } else {
      console.log("Successfully created 'documents' bucket programmatically!");
    }
  } else {
    console.log("'documents' bucket already exists. Public status:", hasDocuments.public);
  }
}

checkStorage();
