import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 mt-auto relative z-10 text-white font-body rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
      
      {/* Background ambient light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-[3rem]">
        <div className="absolute -top-[20%] left-[20%] w-[60%] h-[60%] bg-accent-primary/20 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 max-w-[1400px] relative z-10">
        
        {/* Massive Creative CTA Section */}
        <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-10 pb-16 border-b border-slate-700/50">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-extrabold font-heading text-white tracking-tight leading-[1.05] mb-6">
              Ready to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-emerald-300">take control?</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium">Stop guessing. Start knowing. Join the platform built to democratize affordable housing.</p>
          </div>
          <Link href="/signup" className="group relative inline-flex items-center justify-center gap-3 bg-white text-slate-900 text-xl font-bold px-10 py-6 rounded-3xl hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
            <Sparkles size={24} className="text-accent-primary" />
            Get Started Free
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 mb-20">
          
          {/* Brand Column (No Logo Image as requested) */}
          <div className="col-span-2 md:col-span-5 pr-0 md:pr-12">
            <Link href="/" className="font-heading text-4xl font-extrabold text-white inline-block mb-6 tracking-tighter hover:text-accent-primary transition-colors">
              RealDoor.
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed mb-10 max-w-sm text-lg">
              An application-readiness copilot engineered to reduce friction in affordable housing. 
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all border border-slate-700 hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all border border-slate-700 hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
              </a>
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-heading text-white font-bold text-sm uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/how-it-works" className="text-slate-400 font-medium hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="/login" className="text-slate-400 font-medium hover:text-white transition-colors">Identity Vault</Link></li>
              <li><Link href="/discover" className="text-slate-400 font-medium hover:text-white transition-colors">Property Explorer</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-heading text-white font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-slate-400 font-medium hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link href="/contact" className="text-slate-400 font-medium hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-3">
            <h4 className="font-heading text-white font-bold text-sm uppercase tracking-widest mb-6">Legal & Trust</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy-policy" className="text-slate-400 font-medium hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-slate-400 font-medium hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/trust-center" className="text-slate-400 font-medium hover:text-white transition-colors">Trust Center</Link></li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Bar: Hack-Nation Credit */}
        <div className="border-t border-slate-700/50 pt-8 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            <p className="text-slate-500 font-medium text-sm text-center md:text-left">
              © {new Date().getFullYear()} RealDoor Inc. Not affiliated with HUD.
            </p>

            <div className="flex items-center gap-4 bg-slate-800/50 px-6 py-3 rounded-full border border-slate-700 backdrop-blur-md">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Architected For</span>
              <div className="w-px h-4 bg-slate-600"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-heading font-extrabold text-slate-200">Hack-Nation</span>
                <span className="text-accent-primary text-xs">×</span>
                <span className="text-sm font-heading font-extrabold text-slate-200">RealPage</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
