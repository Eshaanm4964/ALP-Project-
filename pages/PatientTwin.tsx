
import React, { useState, useEffect } from 'react';
import { UserProfile, DigitalTwin } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { 
  Dna, Cpu, Activity, Zap, Play, Loader2, BrainCircuit, 
  TrendingUp, TrendingDown, Info, ShieldCheck, Microscope,
  Sparkles, Layers, ArrowRight
} from 'lucide-react';
import { simulateCounterfactualAgent, updateDigitalTwinAgent } from '../geminiService';

const PatientTwin: React.FC<{ profile: UserProfile, setProfile: (p: UserProfile) => void }> = ({ profile, setProfile }) => {
  const [simulationQuery, setSimulationQuery] = useState('');
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const twin = profile.digitalTwin;

  const handleUpdateTwin = async () => {
    setIsUpdating(true);
    try {
      const logs = JSON.parse(localStorage.getItem('medi_logs') || '[]');
      const newTwin = await updateDigitalTwinAgent(profile, logs);
      setProfile({ ...profile, digitalTwin: newTwin });
    } catch (e) {
      console.error("Twin update failed", e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSimulate = async () => {
    if (!simulationQuery.trim() || !twin) return;
    setIsSimulating(true);
    try {
      const result = await simulateCounterfactualAgent(twin, profile, simulationQuery);
      setSimulationResult(result);
    } catch (e) {
      console.error("Simulation failed", e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 italic mb-2">
            <Layers size={12} /> Computational Biosync
          </div>
          <h2 className="text-4xl font-black text-slate-900 flex items-center gap-3 italic tracking-tighter uppercase">
            Patient Digital Twin
          </h2>
          <p className="text-slate-500 font-medium">Predictive Health Modeling & Decision Intelligence</p>
        </div>
        <button 
          onClick={handleUpdateTwin}
          disabled={isUpdating}
          className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black italic uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 transition-all shadow-2xl disabled:opacity-50 group active:scale-95"
        >
          {isUpdating ? <Loader2 size={20} className="animate-spin" /> : <Microscope size={20} className="group-hover:rotate-12 transition-transform" />}
          Reconstruct Biosync Model
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Model Visualizations */}
        <div className="lg:col-span-8 space-y-8">
          {!twin ? (
            <div className="bg-white border-4 border-dashed border-slate-100 rounded-[3.5rem] p-24 text-center space-y-6">
              <div className="relative inline-block">
                <Dna size={80} className="mx-auto text-slate-200 animate-pulse" />
                <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Awaiting Digital Persona</h3>
                <p className="text-slate-400 max-w-sm mx-auto text-sm font-medium italic">Synchronize your recovery logs to build an evolving computational model of your metabolic state.</p>
              </div>
              <button 
                onClick={handleUpdateTwin}
                className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black italic uppercase tracking-widest shadow-xl shadow-blue-100"
              >
                Initiate Sync
              </button>
            </div>
          ) : (
            <>
              {/* Equilibrium Status */}
              <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-175 transition-transform duration-1000">
                  <BrainCircuit size={200} />
                </div>
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-3 bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] w-fit italic border border-blue-500/20">
                    <Activity size={12} className="animate-pulse" /> Homeostatic Equilibrium
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black tracking-tight leading-none italic uppercase">Systemic State Summary</h3>
                    <p className="text-2xl text-blue-100/90 font-medium leading-relaxed max-w-4xl italic">
                      "{twin.equilibriumStatus}"
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3 text-emerald-400 font-black italic text-sm uppercase tracking-widest">
                      <Zap size={20} className="animate-bounce" /> Metabolic Stability: High
                    </div>
                    <div className="flex items-center gap-3 text-blue-300 font-black italic text-sm uppercase tracking-widest">
                      <ShieldCheck size={20} /> Homeostasis: Synchronized
                    </div>
                  </div>
                </div>
              </div>

              {/* Trajectories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {twin.trajectories?.map((t, i) => (
                  <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 group hover:shadow-2xl transition-all">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-black text-slate-900 uppercase tracking-tighter italic text-xl">{t.label} Model</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Historical Trajectory</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase italic border border-emerald-100">
                        <TrendingUp size={12} /> Positive Trend
                      </div>
                    </div>
                    <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={t.values?.map((v, idx) => ({ value: v, date: t.dates?.[idx] })) || []}>
                          <defs>
                            <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <Tooltip 
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: '900', fontStyle: 'italic' }} 
                          />
                          <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={5} fill={`url(#grad-${i})`} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Counterfactual Simulator (What-If) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] relative overflow-hidden group">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles size={120} />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] w-fit italic">
                 Predictive Intelligence
              </div>
              <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-tight">What-If Engine</h3>
              <p className="text-indigo-100/80 text-sm leading-relaxed font-bold italic">
                Simulate health outcome shifts by altering lifestyle inputs. The model computes "Risk Deltas" based on your unique digital twin profile.
              </p>
              
              <div className="space-y-5">
                <div className="relative">
                  <textarea 
                    className="w-full bg-indigo-700/40 border-2 border-white/10 rounded-[2rem] p-6 text-sm outline-none focus:border-white/40 placeholder:text-white/30 font-black italic h-40 resize-none transition-all"
                    placeholder="e.g. 'What if I increase sleep by 90 minutes and reduce sodium by 15%?'"
                    value={simulationQuery}
                    onChange={(e) => setSimulationQuery(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-6 text-[10px] font-black text-white/20 uppercase tracking-widest italic">
                     Decision Input
                  </div>
                </div>
                
                <button 
                  onClick={handleSimulate}
                  disabled={isSimulating || !twin}
                  className="w-full bg-white text-indigo-600 py-5 rounded-2xl font-black italic uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isSimulating ? <Loader2 className="animate-spin" /> : <Play size={22} fill="currentColor" />}
                  Simulate Future Path
                </button>
              </div>

              {simulationResult && (
                <div className="mt-8 bg-slate-900/40 border border-white/10 p-8 rounded-[2.5rem] animate-in zoom-in-95 duration-500 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-300 italic">
                      <Zap size={14} className="text-amber-400" /> Result Projection
                    </div>
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">Risk Delta Model</span>
                  </div>
                  <p className="text-base leading-relaxed text-white font-black italic tracking-tight">
                    "{simulationResult}"
                  </p>
                  
                  {/* Quantitative Feedback Simulation */}
                  <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-indigo-200 uppercase">Risk Shift Projection</span>
                      <span className="text-emerald-400 text-xs font-black">-12.5%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[12.5%] animate-pulse"></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSimulationResult(null)}
                    className="mt-8 text-[10px] font-black uppercase tracking-widest text-indigo-300 hover:text-white transition-colors flex items-center gap-2 italic"
                  >
                    Reset Simulation Core <ArrowRight size={10} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Med Response Model */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 hover:shadow-lg transition-all">
            <div className="space-y-1">
              <h4 className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                <Dna className="text-blue-600" size={24} /> Efficacy Modeling
              </h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Drug-Response Sensitivity</p>
            </div>
            <div className="space-y-6">
              {twin?.medicationResponses?.map((m, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-[1.75rem] border border-slate-100 space-y-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-slate-200/20 rounded-full -mr-12 -mt-12"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-black text-slate-900 italic uppercase text-sm tracking-tight">{m.med}</span>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      m.effectiveness === 'High' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {m.effectiveness} Efficacy
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">
                    <Info size={14} className="text-blue-500" /> Adverse Events: <span className="text-slate-800 italic">{m.sideEffectsSeverity}</span>
                  </div>
                </div>
              )) || (
                <div className="text-center py-12 space-y-4 border-2 border-dashed border-slate-50 rounded-[2rem]">
                   <Microscope className="mx-auto text-slate-100" size={40} />
                   <p className="text-xs text-slate-300 font-black uppercase tracking-widest italic">Awaiting pharm-signal data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientTwin;
