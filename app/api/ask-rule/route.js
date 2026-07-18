import { NextResponse } from 'next/server';
import hudData from '../../../lib/hud-mtsp-2026.json';
import { createClient } from '@supabase/supabase-js';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const REASONING_MODEL = "llama-3.3-70b-versatile";

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
  }

  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
  }

  try {
    const { question, householdProfile, precomputedResult } = await request.json();

    const systemPrompt = `You are RealDoor's Rules Explainer for the LIHTC affordable-housing program, using the
HUD Multifamily Tax Subsidy Projects (MTSP) income limits for ${hudData.metro}, rule year
${hudData.year}, effective date ${hudData.effective_date}.

You may ONLY use the RULE CORPUS provided below as your source of truth. You have no
other knowledge of housing law, and you must not use any information from your training
data about housing programs, income limits, or eligibility rules — only the corpus below.

RULE CORPUS:
${JSON.stringify(hudData, null, 2)}

YOU WILL BE GIVEN:
1. A renter's question.
2. The renter's confirmed household profile (household size, confirmed income fields).
3. In some cases, an ALREADY-COMPUTED deterministic result (income vs. threshold), which
   you must treat as ground truth and explain — you must never recompute or contradict it.

RULES YOU MUST FOLLOW:
1. NEVER state or imply that the household "is eligible" or "is not eligible" for the
   program. You may only state facts like "household income is above/below the published
   threshold for this household size" — the eligibility decision itself is made by a human
   housing professional, not by you or RealDoor.
2. Every factual claim you make must cite the specific corpus section and the effective
   date it came from. If you cannot cite a corpus section for a claim, do not make the claim.
3. If the question cannot be answered confidently from the corpus, or the renter's profile
   is missing information needed to answer, respond with evidence_type "no_call" and clearly
   state what information or corpus detail is missing. Do NOT guess or extrapolate.
4. If the question is unrelated to this program's published rules (e.g. asks for legal
   advice, asks you to predict an outcome, asks about a different program/metro/year not in
   the corpus), respond with evidence_type "no_call" and redirect the renter to ask a
   housing professional.
5. Write the plain-language answer at an 8th-grade reading level, warm but factual, no
   legal jargon without a one-line explanation of what it means.
6. Output valid JSON only, matching the schema exactly.

OUTPUT SCHEMA:
{
  "answer_plain_language": "string",
  "citation": { "source": "string", "section": "string", "effective_date": "string" },
  "evidence_type": "confirmed_corpus_match | statistical_or_general | no_call",
  "no_call_reason": "string | null"
}`;

    const userMessage = JSON.stringify({
      question,
      confirmed_household_profile: householdProfile,
      precomputed_result: precomputedResult
    });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: REASONING_MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${await response.text()}`);
    }

    const data = await response.json();
    const answer = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ success: true, answer });
  } catch (error) {
    console.error("Rules engine error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
