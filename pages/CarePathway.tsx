
import React, { useState } from 'react';
import { UserProfile, CarePathway } from '../types';
import { generateCarePathway } from '../geminiService';
import { 
  Route, ClipboardList, Info, AlertTriangle, CheckCircle2, 
  Loader2, UserCheck, Moon, Utensils, Zap, CalendarDays
} from 'lucide-react';

const CarePathwayPage: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [symptoms, setSymptoms] = useState('');
  const [lifestyle, setLifestyle] = useState({
    sleep: '6-7 hours',
    diet: 'Balanced',
    stress: 'Moderate'
  });
  const [pathway, setPathway] = useState<CarePathway | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!symptoms) return;
    setLoading(true);
    try {
      const data = await generateCarePathway(profile, symptoms, lifestyle);
      setPathway(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <Route className="text-blue-600" /> Personalized Care Pathway
        </h2>
        <p className="text-slate-500">Your AI-powered roadmap to recovery and optimal health.</p>
      </div>

      {!pathway && !loading && (
        <div className="bg-white p-8 rounded-3xl border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2"><ClipboardList size={20} className="text-blue-600" /> Current Condition</h3>
            <div className="space-y-2">
              <label className="text-sm text-slate-500 font-medium">Primary Symptoms</label>
              <textarea
                className="w-full bg-slate-50 border rounded-2xl p-4 h-32 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Describe what you're feeling and for how long..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2"><UserCheck size={20} className="text-blue-600" /> Lifestyle Context</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1"><Moon size={12}/> Sleep Patterns</label>
                <select 
                  className="w-full bg-slate-50 border rounded-xl px-4 py-2 outline-none"
                  value={lifestyle.sleep}
                  onChange={(e) => setLifestyle({...lifestyle, sleep: e.target.value})}
                >
                  <option>Less than 5 hours</option>
                  <option>6-7 hours</option>
                  <option>8+ hours</option>
                  <option>Irregular/Poor</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1"><Utensils size={12}/> Diet Quality</label>
                <select 
                  className="w-full bg-slate-50 border rounded-xl px-4 py-2 outline-none"
                  value={lifestyle.diet}
                  onChange={(e) => setLifestyle({...lifestyle, diet: e.target.value})}
                >
                  <option>Highly Processed</option>
                  <option>Balanced</option>
                  <option>Vegetarian/Vegan</option>
                  <option>Keto/Low Carb</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1"><Zap size={12}/> Stress Levels</label>
                <select 
                  className="w-full bg-slate-50 border rounded-xl px-4 py-2 outline-none"
                  value={lifestyle.stress}
                  onChange={(e) => setLifestyle({...lifestyle, stress: e.target.value})}
                >
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                  <option>Burnout State</option>
                </select>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleGenerate}
              disabled={!symptoms}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              Generate Care Pathway
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="bg-white p-20 rounded-3xl border shadow-sm flex flex-col items-center gap-6">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <div className="text-center space-y-2">
            <p className="text-xl font-bold text-slate-900 tracking-tight">Creating your medical roadmap...</p>
            <p className="text-slate-500 italic">Synthesizing clinical knowledge with your personal profile.</p>
          </div>
        </div>
      )}

      {pathway && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Info className="text-blue-600" /> Potential Causes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pathway.potentialCauses?.map((cause, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">{cause.title}</h4>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">{cause.likelihood}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{cause.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Zap className="text-amber-500" /> Immediate Care Strategy
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Immediate Actions</p>
                    <ul className="space-y-2">
                      {pathway.immediateActions?.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={16} /> {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ongoing Management</p>
                    <ul className="space-y-2">
                      {pathway.homeCareSteps?.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1.5" /> {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <section className="bg-rose-50 p-6 rounded-3xl border border-rose-100 space-y-4">
              <h3 className="font-bold text-rose-800 flex items-center gap-2">
                <AlertTriangle size={20} /> Red Flags
              </h3>
              <p className="text-xs text-rose-700 font-medium">Seek medical attention immediately if you experience:</p>
              <ul className="space-y-2">
                {pathway.redFlags?.map((flag, i) => (
                  <li key={i} className="text-sm text-rose-800 font-bold flex items-start gap-2">
                    <span className="shrink-0">•</span> {flag}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-slate-900 p-8 rounded-3xl text-white space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <CalendarDays className="text-blue-400" /> Clinical Follow-up
              </h3>
              <div className="bg-white/10 p-4 rounded-xl space-y-2">
                <p className="text-sm leading-relaxed opacity-90">{pathway.doctorFollowUp}</p>
              </div>
              <button 
                onClick={() => setPathway(null)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all text-sm"
              >
                Reset & New Symptoms
              </button>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarePathwayPage;
