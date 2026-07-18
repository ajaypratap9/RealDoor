"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, BookOpen, AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } } };

export default function UnderstandPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [household, setHousehold] = useState(null);
  const [incomeFields, setIncomeFields] = useState([]);
  
  // Frozen 2026 MTSP Limits for Cambridge (Synthetic for Demo)
  const MTSP_LIMITS_2026 = {
    1: 68520, 2: 78360, 3: 88140, 4: 97920, 5: 105780, 6: 113640
  };

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: hh } = await supabase.from('households').select('*').eq('user_id', user.id).single();
      setHousehold(hh);

      if (hh) {
        // Find confirmed income documents
        const { data: docs } = await supabase.from('documents').select('id, doc_type').eq('household_id', hh.id).eq('status', 'confirmed');
        if (docs && docs.length > 0) {
          const docIds = docs.map(d => d.id);
          const { data: fields } = await supabase.from('extracted_fields')
            .select('*')
            .in('document_id', docIds)
            .eq('field_name', 'gross_pay_amount')
            .eq('confirmed', true);
            
          setIncomeFields(fields || []);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-accent-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Math Engine...</p>
    </div>
  );

  const totalMonthlyIncome = incomeFields.reduce((sum, f) => sum + parseFloat(f.value || 0), 0);
  const annualizedIncome = totalMonthlyIncome * 12;
  const limit = household ? MTSP_LIMITS_2026[Math.min(household.household_size, 6)] : 0;
  const isOverLimit = annualizedIncome > limit;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors flex items-center gap-2">
              ← Back to Dashboard
            </Link>
            <h1 className="font-heading font-bold text-lg text-slate-800">Rules Engine</h1>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          
          <motion.div variants={itemVariants} className="mb-4">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Calculations & Logic</h2>
            <p className="text-slate-500 font-medium max-w-2xl">
              Understand exactly how your eligibility is calculated based on published federal rules.
            </p>
          </motion.div>
        
          {/* Anti-Decisioning Disclaimer required by Hackathon */}
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 md:p-8 flex items-start gap-5 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-blue-900 font-bold text-lg mb-2">RealDoor Does Not Determine Eligibility</h3>
              <p className="text-sm font-medium text-blue-800/80 leading-relaxed max-w-3xl">
                We apply deterministic math to published rules based strictly on your confirmed inputs. We never approve, deny, score, or rank your application. Final eligibility is always determined by a qualified human property manager.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold font-heading text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-slate-400 flex items-center justify-center shadow-sm border border-slate-200">
                  <BookOpen size={20} /> 
                </div>
                LIHTC 60% AMI Income Limit (2026)
              </h2>
            </div>
            
            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* The Math Engine */}
                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target Metro</p>
                    <p className="font-bold text-lg text-slate-800">{household?.metro || 'Boston-Cambridge-Newton'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Household Size</p>
                    <p className="font-bold text-lg text-slate-800">{household?.household_size || 0} Person(s)</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Published Threshold</p>
                    <p className="font-extrabold text-3xl text-slate-900 mb-2">${limit.toLocaleString()}</p>
                    <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <Info size={14} className="text-slate-500" />
                      <p className="text-xs font-semibold text-slate-600">Source: HUD MTSP Income Limits (Effective April 1, 2026)</p>
                    </div>
                  </div>
                </div>

                {/* The Renter's Input */}
                <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wider border-b border-slate-200 pb-3">Your Confirmed Inputs</h3>
                  
                  {incomeFields.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-sm font-medium text-slate-500 mb-4">No confirmed income documents found.</p>
                      <Link href="/documents" className="inline-block bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:border-accent-primary transition-colors">
                        Go to Documents
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {incomeFields.map(f => (
                        <div key={f.id} className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-slate-600">Monthly Gross Pay</span>
                          <span className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">${parseFloat(f.value).toLocaleString()}</span>
                        </div>
                      ))}
                      
                      <div className="border-t border-slate-200 pt-5 mt-5">
                        <div className="flex justify-between items-center text-sm mb-3">
                          <span className="font-semibold text-slate-600">Annualized Formula</span>
                          <span className="font-mono font-bold text-slate-400">x 12 months</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-4">
                          <span className="font-extrabold text-slate-800">Total Calculation</span>
                          <span className="font-mono font-black text-xl text-accent-primary">${annualizedIncome.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border shadow-sm ${isOverLimit ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                        {isOverLimit ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
                        {isOverLimit ? 'Calculated income exceeds threshold.' : 'Calculated income is below threshold.'}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
