"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center z-50 relative">
        <Link href="/" className="font-heading text-2xl font-extrabold text-slate-900 flex items-center gap-0 group relative z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://txlbsxwuaumjsewizzzz.supabase.co/storage/v1/object/public/logo/logo.png" alt="RealDoor Logo" className="w-24 h-24 object-contain -my-6 -mr-4 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all relative z-10" />
          <span className="relative z-20">RealDoor</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center text-sm font-bold text-slate-600">
          <Link href="/how-it-works" className="hover:text-accent-primary transition-colors">How it Works</Link>
          <Link href="/about" className="hover:text-accent-primary transition-colors">About Us</Link>
          <Link href="/login" className="hover:text-accent-primary transition-colors">Log in</Link>
          <Link href="/signup" className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">Start for free</Link>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none relative z-50"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-xl border-b border-slate-200/50 z-40 md:hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-6 font-bold text-lg text-slate-700">
              <Link href="/how-it-works" onClick={() => setIsOpen(false)} className="hover:text-accent-primary transition-colors pb-4 border-b border-slate-100">How it Works</Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-accent-primary transition-colors pb-4 border-b border-slate-100">About Us</Link>
              <Link href="/login" onClick={() => setIsOpen(false)} className="hover:text-accent-primary transition-colors pb-4 border-b border-slate-100">Log in</Link>
              <Link href="/signup" onClick={() => setIsOpen(false)} className="bg-slate-900 text-white px-6 py-4 rounded-xl text-center shadow-md active:scale-95 transition-transform">Start for free</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
