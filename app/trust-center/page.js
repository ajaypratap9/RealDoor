import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, Lock, EyeOff, Server, FileCheck, CheckCircle2 } from 'lucide-react';

export default function TrustCenter() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-body selection:bg-accent-primary/20">
      
      {/* Premium Minimal Navbar */}
      <Header />

      <main className="flex-1 w-full relative z-10 py-16 lg:py-24">
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[0%] left-[10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full"></div>
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-accent-primary/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-slate-200 bg-white/80 text-slate-700 px-4 py-2 rounded-full text-xs font-bold tracking-wide mb-6 backdrop-blur-md shadow-sm">
              <Shield size={14} className="text-emerald-600" />
              Security & Trust Center
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Engineered for <span className="text-emerald-600 relative inline-block">Absolute Privacy.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
              RealDoor was built to process highly sensitive financial data safely. Transparency and zero-trust architecture are at the core of our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* Trust Pillar 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">Data Encryption</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">
                All data, including uploaded pay stubs and tax documents, is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We utilize enterprise-grade Supabase infrastructure for isolated storage.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-accent-primary" /> End-to-end TLS encryption
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-accent-primary" /> Row Level Security (RLS) policies
                </li>
              </ul>
            </div>

            {/* Trust Pillar 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100">
                <EyeOff size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">Zero Data Sharing</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">
                RealDoor acts as an isolated preparation sandbox. We do not automatically forward, sell, or share your data with landlords, property management companies (PMCs), or credit bureaus without your explicit download action.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-accent-primary" /> Renter-controlled dossier generation
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-accent-primary" /> No unauthorized third-party access
                </li>
              </ul>
            </div>
            
            {/* Trust Pillar 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 border border-purple-100">
                <Server size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">Ephemeral Document Processing</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">
                When you upload a document, our vision-LLM extracts only the required numerical data (e.g., Gross Income, Date). You have the ability to permanently delete raw file assets from our servers at any time.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-accent-primary" /> Hard delete capabilities
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-accent-primary" /> Minimal extraction philosophy
                </li>
              </ul>
            </div>
            
            {/* Trust Pillar 4 */}
            <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/20 blur-[50px] rounded-full pointer-events-none"></div>
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center mb-6 border border-slate-700 relative z-10">
                <FileCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-heading relative z-10">Transparent AI Engine</h3>
              <p className="text-slate-400 font-medium leading-relaxed mb-6 relative z-10">
                We believe AI should not be a black box, especially for housing. Our compliance rules engine explicitly cites the exact HUD MTSP tables and math formulas used to calculate your eligibility range.
              </p>
              <ul className="space-y-3 relative z-10">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                  <CheckCircle2 size={16} className="text-accent-primary" /> Deterministic mathematical logic
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                  <CheckCircle2 size={16} className="text-accent-primary" /> Explicit source citations
                </li>
              </ul>
            </div>

          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
            <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4">Have security concerns?</h3>
            <p className="text-slate-500 font-medium mb-6 max-w-lg mx-auto">
              If you have found a vulnerability or have specific questions regarding our data compliance, please reach out to our security team.
            </p>
            <a href="mailto:ajaysingh91400@gmail.com" className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
              Contact Security Team
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
