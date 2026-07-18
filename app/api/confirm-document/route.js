import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request) {
  if (!supabaseKey) {
    return NextResponse.json({ error: "Missing Service Role Key" }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
  }

  const supabaseClient = createClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { docId, fieldIds, userId, docType } = await request.json();

    if (!docId) {
      return NextResponse.json({ error: "Missing docId" }, { status: 400 });
    }

    if (userId !== user.id) {
       return NextResponse.json({ error: "Unauthorized action" }, { status: 403 });
    }

    // 1. Mark all fields as confirmed
    for (const fId of fieldIds) {
      await supabase.from('extracted_fields').update({ confirmed: true }).eq('id', fId);
    }

    // 2. Mark document as confirmed
    await supabase.from('documents').update({ status: 'confirmed' }).eq('id', docId);

    // 3. Log consent
    if (userId) {
      await supabase.from('consent_log').insert({
        user_id: userId,
        action: 'Document Reviewed',
        detail: "User confirmed extracted fields for " + (docType || 'document')
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
