
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { 
  Calculator, Stethoscope, Search, FileText, Pill, 
  MapPin, Route, Zap, Sparkles, BrainCircuit, Activity,
  ShieldPlus
} from 'lucide-react';

const ToolCard = ({ icon: Icon, title, description, color, onClick, badge }: any) => (
  <button 
    onClick={onClick}
    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-left group relative overflow-hidden"
  >
    {badge && (
      <div className="absolute top-4 right-4 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg animate-pulse shadow-lg shadow-blue-200">
        {badge}
      </div>
    )}
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2 italic tracking-tight uppercase">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed font-medium">{description}</p>
  </button>
);

const Tools: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-blue-100 italic">
          <Activity size={12} /> Diagnostic Intelligence
        </div>
        <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase">Clinical Utilities</h2>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          Access specialized medical utilities designed to decode health metrics and simulate potential futures.
        </p>
      </div>

      {/* Advanced Feature Section */}
      <section className="space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] px-2 italic">Decision Intelligence Tools</h3>
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5 group transition-all hover:scale-[1.01]">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
            <Sparkles size={250} />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] w-fit shadow-lg shadow-blue-500/20 italic">
                Experimental Modeling
              </div>
              <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Health 'What-If' Simulator</h3>
              <p className="text-blue-100/70 text-lg font-medium leading-relaxed italic">
                Simulate the quantitative risk deltas of lifestyle changes using your Patient Digital Twin. 
                Move beyond static recommendations to predictive decision intelligence.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {["Risk Deltas", "Future Trajectories", "Digital Twin Sync"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400 italic">
                    <Zap size={12} /> {f}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate('/twin')}
                className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black italic uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center gap-3 active:scale-95 shadow-xl"
              >
                Launch Simulator <Zap size={20} fill="currentColor" />
              </button>
            </div>
            <div className="hidden lg:block relative h-full min-h-[300px]">
              <div className="absolute inset-0 bg-blue-500/10 rounded-[2.5rem] border border-white/10 backdrop-blur-sm p-8 flex flex-col justify-center gap-6 overflow-hidden">
                <div className="space-y-2 animate-pulse">
                  <div className="h-2 w-2/3 bg-white/20 rounded-full"></div>
                  <div className="h-2 w-full bg-white/10 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full bg-blue-500/${i*10} animate-pulse`} />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
                </div>
                <div className="absolute bottom-0 right-0 p-4 opacity-10">
                   <BrainCircuit size={100} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Grid */}
      <section className="space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] px-2 italic">Standard Diagnostic Utilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ToolCard 
            icon={Stethoscope} 
            title="Intelligent Triage" 
            description="Guided AI clinical interviews to assess symptom severity and emergency risk."
            color="bg-emerald-500"
            onClick={() => navigate('/triage')}
            badge="Clinical"
          />
          <ToolCard 
            icon={Route} 
            title="Care Pathway" 
            description="Personalized roadmap of immediate actions, lifestyle adjustments, and red flags."
            color="bg-blue-500"
            onClick={() => navigate('/pathway')}
          />
          <ToolCard 
            icon={Pill} 
            title="Interaction Checker" 
            description="Analyze contraindications and pharmacological conflicts between current medications."
            color="bg-rose-500"
            onClick={() => navigate('/drugs')}
          />
          <ToolCard 
            icon={MapPin} 
            title="Clinic Finder" 
            description="Locate the nearest specialized centers and pharmacies using live Maps grounding."
            color="bg-amber-500"
            onClick={() => navigate('/clinics')}
          />
          <ToolCard 
            icon={FileText} 
            title="Lab Report Parser" 
            description="AI-powered simplification of complex laboratory metrics and blood work values."
            color="bg-indigo-500"
            onClick={() => navigate('/lab-parser')}
          />
          <ToolCard 
            icon={Search} 
            title="Medical Search" 
            description="Access peer-reviewed clinical research and news with synthesized summaries."
            color="bg-slate-700"
            onClick={() => navigate('/med-search')}
          />
        </div>
      </section>

      <div className="bg-indigo-50 rounded-[3rem] p-12 text-slate-900 flex flex-col md:flex-row items-center justify-between gap-12 mt-12 border border-indigo-100 shadow-sm relative overflow-hidden">
        {/* Fixed: Added missing ShieldPlus import */}
        <div className="absolute top-0 left-0 p-8 opacity-5 text-indigo-600">
          <ShieldPlus size={150} />
        </div>
        <div className="space-y-4 max-w-xl relative z-10">
          <h3 className="text-3xl font-black italic tracking-tighter uppercase">Professional Verification</h3>
          <p className="text-slate-600 font-medium italic leading-relaxed">
            MediGenie provides advanced decision intelligence, but always verify critical findings with a certified health professional.
          </p>
        </div>
        <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black italic uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 shrink-0 relative z-10">
          Connect to Specialist
        </button>
      </div>
    </div>
  );
};

export default Tools;
