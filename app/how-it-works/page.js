import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileSearch, ShieldAlert, FileCheck, ArrowRight, LayoutDashboard, BrainCircuit } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-body selection:bg-accent-primary/20">
      
      {/* Premium Minimal Navbar */}
      <Header />

      <main className="flex-1 w-full relative z-10 py-16 lg:py-24">
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-accent-primary/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-slate-200 bg-white/80 text-slate-600 px-4 py-2 rounded-full text-xs font-bold tracking-wide mb-6 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
              The Engineering Behind RealDoor
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 tracking-tight mb-6 leading-[1.1]">
              How the <span className="text-accent-primary relative inline-block">Copilot works.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
              We engineered a system that helps you securely gather, organize, and understand the requirements for affordable housing applications. We deliver absolute clarity; the housing professional makes the final decision.
            </p>
          </div>

          <div className="space-y-16 md:space-y-32 relative">
            
            {/* Connecting vertical line (desktop) */}
            <div className="hidden md:block absolute left-[50%] top-[10%] bottom-[10%] w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent -translate-x-1/2 -z-10"></div>

            {/* Step 1 */}
            <section className="flex flex-col md:flex-row gap-8 md:gap-16 items-center group">
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center border-4 border-slate-100 text-slate-300 font-heading text-5xl font-extrabold shadow-sm group-hover:border-accent-primary group-hover:text-accent-primary transition-all duration-500 z-10 relative">1</div>
                  <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                    <FileSearch size={24} />
                  </div>
                  <h2 className="font-heading text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Upload & Extract</h2>
                  <p className="text-slate-500 font-medium text-base mb-4 leading-relaxed">
                    Securely upload your raw, unstructured documents (pay stubs, tax returns, benefits letters). RealDoor utilizes a proprietary vision-LLM extraction pipeline to instantly lift the critical financial data required for compliance checks.
                  </p>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mt-6">
                    <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><ShieldAlert size={16} className="text-amber-500"/> Privacy Guaranteed</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Your data is heavily sandboxed. It remains entirely under your control and is never auto-forwarded to landlords or third parties.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2 */}
            <section className="flex flex-col md:flex-row-reverse gap-8 md:gap-16 items-center group">
              <div className="md:w-1/2 flex justify-center md:justify-start">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center border-4 border-slate-100 text-slate-300 font-heading text-5xl font-extrabold shadow-sm group-hover:border-purple-500 group-hover:text-purple-500 transition-all duration-500 z-10 relative">2</div>
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              <div className="md:w-1/2 text-left md:text-right">
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 md:ml-auto">
                    <BrainCircuit size={24} />
                  </div>
                  <h2 className="font-heading text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Deterministic Rule Engine</h2>
                  <p className="text-slate-500 font-medium text-base mb-4 leading-relaxed">
                    Affordable housing rules are dense and localized. We route your extracted data through a deterministic mathematical engine mapped against official HUD MTSP (Multifamily Tax Subsidy Project) datasets. 
                  </p>
                  <p className="text-slate-500 font-medium text-base leading-relaxed">
                    We clearly cite our rules. The math isn't hallucinated; it is computed and explicitly explained so you know exactly where your household stands.
                  </p>
                </div>
              </div>
            </section>

            {/* Step 3 */}
            <section className="flex flex-col md:flex-row gap-8 md:gap-16 items-center group">
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center border-4 border-slate-100 text-slate-300 font-heading text-5xl font-extrabold shadow-sm group-hover:border-accent-primary group-hover:text-accent-primary transition-all duration-500 z-10 relative">3</div>
                  <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-slate-900 rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-800 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-shadow text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-accent-primary/10 blur-[50px] rounded-full"></div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center mb-6 border border-slate-700 relative z-10">
                    <FileCheck size={24} />
                  </div>
                  <h2 className="font-heading text-3xl font-extrabold text-white mb-4 tracking-tight relative z-10">Compile Dossier</h2>
                  <p className="text-slate-400 font-medium text-base mb-6 leading-relaxed relative z-10">
                    Once all required documents are flagged as present and the logic engine computes eligibility, you instantly generate a renter-controlled Application Dossier.
                  </p>
                  
                  <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 relative z-10">
                    <p className="text-sm font-bold text-white mb-1">Human-in-the-loop Finality</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      RealDoor is an assistive technology. You hand your perfectly curated dossier to a certified housing professional who makes the final, official decision.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-24 text-center">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-slate-900 text-white text-lg font-bold px-10 py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:-translate-y-1 group">
              Start your application packet <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
