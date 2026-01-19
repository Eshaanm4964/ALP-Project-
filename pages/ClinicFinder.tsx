
import React, { useState, useEffect } from 'react';
import { findNearbyClinics } from '../geminiService';
import { MapPin, Search, Loader2, Navigation, ExternalLink } from 'lucide-react';

const ClinicFinder: React.FC = () => {
  const [specialty, setSpecialty] = useState('General');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error("Geolocation failed", err)
    );
  }, []);

  const handleSearch = async () => {
    if (!location) {
      alert("Please allow location access to find nearby clinics.");
      return;
    }
    setLoading(true);
    try {
      const data = await findNearbyClinics(specialty, location.lat, location.lng);
      setResponse(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sources = response?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <MapPin className="text-amber-500" /> Clinic Finder
        </h2>
        <p className="text-slate-500">Locate specialized medical centers using live Google Maps data.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">What are you looking for?</label>
          <div className="flex gap-2">
            <select 
              className="flex-1 bg-slate-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              {['General', 'Emergency', 'Dental', 'Pediatrics', 'Cardiology', 'Mental Health', 'Radiology'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-amber-500 text-white px-8 py-3 rounded-xl hover:bg-amber-600 transition-all flex items-center gap-2 font-bold shadow-lg shadow-amber-100 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
              Find Now
            </button>
          </div>
        </div>
      </div>

      {response && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm prose max-w-none">
            <h3 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">
              <Navigation size={20} className="text-amber-500" /> Recommended Locations
            </h3>
            <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {response.text}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((chunk: any, i: number) => chunk.maps && (
              <a 
                key={i} 
                href={chunk.maps.uri} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-amber-500 transition-all group flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <MapPin size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{chunk.maps.title || "View on Maps"}</h4>
                    <p className="text-xs text-slate-400">Google Maps Verified</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicFinder;
