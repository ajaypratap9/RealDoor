"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, ChevronDown, Settings, LogOut, Menu, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '../../lib/supabase/client';

export default function DashboardHeader() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
      }
    };
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleResetPassword = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email) {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) {
        alert('Error sending reset link: ' + error.message);
      } else {
        alert('Password reset link has been sent to your email.');
      }
      setDropdownOpen(false);
    }
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Checklist', path: '/checklist' },
    { name: 'Documents', path: '/documents' }
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and Desktop Nav */}
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-0 group relative z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://txlbsxwuaumjsewizzzz.supabase.co/storage/v1/object/public/logo/logo.png" alt="RealDoor" className="w-24 h-24 object-contain -my-6 -mr-4 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all relative z-10" />
                <span className="font-heading text-xl font-extrabold text-slate-900 relative z-20">RealDoor</span>
              </Link>
              
              <div className="hidden md:flex space-x-1">
                {navItems.map((item, i) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link key={i} href={item.path} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Side Tools */}
            <div className="flex items-center gap-4">
              
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full border border-slate-200 transition-colors"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              <div className="relative hidden sm:block" ref={notificationsRef}>
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full border border-slate-200 transition-colors relative"
                >
                  <Bell size={18} />
                </button>
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">0 New</span>
                      </div>
                      <div className="p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                          <Bell className="text-slate-300" size={20} />
                        </div>
                        <p className="font-bold text-slate-700">No new notifications</p>
                        <p className="text-sm text-slate-500 mt-1">You're all caught up!</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all bg-white shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-accent-primary to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    {userName ? userName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 hidden sm:block">{userName}</span>
                  <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                        <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{userName}</p>
                      </div>
                      <div className="p-2">
                        <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-accent-primary transition-colors">
                          <Settings size={16} /> Account Settings
                        </Link>
                        <Link href="/change-password" onClick={() => setDropdownOpen(false)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors text-left mt-1">
                          <Lock size={16} /> Reset Password
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left mt-1">
                          <LogOut size={16} /> Secure Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-200/60 bg-white shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, i) => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={i} 
                    href={item.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 ${isActive ? 'bg-accent-primary/10 text-accent-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
