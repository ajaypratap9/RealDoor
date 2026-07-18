"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Key, Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
import DashboardHeader from '../components/DashboardHeader';
import { motion } from 'framer-motion';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    // Quick session check on mount
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = '/login';
      setLoading(false);
    };
    checkSession();
  }, [supabase]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg(null);

    // 1. Re-authenticate the user with their old password to prove identity
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setMsg("Session expired. Please log in again.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    });

    if (signInError) {
      setMsg("Incorrect current password. Please try again.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    // 2. If successful, update to the new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      setMsg(updateError.message);
      setIsError(true);
    } else {
      setMsg("Password successfully updated! Your account is secure.");
      setIsError(false);
      setOldPassword('');
      setNewPassword('');
    }
    
    setIsLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-accent-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-body flex flex-col">
      <DashboardHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="w-full max-w-md relative"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-purple-500/20 blur-3xl -z-10 rounded-full scale-150"></div>

          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden relative">
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 mx-auto flex items-center justify-center shadow-inner border border-amber-100 mb-6 relative">
                <div className="absolute inset-0 bg-amber-400/20 rounded-2xl animate-pulse"></div>
                <Lock className="text-amber-500 relative z-10" size={28} />
              </div>
              <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">Security Settings</h2>
              <p className="text-slate-500 font-medium text-sm mt-3 flex items-center justify-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-500" /> End-to-end encrypted update
              </p>
            </div>

            {msg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`p-4 rounded-xl text-sm font-bold mb-6 border ${isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} flex items-start gap-3`}
              >
                {msg}
              </motion.div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="password" 
                    required
                    placeholder="Enter old password"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all bg-slate-50 hover:bg-white font-medium text-slate-800"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="password" 
                    required
                    minLength="6"
                    placeholder="Minimum 6 characters"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all bg-slate-50 hover:bg-white font-medium text-slate-800"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading || !oldPassword || !newPassword}
                  className="w-full bg-[#1A1A1A] text-white font-bold py-4 rounded-xl hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-lg shadow-black/10 hover:-translate-y-0.5 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                  <span className="relative z-10">{isLoading ? "Updating Vault..." : "Update Password"}</span>
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors">
                <ArrowLeft size={16} /> Return to Mission Control
              </Link>
            </div>
            
          </div>
        </motion.div>
      </main>
    </div>
  );
}
