
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { UserProfile, ChatMessage, AgentName } from '../types';
import { chatWithMediGenie, prescriptionSafetyAgent } from '../geminiService';
import { 
  Send, User, ShieldCheck, Info, Loader2, Search, 
  ExternalLink, Mic, MicOff, ImageIcon, X, AlertCircle,
  BrainCircuit, Library, ShieldAlert, ClipboardCheck, Lock, Pill, AlertTriangle,
  RefreshCcw, Cpu, Sparkles, Database, Microscope, Globe, Banknote, Tag, ShoppingCart,
  Layers, Dna, Activity, Workflow, Zap, Scan, ShieldAlert as ShieldWarning
} from 'lucide-react';

const MEDICAL_TERMS = [
  'Aspirin', 'Penicillin', 'Metformin', 'Amoxicillin', 'Ibuprofen', 'Atorvastatin', 'Lisinopril', 
  'Omeprazole', 'Insulin', 'Levothyroxine', 'Albuterol', 'Amlodipine', 'Sertraline', 'Losartan',
  'Immunotherapy', 'Chemotherapy', 'Dialysis', 'Angioplasty', 'Vaccination', 'Gene Therapy', 
  'Stem Cell', 'Radiotherapy', 'Endoscopy', 'Laparoscopy', 'Detox', 'Rehab', 'CRISPR',
  'Homeostasis', 'Metabolism', 'Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Antibiotics',
  'Diagnostics', 'Synthesis', 'Biosync', 'Trauma Care', 'Pharma', 'Clinical Trial', 'Pathology'
];

const MedicalParticleField = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      term: MEDICAL_TERMS[i % MEDICAL_TERMS.length],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 20}s`,
      fontSize: `${10 + Math.random() * 12}px`,
      opacity: 0.05 + Math.random() * 0.1,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute whitespace-nowrap font-black uppercase tracking-widest text-slate-900 animate-revolve italic"
          style={{
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.fontSize,
            opacity: p.opacity,
          }}
        >
          {p.term}
        </div>
      ))}
    </div>
  );
};

const AgentBadge = ({ name, isLearning }: { name: AgentName, isLearning?: boolean }) => {
  const getIcon = () => {
    switch(name) {
      case 'Symptom Analyzer': return <BrainCircuit size={10} />;
      case 'Medical Librarian': return <Library size={10} />;
      case 'Risk Evaluator': return <ShieldAlert size={10} />;
      case 'Action Planner': return <ClipboardCheck size={10} />;
      case 'Safety Officer': return <Lock size={10} />;
      case 'Prescription Safety Agent': return <Pill size={10} />;
      case 'Memory Agent': return <Database size={10} />;
      case 'Twin Architect Agent': return <Cpu size={10} />;
      case 'Counterfactual Simulator': return <Sparkles size={10} />;
      default: return <ShieldCheck size={10} />;
    }
  };

  const colors: Record<string, string> = {
    'Symptom Analyzer': 'bg-purple-50 text-purple-600 border-purple-200',
    'Prescription Safety Agent': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Safety Officer': 'bg-rose-50 text-rose-600 border-rose-200',
    'Medical Librarian': 'bg-blue-50 text-blue-600 border-blue-200',
    'Memory Agent': 'bg-indigo-50 text-indigo-600 border-indigo-200',
    'Twin Architect Agent': 'bg-cyan-50 text-cyan-600 border-cyan-200',
    'Counterfactual Simulator': 'bg-amber-50 text-amber-600 border-amber-200',
  };

  const colorClass = colors[name as string] || 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <div className={`flex items-center gap-3 mb-2`}>
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${colorClass}`}>
        <span className="shrink-0 animate-pulse">{getIcon()}</span>
        <span className="italic">{name}</span>
      </div>
      {isLearning && (
        <div className="flex items-center gap-1.5 text-[9px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 uppercase tracking-tighter italic animate-pulse shadow-sm">
          <AlertCircle size={10} className="animate-spin-slow" /> Low Confidence / Learning
        </div>
      )}
    </div>
  );
};

const PrescriptionCard = ({ rec }: { rec: ChatMessage['recommendation'] }) => {
  if (!rec) return null;
  return (
    <div className="bg-white border-2 border-emerald-100 rounded-[2rem] overflow-hidden shadow-2xl mt-4 animate-in zoom-in-95 duration-500 max-w-sm">
      <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Pill size={20} />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Clinical Advice Slip</span>
        </div>
        <ShoppingCart size={18} className="opacity-40" />
      </div>
      
      <div className="p-6 space-y-5">
        <div>
          <h4 className="text-2xl font-black text-slate-900 leading-tight italic uppercase tracking-tighter">{rec.medication}</h4>
          <div className="flex items-center gap-3 mt-2">
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">Verified OTC</span>
            <div className="flex items-center gap-1.5 text-slate-800 text-sm font-black italic">
              <Tag size={14} className="text-emerald-500" /> {rec.price || "N/A"}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-slate-200/20 rounded-full -mr-10 -mt-10"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
             Precision Dosage
          </p>
          <p className="text-base font-bold text-slate-800 leading-relaxed italic relative z-10">"{rec.dosage}"</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
              <AlertTriangle size={14} /> Critical Warnings
            </p>
            <ul className="space-y-2 pl-1">
              {rec.warnings?.map((w, i) => (
                <li key={i} className="text-[11px] text-slate-700 flex items-start gap-2.5 font-semibold italic">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0 animate-pulse" /> {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
            <Banknote size={14} /> Estimated Retail Price
          </div>
          <div className="bg-slate-900 text-white px-3 py-1 rounded-lg text-sm font-black tracking-tighter italic">
            {rec.price || "$--.--"}
          </div>
        </div>
      </div>
    </div>
  );
};

const Chat: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const getInitialMessage = (): ChatMessage => ({
    role: 'model',
    text: `Greetings ${profile.name}. MediGenie Clinical Cluster is online. I have analyzed your Digital Twin and current health baseline. How can the cluster assist your medical journey?`,
    timestamp: new Date(),
    activeAgent: 'Safety Officer'
  });

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage()]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentThinkingAgent, setCurrentThinkingAgent] = useState<string>('Orchestrator');
  const [thinkingStep, setThinkingStep] = useState<string>('Initializing Synapse');
  const [thinkingProgress, setThinkingProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isTyping) {
      const agents = ['Orchestrator', 'Prescription Safety Agent', 'Symptom Analyzer', 'Medical Librarian', 'Safety Officer'];
      const steps = [
        'Initializing Multi-Agent Synapse...',
        'Querying Peer-Reviewed Literature...', 
        'Cross-referencing Digital Twin Vitals...', 
        'Analyzing Pharmacological Interactions...', 
        'Generating Risk Trajectories...',
        'Finalizing Clinical Response Path...'
      ];
      
      let i = 0;
      setThinkingProgress(0);
      const interval = setInterval(() => {
        setCurrentThinkingAgent(agents[i % agents.length]);
        setThinkingStep(steps[Math.min(i, steps.length - 1)]);
        setThinkingProgress(prev => Math.min(prev + 15, 95));
        i++;
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  const handleNewChat = () => {
    if (window.confirm("Purge clinical context and restart agentic session?")) {
      setMessages([getInitialMessage()]);
      setInput('');
      setSelectedImage(null);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isTyping) return;

    const userMsg: ChatMessage = { 
      role: 'user', 
      text: input || (selectedImage ? "Clinical Visual Input Session." : ""), 
      image: selectedImage || undefined,
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentImage = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await chatWithMediGenie(currentInput || "Clinical observation.", currentImage, history, profile);
      const fullText = response.text || "Clinical cluster connection failure.";
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      let recommendation = undefined;
      let activeAgent: AgentName = 'Medical Librarian';

      const inputLower = currentInput.toLowerCase();
      if (currentImage) activeAgent = 'Symptom Analyzer';
      else if (inputLower.match(/med|pill|tablet|dose|interaction|price|cost|buy|treat|medicine|relief/)) activeAgent = 'Prescription Safety Agent';
      else if (inputLower.match(/simulate|predict|if i/)) activeAgent = 'Counterfactual Simulator';
      else if (inputLower.match(/history|last time|previously/)) activeAgent = 'Memory Agent';

      if (activeAgent === 'Prescription Safety Agent' || inputLower.match(/pain|fever|cough|sore|flu|cold|headache|ache/)) {
        activeAgent = 'Prescription Safety Agent';
        try {
          recommendation = await prescriptionSafetyAgent(currentInput, profile);
        } catch (e) { console.error(e); }
      }

      const isLearning = fullText.includes('?') && fullText.length < 250;

      const botMsg: ChatMessage = {
        role: 'model',
        text: fullText,
        timestamp: new Date(),
        activeAgent: activeAgent,
        confidence: isLearning ? 'Low' : 'High',
        recommendation: recommendation && recommendation.medication ? recommendation : undefined,
        sources: sources.map((s: any) => ({ title: s.web?.title || 'Clinical Grounding', uri: s.web?.uri || '#' }))
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Clinical Safety Protocol: Session interrupted. Attempting to re-establish agentic connection...",
        timestamp: new Date(),
        activeAgent: 'Safety Officer'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto border glass rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in duration-700 relative">
      {/* Dynamic Background during typing */}
      {isTyping && <MedicalParticleField />}
      
      {/* Header */}
      <div className="bg-slate-900 p-7 text-white flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] rotate-6 border border-white/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-black italic uppercase tracking-tighter text-2xl leading-tight">MediGenie Clinical Cluster</h3>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex gap-2">
                {[1, 2, 3].map((a) => (
                  <span key={a} className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                ))}
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Multi-Agent Synapse Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleNewChat}
          className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 group active:scale-95"
        >
          <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
          Purge Session
        </button>
      </div>

      {/* Prominent Medical Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-8 py-4 flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 relative z-10">
        <div className="bg-amber-500 p-2 rounded-xl text-white shrink-0 shadow-lg shadow-amber-200/50">
          <ShieldWarning size={20} />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 italic">Medical Safety Protocol</h4>
          <p className="text-sm font-bold text-amber-900 italic leading-tight">
            MediGenie AI is not a medical diagnosis tool. All information is for educational purposes only. <span className="underline decoration-amber-400/50 underline-offset-2">Always consult a qualified doctor</span> for medical advice.
          </p>
        </div>
        <div className="ml-auto hidden md:block">
          <div className="flex items-center gap-2 bg-amber-200/50 px-3 py-1 rounded-full text-[9px] font-black text-amber-700 uppercase tracking-widest italic">
            <AlertCircle size={12} /> Priority 1: User Safety
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-slate-50/10 scroll-smooth relative z-10" ref={scrollRef}>
        {messages?.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-5 duration-500`}>
            <div className={`flex gap-6 max-w-[92%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl border ${
                m.role === 'user' ? 'bg-slate-900 text-white border-white/10' : 'bg-white text-blue-600 border-slate-100'
              }`}>
                {m.role === 'user' ? <User size={28} /> : <ShieldCheck size={28} />}
              </div>
              <div className="flex flex-col space-y-1">
                {m.activeAgent && <AgentBadge name={m.activeAgent} isLearning={m.confidence === 'Low'} />}
                <div className={`p-8 rounded-[2.5rem] shadow-sm space-y-5 relative overflow-hidden transition-all ${
                  m.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-tr-none' 
                  : `bg-white text-slate-800 rounded-tl-none border border-slate-100 ${m.confidence === 'Low' ? 'ring-2 ring-rose-500/20' : ''}`
                }`}>
                  {m.confidence === 'Low' && m.role === 'model' && (
                    <div className="flex items-center gap-2 mb-4 bg-rose-50 p-3 rounded-2xl border border-rose-100 animate-pulse">
                      <AlertCircle className="text-rose-500 shrink-0" size={18} />
                      <p className="text-[11px] font-black text-rose-600 uppercase tracking-widest italic leading-tight">
                        Experimental Reasoning Active: Clinical evidence requested.
                      </p>
                    </div>
                  )}

                  {m.image && (
                    <div className="rounded-[1.75rem] overflow-hidden mb-6 border-2 border-white/5 shadow-2xl">
                      <img src={m.image} alt="Clinical Visual Input" className="w-full h-auto object-cover max-h-[500px]" />
                    </div>
                  )}
                  <p className={`text-lg leading-relaxed whitespace-pre-wrap font-bold italic tracking-tight ${m.confidence === 'Low' && m.role === 'model' ? 'text-rose-800' : ''}`}>{m.text}</p>
                  
                  {m.recommendation && <PrescriptionCard rec={m.recommendation} />}

                  {m.sources && m.sources.length > 0 && (
                    <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 italic">
                        <Globe size={14} className="text-blue-500" /> Grounding Evidence
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {m.sources?.map((s, idx) => (
                          <a 
                            key={idx} 
                            href={s.uri} 
                            target="_blank" 
                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-400 hover:bg-white transition-all group"
                          >
                            <span className="text-xs font-black text-slate-800 truncate mr-3 italic tracking-tight">{s.title}</span>
                            <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-500 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* --- SOPHISTICATED AGENTIC LOADING INDICATOR --- */}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in zoom-in-95 duration-500 relative z-10">
            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-xl flex items-center justify-center text-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-50/50 animate-pulse"></div>
                <Layers size={30} className="animate-bounce relative z-10" />
                <div className="absolute inset-0 border-2 border-blue-500/20 rounded-2xl animate-spin-slow"></div>
              </div>
              
              <div className="bg-white p-8 rounded-[2.5rem] rounded-tl-none shadow-2xl border border-slate-100 space-y-6 min-w-[360px] relative overflow-hidden group">
                {/* Background Scanning Animation */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan z-20"></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Dna size={20} className="text-blue-600 animate-spin-slow" />
                      <div className="absolute inset-0 bg-blue-400/20 blur-lg rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] text-blue-600 italic">Clinical Synthesis Engine</span>
                  </div>
                  <div className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                    Cluster Status: <span className="text-emerald-500">Deep Reasoning</span>
                  </div>
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                    <div className="flex items-center gap-2">
                       <Workflow size={14} className="text-blue-400" /> Agent: {currentThinkingAgent}
                    </div>
                    <span className="text-blue-500 tabular-nums">{thinkingProgress}%</span>
                  </div>
                  
                  {/* Advanced Progress Bar */}
                  <div className="h-3 w-full bg-slate-50 rounded-full border border-slate-100 p-0.5 overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600 rounded-full transition-all duration-700 ease-out relative"
                      style={{ width: `${thinkingProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-shimmer"></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-black text-slate-800 italic flex items-center gap-3 animate-pulse">
                      <Zap size={16} className="text-amber-500" /> {thinkingStep}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Grounding Linked</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse delay-300 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Model Equilibrium Check</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 p-4 opacity-[0.03] rotate-12 -mr-4 -mb-4">
                  <Scan size={120} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Command Buffer */}
      <div className="p-8 bg-white border-t border-slate-100 relative z-10">
        <div className="flex items-center gap-5 max-w-5xl mx-auto">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 bg-slate-50 text-slate-500 hover:bg-blue-600 hover:text-white rounded-[1.5rem] flex items-center justify-center transition-all group shadow-inner border border-slate-100 active:scale-95"
          >
            <ImageIcon size={28} className="group-hover:scale-110 transition-transform" />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e:any) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
          }} />
          
          <div className="flex-1 relative group">
            <input
              type="text"
              className="w-full bg-slate-50 border-2 border-transparent rounded-[2.25rem] px-10 py-6 text-lg font-black italic focus:outline-none focus:border-blue-500/20 focus:bg-white placeholder:text-slate-300 transition-all tracking-tight"
              placeholder="Query symptoms, request costings, or run simulations..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
              <Mic size={20} className="text-slate-300 hover:text-blue-500 cursor-pointer transition-colors" />
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={isTyping || (!input.trim() && !selectedImage)}
            className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] disabled:bg-slate-200 transition-all hover:scale-105 active:scale-95 group"
          >
            <Send size={32} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-8 mt-8">
          <p className="text-[11px] text-slate-400 flex items-center gap-2.5 font-black uppercase tracking-[0.25em] italic">
            <AlertCircle size={14} className="text-amber-500 animate-pulse" /> Non-Diagnostic Experimental Intelligence
          </p>
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
          <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] italic">
            Patient Memory Sync Active
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(300px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: 0 0; }
          100% { background-position: 40px 0; }
        }
        .animate-shimmer {
          animation: shimmer 1s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes revolve {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(100px, 50px) rotate(90deg); }
          50% { transform: translate(50px, 150px) rotate(180deg); }
          75% { transform: translate(-80px, 70px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        .animate-revolve {
          animation: revolve linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Chat;
