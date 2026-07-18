import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Target, Users, BookOpen, Scale, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-body selection:bg-accent-primary/20">
      
      {/* Premium Minimal Navbar */}
      <Header />

      <main className="flex-1 w-full relative z-10 py-16 lg:py-24">
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-accent-primary/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-slate-200 bg-white/80 text-slate-600 px-4 py-2 rounded-full text-xs font-bold tracking-wide mb-6 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent-primary"></span>
              Our Mission
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Applying for affordable housing shouldn't require a <span className="text-accent-primary relative inline-block">law degree.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
              At RealDoor, we believe that transparency, empowerment, and absolute clarity are fundamental rights for every renter.
            </p>
          </div>

          {/* Manifesto Bento Box */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
            
            <div className="relative z-10 prose prose-lg prose-slate max-w-none">
              <p className="text-xl text-slate-700 font-semibold leading-relaxed mb-8">
                The affordable housing application process is notoriously opaque. Renters often spend weeks gathering sensitive documents and filling out complex paperwork, only to be denied over a simple technicality or a misunderstood rule. We built RealDoor to permanently change this paradigm.
              </p>
              <div className="h-px w-24 bg-accent-primary/30 my-8"></div>
              <p className="text-slate-600 font-medium leading-relaxed mb-0">
                By acting strictly as a preparatory copilot, we bridge the gap between complex federal and state housing guidelines (like HUD MTSP limits) and the renters who need to navigate them. We parse the rules so the renter doesn't have to.
              </p>
            </div>
          </div>

          {/* Core Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">We Assist</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">We prepare your compliance packet based strictly on the math. We never make the final approval or denial decision.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <Scale size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">We Don't Judge</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">No arbitrary scoring, no hidden risk profiles. Our engine is purely deterministic and completely transparent to the user.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <BookOpen size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">We Educate</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">We cite exact rules from the HUD manual to explain exactly why a document is needed and how income is calculated.</p>
            </div>
          </div>

          {/* Origin Story / Hackathon Credit */}
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold tracking-widest uppercase text-slate-300">Origin Story</span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-6 tracking-tight">Built for the Hack-Nation RealPage Challenge</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
                RealDoor was conceived to tackle the friction and inequality in modern renting. By empowering the applicant with enterprise-grade compliance tools before the application is even submitted, we aim to drastically reduce denial rates caused by incomplete or misunderstood requirements.
              </p>
              <Link href="/how-it-works" className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors group">
                See the technology <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="relative z-10 w-full md:w-1/3 flex justify-center">
              <div className="w-48 h-48 bg-slate-800 rounded-full border-8 border-slate-700/50 flex items-center justify-center shadow-inner relative">
                <Users size={64} className="text-accent-primary opacity-80" />
                <div className="absolute -bottom-4 bg-accent-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-white/20">
                  Hack-Nation '26
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-extrabold font-heading text-[#1A1A1A] mb-8 text-center">Meet Team Unfoldd</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
              
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent-primary to-blue-500 mb-6 p-1 shadow-lg group-hover:shadow-accent-primary/30 transition-shadow">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-white">
                    <span className="text-2xl font-bold text-accent-primary">AP</span>
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-1">Ajay Pratap Singh</h3>
                <p className="text-accent-primary font-bold text-xs tracking-widest uppercase mb-4">Team Leader</p>
                <p className="text-slate-500 text-sm font-medium">Driving the vision for a more transparent and equitable housing application process.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 mb-6 p-1 shadow-lg group-hover:shadow-emerald-500/30 transition-shadow">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-white">
                    <span className="text-2xl font-bold text-emerald-500">DK</span>
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-1">Dev Kumar</h3>
                <p className="text-emerald-600 font-bold text-xs tracking-widest uppercase mb-4">Core Member</p>
                <p className="text-slate-500 text-sm font-medium">Engineering the deterministic compliance engine and securing the AI pipeline.</p>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
