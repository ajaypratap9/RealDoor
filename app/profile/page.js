"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserCircle, Briefcase, Heart, CheckCircle2, AlertCircle, Edit2, Check, ArrowRight, X } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardHeader from '../components/DashboardHeader';

// Animation variants
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } } };

export default function Profile() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState({ complete: false, unconfirmedCount: 0 });
  const [household, setHousehold] = useState(null);
  const [incomeData, setIncomeData] = useState([]);
  const [benefitsData, setBenefitsData] = useState([]);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', household_size: 1, metro: '', program: '' });
  const [userName, setUserName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      
      const currentName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || '';
      setUserName(currentName);

      // Fetch Household
      const { data: hh } = await supabase.from('households').select('*').eq('user_id', user.id).single();
      
      if (hh) {
        setHousehold(hh);
        setEditForm({
          name: currentName,
          household_size: hh.household_size || 1,
          metro: hh.metro || '',
          program: hh.program || ''
        });

        // Fetch Documents & Fields
        const { data: docs } = await supabase.from('documents').select('*').eq('household_id', hh.id);
        
        if (docs && docs.length > 0) {
          const docIds = docs.map(d => d.id);
          const { data: fields } = await supabase.from('extracted_fields').select('*').in('document_id', docIds);
          
          let unconfirmed = 0;
          let incData = [];
          let benData = [];

          if (fields) {
            fields.forEach(f => {
              if (!f.confirmed) unconfirmed++;
              
              const docName = docs.find(d => d.id === f.document_id)?.doc_type;
              
              if (['employer_or_agency_name', 'gross_pay_amount', 'pay_period'].includes(f.field_name) || f.field_name.includes('gross') || f.field_name.includes('pay')) {
                incData.push({ 
                  label: f.field_name.replace(/_/g, ' '), 
                  value: f.value, 
                  confirmed: f.confirmed, 
                  sourceDoc: docName,
                  docId: f.document_id
                });
              } else if (f.field_name.includes('benefit')) {
                benData.push({ 
                  label: f.field_name.replace(/_/g, ' '), 
                  value: f.value, 
                  confirmed: f.confirmed, 
                  sourceDoc: docName,
                  docId: f.document_id
                });
              }
            });
          }

          if (benData.length === 0) {
            benData = [{ label: 'Benefit Type', value: 'None reported', confirmed: true, sourceDoc: null }];
          }

          setIncomeData(incData);
          setBenefitsData(benData);
          setProfileStatus({ complete: unconfirmed === 0 && incData.length > 0, unconfirmedCount: unconfirmed });
        } else {
          setIncomeData([{ label: 'Employment Income', value: 'No documents uploaded', confirmed: true, sourceDoc: null }]);
          setBenefitsData([{ label: 'Social Benefits', value: 'No documents uploaded', confirmed: true, sourceDoc: null }]);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      if (editForm.name && editForm.name !== userName) {
        const { error: authError } = await supabase.auth.updateUser({
          data: { name: editForm.name }
        });
        if (authError) throw authError;
        setUserName(editForm.name);
      }

      const { error } = await supabase.from('households')
        .update({
          household_size: parseInt(editForm.household_size),
          metro: editForm.metro,
          program: editForm.program
        })
        .eq('id', household.id);

      if (error) throw error;
      
      setHousehold({
        ...household,
        household_size: parseInt(editForm.household_size),
        metro: editForm.metro,
        program: editForm.program
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <DashboardHeader />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-accent-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Identity Vault...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-body flex flex-col">
      <DashboardHeader />

      <main className="flex-1 w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-4">
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight mb-2">Human-Confirmed Profile</h2>
            <p className="text-slate-500 font-medium max-w-2xl">
              This profile is generated purely from fields you have explicitly confirmed from your uploads. The AI never guesses and we never pull hidden data.
            </p>
          </motion.div>

          {/* Status Banner */}
          <motion.div variants={itemVariants}>
            {profileStatus.complete ? (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200 rounded-3xl p-8 mb-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white text-green-600 flex items-center justify-center shrink-0 shadow-sm border border-green-100">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-green-900 mb-1">Profile is 100% Confirmed</h2>
                    <p className="text-green-700 font-medium">All extracted data has been verified by you. You are ready to generate your packet.</p>
                  </div>
                </div>
                <Link href="/packet" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-green-600/20 whitespace-nowrap flex items-center justify-center gap-2">
                  Preview Packet <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-8 mb-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white text-orange-600 flex items-center justify-center shrink-0 shadow-sm border border-orange-100">
                    <AlertCircle size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-orange-900 mb-1">{profileStatus.unconfirmedCount > 0 ? `${profileStatus.unconfirmedCount} fields still need your review` : 'No verified income found'}</h2>
                    <p className="text-orange-800 font-medium">We cannot run the deterministic eligibility math until every field is explicitly confirmed.</p>
                  </div>
                </div>
                <Link href="/documents" className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-slate-900/20 whitespace-nowrap text-center">
                  Review Pipeline
                </Link>
              </div>
            )}
          </motion.div>

          {/* Profile Cards */}
          <div className="space-y-6">
            
            {/* Household Card (Editable) */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden relative">
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-inner">
                    <UserCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[#1A1A1A]">Household Composition</h3>
                    <p className="text-sm text-slate-500 font-medium">Core setup for MTSP sizing</p>
                  </div>
                </div>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-indigo-600 text-sm font-bold flex items-center gap-1.5 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-200">
                    <Edit2 size={14} /> Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-700 text-sm font-bold flex items-center gap-1.5 transition-colors bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                      <X size={14} /> Cancel
                    </button>
                    <button onClick={handleSaveProfile} disabled={isSaving} className="text-white bg-indigo-600 hover:bg-indigo-700 text-sm font-bold flex items-center gap-1.5 transition-colors px-4 py-2 rounded-lg shadow-sm disabled:opacity-50">
                      {isSaving ? 'Saving...' : <><Check size={14} /> Save</>}
                    </button>
                  </div>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Full Name</p>
                      <p className="font-bold text-[#1A1A1A] text-lg">{userName || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Household Size</p>
                      <p className="font-bold text-[#1A1A1A] text-lg">{household?.household_size || 1} Person(s)</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Metro Area</p>
                      <p className="font-bold text-[#1A1A1A] text-lg">{household?.metro || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Housing Program</p>
                      <p className="font-bold text-[#1A1A1A] text-lg">{household?.program || 'Not specified'}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="edit" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-indigo-50/30">
                    <div>
                      <label className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-2 block">Full Name</label>
                      <input 
                        type="text" 
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-2 block">Household Size</label>
                      <input 
                        type="number" 
                        min="1" max="12"
                        value={editForm.household_size}
                        onChange={(e) => setEditForm({...editForm, household_size: e.target.value})}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-2 block">Metro Area</label>
                      <select 
                        value={editForm.metro}
                        onChange={(e) => setEditForm({...editForm, metro: e.target.value})}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
                      >
                        <option value="">Select Area</option>
                        <option value="Boston-Cambridge-Newton, MA-NH">Boston-Cambridge-Newton, MA</option>
                        <option value="New York-Newark-Jersey City, NY-NJ-PA">New York Metro Area</option>
                        <option value="Los Angeles-Long Beach-Anaheim, CA">Los Angeles Metro Area</option>
                        <option value="Chicago-Naperville-Elgin, IL-IN-WI">Chicago Metro Area</option>
                        <option value="San Francisco-Oakland-Hayward, CA">San Francisco Metro Area</option>
                        <option value="Austin-Round Rock, TX">Austin Metro Area</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-2 block">Housing Program</label>
                      <select 
                        value={editForm.program}
                        onChange={(e) => setEditForm({...editForm, program: e.target.value})}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
                      >
                        <option value="">Select Program</option>
                        <option value="LIHTC (Low-Income Housing Tax Credit)">LIHTC (Tax Credit)</option>
                        <option value="Section 8 (Housing Choice Voucher)">Section 8</option>
                        <option value="Public Housing">Public Housing</option>
                        <option value="HUD-VASH">HUD-VASH (Veterans)</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Income Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-inner">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[#1A1A1A]">Employment Income</h3>
                    <p className="text-sm text-slate-500 font-medium">Extracted from verified pay stubs</p>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                  {incomeData.map((item, i) => (
                    <div key={i}>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        {item.label}
                        {item.confirmed === false && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" title="Needs confirmation"></span>}
                      </p>
                      <p className={`font-bold text-lg ${item.confirmed === false ? 'text-orange-600' : 'text-[#1A1A1A]'}`}>
                        {item.value || 'Not found'}
                      </p>
                    </div>
                  ))}
                </div>
                {incomeData.length > 0 && incomeData[0].sourceDoc && (
                  <div className="bg-slate-50 rounded-xl px-5 py-3 border border-slate-200 inline-flex items-center gap-2 text-sm text-slate-700 font-semibold shadow-inner">
                    Source: {incomeData[0].sourceDoc} 
                    <Link href={`/documents/${incomeData[0].docId}/review`} className="underline font-bold ml-3 hover:text-emerald-700 text-emerald-600">View source document</Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Benefits Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-inner">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[#1A1A1A]">Social Benefits</h3>
                    <p className="text-sm text-slate-500 font-medium">Extracted from verified award letters</p>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 gap-8">
                  {benefitsData.map((item, i) => (
                    <div key={i}>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        {item.label}
                        {item.confirmed === false && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
                      </p>
                      <p className="font-bold text-[#1A1A1A] text-lg">{item.value || 'Not found'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </main>
    </div>
  );
}
