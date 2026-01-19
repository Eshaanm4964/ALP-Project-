
import React, { useState } from 'react';
import { checkDrugInteractions } from '../geminiService';
import { Pill, Plus, X, AlertTriangle, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';

const DrugInteraction: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [meds, setMeds] = useState<string[]>([]);
  const [currentMed, setCurrentMed] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const addMed = () => {
    if (currentMed.trim() && !meds.includes(currentMed.trim())) {
      setMeds([...meds, currentMed.trim()]);
      setCurrentMed('');
    }
  };

  const removeMed = (index: number) => {
    setMeds(meds.filter((_, i) => i !== index));
  };

  const handleCheck = async () => {
    if (meds.length < 2) return;
    setLoading(true);
    try {
      const data = await checkDrugInteractions(meds, profile);
      setResult(data || "Analysis failed.");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <Pill className="text-rose-500" /> Drug Interaction Checker
        </h2>
        <p className="text-slate-500">Check for potential adverse reactions between your medications.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
        <div className="flex gap-2">
          <input 
            type="text"
            className="flex-1 bg-slate-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500 transition-all"
            placeholder="Enter medication name (e.g. Warfarin, Aspirin)..."
            value={currentMed}
            onChange={(e) => setCurrentMed(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addMed()}
          />
          <button 
            onClick={addMed}
            className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-all"
          >
            <Plus />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[50px] p-2 border border-dashed rounded-xl border-slate-200">
          {meds.map((m, i) => (
            <span key={i} className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border border-rose-100">
              {m} <X size={14} className="cursor-pointer" onClick={() => removeMed(i)} />
            </span>
          ))}
          {meds.length === 0 && <p className="text-slate-400 text-sm m-auto">No medications added yet.</p>}
        </div>

        <button 
          onClick={handleCheck}
          disabled={meds.length < 2 || loading}
          className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <AlertTriangle size={20} />}
          Analyze Interactions
        </button>
      </div>

      {result && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm prose prose-slate max-w-none whitespace-pre-wrap leading-relaxed text-slate-700">
          <h3 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Analysis Results</h3>
          {result}
        </div>
      )}
    </div>
  );
};

export default DrugInteraction;
