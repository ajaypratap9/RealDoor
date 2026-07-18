import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Shield, MapPin, MessageSquare, ArrowRight, ExternalLink } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-body selection:bg-accent-primary/20">
      
      {/* Premium Minimal Navbar */}
      <Header />

      <main className="flex-1 w-full relative z-10 py-16 lg:py-24">
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent-primary/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 border border-slate-200 bg-white/80 text-slate-600 px-4 py-2 rounded-full text-xs font-bold tracking-wide mb-6 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
              Get in Touch
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 tracking-tight mb-6">
              How can we help you <span className="text-accent-primary">succeed?</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
              Whether you have questions about our compliance engine, need technical assistance, or want to discuss a partnership, our team is ready to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Contact Information Cards */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg hover:border-accent-primary/20 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center mb-6 group-hover:bg-accent-primary/10 group-hover:text-accent-primary transition-colors border border-slate-100">
                  <Mail size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Technical Support</h3>
                <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                  Experiencing issues with document extraction, rules computation, or packet generation? Reach out to our engineering team.
                </p>
                <a href="mailto:ajaysingh91400@gmail.com" className="inline-flex items-center gap-2 text-accent-primary font-bold hover:text-accent-dark transition-colors">
                  ajaysingh91400@gmail.com <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg hover:border-accent-primary/20 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center mb-6 group-hover:bg-accent-primary/10 group-hover:text-accent-primary transition-colors border border-slate-100">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Privacy & Data Requests</h3>
                <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                  For inquiries regarding our zero-retention policy, manual data deletion requests, or compliance with data privacy regulations.
                </p>
                <a href="mailto:ajaysingh91400@gmail.com" className="inline-flex items-center gap-2 text-accent-primary font-bold hover:text-accent-dark transition-colors">
                  ajaysingh91400@gmail.com <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>

            {/* Contact Form / Info Block */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-extrabold font-heading mb-4">Enterprise & Partnerships</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8">
                  RealDoor is engineered to integrate seamlessly into modern affordable housing workflows. If you represent a Property Management Company (PMC) or a state housing authority, let's talk about reducing application friction at scale.
                </p>
                
                <div className="space-y-6 mb-10">
                  <div className="flex items-center gap-4 text-slate-300 font-medium">
                    <MapPin className="text-accent-primary shrink-0" size={20} />
                    <span>Innovation Hub, New Delhi, India</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300 font-medium">
                    <MessageSquare className="text-accent-primary shrink-0" size={20} />
                    <span>Average response time: &lt; 2 hours</span>
                  </div>
                </div>

                <a href="mailto:ajaysingh91400@gmail.com" className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group">
                  Contact Founders <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

          </div>
          
          {/* Important Notice */}
          <div className="mt-12 bg-amber-50 border border-amber-100 rounded-2xl p-6 md:p-8 flex items-start gap-4 shadow-sm max-w-4xl mx-auto">
            <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 shadow-sm">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="text-amber-900 font-bold mb-2">Important Notice Regarding Applications</h4>
              <p className="text-sm font-medium text-amber-800/80 leading-relaxed">
                RealDoor is an assistive preparation tool designed to help you organize documents against complex rules. <strong>We cannot answer specific questions regarding your eligibility or the status of a submitted application.</strong> Please contact your prospective property manager directly for any application updates or final eligibility decisions.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
