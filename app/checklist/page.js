"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardHeader from '../components/DashboardHeader';
import { CheckCircle2, AlertCircle, FileUp, ChevronRight, ShieldCheck, ListChecks, ArrowRight } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } } };

export default function ChecklistPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState([
    { 
      id: 'proof_income',
      name: 'Proof of Income (Pay Stubs)', 
      description: 'Last 4-6 consecutive pay stubs for all employed household members.',
      status: 'missing', 
      linkedDoc: null 
    },
    { 
      id: 'photo_id',
      name: 'Government Issued Photo ID', 
      description: 'Valid driver\'s license or state ID for all adults.',
      status: 'missing', 
      linkedDoc: null 
    },
    { 
      id: 'benefit_letter',
      name: 'Benefit Award Letter', 
      description: 'Current award letter for Social Security, SNAP, or other benefits.',
      status: 'missing', 
      linkedDoc: null 
    },
    { 
      id: 'ssn_card',
      name: 'Social Security Cards', 
      description: 'Copies of cards for all household members.',
      status: 'missing', 
      linkedDoc: null 
    }
  ]);

  useEffect(() => {
    async function fetchDocs() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: hh } = await supabase.from('households').select('id').eq('user_id', user.id).single();
      if (!hh) return;

      const { data: docs } = await supabase.from('documents').select('*').eq('household_id', hh.id);
      if (docs && docs.length > 0) {
        const docIds = docs.map(d => d.id);
        const { data: fields } = await supabase.from('extracted_fields').select('*').in('document_id', docIds);
        
        setChecklist(prev => prev.map(item => {
          if (item.id === 'proof_income') {
            const hasIncome = fields?.find(f => f.field_name === 'gross_pay_amount');
            if (hasIncome) {
              const doc = docs.find(d => d.id === hasIncome.document_id);
              return { ...item, status: 'present', linkedDoc: doc.doc_type };
            }
          }
          if (item.id === 'benefit_letter') {
            const hasBenefit = fields?.find(f => f.field_name.includes('benefit'));
            // If we don't have explicit extracted benefits, maybe they uploaded a document with 'benefit' in the name
            const doc = docs.find(d => d.doc_type.toLowerCase().includes('benefit'));
            if (hasBenefit) {
              const bdoc = docs.find(d => d.id === hasBenefit.document_id);
              return { ...item, status: 'present', linkedDoc: bdoc.doc_type };
            } else if (doc) {
              return { ...item, status: 'present', linkedDoc: doc.doc_type };
            }
          }
          return item;
        }));
      }
      setLoading(false);
    }
    fetchDocs();
  }, [supabase]);

  const completedCount = checklist.filter(c => c.status === 'present').length;

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-accent-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-medium animate-pulse">Syncing Requirements...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body flex flex-col">
      <DashboardHeader />

      <main className="flex-1 w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          
          {/* Summary Bar */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">LIHTC Checklist</h2>
              <p className="text-slate-500 font-medium max-w-lg">
                This checklist represents the strict, non-negotiable documentation required by affordable housing programs. We flag missing items before you apply.
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shrink-0 text-center min-w-[240px] shadow-inner">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Progress</p>
              <div className="flex items-end justify-center gap-2">
                <span className="text-4xl font-extrabold text-slate-900">{completedCount}</span>
                <span className="text-xl font-bold text-slate-400 mb-1">/ {checklist.length}</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full mt-4 overflow-hidden">
                <div 
                  className="bg-accent-primary h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(completedCount / checklist.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-xl text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-slate-400 flex items-center justify-center shadow-sm border border-slate-200">
                  <ShieldCheck size={20} /> 
                </div>
                Required Documents
              </h3>
            </div>
            <div className="divide-y divide-slate-50">
              {checklist.map((item) => (
                <div key={item.id} className="p-6 md:p-8 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      {item.status === 'present' ? (
                        <div className="bg-green-50 rounded-xl p-2 border border-green-100">
                          <CheckCircle2 className="text-green-500" size={24} />
                        </div>
                      ) : (
                        <div className="bg-amber-50 rounded-xl p-2 border border-amber-100">
                          <AlertCircle className="text-amber-500" size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-800">{item.name}</h4>
                      <p className="text-sm text-slate-500 mt-1 font-medium leading-relaxed">{item.description}</p>
                      
                      {item.status === 'present' && item.linkedDoc && (
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 shadow-inner">
                          <CheckCircle2 size={12} /> Satisfied by: {item.linkedDoc}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-auto shrink-0 md:text-right">
                    {item.status === 'missing' ? (
                      <Link href="/documents" className="inline-flex w-full md:w-auto items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-slate-900/20">
                        <FileUp size={16} /> Upload Now
                      </Link>
                    ) : (
                      <span className="inline-block w-full md:w-auto text-center bg-green-50 text-green-700 font-bold py-2.5 px-6 rounded-xl border border-green-200">
                        Completed
                      </span>
                    )}
                  </div>
                  
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}
