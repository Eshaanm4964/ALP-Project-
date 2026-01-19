
import React, { useState } from 'react';
import { UserProfile, TriageStep } from '../types';
import { getNextTriageStep } from '../geminiService';
import { Activity, AlertCircle, ChevronRight, Loader2, RefreshCcw, ShieldAlert } from 'lucide-react';

const SymptomTriage: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [symptoms, setSymptoms] = useState('');
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);
  const [currentStep, setCurrentStep] = useState<TriageStep | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const startTriage = async () => {
    if (!symptoms) return;
    setLoading(true);
    setStarted(true);
    try {
      const step = await getNextTriageStep(profile, symptoms, []);
      setCurrentStep(step);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (answer: string) => {
    setLoading(true);
    const newHistory = [...history, { question: currentStep!.question, answer }];
    setHistory(newHistory);
    try {
      const step = await getNextTriageStep(profile, symptoms, newHistory);
      setCurrentStep(step);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStarted(false);
    setSymptoms('');
    setHistory([]);
    setCurrentStep(null);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Emergency': return 'bg-red-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-slate-900';
      default: return 'bg-emerald-500 text-white';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <Activity className="text-emerald-500" /> Intelligent Symptom Triage
        </h2>
        <p className="text-slate-500">A structured AI clinical interview to evaluate your health risks.</p>
      </div>

      {!started ? (
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">What symptoms are you experiencing?</label>
            <textarea
              className="w-full bg-slate-50 border rounded-2xl p-4 h-32 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="e.g. Sharp pain in lower abdomen, started 2 hours ago..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>
          <button
            onClick={startTriage}
            disabled={!symptoms}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            Start Assessment <ChevronRight />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white p-12 rounded-3xl border shadow-sm flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-emerald-500" size={40} />
              <p className="text-slate-500 font-medium italic">MediGenie is analyzing your input...</p>
            </div>
          ) : currentStep ? (
            <div className="bg-white rounded-3xl border shadow-lg overflow-hidden">
              <div className={`p-4 flex items-center justify-between ${getRiskColor(currentStep.riskLevel)}`}>
                <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  <ShieldAlert size={14} /> {currentStep.riskLevel} Risk Level
                </span>
                <span className="text-[10px] opacity-80 italic">Step {history.length + 1}</span>
              </div>

              <div className="p-8 space-y-8">
                {currentStep.isComplete ? (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                      <h4 className="font-bold text-emerald-900 mb-2 text-xl">Assessment Complete</h4>
                      <p className="text-emerald-700 leading-relaxed">{currentStep.result?.recommendation}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Risk Score</p>
                        <p className="text-2xl font-bold text-slate-900">{currentStep.result?.riskScore}/100</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Urgency</p>
                        <p className="text-lg font-bold text-slate-900">{currentStep.result?.urgency}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-700">Possible Conditions:</p>
                      <div className="flex flex-wrap gap-2">
                        {currentStep.result?.potentialConditions.map((c, i) => (
                          <span key={i} className="bg-white border px-3 py-1 rounded-full text-xs text-slate-600 font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={reset}
                      className="w-full py-4 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCcw size={18} /> New Assessment
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-slate-900 leading-tight">{currentStep.question}</h3>
                      <p className="text-sm text-slate-400 italic">{currentStep.summarySoFar}</p>
                    </div>

                    <div className="space-y-3">
                      {currentStep.options ? (
                        currentStep.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => submitAnswer(opt)}
                            className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group flex items-center justify-between"
                          >
                            <span className="font-medium text-slate-700 group-hover:text-emerald-700">{opt}</span>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500" />
                          </button>
                        ))
                      ) : (
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            className="w-full bg-slate-50 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Type your answer here..."
                            onKeyDown={(e) => e.key === 'Enter' && submitAnswer((e.target as HTMLInputElement).value)}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : null}

          {currentStep?.riskLevel === 'Emergency' && (
            <div className="bg-red-50 border-2 border-red-500 p-6 rounded-3xl flex items-center gap-4 animate-pulse">
              <AlertCircle size={40} className="text-red-500 shrink-0" />
              <div>
                <h4 className="text-red-900 font-bold text-lg">EMERGENCY DETECTED</h4>
                <p className="text-red-700 text-sm">Please stop this assessment and seek immediate emergency medical care or call 911/emergency services.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SymptomTriage;
