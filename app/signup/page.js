"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
import { motion } from 'framer-motion';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const supabase = createClient();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    
    // Pass full_name to Supabase auth metadata
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      // Create initial consent log
      const { data: { user } } = await supabase.auth.getUser();
      if(user) {
         await supabase.from('consent_log').insert({
            user_id: user.id,
            action: 'Account Created',
            detail: 'User created account and agreed to terms'
         });
      }
      window.location.href = '/onboarding';
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] px-4 font-body relative overflow-hidden">
      
      {/* Premium Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

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
          <h2 className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">Create your profile</h2>
          <p className="text-slate-500 font-medium mt-2">Get your affordable housing packet ready.</p>
        </div>

        <div className="bg-emerald-50/50 p-4 rounded-2xl mb-8 flex items-start gap-4 border border-emerald-100/50">
          <div className="mt-1 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} />
          </div>
          <p className="text-xs text-emerald-800 font-medium leading-relaxed">
            Your data is never shared with landlords or property managers without your explicit download and consent.
          </p>
        </div>

        {errorMsg && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 text-center">
            {errorMsg}
          </motion.div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={18} className="text-slate-400" />
            </div>
            <input 
              type="text" 
              required
              placeholder="Full Name"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary text-sm font-medium transition-all"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail size={18} className="text-slate-400" />
            </div>
            <input 
              type="email" 
              required
              placeholder="Email Address"
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
              placeholder="Password (min 6 characters)"
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
              <>Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-8 font-medium">
          Already have an account? <Link href="/login" className="text-accent-primary font-bold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
