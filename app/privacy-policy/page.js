import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-body selection:bg-accent-primary/20">
      
      {/* Premium Minimal Navbar */}
      <Header />

      <main className="flex-1 w-full relative z-10 py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-slate-500 font-medium">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 prose prose-slate prose-lg max-w-none">
            <p>
              At <strong>RealDoor</strong>, we are committed to absolute transparency regarding your data. This Privacy Policy outlines the types of information we collect, how it is used, and the steps we take to ensure your data remains strictly under your control.
            </p>

            <h2 className="font-heading text-2xl font-bold text-slate-900 mt-10 mb-4">1. Information We Collect</h2>
            <p>
              We collect information that you explicitly provide to us when you use the RealDoor platform. This includes:
            </p>
            <ul>
              <li><strong>Account Information:</strong> Full name and email address required to secure your Identity Vault.</li>
              <li><strong>Financial Documents:</strong> Images or PDFs of pay stubs, benefits letters, or tax returns that you voluntarily upload.</li>
              <li><strong>Extracted Data:</strong> The numerical values (e.g., Gross Income, Pay Period) parsed from your uploaded documents by our extraction engine.</li>
            </ul>

            <h2 className="font-heading text-2xl font-bold text-slate-900 mt-10 mb-4">2. How We Use Your Information</h2>
            <p>
              Your data is exclusively used to provide the RealDoor assistive preparation service. Specifically, we use it to:
            </p>
            <ul>
              <li>Compute your household's Area Median Income (AMI) percentage against official HUD MTSP tables.</li>
              <li>Identify missing documentation required for a standard affordable housing application packet.</li>
              <li>Generate a comprehensive PDF dossier that <strong>you</strong> can download and present to property managers.</li>
            </ul>

            <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl my-8">
              <h3 className="font-bold text-blue-900 mt-0 mb-2">Zero Data Sharing Policy</h3>
              <p className="text-blue-800 text-sm mb-0">
                We strictly adhere to a zero-sharing architecture. RealDoor does not sell, rent, or automatically forward your data to any third party, including landlords, property management companies (PMCs), or credit bureaus. You maintain sole authority over who sees your finalized dossier.
              </p>
            </div>

            <h2 className="font-heading text-2xl font-bold text-slate-900 mt-10 mb-4">3. Data Security and Retention</h2>
            <p>
              RealDoor employs enterprise-grade security measures. Data is encrypted in transit (TLS 1.3) and at rest (AES-256). We utilize Row Level Security (RLS) to ensure that your Identity Vault is completely isolated from other users.
            </p>
            <p>
              You have the right to request full deletion of your account and all associated documents at any time. Upon deletion, your raw document assets and extracted data are permanently purged from our storage buckets.
            </p>

            <h2 className="font-heading text-2xl font-bold text-slate-900 mt-10 mb-4">4. Built for the Hack-Nation Challenge</h2>
            <p>
              RealDoor is an application built as part of the Hack-Nation RealPage Challenge. While we employ rigorous security practices, it is operating in an experimental/hackathon capacity. 
            </p>

            <h2 className="font-heading text-2xl font-bold text-slate-900 mt-10 mb-4">5. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or how your data is handled, please contact us at:
            </p>
            <p>
              <a href="mailto:ajaysingh91400@gmail.com" className="text-accent-primary font-bold hover:underline">ajaysingh91400@gmail.com</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
