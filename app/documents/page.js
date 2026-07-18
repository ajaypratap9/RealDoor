"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardHeader from '../components/DashboardHeader';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Clock, Trash2, Search, RefreshCw } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } } };

export default function DocumentsPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  const fetchDocuments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    // 1. Get Household ID (Needed for the SQL Schema)
    const { data: hh } = await supabase.from('households').select('id').eq('user_id', user.id).single();
    
    if (hh) {
      // 2. Get Documents by household_id
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('household_id', hh.id)
        .order('uploaded_at', { ascending: false });
        
      if (!error && data) {
        setDocuments(data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcessing(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcessing(e.target.files[0]);
    }
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });

  const convertPdfToImages = async (file) => {
    const pdfjsLib = await import('pdfjs-dist/build/pdf.min.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const base64Images = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport: viewport }).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      base64Images.push(dataUrl.split(',')[1]);
    }
    return base64Images;
  };

  const handleFileProcessing = async (file) => {
    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: hh } = await supabase.from('households').select('id').eq('user_id', user.id).single();
      if (!hh) throw new Error("Please complete your profile (Onboarding) first so we can attach documents to your household.");

      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = user.id + "_" + Math.random() + "." + fileExt;
      const filePath = "uploads/" + fileName;
      
      const { error: uploadErr } = await supabase.storage.from('documents').upload(filePath, file);
      if (uploadErr) throw new Error("Storage Upload Error: " + uploadErr.message);

      let base64ImageArray = [];
      let finalMimeType = file.type;

      if (fileExt === 'pdf') {
        base64ImageArray = await convertPdfToImages(file);
        finalMimeType = 'image/jpeg'; // converted to jpeg
      } else {
        base64ImageArray = [await toBase64(file)];
      }

      // Insert matching strict SQL schema
      const { data: docData, error: dbErr } = await supabase.from('documents').insert({
        household_id: hh.id,
        doc_type: file.name,
        storage_path: filePath,
        status: 'pending_review'
      }).select().single();

      if (dbErr) throw new Error("Database Insert Error: " + dbErr.message);

      setDocuments([{ ...docData, status: 'extracting' }, ...documents]);

      const aiResponse = await fetch('/api/extract-document', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ 
          imageBase64Array: base64ImageArray, 
          mimeType: finalMimeType 
        })
      });
      const aiData = await aiResponse.json();

      if (aiData.success) {
        await supabase.from('documents').update({ status: 'needs_review' }).eq('id', docData.id);
        
        const extractedFields = aiData.data.fields;
        for (const [key, fieldObj] of Object.entries(extractedFields)) {
          if (fieldObj.value) {
            // Insert matching strict SQL schema (value instead of extracted_value)
            await supabase.from('extracted_fields').insert({
              document_id: docData.id,
              field_name: key,
              value: String(fieldObj.value),
              confidence: fieldObj.confidence,
              source_snippet: fieldObj.source_snippet,
              confirmed: false
            });
          }
        }
      } else {
        await supabase.from('documents').update({ status: 'failed' }).eq('id', docData.id);
        throw new Error("AI Extraction Error: " + JSON.stringify(aiData));
      }
      
      await fetchDocuments();

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id, storagePath) => {
    await supabase.storage.from('documents').remove([storagePath]);
    await supabase.from('documents').delete().eq('id', id);
    fetchDocuments();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body flex flex-col">
      <DashboardHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <motion.div variants={itemVariants} className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Upload Evidence</h2>
            <p className="text-slate-500 font-medium max-w-2xl">
              Securely upload synthetic pay stubs or benefit letters. Our AI engine processes documents strictly in memory and does not train on your inputs.
            </p>
          </motion.div>

          {/* Uploader Box */}
          <motion.div variants={itemVariants} className="mb-12">
            <div 
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                dragActive ? "border-accent-primary bg-accent-primary/5 shadow-inner scale-[0.99]" : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50 shadow-sm"
              }`}
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-400 shadow-sm border border-slate-100">
                {isUploading ? <RefreshCw className="animate-spin text-accent-primary" size={32} /> : <UploadCloud size={32} />}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{isUploading ? 'Processing via Qwen 27B Vision...' : 'Drag & drop your files here'}</h3>
              <p className="text-sm text-slate-500 mb-8 font-medium">Supported formats: PNG, JPG, PDF (Max 5MB)</p>
              
              <label className={`bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-800 hover:-translate-y-0.5'}`}>
                Browse Files
                <input type="file" disabled={isUploading} className="hidden" accept="image/jpeg, image/png, application/pdf" onChange={handleFileChange} />
              </label>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Pipeline History</h2>
            
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
              {loading ? (
                <div className="p-16 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-slate-100 border-t-accent-primary rounded-full animate-spin mb-4"></div>
                  <div className="text-slate-400 font-bold animate-pulse">Syncing with encrypted vault...</div>
                </div>
              ) : documents.length === 0 ? (
                <div className="p-16 text-center">
                  <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">Your pipeline is empty. Add a document above.</p>
                </div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="divide-y divide-slate-50">
                  {documents.map((doc) => (
                    <motion.div variants={itemVariants} key={doc.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0 border border-gray-200">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-text-heading text-sm">{doc.doc_type}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                      {doc.status === 'confirmed' && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-accent-dark border border-green-200 rounded-full text-xs font-bold">
                          <CheckCircle2 size={14} /> Confirmed
                        </span>
                      )}
                      {(doc.status === 'needs_review' || doc.status === 'pending_review') && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-bold">
                          <AlertCircle size={14} /> Needs Review
                        </span>
                      )}
                      {doc.status === 'extracting' && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-xs font-bold">
                          <Clock size={14} className="animate-spin-slow" /> Extracting...
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        {(doc.status === 'needs_review' || doc.status === 'pending_review' || doc.status === 'confirmed') && (
                          <Link href={"/documents/" + doc.id + "/review"} className="px-3 py-1.5 bg-white border border-gray-200 shadow-sm rounded-lg text-xs font-bold text-text-heading hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                            <Search size={14} /> {doc.status === 'confirmed' ? 'View Data' : 'Review'}
                          </Link>
                        )}
                        <button onClick={() => handleDelete(doc.id, doc.storage_path)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
