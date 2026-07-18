"use client";

import { useState, useEffect } from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

export default function Onboarding() {
  const [householdSize, setHouseholdSize] = useState(1);
  const [targetMetroArea, setTargetMetroArea] = useState('Boston-Cambridge-Newton, MA-NH');
  const [program, setProgram] = useState('LIHTC (Low-Income Housing Tax Credit)');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const supabase = createClient();

  useEffect(() => {
    // Redirect if already has household
    const checkHousehold = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      const { data } = await supabase.from('households').select('id').eq('user_id', user.id).single();
      if (data) {
        window.location.href = '/dashboard';
      }
    };
    checkHousehold();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setErrorMsg("Session expired. Please log in.");
      setIsLoading(false);
      return;
    }

    // Insert Household
    const { error: hhError } = await supabase.from('households').insert({
      user_id: user.id,
      metro: targetMetroArea,
      program: program,
      household_size: householdSize
    });

    if (hhError) {
      setErrorMsg(hhError.message);
      setIsLoading(false);
      return;
    }

    // Log Consent
    await supabase.from('consent_log').insert({
      user_id: user.id,
      action: 'Onboarding Completed',
      detail: 'Agreed to document processing consent'
    });

    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-extrabold font-heading text-text-heading mb-2">Let's set up your profile</h2>
        <p className="text-text-body mb-8">We need two pieces of information to look up the exact affordable housing rules for your situation.</p>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Household Size */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <label className="block text-lg font-bold text-text-heading mb-2">How many people live in your household?</label>
            <p className="text-sm text-text-body mb-4">Include yourself, children, and anyone else who will live with you.</p>
            <input 
              type="number" 
              min="1" 
              max="15"
              required
              className="w-32 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent text-xl font-bold"
              value={householdSize}
              onChange={(e) => setHouseholdSize(parseInt(e.target.value))}
            />
          </div>

          {/* Target Metro Area */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <label className="block text-lg font-bold text-text-heading mb-2">Where are you looking to rent?</label>
            <p className="text-sm text-text-body mb-4">Select your target Metropolitan Statistical Area (MSA).</p>
            <select 
              required
              value={targetMetroArea}
              onChange={(e) => setTargetMetroArea(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent font-semibold bg-white"
            >
              <option value="Boston-Cambridge-Newton, MA-NH">Boston-Cambridge-Newton, MA</option>
              <option value="New York-Newark-Jersey City, NY-NJ-PA">New York Metro Area</option>
              <option value="Los Angeles-Long Beach-Anaheim, CA">Los Angeles Metro Area</option>
              <option value="Chicago-Naperville-Elgin, IL-IN-WI">Chicago Metro Area</option>
              <option value="San Francisco-Oakland-Hayward, CA">San Francisco Metro Area</option>
              <option value="Austin-Round Rock, TX">Austin Metro Area</option>
            </select>
          </div>

          {/* Housing Program */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <label className="block text-lg font-bold text-text-heading mb-2">Housing Program</label>
            <p className="text-sm text-text-body mb-4">Which affordable housing program are you preparing for?</p>
            <select 
              required
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent font-semibold bg-white"
            >
              <option value="LIHTC (Low-Income Housing Tax Credit)">LIHTC (Tax Credit)</option>
              <option value="Section 8 (Housing Choice Voucher)">Section 8</option>
              <option value="Public Housing">Public Housing</option>
              <option value="HUD-VASH">HUD-VASH (Veterans)</option>
            </select>
          </div>

          {/* Consent Checkbox */}
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex gap-4 items-start">
            <div className="flex items-center h-6">
              <input 
                id="consent"
                type="checkbox" 
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-5 h-5 text-accent-primary border-gray-300 rounded focus:ring-accent-primary cursor-pointer"
              />
            </div>
            <label htmlFor="consent" className="text-sm text-text-heading font-medium leading-relaxed cursor-pointer">
              I understand RealDoor will process documents I upload to help me prepare an application. I can delete everything at any time from the Trust Center.
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button 
              type="submit"
              disabled={isLoading || !consent}
              className="w-full bg-text-heading text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              <ShieldCheck size={20} />
              {isLoading ? "Saving..." : "Create my profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
