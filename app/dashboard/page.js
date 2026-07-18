"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardHeader from '../components/DashboardHeader';
import { motion } from 'framer-motion';
import { 
  FileText, CheckCircle2, UploadCloud, 
  Settings, Activity, ArrowRight, ShieldCheck, 
  Map, UserCircle, Calculator, FileCheck2, Lightbulb
} from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
};

export default function Dashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [docCount, setDocCount] = useState(0);
  const [hasConfirmedProfile, setHasConfirmedProfile] = useState(false);
  const [hasConfirmedDocs, setHasConfirmedDocs] = useState(false);
  const [userName, setUserName] = useState('');
  const [readinessScore, setReadinessScore] = useState(0);

  useEffect(() => {
    async function loadDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUserName(user.user_metadata?.name || user.user_metadata?.full_name || user.email.split('@')[0]);

      const { data: hh } = await supabase.from('households').select('*').eq('user_id', user.id).single();
      
      let dCount = 0;
      let score = 15; // Base score for account creation
      
      if (hh) {
        score += 20; // Completed profile
        setHasConfirmedProfile(true); 

        const { count, data: docs } = await supabase.from('documents').select('id, status', { count: 'exact' }).eq('household_id', hh.id);
        
        dCount = count || 0;
        setDocCount(dCount);
        
        if (dCount > 0) score += 25; // Uploaded docs
        
        const hasConfirmed = docs && docs.some(d => d.status === 'confirmed');
        setHasConfirmedDocs(hasConfirmed); 
        
        if (hasConfirmed) score += 40; // Confirmed docs (max 100)
      }

      setReadinessScore(score);
      setLoading(false);
    }
    loadDashboardData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
        <DashboardHeader />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-accent-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium tracking-wide animate-pulse">Initializing Workspace...</p>
        </div>
      </div>
    );
  }

  const overviewCards = [
    {
      title: "Preparation Checklist",
      desc: "Understand exactly what documents you need before you start. Clear up the confusion of affordable housing.",
      icon: <FileCheck2 size={28} className="text-blue-600" />,
      bg: "bg-blue-50",
      border: "border-blue-100",
      path: "/checklist",
      action: "View Checklist"
    },
    {
      title: "Document Pipeline",
      desc: "Upload your pay stubs, award letters, and bank statements. Our secure AI extracts the math automatically.",
      icon: <UploadCloud size={28} className="text-emerald-600" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      path: "/documents",
      action: "Upload Documents"
    },
    {
      title: "Identity Profile",
      desc: "Review and explicitly confirm the AI's data extraction. You have total control over your digital identity.",
      icon: <UserCircle size={28} className="text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      path: "/profile",
      action: "Verify Identity"
    },
    {
      title: "Rules Engine",
      desc: "Run a deterministic math check against 2026 HUD limits for your selected Metro Area to see if you qualify.",
      icon: <Calculator size={28} className="text-amber-600" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      path: "/understand",
      action: "Check Eligibility"
    },
    {
      title: "Export Packet",
      desc: "Generate a beautifully formatted, mathematically proven PDF dossier to hand to your property manager.",
      icon: <FileText size={28} className="text-red-600" />,
      bg: "bg-red-50",
      border: "border-red-100",
      path: "/packet",
      action: "Generate PDF"
    },
    {
      title: "Property Discovery",
      desc: "Search an unfiltered, transparent database of HUD LIHTC properties in your target metropolitan area.",
      icon: <Map size={28} className="text-purple-600" />,
      bg: "bg-purple-50",
      border: "border-purple-100",
      path: "/discover",
      action: "Find Housing"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-body selection:bg-accent-primary/20">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-10">
          
          {/* Header Section */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-2">
                Mission Control
              </h1>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-500" /> End-to-end encrypted session for {userName.split(' ')[0]}.
              </p>
            </div>
            <Link href="/packet" className="group flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-black/20 hover:bg-black hover:-translate-y-0.5 transition-all">
              Generate PDF Packet <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Readiness Tracker */}
          <motion.div variants={itemVariants} className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#1A1A1A] text-lg flex items-center gap-2"><Lightbulb size={20} className="text-amber-500"/> Readiness Progress</h3>
              <span className="text-sm font-bold text-accent-primary bg-accent-primary/10 px-4 py-1.5 rounded-full">{readinessScore}% Ready</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-8">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${readinessScore}%` }} 
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-accent-primary to-purple-500 rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </motion.div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Create Account', desc: 'Securely registered', done: true },
                { label: 'Set Up Profile', desc: 'Metro Area saved', done: hasConfirmedProfile },
                { label: 'Upload Documents', desc: `${docCount} files processed`, done: docCount > 0 },
                { label: 'Verify AI Data', desc: 'Math is locked in', done: hasConfirmedDocs }
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col text-left gap-2 relative">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-colors shadow-inner ${step.done ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                    {step.done ? <CheckCircle2 size={18} /> : idx + 1}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${step.done ? 'text-slate-800' : 'text-slate-500'}`}>{step.label}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Module Overview Grid */}
          <div>
            <motion.h3 variants={itemVariants} className="text-xl font-bold text-[#1A1A1A] mb-6">Platform Modules</motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {overviewCards.map((card, idx) => (
                <motion.div key={idx} variants={itemVariants} className="group bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 hover:border-accent-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-[100px] -z-0"></div>
                  
                  <div className={`w-14 h-14 rounded-2xl ${card.bg} border ${card.border} flex items-center justify-center mb-6 shadow-inner relative z-10 group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  
                  <h4 className="text-lg font-bold text-[#1A1A1A] mb-3 relative z-10">{card.title}</h4>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 flex-1 relative z-10">
                    {card.desc}
                  </p>
                  
                  <Link href={card.path} className="inline-flex items-center gap-2 text-sm font-bold text-accent-primary hover:text-accent-dark transition-colors mt-auto relative z-10 w-fit">
                    {card.action} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          
        </motion.div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
