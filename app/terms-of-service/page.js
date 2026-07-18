import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-body selection:bg-accent-primary/20">
      
      {/* Premium Minimal Navbar */}
      <Header />

      <main className="flex-1 w-full relative z-10 py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight mb-4">Terms of Service</h1>
            <p className="text-slate-500 font-medium">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 prose prose-slate prose-lg max-w-none">
            <p>
              Welcome to RealDoor. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully.
            </p>

            <div className="p-6 bg-amber-50 border border-amber-100 rounded-xl my-8">
              <h3 className="font-bold text-amber-900 mt-0 mb-2">Disclaimer of Authority</h3>
              <p className="text-amber-800 text-sm mb-0">
                <strong>RealDoor is an assistive software tool, not a decision-making authority.</strong> We do not approve, deny, or score applications for affordable housing. RealDoor solely provides organizational tools and mathematical estimates based on public HUD MTSP data. The final determination of eligibility rests entirely with certified property management professionals.
              </p>
            </div>

            <h2 className="font-heading text-2xl font-bold text-slate-900 mt-10 mb-4">1. Acceptance of Terms</h2>
            <p>
              By creating an account, uploading documents, or utilizing the logic engine on RealDoor, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy.
            </p>

            <h2 className="font-heading text-2xl font-bold text-slate-900 mt-10 mb-4">2. User Responsibilities</h2>
            <p>
              When utilizing RealDoor, you agree to:
            </p>
            <ul>
              <li>Provide accurate and truthful information during account creation.</li>
              <li>Upload only documents that belong to you or for which you have explicit legal authority to process.</li>
              <li>Maintain the confidentiality of your account credentials.</li>
              <li>Not use the platform for any fraudulent, malicious, or illegal activities.</li>
            </ul>

            <h2 className="font-heading text-2xl font-bold text-slate-900 mt-10 mb-4">3. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, RealDoor, its founders, and its affiliates shall not be liable for any direct, indirect, incidental, or consequential damages resulting from:
            </p>
            <ul>
              <li>Errors, mistakes, or inaccuracies in the extraction of data or computation of rules.</li>
              <li>The rejection or denial of an affordable housing application by a property manager.</li>
              <li>Any unauthorized access to our secure servers or any personal data stored therein.</li>
            </ul>
            <p>
              The platform is provided "as is" and "as available" without any warranties, express or implied.
            </p>

            <h2 className="font-heading text-2xl font-bold text-slate-900 mt-10 mb-4">4. Hackathon Context</h2>
            <p>
              RealDoor is a prototype developed for the Hack-Nation RealPage Challenge. As such, the platform may undergo rapid changes, and service availability is not guaranteed.
            </p>

            <h2 className="font-heading text-2xl font-bold text-slate-900 mt-10 mb-4">5. Contact Information</h2>
            <p>
              For legal inquiries or questions regarding these Terms, please contact us:
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
