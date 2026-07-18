import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { HUD_MTSP_LIMITS_2026 } from '../../../lib/hud-mtsp-data';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
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

    const body = await req.json();
    const householdId = body.household_id;
    if (!householdId) {
      return NextResponse.json({ error: "Missing household_id" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: household } = await supabaseAdmin
      .from('households')
      .select('*')
      .eq('id', householdId)
      .single();

    if (!household || household.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized to access this household data." }, { status: 403 });
    }

    const { data: documents } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('household_id', householdId)
      .eq('status', 'confirmed');

    const docIds = (documents || []).map(d => d.id);
    let fields = [];
    if (docIds.length > 0) {
      const { data: extracted } = await supabaseAdmin
        .from('extracted_fields')
        .select('*')
        .in('document_id', docIds);
      fields = extracted || [];
    }

    const size = Math.min(household.household_size || 0, 8);
    // Use the getMtspLimit function which safely falls back to Boston if area is missing
    const { getMtspLimit } = require('../../../lib/hud-mtsp-data');
    const mtspLimit = size > 0 ? getMtspLimit(size, household.metro) : 0;
    
    let totalProjectedAnnualIncome = 0;
    let hasNonNumericError = false;
    let periodWarning = false;

    (documents || []).forEach(doc => {
      const docFields = fields.filter(f => f.document_id === doc.id && f.confirmed);
      const payPeriodField = docFields.find(f => f.field_name.toLowerCase().includes('pay_period') || f.field_name.toLowerCase() === 'period');
      
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

      const incomeFields = docFields.filter(f => 
        (f.field_name.toLowerCase().includes('gross') || 
         f.field_name.toLowerCase().includes('income') || 
         f.field_name.toLowerCase().includes('pay')) &&
         !f.field_name.toLowerCase().includes('period')
      );

      let docIncome = 0;
      incomeFields.forEach(f => {
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
    const safeText = (text) => {
      let clean = text;
      blocklist.forEach(word => {
        const regex = new RegExp(word, 'gi');
        clean = clean.replace(regex, '[REDACTED DECISION WORD]');
      });
      return clean;
    };

    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

    // Generate PDF using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const fontCourierBold = await pdfDoc.embedFont(StandardFonts.CourierBold);

    // Fetch and embed logo
    let logoImage;
    try {
      const logoBytes = await fetch('https://txlbsxwuaumjsewizzzz.supabase.co/storage/v1/object/public/logo/logo.png').then(res => res.arrayBuffer());
      logoImage = await pdfDoc.embedPng(logoBytes);
    } catch (e) {
      console.warn("Could not load logo", e);
    }

    let page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
    const { width, height } = page.getSize();
    
    // Increase top margin to make room for the large 85px logo without it bleeding off the top
    let currentY = height - 90; 
    
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? rgb(parseInt(result[1], 16)/255, parseInt(result[2], 16)/255, parseInt(result[3], 16)/255) : rgb(0,0,0);
    };

    const checkPage = (neededSpace = 30) => {
      if (currentY < (50 + neededSpace)) {
        page = pdfDoc.addPage([595.28, 841.89]);
        currentY = height - 50;
      }
    };

    const writeLine = (text, size, font, colorHex, indent = 0) => {
      checkPage(size + 10);
      page.drawText(text, { x: 50 + indent, y: currentY, size, font, color: hexToRgb(colorHex) });
      currentY -= (size + 12);
    };

    const writePairGrid = (label1, value1, label2, value2) => {
      checkPage(25);
      page.drawText(label1, { x: 50, y: currentY, size: 8, font: fontBold, color: hexToRgb('#6B7280') });
      page.drawText(value1, { x: 50, y: currentY - 12, size: 10, font: fontBold, color: hexToRgb('#111827') });
      
      if (label2) {
        page.drawText(label2, { x: 300, y: currentY, size: 8, font: fontBold, color: hexToRgb('#6B7280') });
        page.drawText(value2, { x: 300, y: currentY - 12, size: 10, font: fontBold, color: hexToRgb('#111827') });
      }
      currentY -= 30;
    };

    const writeRightAlignedPair = (label, value) => {
      checkPage(25);
      page.drawText(label, { x: 50, y: currentY, size: 9, font: fontBold, color: hexToRgb('#6B7280') });
      const valWidth = fontBold.widthOfTextAtSize(value, 10);
      page.drawText(value, { x: 545 - valWidth, y: currentY, size: 10, font: fontBold, color: hexToRgb('#111827') });
      currentY -= 20;
    };

    const drawDivider = () => {
      checkPage(20);
      currentY -= 5;
      page.drawLine({ start: { x: 50, y: currentY }, end: { x: 545, y: currentY }, thickness: 1, color: hexToRgb('#E5E7EB') });
      currentY -= 15;
    };

    // Header
    if (logoImage) {
      const logoWidth = 85;
      const logoHeight = 85;
      page.drawImage(logoImage, {
        x: 40,
        y: currentY - 18, // Moved down slightly
        width: logoWidth,
        height: logoHeight,
        opacity: 0.8
      });
      page.drawText('RealDoor', { x: 40 + logoWidth - 20, y: currentY + 15, size: 24, font: fontBold, color: hexToRgb('#111827') });
    } else {
      page.drawText('RealDoor', { x: 50, y: currentY, size: 24, font: fontBold, color: hexToRgb('#111827') });
    }
    
    const headerRightText = 'APPLICATION READINESS PACKET';
    const headerRightWidth = fontBold.widthOfTextAtSize(headerRightText, 12);
    page.drawText(headerRightText, { x: 545 - headerRightWidth, y: currentY + 15, size: 12, font: fontBold, color: hexToRgb('#111827') });
    currentY -= 30; // Increased padding so the lowered logo doesn't hit the line
    drawDivider();
    
    const dateText = `Generated on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} | RealDoor Compliance Engine`;
    const dateWidth = fontBold.widthOfTextAtSize(dateText, 8);
    page.drawText(dateText, { x: 545 - dateWidth, y: currentY + 5, size: 8, font: fontBold, color: hexToRgb('#9CA3AF') });
    currentY -= 15;

    // Applicant Info
    const applicantName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Applicant';
    page.drawText('APPLICANT INFORMATION', { x: 50, y: currentY, size: 10, font: fontBold, color: hexToRgb('#111827') });
    currentY -= 5;
    drawDivider();
    
    writePairGrid('NAME', applicantName, 'EMAIL', user.email || '');
    currentY -= 5;

    // Section 1
    page.drawText('LIHTC INCOME ELIGIBILITY ESTIMATE', { x: 50, y: currentY, size: 10, font: fontBold, color: hexToRgb('#111827') });
    currentY -= 5;
    drawDivider();

    if (periodWarning) {
      page.drawRectangle({ x: 50, y: currentY - 10, width: 495, height: 20, color: hexToRgb('#FEF3C7'), borderColor: hexToRgb('#FDE68A'), borderWidth: 1 });
      page.drawText('Warning: Pay period not specified for one or more documents. Annualization assumed monthly.', { x: 60, y: currentY - 3, size: 9, font: fontBold, color: hexToRgb('#92400E') });
      currentY -= 25;
    }

    writeRightAlignedPair('HOUSEHOLD SIZE', `${size}`);
    writeRightAlignedPair('TOTAL PROJECTED ANNUAL INCOME', currencyFormatter.format(totalProjectedAnnualIncome));
    writeRightAlignedPair('HUD MTSP ANNUAL LIMIT (2026)', currencyFormatter.format(mtspLimit));
    
    currentY -= 5;
    checkPage(40);
    page.drawRectangle({ x: 50, y: currentY - 20, width: 495, height: 25, color: hexToRgb('#F8FAFC'), borderColor: hexToRgb('#E2E8F0'), borderWidth: 1 });
    page.drawText(`Formula Used: Total Annual Income <= MTSP Limit (${currencyFormatter.format(totalProjectedAnnualIncome)} <= ${currencyFormatter.format(mtspLimit)})`, {
      x: 60, y: currentY - 12, size: 9, font: fontCourierBold, color: hexToRgb('#334155')
    });
    currentY -= 35;
    const statusText = isBelowThreshold ? 'Below published threshold' : 'Exceeds published threshold';
    
    page.drawText(statusText, { x: 50, y: currentY, size: 10, font: fontBold, color: hexToRgb(isBelowThreshold ? '#047857' : '#B91C1C') });
    const sourceText = 'Source: HUD MTSP Income Limit Documentation, 2026 Rule Year. Effective: 03/01/2026.';
    const sourceWidth = fontRegular.widthOfTextAtSize(sourceText, 7);
    page.drawText(sourceText, { x: 545 - sourceWidth, y: currentY, size: 7, font: fontRegular, color: hexToRgb('#94A3B8') });
    currentY -= 30;

    // Section 2
    page.drawText('HUMAN-CONFIRMED DOCUMENT DATA', { x: 50, y: currentY, size: 10, font: fontBold, color: hexToRgb('#111827') });
    currentY -= 5;
    drawDivider();

    if (hasNonNumericError) {
      writeLine('Warning: Non-numeric value detected in income fields. Calculation assumes $0.', 10, fontBold, '#B91C1C');
      currentY -= 5;
    }

    const fieldsByDoc = {};
    (documents || []).forEach(d => {
      fieldsByDoc[d.id] = fields.filter(f => f.document_id === d.id && f.confirmed);
    });

    Object.keys(fieldsByDoc).forEach(docId => {
      const dFields = fieldsByDoc[docId];
      if (dFields.length === 0) return;
      const docObj = documents.find(d => d.id === docId);
      const dName = docObj?.doc_type || 'Document';

      checkPage(70); // Need space for title box, header, and at least one row
      
      // Draw Doc Title Box
      page.drawRectangle({ x: 50, y: currentY - 5, width: 495, height: 22, color: hexToRgb('#F9FAFB'), borderColor: hexToRgb('#E5E7EB'), borderWidth: 1 });
      page.drawText(safeText(dName), { x: 60, y: currentY + 2, size: 10, font: fontBold, color: hexToRgb('#1F2937') });
      
      if (docObj?.file_url) {
        const linkWidth = fontRegular.widthOfTextAtSize('[View Original]', 9);
        page.drawText('[View Original]', { x: 460, y: currentY + 2, size: 9, font: fontRegular, color: hexToRgb('#3B82F6') });
        page.drawLink({ x: 460, y: currentY + 2, width: linkWidth, height: 10, url: docObj.file_url });
      }
      currentY -= 20;

      // Draw Table Header
      page.drawText('FIELD NAME', { x: 60, y: currentY, size: 8, font: fontBold, color: hexToRgb('#9CA3AF') });
      page.drawText('EXTRACTED VALUE', { x: 230, y: currentY, size: 8, font: fontBold, color: hexToRgb('#9CA3AF') });
      page.drawText('SOURCE PROVENANCE', { x: 380, y: currentY, size: 8, font: fontBold, color: hexToRgb('#9CA3AF') });
      currentY -= 8;
      page.drawLine({ start: { x: 50, y: currentY }, end: { x: 545, y: currentY }, thickness: 1, color: hexToRgb('#E5E7EB') });
      currentY -= 15;

      // Draw Rows
      dFields.forEach((f, idx) => {
        checkPage(30);
        const fieldName = safeText(f.field_name.replace(/_/g, ' '));
        const fieldValue = safeText(f.value) + (f._hasError ? ' (Invalid)' : '');
        
        let snippet = f.source_snippet ? safeText(f.source_snippet) : 'N/A';
        // Truncate snippet to prevent overflow on the right margin
        if (snippet.length > 30) snippet = snippet.substring(0, 27) + '...';

        page.drawText(fieldName.substring(0, 25), { x: 60, y: currentY, size: 9, font: fontBold, color: hexToRgb('#4B5563') });
        page.drawText(fieldValue.substring(0, 25), { x: 230, y: currentY, size: 9, font: fontBold, color: hexToRgb(f._hasError ? '#B91C1C' : '#111827') });
        page.drawText(`"${snippet}"`, { x: 380, y: currentY, size: 8, font: fontOblique, color: hexToRgb('#6B7280') });
        
        currentY -= 8;
        // Bottom border for row
        if (idx < dFields.length - 1) {
           page.drawLine({ start: { x: 50, y: currentY }, end: { x: 545, y: currentY }, thickness: 0.5, color: hexToRgb('#F3F4F6') });
        }
        currentY -= 15;
      });
      currentY -= 15; // Extra spacing after the whole table
    });

    // Disclaimer Box
    checkPage(60);
    page.drawRectangle({ x: 50, y: currentY - 30, width: 495, height: 35, borderColor: hexToRgb('#D1D5DB'), borderWidth: 1 });
    page.drawText('RealDoor does not determine eligibility. This packet only confirms document presence and calculates income', { x: 60, y: currentY - 10, size: 9, font: fontBold, color: hexToRgb('#6B7280') });
    page.drawText('against published limits. A qualified housing professional will make the final decision.', { x: 100, y: currentY - 22, size: 9, font: fontBold, color: hexToRgb('#6B7280') });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
    
    return NextResponse.json({ pdfBase64 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
