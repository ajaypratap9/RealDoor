"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, FileText, CheckCircle2, ShieldAlert, AlertTriangle, Edit, ExternalLink } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
import { getMtspLimit } from '../../lib/hud-mtsp-data';
import DashboardHeader from '../components/DashboardHeader';

export default function PacketPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [household, setHousehold] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [fields, setFields] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        setUser(user);
        const { data: hh } = await supabase.from('households').select('*').eq('user_id', user.id).single();
        setHousehold(hh);

        if (hh) {
          const { data: docs } = await supabase.from('documents').select('*').eq('household_id', hh.id);
          const confirmedDocs = (docs || []).filter(d => d.status === 'confirmed');
          setDocuments(confirmedDocs);
          
          if (confirmedDocs.length > 0) {
            const docIds = confirmedDocs.map(d => d.id);
            const { data: extracted } = await supabase.from('extracted_fields')
              .select('*')
              .in('document_id', docIds);
            setFields(extracted || []);
          }
        }
      } catch (err) {
        console.error("Error loading packet data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supabase, router]);

  const handleDownloadPDF = async () => {
    setExporting(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-packet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ household_id: household.id })
      });
      const data = await res.json();
      const error = !res.ok ? new Error(data.error || 'Failed') : null;

      if (error) throw new Error(error.message || 'Failed to generate PDF');

      if (data && data.pdfBase64) {
        const linkSource = `data:application/pdf;base64,${data.pdfBase64}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = `Application_Readiness_Packet.pdf`;
        downloadLink.click();
      } else {
        throw new Error('Invalid response from PDF generator');
      }

      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('consent_log').insert({
        user_id: user.id,
        action: 'Packet Exported',
        detail: 'User downloaded application-readiness packet via Edge Function.'
      });

    } catch (err) {
      console.error(err);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <DashboardHeader />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-accent-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Compiling Virtual Document...</p>
      </div>
    </div>
  );

  const isProfileComplete = household && household.household_size > 0;
  const mtspLimit = isProfileComplete ? getMtspLimit(household.household_size, household.metro) : 0;
  
  // Deterministic Math Calculation: Annualization Engine
  let totalProjectedAnnualIncome = 0;
  let hasNonNumericError = false;
  let periodWarning = false;

  const fieldsByDoc = {};
  
  documents.forEach(doc => {
    const docFields = fields.filter(f => f.document_id === doc.id);
    fieldsByDoc[doc.id] = docFields; // Save for rendering

    const confirmedDocFields = docFields.filter(f => f.confirmed);
    
    // Find pay period
    const payPeriodField = confirmedDocFields.find(f => f.field_name.toLowerCase().includes('pay_period') || f.field_name.toLowerCase() === 'period');
    
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

    // Find income fields
    const incomeFields = confirmedDocFields.filter(f => 
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
        f._hasError = true; // flag field for UI
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
  const isReady = isProfileComplete && documents.length > 0;

  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-body flex flex-col text-[#3D3D3A]">
      <DashboardHeader />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
        
        {/* Action Bar (Outside Preview) */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">Packet Preview</h1>
            <p className="text-sm font-medium text-slate-500">Review your compiled dossier before generating the official PDF.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/profile" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-colors shadow-sm">
              <Edit size={16} /> Edit Profile
            </Link>
            <button 
              onClick={handleDownloadPDF} 
              disabled={exporting || !isReady} 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md disabled:opacity-50 disabled:hover:bg-emerald-600"
            >
              <Download size={18} /> {exporting ? 'Generating PDF...' : 'Download PDF Packet'}
            </button>
          </div>
        </div>

        {error && (
          <div className="w-full max-w-4xl mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <AlertTriangle size={20} />
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        {/* The "Virtual Paper" Card */}
        <div className="w-full max-w-4xl bg-white rounded-xl border border-slate-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden relative">
          
          {/* Document Header */}
          <div className="p-10 md:p-12 pb-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
              <div className="flex items-center gap-0">
                <img src="https://txlbsxwuaumjsewizzzz.supabase.co/storage/v1/object/public/logo/logo.png" alt="RealDoor Logo" className="w-16 h-16 sm:w-24 sm:h-24 object-contain -mr-2 sm:-mr-4 -ml-4 sm:-ml-8 grayscale opacity-80" />
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">RealDoor</span>
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1A1A1A] uppercase tracking-wider text-left sm:text-right">Application Readiness Packet</h2>
            </div>
            <div className="w-full h-px bg-slate-200"></div>
            <p className="text-xs font-bold text-slate-400 mt-3 text-right">Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} | RealDoor Compliance Engine</p>
          </div>

          {!isReady ? (
            /* Empty State */
            <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                <FileText size={40} />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Your packet is empty.</h3>
              <p className="text-slate-500 max-w-sm mb-6">
                {!isProfileComplete 
                  ? "Please complete your profile (Household Size) to calculate eligibility." 
                  : "Confirm at least one document to generate your preview."}
              </p>
            </div>
          ) : (
            /* Document Content */
            <div className="p-10 md:p-12 pt-6 space-y-12">
              
              {/* Applicant Info */}
              <section>
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A] border-b border-slate-200 pb-2 mb-6 uppercase tracking-wider">Applicant Information</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 max-w-2xl">
                  <div>
                    <dt className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</dt>
                    <dd className="text-sm font-bold text-[#1A1A1A]">{user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Applicant'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</dt>
                    <dd className="text-sm font-bold text-[#1A1A1A]">{user?.email}</dd>
                  </div>
                </dl>
              </section>

              {/* Section 1: Deterministic Calculator */}
              <section>
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A] border-b border-slate-200 pb-2 mb-6 uppercase tracking-wider">LIHTC Income Eligibility Estimate</h3>
                
                {periodWarning && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                    <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs font-bold text-amber-800">Warning: Pay period not specified for one or more documents. Annualization assumed monthly.</p>
                  </div>
                )}

                <div className="space-y-3 max-w-2xl mb-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">Household Size</span>
                    <span className="text-sm sm:text-base font-bold text-[#1A1A1A]">{household.household_size}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">Total Projected Annual Income</span>
                    <span className="text-sm sm:text-base font-bold text-[#1A1A1A]">{currencyFormatter.format(totalProjectedAnnualIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">HUD MTSP Annual Limit (2026)</span>
                    <span className="text-sm sm:text-base font-bold text-[#1A1A1A]">{currencyFormatter.format(mtspLimit)}</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg mb-4">
                  <p className="font-mono text-sm font-bold text-slate-700">
                    Formula Used: Total Annual Income &lt;= MTSP Limit ({currencyFormatter.format(totalProjectedAnnualIncome)} &lt;= {currencyFormatter.format(mtspLimit)})
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm ${isBelowThreshold ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {isBelowThreshold ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                    {isBelowThreshold ? 'Below published threshold' : 'Exceeds published threshold'}
                  </div>
                  
                  <p className="text-xs text-slate-400 max-w-xs sm:text-right">
                    Source: HUD MTSP Income Limit Documentation, 2026 Rule Year. Effective: 03/01/2026.
                  </p>
                </div>
              </section>

              {/* Section 2: Human-Confirmed Data & Source Provenance */}
              <section>
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A] border-b border-slate-200 pb-2 mb-6 uppercase tracking-wider">Human-Confirmed Document Data</h3>
                
                {hasNonNumericError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <ShieldAlert size={18} className="text-red-600 mt-0.5 shrink-0" />
                    <p className="text-sm font-bold text-red-800">Needs review: non-numeric value detected in income fields. Calculation assumes $0 for these fields.</p>
                  </div>
                )}

                <div className="space-y-8">
                  {documents.map(doc => {
                    const docFields = fieldsByDoc[doc.id] || [];
                    if (docFields.length === 0) return null;

                    return (
                      <div key={doc.id} className="break-inside-avoid">
                        <div className="mb-4 bg-slate-50 py-2 px-4 rounded-md inline-flex items-center gap-2 border border-slate-200">
                          <h4 className="text-md font-bold text-slate-800">{doc.doc_type}</h4>
                          {doc.file_url && (
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-xs font-bold transition-colors">
                              <ExternalLink size={14} /> View Original
                            </a>
                          )}
                        </div>
                        <dl className="space-y-3">
                          {docFields.map(f => (
                            <div key={f.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 border-b border-slate-100 pb-3 group">
                              <dt className="md:col-span-4 text-sm font-bold text-slate-600 capitalize">{f.field_name.replace(/_/g, ' ')}</dt>
                              <dd className="md:col-span-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <span className={`text-sm font-bold ${f._hasError ? 'text-red-600' : 'text-[#1A1A1A]'}`}>
                                  {f.value} {f._hasError && '(Invalid Number)'}
                                </span>
                                {f.source_snippet && (
                                  <div className="relative">
                                    <span className="text-[10px] uppercase font-bold text-blue-500 cursor-help border border-blue-200 bg-blue-50 px-2 py-0.5 rounded-full opacity-50 group-hover:opacity-100 transition-opacity">
                                      Source Provenance
                                    </span>
                                    {/* Tooltip for snippet */}
                                    <div className="absolute right-0 bottom-full mb-2 w-64 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 hidden sm:block">
                                      <span className="font-bold block mb-1 text-slate-400">Extracted from:</span>
                                      "{f.source_snippet}"
                                    </div>
                                  </div>
                                )}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    );
                  })}
                </div>
              </section>

            </div>
          )}

          {/* Section 3: The Disclaimer Box */}
          <div className="bg-slate-50 border-t border-slate-200 p-8 mt-auto">
            <div className="border border-slate-300 rounded-md p-4 text-center">
              <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-3xl mx-auto">
                RealDoor does not determine eligibility. This packet only confirms document presence and calculates income against published limits. A qualified housing professional will make the final decision.
              </p>
            </div>
          </div>
          
        </div>
        
        {/* Extra spacing at bottom */}
        <div className="h-24"></div>
      </main>
    </div>
  );
}
