"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Check, AlertTriangle, HelpCircle, 
  Eye, FileText, CheckCircle2, Save, X
} from 'lucide-react';
import { createClient } from '../../../../lib/supabase/client';

export default function DocumentReviewPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.id;
  const supabase = createClient();

  const [document, setDocument] = useState(null);
  const [fields, setFields] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [tempValues, setTempValues] = useState({});

  useEffect(() => {
    async function fetchReviewData() {
      if (!docId) return;

      // 1. Fetch Document details
      const { data: doc, error: docErr } = await supabase
        .from('documents')
        .select('*')
        .eq('id', docId)
        .single();
      
      if (docErr || !doc) {
        console.error(docErr);
        router.push('/documents');
        return;
      }
      setDocument(doc);

      // 2. Get Public URL for the image
      const { data: publicUrlData } = supabase
        .storage
        .from('documents')
        .getPublicUrl(doc.storage_path);
        
      if (publicUrlData && publicUrlData.publicUrl) {
        setImageUrl(publicUrlData.publicUrl);
      }

      // 3. Fetch Extracted Fields
      const { data: extractedData, error: extErr } = await supabase
        .from('extracted_fields')
        .select('*')
        .eq('document_id', docId);

      if (!extErr && extractedData) {
        // Map to an array of field objects we can easily render
        setFields(extractedData);
      }
      setLoading(false);
    }
    fetchReviewData();
  }, [docId, router, supabase]);

  const toggleEdit = (fieldId, currentValue) => {
    setEditMode(prev => ({ ...prev, [fieldId]: true }));
    setTempValues(prev => ({ ...prev, [fieldId]: currentValue }));
  };

  const cancelEdit = (fieldId) => {
    setEditMode(prev => ({ ...prev, [fieldId]: false }));
  };

  const saveEdit = async (fieldId) => {
    const newVal = tempValues[fieldId];
    
    // Update DB
    await supabase
      .from('extracted_fields')
      .update({ value: newVal, corrected: true })
      .eq('id', fieldId);

    // Update Local State
    setFields(fields.map(f => f.id === fieldId ? { ...f, value: newVal, corrected: true } : f));
    setEditMode(prev => ({ ...prev, [fieldId]: false }));
  };

  const handleConfirmAll = async () => {
    setSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
      const res = await fetch('/api/confirm-document', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          docId: docId,
          fieldIds: fields.map(f => f.id),
          userId: user?.id,
          docType: document?.doc_type
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to confirm document");
      }
      
      setSaving(false);
      router.push('/dashboard');
    } catch (err) {
      alert("Error saving: " + err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center font-bold text-gray-500">Loading document data...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-body flex flex-col h-screen overflow-hidden">
      
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 shrink-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-6 min-w-0">
              <Link href="/documents" className="text-gray-500 hover:text-text-heading font-semibold text-sm flex items-center gap-1 sm:gap-2 shrink-0">
                <ArrowLeft size={16} /> <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="w-px h-6 bg-gray-200 hidden sm:block shrink-0"></div>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="hidden sm:flex w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 items-center justify-center border border-yellow-100 shrink-0">
                  <Eye size={18} />
                </div>
                <div className="truncate">
                  <h1 className="font-heading font-bold text-sm sm:text-base text-text-heading leading-tight truncate">Human-in-the-Loop Review</h1>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">{document?.doc_type || 'Unknown Document'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0 pl-2">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600">
                <ShieldCheckIcon /> Untrusted Data Sandbox
              </div>
              <button 
                onClick={handleConfirmAll}
                disabled={saving}
                className="bg-accent-primary text-white font-bold py-1.5 sm:py-2 px-3 sm:px-5 rounded-lg sm:rounded-xl hover:bg-accent-dark transition-colors flex items-center gap-1 sm:gap-2 disabled:opacity-50 text-xs sm:text-base whitespace-nowrap"
              >
                {saving ? 'Saving...' : <><CheckCircle2 size={16} className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Confirm & Save</span><span className="sm:hidden">Save</span></>}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Split Screen Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Pane: Original Document Image Viewer */}
        <div className="w-full md:w-1/2 bg-gray-900 border-r border-gray-200 flex flex-col relative">
          <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 flex items-center gap-2 shadow-lg">
            <FileText size={14} /> Original Upload
          </div>
          
          <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center custom-scrollbar">
            {imageUrl ? (
              document?.storage_path?.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={imageUrl} 
                  title="Document Preview"
                  className="w-full h-full bg-white shadow-2xl rounded-sm border-0 min-h-[600px]"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={imageUrl} 
                  alt="Document Preview" 
                  className="max-w-full h-auto bg-white shadow-2xl rounded-sm object-contain"
                />
              )
            ) : (
              <div className="text-gray-500 font-bold mt-20">Preview not available</div>
            )}
          </div>
        </div>

        {/* Right Pane: Extracted Data Fields */}
        <div className="w-full md:w-1/2 bg-white flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 shrink-0 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold font-heading text-text-heading mb-2">Review Extracted Data</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              RealDoor AI extracted these fields. Please verify them against the original document on the left. Click any field to correct it.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            {fields.length === 0 ? (
              <div className="text-center text-gray-400 py-10">No fields extracted.</div>
            ) : (
              fields.map((field) => (
                <div key={field.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-gray-300">
                  <div className="p-4 md:p-5 flex flex-col md:flex-row justify-between gap-4">
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                          {field.field_name.replace(/_/g, ' ')}
                        </label>
                        {field.confidence === 'high' && <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-bold border border-green-200">High Confidence</span>}
                        {field.confidence === 'low' && <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-[10px] font-bold border border-yellow-200">Low Confidence</span>}
                        {field.corrected && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold border border-blue-200">Edited by you</span>}
                      </div>
                      
                      {editMode[field.id] ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input 
                            type="text" 
                            className="flex-1 px-3 py-2 border border-accent-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/20 text-sm font-bold text-text-heading bg-accent-primary/5"
                            value={tempValues[field.id] || ''}
                            onChange={(e) => setTempValues({...tempValues, [field.id]: e.target.value})}
                            autoFocus
                          />
                          <button onClick={() => saveEdit(field.id)} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><Save size={16} /></button>
                          <button onClick={() => cancelEdit(field.id)} className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"><X size={16} /></button>
                        </div>
                      ) : (
                        <div 
                          className="text-lg font-bold text-text-heading cursor-pointer hover:text-accent-primary transition-colors flex items-center gap-2 group"
                          onClick={() => toggleEdit(field.id, field.value)}
                        >
                          {field.value || <span className="text-gray-400 italic">Not found</span>}
                          <span className="text-xs font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">(Click to edit)</span>
                        </div>
                      )}
                    </div>

                    <div className="md:w-1/3 shrink-0 bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                        <HelpCircle size={12} /> Source Snippet
                      </div>
                      <p className="text-xs text-gray-600 font-medium italic leading-relaxed">
                        "{field.source_snippet || 'No source snippet'}"
                      </p>
                    </div>

                  </div>
                </div>
              ))
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mt-4">
              <AlertTriangle className="text-blue-500 shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-blue-800">
                <p className="font-bold mb-1">Why do I need to review this?</p>
                <p className="opacity-90">RealDoor uses a strict deterministic math engine for eligibility. If the AI reads a $5 as an $8, your math will be wrong. We never trust AI unconditionally.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function ShieldCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
