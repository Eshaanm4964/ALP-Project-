
import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Calendar, Activity, CheckCircle2, AlertCircle, Loader2, BrainCircuit, RefreshCw } from 'lucide-react';
import { FollowUpLog, UserProfile } from '../types';
import { followUpAgent, summarizeHealthMemory, updateDigitalTwinAgent } from '../geminiService';

const HealthProgress: React.FC<{ profile: UserProfile, setProfile: (p: UserProfile) => void }> = ({ profile, setProfile }) => {
  const [logs, setLogs] = useState<FollowUpLog[]>(() => {
    const saved = localStorage.getItem('medi_logs');
    return saved ? JSON.parse(saved).map((l:any) => ({...l, date: new Date(l.date)})) : [];
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newLog, setNewLog] = useState({ condition: '', status: 'Stable', notes: '' });
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshingMemory, setIsRefreshingMemory] = useState(false);

  useEffect(() => {
    localStorage.setItem('medi_logs', JSON.stringify(logs));
  }, [logs]);

  const refreshMemory = async (currentLogs: FollowUpLog[]) => {
    setIsRefreshingMemory(true);
    try {
      const summary = await summarizeHealthMemory(profile, currentLogs);
      const newTwin = await updateDigitalTwinAgent(profile, currentLogs);
      setProfile({ ...profile, healthSummary: summary, digitalTwin: newTwin });
    } catch (e) {
      console.error("Memory/Twin refresh failed", e);
    } finally {
      setIsRefreshingMemory(false);
    }
  };

  const handleAddLog = async () => {
    if (!newLog.condition || !newLog.notes) return;
    setLoading(true);
    
    const log: FollowUpLog = {
      id: Date.now().toString(),
      date: new Date(),
      condition: newLog.condition,
      status: newLog.status as any,
      notes: newLog.notes
    };

    try {
      const feedback = await followUpAgent(profile, logs, JSON.stringify(log));
      setAiFeedback(feedback || "Log saved successfully.");
      const updatedLogs = [log, ...logs];
      setLogs(updatedLogs);
      
      // Refresh AI Long-Term Memory & Digital Twin
      await refreshMemory(updatedLogs);
      
      setNewLog({ condition: '', status: 'Stable', notes: '' });
      setShowAdd(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2 tracking-tight italic">
            <TrendingUp className="text-blue-600" /> RECOVERY TRACKER
          </h2>
          <p className="text-slate-500 font-medium">The Follow-up Agent monitor your health narrative and syncs your Digital Twin.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} /> Log New Evidence
        </button>
      </div>

      {/* Long Term Memory Summary Card */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/10 group cursor-default">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
          <BrainCircuit size={150} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-[0.2em] text-[10px]">
              <BrainCircuit size={16} /> Agentic Longitudinal Intelligence
            </div>
            <h3 className="text-2xl font-black italic tracking-tighter uppercase">Health Narrative Sync</h3>
            <p className="text-blue-100/80 text-lg leading-relaxed font-medium italic">
              {profile.healthSummary ? `"${profile.healthSummary}"` : "Model waiting for evidence logs to synchronize digital twin state."}
            </p>
          </div>
          <button 
            onClick={() => refreshMemory(logs)}
            disabled={isRefreshingMemory || logs.length === 0}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl text-xs font-black uppercase italic tracking-widest transition-all disabled:opacity-30"
          >
            {isRefreshingMemory ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Synchronize
          </button>
        </div>
      </div>

      {aiFeedback && (
        <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-blue-600" size={24} />
            <h4 className="font-black text-slate-900 italic tracking-tighter uppercase">Follow-up Analysis</h4>
          </div>
          <p className="text-slate-700 text-lg leading-relaxed font-medium italic">"{aiFeedback}"</p>
          <button onClick={() => setAiFeedback(null)} className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-6 hover:text-blue-600 transition-colors">Dismiss Report</button>
        </div>
      )}

      {showAdd && (
        <div className="bg-white p-10 rounded-[2.5rem] border shadow-2xl animate-in slide-in-from-top-8 duration-500">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase">Document New State</h3>
            <button onClick={() => setShowAdd(false)} className="text-slate-300 hover:text-rose-500 transition-colors"><Calendar size={24}/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observable Condition</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition-all font-bold text-slate-900"
                placeholder="e.g. Morning Hypertension"
                value={newLog.condition}
                onChange={e => setNewLog({...newLog, condition: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Status</label>
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition-all font-bold text-slate-900"
                value={newLog.status}
                onChange={e => setNewLog({...newLog, status: e.target.value})}
              >
                <option>Improving</option>
                <option>Stable</option>
                <option>Worsening</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes & Signal Data</label>
              <textarea 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 h-40 outline-none focus:border-blue-500 transition-all font-bold text-slate-700 resize-none leading-relaxed"
                placeholder="Record qualitative observations or specific numerical readings (HR, Temp, BP)..."
                value={newLog.notes}
                onChange={e => setNewLog({...newLog, notes: e.target.value})}
              />
            </div>
          </div>
          <button 
            onClick={handleAddLog}
            disabled={loading || !newLog.condition}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black italic uppercase tracking-[0.2em] mt-10 hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24}/>}
            Commit & Recompute Twin State
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {logs.length === 0 ? (
          <div className="bg-white p-24 rounded-[3rem] border-2 border-dashed border-slate-100 text-center space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="text-slate-200" size={40} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Zero Signal History Detected</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                    log.status === 'Improving' ? 'bg-emerald-50 text-emerald-500' : 
                    log.status === 'Worsening' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {log.status === 'Improving' ? <TrendingUp size={28}/> : 
                     log.status === 'Worsening' ? <AlertCircle size={28}/> : <Activity size={28}/>}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 italic tracking-tighter uppercase text-xl">{log.condition}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.date.toLocaleDateString()} @ {log.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                  log.status === 'Improving' ? 'bg-emerald-50 text-emerald-600' : 
                  log.status === 'Worsening' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {log.status}
                </span>
              </div>
              <p className="mt-6 text-slate-600 font-medium leading-relaxed pl-20 italic">"{log.notes}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HealthProgress;
