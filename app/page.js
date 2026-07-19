"use client";

import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, CheckCircle2, ShieldAlert, Sparkles, Building, Briefcase, ChevronRight, Calculator, FileSearch, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-body selection:bg-accent-primary/20 overflow-x-hidden">
      
      {/* Premium Navbar - Reduced Height */}
      <Header />

      <main className="flex-1 w-full relative z-10">
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-2 pb-16 lg:pt-6 lg:pb-32 overflow-hidden">
          {/* Ambient Background Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
              
              {/* Hero Copy */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left z-10"
              >
                <div className="inline-flex items-center justify-center lg:justify-start gap-2 border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold tracking-wide mb-8 mx-auto lg:mx-0 shadow-sm w-max">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  The #1 Copilot for Renters
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-[72px] leading-[1.05] font-extrabold font-heading text-slate-900 mb-6 tracking-tight">
                  Stop guessing.<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">Start knowing.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Applying for affordable housing shouldn't require a law degree. RealDoor reads your documents, computes the HUD limits, and builds your application dossier automatically. <strong>You decide, we assist.</strong>
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Link href="/signup" className="w-full sm:w-auto bg-slate-900 text-white text-center px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-900/20 hover:-translate-y-1 flex items-center justify-center gap-2 group">
                    <Sparkles size={18} className="text-accent-primary" />
                    Build Your Dossier
                  </Link>
                  <Link href="/how-it-works" className="w-full sm:w-auto bg-white text-slate-800 border border-slate-200 text-center px-8 py-4 rounded-xl font-bold hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 shadow-sm flex items-center justify-center gap-2">
                    How it works <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>

              {/* Hero Visual */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full lg:w-1/2 relative z-10 mt-10 lg:mt-0"
              >
                <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/20 to-blue-500/20 rounded-full blur-3xl opacity-60"></div>
                  
                  <svg viewBox="0 0 500 500" className="w-full h-full relative z-10" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.9" />
                      </linearGradient>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#334155" />
                      </linearGradient>
                      <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="15" stdDeviation="20" floodColor="#000000" floodOpacity="0.1" />
                      </filter>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <motion.g 
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      filter="url(#glass)"
                    >
                      <rect x="40" y="60" width="420" height="340" rx="16" fill="url(#bgGrad)" stroke="#e2e8f0" strokeWidth="2" />
                      
                      <circle cx="60" cy="80" r="4" fill="#ef4444" />
                      <circle cx="75" cy="80" r="4" fill="#eab308" />
                      <circle cx="90" cy="80" r="4" fill="#22c55e" />
                      <line x1="40" y1="100" x2="460" y2="100" stroke="#e2e8f0" strokeWidth="1" />
                      
                      <text x="60" y="130" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#0f172a">Compliance Overview</text>
                      <text x="60" y="150" fontFamily="sans-serif" fontSize="10" fill="#64748b">Real-time LIHTC Eligibility Metrics</text>

                      <rect x="60" y="180" width="180" height="120" rx="8" fill="#ffffff" stroke="#f1f5f9" strokeWidth="2" />
                      <text x="75" y="205" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#334155">Income vs Limit</text>
                      
                      <rect x="75" y="220" width="150" height="12" rx="6" fill="#e2e8f0" />
                      <rect x="75" y="220" width="150" height="12" rx="6" fill="#94a3b8" opacity="0.3" />
                      
                      <motion.rect 
                        x="75" y="245" height="12" rx="6" fill="url(#accentGrad)"
                        initial={{ width: 0 }}
                        animate={{ width: 110 }}
                        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                      />
                      <motion.text 
                        x="75" y="275" fontFamily="sans-serif" fontSize="10" fill="#10b981" fontWeight="bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >Below 60% AMI Threshold</motion.text>

                      <rect x="260" y="180" width="140" height="120" rx="8" fill="#ffffff" stroke="#f1f5f9" strokeWidth="2" />
                      <text x="330" y="205" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#334155" textAnchor="middle">Data Confidence</text>
                      
                      <circle cx="330" cy="250" r="30" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                      <motion.circle 
                        cx="330" cy="250" r="30" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round"
                        strokeDasharray="188.5"
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 18.85 }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                        transform="rotate(-90 330 250)"
                      />
                      <motion.text 
                        x="330" y="254" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#0f172a" textAnchor="middle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >99%</motion.text>

                      <rect x="60" y="320" width="340" height="60" rx="8" fill="#ffffff" stroke="#f1f5f9" strokeWidth="2" />
                      <motion.path 
                        d="M 60 380 L 60 360 C 100 360, 150 330, 200 350 C 250 370, 300 320, 350 340 C 380 350, 400 330, 400 330 L 400 380 Z" 
                        fill="url(#chartGrad)"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                        style={{ clipPath: "inset(0 0 0 0 round 0 0 8px 8px)" }}
                      />
                      <motion.path 
                        d="M 60 360 C 100 360, 150 330, 200 350 C 250 370, 300 320, 350 340 C 380 350, 400 330, 400 330" 
                        fill="none" stroke="#10b981" strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                      />
                    </motion.g>

                    <motion.g 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
                      transition={{ opacity: { delay: 1.8 }, x: { delay: 1.8 }, y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
                      filter="url(#glass)"
                    >
                      <rect x="20" y="30" width="130" height="40" rx="20" fill="#0f172a" />
                      <circle cx="40" cy="50" r="8" fill="#10b981" filter="url(#glow)" />
                      <text x="55" y="54" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#ffffff">Verified Stub</text>
                    </motion.g>

                    <motion.g 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0, y: [0, 5, 0] }}
                      transition={{ opacity: { delay: 2.1 }, x: { delay: 2.1 }, y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" } }}
                      filter="url(#glass)"
                    >
                      <rect x="340" y="390" width="150" height="40" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                      <text x="355" y="414" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#0f172a">Annual: $42,500</text>
                      <circle cx="470" cy="410" r="12" fill="#dbeafe" />
                      <path d="M 466 410 L 469 413 L 474 407" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    </motion.g>
                  </svg>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ================= PROBLEM VS SOLUTION ================= */}
        <section className="py-20 bg-white border-y border-slate-100 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-slate-900 mb-4">Why we built RealDoor</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                The affordable housing process is broken. Renters are punished for bureaucratic complexity. We fix the preparation layer.
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8 lg:gap-12"
            >
              {/* Problem */}
              <motion.div variants={itemVariants} className="bg-slate-50 rounded-3xl p-8 md:p-10 border border-slate-200">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6">
                  <ShieldAlert size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">The Old Way (Painful)</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold mt-1 text-lg">✕</span>
                    <p className="text-slate-600 font-medium">Gathering sensitive documents without knowing exactly what is needed.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold mt-1 text-lg">✕</span>
                    <p className="text-slate-600 font-medium">Trying to decipher complex HUD Income limits (AMI) using outdated PDFs.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold mt-1 text-lg">✕</span>
                    <p className="text-slate-600 font-medium">Getting rejected weeks later due to a single missing signature or miscalculated stub.</p>
                  </li>
                </ul>
              </motion.div>

              {/* Solution */}
              <motion.div variants={itemVariants} className="bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-800 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CgkJPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPgoJPC9zdmc+')] opacity-50"></div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute -top-32 -right-32 w-64 h-64 bg-accent-primary/10 blur-[50px] rounded-full pointer-events-none"
                />
                
                <div className="w-12 h-12 bg-accent-primary/20 border border-accent-primary/30 rounded-xl flex items-center justify-center text-accent-primary mb-6 relative z-10 group-hover:scale-110 transition-transform">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">The RealDoor Way (Smart)</h3>
                <ul className="space-y-4 relative z-10">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-accent-primary shrink-0 mt-0.5" />
                    <p className="text-slate-300 font-medium">Instantly extract data using private, on-device AI models. No data leaks.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-accent-primary shrink-0 mt-0.5" />
                    <p className="text-slate-300 font-medium">Automatically compute eligibility using deterministic math against real-time HUD MTSP tables.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-accent-primary shrink-0 mt-0.5" />
                    <p className="text-slate-300 font-medium">Generate a perfect Application Dossier that property managers can instantly verify.</p>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ================= BENTO GRID FEATURES ================= */}
        <section className="py-20 lg:py-32 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-slate-900 mb-6">Enterprise-grade tools.<br/> Built for the renter.</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">We brought property-management-level technology to the renter's side of the table, focusing heavily on privacy and transparency.</p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
            >
              
              {/* Box 1 (Large) */}
              <motion.div variants={itemVariants} className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden relative group hover:shadow-lg transition-all duration-300">
                {/* SVG Abstract Art Background */}
                <svg className="absolute inset-0 w-full h-full text-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform scale-150 group-hover:scale-100" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0,50 Q25,0 50,50 T100,50 L100,100 L0,100 Z" />
                </svg>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[50px] rounded-full group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <FileSearch size={24} />
                    </div>
                    <h3 className="text-2xl font-bold font-heading text-slate-900 mb-2">Automated Vision Extraction</h3>
                    <p className="text-slate-500 font-medium max-w-md">Upload messy PDFs or phone pictures of pay stubs. Our AI isolates the numbers needed for compliance, ignoring the noise.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">OCR Tech</span>
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">LLM Parsed</span>
                  </div>
                </div>
              </motion.div>

              {/* Box 2 (Small) */}
              <motion.div variants={itemVariants} className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl overflow-hidden relative group hover:shadow-2xl transition-all duration-300">
                {/* SVG Concentric Circles */}
                <svg className="absolute -bottom-10 -right-10 w-48 h-48 text-accent-primary/10 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 pointer-events-none" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-accent-primary/20 text-accent-primary border border-accent-primary/30 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                      <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-2xl font-bold font-heading text-white mb-2">Zero Retention</h3>
                    <p className="text-slate-400 font-medium">Your documents are processed ephemerally. We do not build profiles to sell to landlords.</p>
                  </div>
                </div>
              </motion.div>

              {/* Box 3 (Small) */}
              <motion.div variants={itemVariants} className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 shadow-sm overflow-hidden relative group hover:shadow-md transition-all duration-300">
                {/* SVG Grid Art */}
                <svg className="absolute inset-0 w-full h-full text-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white text-emerald-600 flex items-center justify-center mb-6 shadow-sm group-hover:-translate-y-1 transition-transform">
                      <Calculator size={24} />
                    </div>
                    <h3 className="text-2xl font-bold font-heading text-emerald-900 mb-2">Transparent Math</h3>
                    <p className="text-emerald-700/80 font-medium">We show the exact HUD formulas used. No black-box AI decisions.</p>
                  </div>
                </div>
              </motion.div>

              {/* Box 4 (Large) */}
              <motion.div variants={itemVariants} className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden relative group hover:shadow-lg transition-all duration-300">
                {/* SVG Abstract Waves */}
                <svg className="absolute bottom-0 left-0 w-full text-purple-500/5 group-hover:text-purple-500/10 transition-colors duration-700 pointer-events-none transform translate-y-4 group-hover:translate-y-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
                  <path fill="currentColor" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,208C384,192,480,128,576,133.3C672,139,768,213,864,229.3C960,245,1056,203,1152,181.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[50px] rounded-full group-hover:bg-purple-500/10 transition-colors"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                      <FileText size={24} />
                    </div>
                    <h3 className="text-2xl font-bold font-heading text-slate-900 mb-2">The Dossier Generator</h3>
                    <p className="text-slate-500 font-medium max-w-md">Click one button to compile a beautifully formatted PDF containing a cover letter, verified income calculations, and all attached evidence.</p>
                  </div>
                  <div>
                    <Link href="/how-it-works" className="inline-flex items-center gap-1 text-purple-600 font-bold hover:text-purple-700">
                      Learn how it works <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  )
}
