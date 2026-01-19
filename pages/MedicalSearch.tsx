
import React, { useState } from 'react';
import { searchMedicalInfo } from '../geminiService';
import { Search, Loader2, Globe, ExternalLink, BookOpen } from 'lucide-react';

const MedicalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchMedicalInfo(query);
      setResponse(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sources = response?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <Search className="text-slate-700" /> Medical Search Engine
        </h2>
        <p className="text-slate-500">Query latest clinical studies, medical journals, and verified health news.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
        <div className="flex gap-2">
          <input 
            type="text"
            className="flex-1 bg-slate-50 border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
            placeholder="Search for 'Latest clinical trials for type 2 diabetes'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={loading || !query}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Globe size={20} />}
            Search
          </button>
        </div>
      </div>

      {response && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm prose max-w-none">
              <h3 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">
                <BookOpen size={20} className="text-slate-700" /> Synthesis Summary
              </h3>
              <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {response.text}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Cited Sources</h4>
            {sources.length > 0 ? sources.map((chunk: any, i: number) => chunk.web && (
              <a 
                key={i} 
                href={chunk.web.uri} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-slate-900 transition-all group flex items-start gap-3 shadow-sm"
              >
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-slate-100">
                  <ExternalLink size={14} className="text-slate-500" />
                </div>
                <div className="min-w-0">
                  <h5 className="font-bold text-slate-900 text-xs truncate">{chunk.web.title}</h5>
                  <p className="text-[10px] text-slate-400 truncate mt-1">{chunk.web.uri}</p>
                </div>
              </a>
            )) : (
              <div className="text-slate-400 text-xs text-center py-8 border border-dashed rounded-3xl">
                No external links detected in summary.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalSearch;
