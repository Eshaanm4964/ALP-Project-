
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Heart, User, Activity, ShieldPlus, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    age: 0,
    gender: 'Male',
    weight: 0,
    height: 0,
    bloodGroup: 'A+',
    allergies: [],
    medicalHistory: '',
    isRegistered: false,
  });

  const nextStep = () => setStep(prev => prev + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white">
        <div className="bg-blue-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Heart size={120} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Welcome to MediGenie</h2>
          <p className="text-blue-100">Let's set up your personal health profile.</p>
          
          <div className="flex gap-2 mt-6">
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${s <= step ? 'bg-white' : 'bg-blue-400 opacity-50'}`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-blue-800 font-semibold mb-4">
                <User size={20} />
                <h3>Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                  <input
                    required
                    type="number"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={formData.age || ''}
                    onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={20} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-blue-800 font-semibold mb-4">
                <Activity size={20} />
                <h3>Physical Metrics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
                    value={formData.weight || ''}
                    onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
                    value={formData.height || ''}
                    onChange={e => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Medical History <ChevronRight size={20} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-blue-800 font-semibold mb-4">
                <ShieldPlus size={20} />
                <h3>Safety & History</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Known Allergies (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
                  value={formData.allergies.join(', ')}
                  onChange={e => setFormData({ ...formData, allergies: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brief Medical History</label>
                <textarea
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none h-32"
                  placeholder="Tell us about any past conditions or current medications..."
                  value={formData.medicalHistory}
                  onChange={e => setFormData({ ...formData, medicalHistory: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
              >
                Complete Registration
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
