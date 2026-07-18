"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] px-4 font-body relative overflow-hidden">
      
      {/* Premium Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-0 group relative z-0">
            <img src="https://txlbsxwuaumjsewizzzz.supabase.co/storage/v1/object/public/logo/logo.png" alt="RealDoor Logo" className="h-24 w-auto mx-auto object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all -mb-6" />
          </Link>
          <h2 className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">Welcome back</h2>
          <p className="text-slate-500 font-medium mt-2">Log in to manage your identity vault.</p>
        </div>

        {errorMsg && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 text-center">
            {errorMsg}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail size={18} className="text-slate-400" />
            </div>
            <input 
              type="email" 
              required
              placeholder="Email address"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary text-sm font-medium transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={18} className="text-slate-400" />
            </div>
            <input 
              type="password" 
              required
              placeholder="Password"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary text-sm font-medium transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50 mt-2 flex justify-center items-center gap-2 group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Secure Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-8 font-medium">
          Don't have an account? <Link href="/signup" className="text-accent-primary font-bold hover:underline">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
