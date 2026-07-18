"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Calculator, Send, Info, ChevronRight, FileCheck, HelpCircle } from 'lucide-react';
import { computeIncomeEligibility } from '../../lib/calculator';
import { createClient } from '../../lib/supabase/client';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } } };

export default function RulesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isAsking, setIsAsking] = useState(false);

  const [householdSize, setHouseholdSize] = useState(1);
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState(0);

  useEffect(() => {
    async function fetchRulesData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: hh } = await supabase.from('households').select('id, household_size').eq('user_id', user.id).single();
      if (hh) {
        setHouseholdSize(hh.household_size || 1);
        
        const { data: docs } = await supabase.from('documents').select('id').eq('household_id', hh.id);
        if (docs && docs.length > 0) {
          const docIds = docs.map(d => d.id);
          const { data: fields } = await supabase.from('extracted_fields')
            .select('value')
            .in('document_id', docIds)
            .eq('field_name', 'gross_pay_amount')
            .eq('confirmed', true);
            
          if (fields) {
            const monthly = fields.reduce((sum, f) => sum + parseFloat(f.value || 0), 0);
            setGrossMonthlyIncome(monthly);
          }
        }
      }
      setLoading(false);
    }
    fetchRulesData();
  }, [supabase]);
  
  const calcResult = computeIncomeEligibility(householdSize, grossMonthlyIncome, 'monthly');

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-accent-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Rules Engine...</p>
    </div>
  );

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsAsking(true);
    // Optimistic UI
    const newChat = { role: 'user', content: question };
    setChatHistory(prev => [...prev, newChat]);
    setQuestion('');

    try {
      const response = await fetch('/api/ask-rule', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ 
          question: newChat.content,
          householdProfile: { size: householdSize, income: grossMonthlyIncome },
          precomputedResult: calcResult
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: data.answer.answer_plain_language,
          citation: data.answer.citation,
          evidence_type: data.answer.evidence_type
        }]);
      } else {
        throw new Error('API Error');
      }
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error checking the rules.', evidence_type: 'error' }]);
    }
    setIsAsking(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/profile" className="text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors flex items-center gap-2">
              ← Back to Profile
            </Link>
            <h1 className="font-heading font-bold text-lg text-slate-800">Rules & Eligibility Engine</h1>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Deterministic Calculator */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-[0_20px_50px_rgb(0,0,0,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/20 blur-[80px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 blur-[60px] rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm shadow-inner">
                    <Calculator size={24} className="text-accent-primary" />
                  </div>
                  <h2 className="font-extrabold text-2xl font-heading tracking-tight">Deterministic Math</h2>
                </div>
                
                <p className="text-slate-400 font-medium text-sm mb-10 leading-relaxed max-w-sm">
                  This calculation is executed by standard mathematical logic against the frozen HUD dataset, never hallucinated by an LLM.
                </p>

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800/60">
                    <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Annualized Income</span>
                    <span className="font-mono font-bold text-xl">${calcResult.annual_income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800/60">
                    <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">HUD MTSP (60% AMI)</span>
                    <span className="font-mono font-bold text-xl">${calcResult.threshold.toLocaleString()}</span>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border backdrop-blur-md ${calcResult.result === 'at_or_below_threshold' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} flex items-center gap-4 mb-6`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${calcResult.result === 'at_or_below_threshold' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider mb-1 opacity-80">Eligibility Status</p>
                    <p className="text-lg font-bold leading-tight">{calcResult.result === 'at_or_below_threshold' ? 'Income meets program criteria' : 'Income exceeds program limits'}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex flex-col gap-2 font-medium bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                  <span className="flex items-center gap-2"><Info size={14}/> Formula: <span className="font-mono text-slate-400">{calcResult.formula}</span></span>
                  <span className="flex items-center gap-2"><Info size={14}/> Effective Date: <span className="font-mono text-slate-400">{calcResult.effective_date}</span></span>
                </div>
              </div>
            </div>

            <button className="w-full bg-white border border-slate-200 text-slate-800 font-bold py-4.5 rounded-2xl shadow-sm hover:border-accent-primary hover:shadow-md transition-all flex justify-between items-center px-6 group">
              <span className="flex items-center gap-3"><FileCheck size={20} className="text-accent-primary group-hover:scale-110 transition-transform" /> Save calculation to packet</span>
              <ChevronRight size={20} className="text-slate-400 group-hover:text-accent-primary transition-colors" />
            </button>
          </motion.div>

          {/* Right Column - Rules Q&A Chat */}
          <motion.div variants={itemVariants} className="lg:col-span-7 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-[800px] overflow-hidden">
            
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-extrabold text-2xl text-slate-900 mb-2 tracking-tight">Ask a Rule Question</h2>
              <p className="font-medium text-slate-500">I will explain the rules using strict citations from the HUD Manual. I cannot approve your application or bend the rules.</p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-white scroll-smooth">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                    <HelpCircle size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">How can I help?</h3>
                  <p className="text-slate-500 font-medium max-w-sm">Ask about income limits, required documents, or household definitions for your target metro.</p>
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-3xl p-5 md:p-6 ${msg.role === 'user' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 rounded-br-sm' : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-bl-sm'}`}>
                      <p className="text-sm md:text-base leading-relaxed font-medium">{msg.content}</p>
                      
                      {/* Citation block for AI */}
                      {msg.role === 'assistant' && msg.citation && (
                        <div className={`mt-4 pt-4 border-t ${msg.role === 'user' ? 'border-slate-700' : 'border-slate-200'}`}>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Citation</p>
                          <p className="text-xs text-slate-600 font-semibold">Source: {msg.citation.source} (Effective: {msg.citation.effective_date})</p>
                        </div>
                      )}
                      
                      {msg.evidence_type === 'no_call' && (
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-200/50 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-200">
                          <Info size={14} /> No rules match
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isAsking && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl rounded-bl-sm p-6 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 animate-bounce"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500 animate-bounce" style={{animationDelay: '300ms'}}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100">
              <form onSubmit={handleAsk} className="relative flex items-center group">
                <input 
                  type="text" 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What's the income limit for my household size?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary text-sm font-medium transition-all shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={!question.trim() || isAsking}
                  className="absolute right-2 w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-50 shadow-md group-focus-within:bg-accent-primary group-focus-within:hover:bg-accent-dark"
                >
                  <Send size={18} />
                </button>
              </form>
              
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                <button onClick={() => setQuestion("Does my SNAP benefit count as income?")} className="shrink-0 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:border-accent-primary hover:text-accent-primary transition-colors shadow-sm">
                  Does my SNAP benefit count as income?
                </button>
                <button onClick={() => setQuestion("Am I eligible?")} className="shrink-0 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:border-accent-primary hover:text-accent-primary transition-colors shadow-sm">
                  Am I eligible? (Test No-Call)
                </button>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
