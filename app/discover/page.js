"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, MapPin, Building, AlertCircle, Filter } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

export default function DiscoverPage() {
  const [household, setHousehold] = useState(null);
  
  // Synthetic / Static LIHTC Data for Cambridge MA (from HUD LIHTC Database)
  const LIHTC_PROPERTIES = [
    { id: 1, name: "Rindge Tower Apartments", address: "402 Rindge Ave, Cambridge, MA", units: 273, type: "Family", availability: "Unknown" },
    { id: 2, name: "Squirrelwood Apartments", address: "243 Broadway, Cambridge, MA", units: 88, type: "Family", availability: "Unknown" },
    { id: 3, name: "Jefferson Park State", address: "266 B Rindge Ave, Cambridge, MA", units: 104, type: "Family", availability: "Unknown" },
    { id: 4, name: "Lincoln Way", address: "44A Lincoln Way, Cambridge, MA", units: 64, type: "Elderly", availability: "Unknown" }
  ];

  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: hh } = await supabase.from('households').select('*').eq('user_id', user.id).single();
        setHousehold(hh);
      }
    }
    loadData();
  }, []);

  const filteredProperties = filter === 'All' ? LIHTC_PROPERTIES : LIHTC_PROPERTIES.filter(p => p.type === filter);

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-body flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-500 hover:text-text-heading font-semibold text-sm flex items-center gap-2">
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <div className="w-px h-6 bg-gray-200"></div>
            <h1 className="font-heading font-bold text-lg text-text-heading flex items-center gap-2">
              <Search size={20} className="text-accent-primary" /> Property Discovery
            </h1>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Anti-Steering & Availability Disclaimer required by Hackathon */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-8 flex items-start gap-4">
          <AlertCircle className="text-purple-600 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-purple-900 font-bold mb-1">Neutral Discovery Zone</h3>
            <p className="text-sm text-purple-800 leading-relaxed">
              RealDoor provides transparent property data from the public HUD LIHTC Database. We do not predict your acceptance or rank properties for you. Availability for all properties is explicitly marked as "Unknown" because live vacancy data is not public. Use the filters below to browse.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-text-heading mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                <Filter size={16} /> Filters
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-accent-primary transition-colors">
                  <input type="radio" name="type" className="text-accent-primary focus:ring-accent-primary" checked={filter === 'All'} onChange={() => setFilter('All')} />
                  Show All Types
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-accent-primary transition-colors">
                  <input type="radio" name="type" className="text-accent-primary focus:ring-accent-primary" checked={filter === 'Family'} onChange={() => setFilter('Family')} />
                  Family Housing
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-accent-primary transition-colors">
                  <input type="radio" name="type" className="text-accent-primary focus:ring-accent-primary" checked={filter === 'Elderly'} onChange={() => setFilter('Elderly')} />
                  Elderly Housing
                </label>
              </div>
            </div>
          </div>

          {/* Property List */}
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold font-heading text-text-heading mb-4">
              {filteredProperties.length} LIHTC Properties found in {household?.metro || 'Cambridge, MA'}
            </h2>
            
            {filteredProperties.map(prop => (
              <div key={prop.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div>
                  <h3 className="text-lg font-bold text-text-heading flex items-center gap-2 mb-1">
                    <Building size={18} className="text-gray-400" /> {prop.name}
                  </h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1.5">
                    <MapPin size={14} /> {prop.address}
                  </p>
                </div>
                
                <div className="flex flex-col md:items-end gap-2">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold">
                      {prop.units} Low-Income Units
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold">
                      {prop.type}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 inline-flex items-center gap-1.5">
                    Waitlist/Availability: <span className="text-gray-400 uppercase tracking-widest">Unknown</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
