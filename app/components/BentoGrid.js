"use client";

import { motion } from "framer-motion";
import { FileSearch, ShieldCheck, Calculator, FileCheck2, Fingerprint, Lock } from "lucide-react";

export default function BentoGrid() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <section className="py-24 bg-bg-primary relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-heading mb-6">Everything you need to prepare. <br/><span className="text-gradient">Nothing you don't.</span></h2>
          <p className="text-lg text-text-body max-w-2xl mx-auto">We replace confusion with clarity. Powerful AI extraction and deterministic math combined into one seamless platform.</p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]"
        >
          {/* Feature 1: Large Span */}
          <motion.div variants={item} className="md:col-span-2 lg:col-span-2 glass rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500" />
            <div>
              <div className="w-12 h-12 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-6 text-accent-primary">
                <FileSearch size={24} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-text-heading mb-3">AI Vision Extraction</h3>
              <p className="text-text-body max-w-md text-lg">Upload pay stubs or benefit letters. Our vision models extract exactly the fields required by HUD, with zero manual entry.</p>
            </div>
            
            {/* Decorative UI inside card */}
            <div className="mt-8 bg-white/80 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">Gross Income</span>
              <span className="font-mono text-accent-dark font-bold bg-green-50 px-3 py-1 rounded-md">$4,250.00</span>
            </div>
          </motion.div>

          {/* Feature 2: Tall Span */}
          <motion.div variants={item} className="md:col-span-1 lg:col-span-2 md:row-span-2 glass-dark rounded-3xl p-8 flex flex-col relative overflow-hidden group text-white">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-accent-primary/20 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-accent-primary">
                  <Calculator size={24} />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3 text-white">Deterministic Math</h3>
                <p className="text-gray-300 text-lg mb-8">AI is great for reading, terrible at math. We use a hardened JavaScript engine to run your income against the frozen 2026 HUD MTSP limits. Zero hallucinations.</p>
              </div>

              {/* Decorative terminal */}
              <div className="bg-black/50 p-5 rounded-2xl border border-gray-700 font-mono text-sm shadow-2xl">
                <div className="flex gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <p className="text-gray-400 mb-1">$ annual_income = 51000;</p>
                <p className="text-gray-400 mb-1">$ limit = HUD_MTSP[2]; // 56400</p>
                <p className="text-accent-primary font-bold mt-3">› status: "at_or_below_threshold"</p>
              </div>
            </div>
          </motion.div>

          {/* Feature 3: Standard Box */}
          <motion.div variants={item} className="md:col-span-1 lg:col-span-1 glass rounded-3xl p-8 flex flex-col justify-between group">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
              <FileCheck2 size={24} />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-text-heading mb-3">Gold Checklist</h3>
              <p className="text-text-body">Know exactly what documents are missing before you ever talk to a property manager.</p>
            </div>
          </motion.div>

          {/* Feature 4: Standard Box */}
          <motion.div variants={item} className="md:col-span-1 lg:col-span-1 glass rounded-3xl p-8 flex flex-col justify-between group">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-text-heading mb-3">Renter-Owned</h3>
              <p className="text-text-body">Your packet belongs to you. Export a clean PDF to send to anyone, anytime.</p>
            </div>
          </motion.div>

          {/* Feature 5: Wide Bottom Span */}
          <motion.div variants={item} className="md:col-span-3 lg:col-span-4 glass rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
            <div className="md:w-1/2 z-10 mb-8 md:mb-0">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-500">
                <Lock size={24} />
              </div>
              <h3 className="font-heading text-3xl font-bold text-text-heading mb-4">Complete Data Control</h3>
              <p className="text-text-body text-lg max-w-md">Our Trust Center lets you view the entire AI prompt logic, see exactly how your data is handled, and delete everything with one click. We don't train models on your data.</p>
            </div>
            <div className="md:w-1/2 flex justify-end z-10">
              <button className="bg-red-50 text-red-600 font-bold px-8 py-4 rounded-xl border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-2 shadow-sm">
                <Fingerprint size={20} />
                Visit the Trust Center
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
