import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import PDFDocument from "npm:pdfkit";

// Hardcoded frozen limits as requested
const HUD_MTSP_LIMITS_2026 = {
  1: 63180,
  2: 72180,
  3: 81180,
  4: 90180,
  5: 97440,
  6: 104640,
  7: 111840,
  8: 119040
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized request");
    }

    const body = await req.json();
    const householdId = body.household_id;
    if (!householdId) {
      throw new Error("Missing household_id");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: household } = await supabaseAdmin
      .from('households')
      .select('*')
      .eq('id', householdId)
      .single();

    if (!household || household.user_id !== user.id) {
      throw new Error("Unauthorized to access this household data.");
    }

    const { data: documents } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('household_id', householdId)
      .eq('status', 'confirmed');

    const docIds = (documents || []).map((d: any) => d.id);
    let fields = [];
    if (docIds.length > 0) {
      const { data: extracted } = await supabaseAdmin
        .from('extracted_fields')
        .select('*')
        .in('document_id', docIds);
      fields = extracted || [];
    }

    // Compute Deterministic Math (Annualization Engine)
    const size = Math.min(household.household_size || 0, 8);
    const mtspLimit = size > 0 ? HUD_MTSP_LIMITS_2026[size] : 0;
    
    let totalProjectedAnnualIncome = 0;
    let hasNonNumericError = false;
    let periodWarning = false;

    (documents || []).forEach((doc: any) => {
      const docFields = fields.filter((f: any) => f.document_id === doc.id && f.confirmed);
      
      const payPeriodField = docFields.find((f: any) => f.field_name.toLowerCase().includes('pay_period') || f.field_name.toLowerCase() === 'period');
      
      let multiplier = 12;
      let hasAssumedPeriod = true;

      if (payPeriodField && payPeriodField.value) {
        const val = payPeriodField.value.toLowerCase();
        if (val.includes('bi-weekly') || val.includes('biweekly')) { multiplier = 26; hasAssumedPeriod = false; }
        else if (val.includes('weekly')) { multiplier = 52; hasAssumedPeriod = false; }
        else if (val.includes('semi-monthly') || val.includes('semi')) { multiplier = 24; hasAssumedPeriod = false; }
        else if (val.includes('month')) { multiplier = 12; hasAssumedPeriod = false; }
        else if (val.includes('annual') || val.includes('year')) { multiplier = 1; hasAssumedPeriod = false; }
      }

      const incomeFields = docFields.filter((f: any) => 
        (f.field_name.toLowerCase().includes('gross') || 
         f.field_name.toLowerCase().includes('income') || 
         f.field_name.toLowerCase().includes('pay')) &&
         !f.field_name.toLowerCase().includes('period')
      );

      let docIncome = 0;
      incomeFields.forEach((f: any) => {
        const numericValue = Number(f.value.replace(/[^0-9.-]+/g, ""));
        if (isNaN(numericValue) || f.value.toUpperCase().includes('N/A')) {
          hasNonNumericError = true;
          f._hasError = true;
        } else {
          docIncome += numericValue;
        }
      });

      if (docIncome > 0) {
        if (hasAssumedPeriod) {
          periodWarning = true;
        }
        totalProjectedAnnualIncome += (docIncome * multiplier);
      }
    });

    const isBelowThreshold = totalProjectedAnnualIncome <= mtspLimit;
    
    const blocklist = ['Eligible', 'Approved', 'Denied'];
    const safeText = (text: string) => {
      let clean = text;
      blocklist.forEach(word => {
        const regex = new RegExp(word, 'gi');
        clean = clean.replace(regex, '[REDACTED DECISION WORD]');
      });
      return clean;
    };

    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

    const pdfBuffer = await new Promise<Uint8Array>((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const chunks: Uint8Array[] = [];

        doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
        doc.on('end', () => {
          const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
          const combined = new Uint8Array(totalLength);
          let offset = 0;
          for (const c of chunks) {
            combined.set(c, offset);
            offset += c.length;
          }
          resolve(combined);
        });
        
        doc.on('error', reject);

        // PDF Styling & Content
        doc.fontSize(20).font('Helvetica-Bold').text('RealDoor', { align: 'left', continued: true });
        doc.fontSize(14).text(' | Application Readiness Packet', { align: 'right' });
        doc.moveTo(50, 80).lineTo(545, 80).stroke('#E5E7EB');
        doc.fontSize(8).font('Helvetica').fillColor('#9CA3AF').text(`Generated on ${new Date().toLocaleDateString('en-US')} | RealDoor Compliance Engine`, 50, 90, { align: 'right' });

        doc.moveDown(3);

        // Section 1
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#111827').text('LIHTC Income Eligibility Estimate');
        doc.moveTo(50, doc.y + 5).lineTo(545, doc.y + 5).stroke('#E5E7EB');
        doc.moveDown(1.5);

        if (periodWarning) {
          doc.fontSize(10).font('Helvetica-Bold').fillColor('#B45309').text('Warning: Pay period not specified for one or more documents. Annualization assumed monthly.');
          doc.moveDown(1);
        }

        doc.fontSize(10).font('Helvetica-Bold').fillColor('#6B7280').text('Household Size:', 50, doc.y, { continued: true });
        doc.font('Helvetica-Bold').fillColor('#111827').text(`  ${size}`, 220, doc.y);
        doc.moveDown(0.5);
        
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#6B7280').text('Total Projected Annual Income:', 50, doc.y, { continued: true });
        doc.font('Helvetica-Bold').fillColor('#111827').text(`  ${currencyFormatter.format(totalProjectedAnnualIncome)}`, 220, doc.y);
        doc.moveDown(0.5);

        doc.fontSize(10).font('Helvetica-Bold').fillColor('#6B7280').text('HUD MTSP Annual Limit (2026):', 50, doc.y, { continued: true });
        doc.font('Helvetica-Bold').fillColor('#111827').text(`  ${currencyFormatter.format(mtspLimit)}`, 220, doc.y);
        doc.moveDown(1.5);

        doc.rect(50, doc.y, 495, 30).fill('#F9FAFB').stroke('#E5E7EB');
        doc.fillColor('#374151').font('Courier-Bold').text(`Formula Used: Total Annual Income <= MTSP Limit (${currencyFormatter.format(totalProjectedAnnualIncome)} <= ${currencyFormatter.format(mtspLimit)})`, 60, doc.y - 20);
        doc.moveDown(1);

        const statusText = isBelowThreshold ? 'Below published threshold' : 'Exceeds published threshold';
        doc.font('Helvetica-Bold').fillColor(isBelowThreshold ? '#047857' : '#B91C1C').text(`Status: ${statusText}`);
        doc.moveDown(0.5);
        doc.fontSize(8).font('Helvetica').fillColor('#9CA3AF').text('Source: HUD MTSP Income Limit Documentation, 2026 Rule Year. Effective: 03/01/2026.');
        
        doc.moveDown(3);

        // Section 2
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#111827').text('Human-Confirmed Document Data');
        doc.moveTo(50, doc.y + 5).lineTo(545, doc.y + 5).stroke('#E5E7EB');
        doc.moveDown(1.5);

        if (hasNonNumericError) {
          doc.fontSize(10).font('Helvetica-Bold').fillColor('#B91C1C').text('Warning: Non-numeric value detected in income fields. Manual review required. Calculation assumes $0 for corrupted fields.');
          doc.moveDown(1);
        }

        const fieldsByDoc: Record<string, any[]> = {};
        (documents || []).forEach((d: any) => {
          fieldsByDoc[d.id] = fields.filter((f: any) => f.document_id === d.id && f.confirmed);
        });

        Object.keys(fieldsByDoc).forEach(docId => {
          const dFields = fieldsByDoc[docId];
          if (dFields.length === 0) return;
          const docObj = documents.find((d: any) => d.id === docId);
          const dName = docObj?.doc_type || 'Document';

          doc.fontSize(12).font('Helvetica-Bold').fillColor('#374151').text(safeText(dName), { continued: true });
          
          if (docObj?.file_url) {
            doc.fontSize(10).fillColor('#3B82F6').text(' [View Original Document]', { link: docObj.file_url });
          } else {
            doc.text('');
          }
          
          doc.moveDown(0.5);

          dFields.forEach(f => {
            const fieldName = safeText(f.field_name.replace(/_/g, ' '));
            const fieldValue = safeText(f.value) + (f._hasError ? ' (Invalid Number)' : '');
            
            doc.fontSize(10).font('Helvetica-Bold').fillColor('#6B7280').text(`${fieldName}: `, { continued: true });
            doc.font('Helvetica-Bold').fillColor(f._hasError ? '#B91C1C' : '#111827').text(fieldValue);
            
            if (f.source_snippet) {
              const snippet = safeText(f.source_snippet);
              doc.fontSize(8).font('Helvetica-Oblique').fillColor('#9CA3AF').text(`Source: "${snippet}"`);
            }
            doc.moveDown(0.5);
          });
          doc.moveDown(1);
        });

        // Disclaimer
        doc.rect(50, 720, 495, 50).stroke('#D1D5DB');
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#6B7280').text('RealDoor does not determine eligibility. This packet only confirms document presence and calculates income against published limits. A qualified housing professional will make the final decision.', 60, 730, { width: 475, align: 'center' });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });

    let binary = '';
    const chunk_size = 0x8000;
    for (let i = 0; i < pdfBuffer.length; i += chunk_size) {
      binary += String.fromCharCode.apply(null, Array.from(pdfBuffer.subarray(i, i + chunk_size)));
    }
    const pdfBase64 = btoa(binary);

    return new Response(JSON.stringify({ pdfBase64 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
