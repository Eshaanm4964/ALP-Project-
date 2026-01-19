
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Save, User, Scale, Ruler, Droplet, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, setProfile }) => {
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [showSaved, setShowSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate a brief network delay for better UX feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setProfile(editedProfile);
    setIsSaving(false);
    setShowSaved(true);
    
    // Scroll to top to ensure success message is seen
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => setShowSaved(false), 4000);
  };

  const handleAllergyChange = (value: string) => {
    const allergiesArr = value.split(',').map(s => s.trim()).filter(s => s !== '');
    setEditedProfile({ ...editedProfile, allergies: allergiesArr });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">My Health Profile</h2>
          <p className="text-slate-500">Keep your medical records accurate for better AI assistance.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:cursor-not-allowed min-w-[160px] justify-center"
        >
          {isSaving ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
          <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      {showSaved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl flex items-center gap-4 animate-in zoom-in-95 fade-in duration-300 shadow-sm">
          <div className="bg-emerald-500 p-1 rounded-full text-white">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="font-bold text-sm">Update Successful!</p>
            <p className="text-xs text-emerald-600">Your medical profile has been synchronized with MediGenie.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-white shadow-md">
                <User size={48} className="text-blue-600" />
              </div>
              <div className="absolute bottom-4 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{profile.name}</h3>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{profile.gender} • {profile.age} years</p>
          </div>

          <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold">
              <AlertTriangle size={18} />
              <h4>Allergies & Alerts</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {editedProfile.allergies.length > 0 ? (
                editedProfile.allergies.map((a, i) => (
                  <span key={i} className="bg-white px-3 py-1 rounded-full text-xs font-bold text-rose-700 border border-rose-200 shadow-sm">
                    {a}
                  </span>
                ))
              ) : (
                <p className="text-xs text-rose-600 italic">No medical alerts documented.</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            <h4 className="font-bold text-lg text-slate-900 border-b border-slate-50 pb-4">Biometric Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Scale size={14} /> Body Weight (kg)
                </label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  value={editedProfile.weight}
                  onChange={e => setEditedProfile({...editedProfile, weight: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Ruler size={14} /> Height (cm)
                </label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  value={editedProfile.height}
                  onChange={e => setEditedProfile({...editedProfile, height: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Droplet size={14} /> Blood Type
                </label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  value={editedProfile.bloodGroup}
                  onChange={e => setEditedProfile({...editedProfile, bloodGroup: e.target.value})}
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   Allergies (comma separated)
                </label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  value={editedProfile.allergies.join(', ')}
                  onChange={e => handleAllergyChange(e.target.value)}
                  placeholder="e.g. Peanuts, Aspirin"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="font-bold text-lg text-slate-900 border-b border-slate-50 pb-4">Long-term Medical History</h4>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 h-48 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none leading-relaxed"
              value={editedProfile.medicalHistory}
              onChange={e => setEditedProfile({...editedProfile, medicalHistory: e.target.value})}
              placeholder="Describe any chronic conditions, past surgeries, or recurring health issues..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
