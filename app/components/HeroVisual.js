"use client";

import { motion } from "framer-motion";
import { FileText, CheckCircle2, ScanLine, ShieldCheck } from "lucide-react";

export default function HeroVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center [perspective:1000px] mt-12 lg:mt-0">
      
      {/* Central glowing orb */}
      <div className="absolute w-72 h-72 bg-accent-primary/20 rounded-full blur-[100px] animate-pulse" />
      
      {/* Main Abstract Dashboard/Document */}
      <motion.div 
        initial={{ rotateX: 20, rotateY: -15, opacity: 0, y: 50 }}
        animate={{ rotateX: 0, rotateY: 0, opacity: 1, y: 0 }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
        className="relative w-full max-w-sm aspect-[4/5] bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-2xl shadow-accent-primary/10 p-6 md:p-8 overflow-hidden flex flex-col z-20"
      >
        {/* Mock Document Header */}
        <div className="flex items-center gap-4 mb-8 pb-5 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner">
            <FileText size={24} />
          </div>
          <div>
            <div className="h-3 w-32 bg-gray-200 rounded-full mb-3" />
            <div className="h-2 w-20 bg-gray-100 rounded-full" />
          </div>
        </div>

        {/* Extraction Rows */}
        <div className="space-y-4 flex-1">
          <ExtractionRow label="Gross Income" value="$4,250.00" delay={0.8} />
          <ExtractionRow label="Employer" value="Acme Corp" delay={1.2} />
          <ExtractionRow label="Pay Period" value="Bi-weekly" delay={1.6} />
        </div>

        {/* AI Scanning Beam */}
        <motion.div 
          animate={{ top: ["-10%", "110%", "-10%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-1 bg-accent-primary shadow-[0_0_20px_rgba(16,185,129,0.8)] z-30"
        />
        
        {/* AI Overlay indicator */}
        <div className="absolute bottom-6 right-6 bg-accent-primary/10 text-accent-dark px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-accent-primary/20">
          <ScanLine size={14} className="animate-pulse" /> Processing...
        </div>
      </motion.div>

      {/* Floating Elements connected to the pipeline */}
      
      {/* 1. HUD MTSP Rules Engine */}
      <motion.div 
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-2 md:-right-8 top-1/4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 z-30 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100">
          <ShieldCheck size={24} />
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">HUD MTSP 2026</p>
          <p className="text-sm font-bold text-gray-800">Verified Eligible</p>
        </div>
      </motion.div>

      {/* 2. Success Status */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -left-2 md:-left-12 bottom-1/4 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-gray-100 z-30 flex items-center gap-3"
      >
        <div className="relative flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-30"></span>
          <CheckCircle2 size={20} className="relative text-accent-primary" />
        </div>
        <span className="text-sm font-bold text-gray-800">Packet Ready</span>
      </motion.div>

    </div>
  );
}

function ExtractionRow({ label, value, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay, duration: 0.6, type: "spring", bounce: 0.4 }}
      className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-100"
    >
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      <span className="text-sm font-mono font-bold text-accent-dark bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 shadow-sm">{value}</span>
    </motion.div>
  )
}
