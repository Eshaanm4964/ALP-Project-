
import React, { useState } from 'react';
import { parseLabReport } from '../geminiService';
import { FileText, Upload, Trash2, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

const LabReportParser: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParse = async () => {
    if (!text && !image) return;
    setLoading(true);
    try {
      let content;
      if (image) {
        const base64Data = image.split(',')[1];
        content = { data: base64Data, mimeType: 'image/jpeg' };
      } else {
        content = text;
      }
      const data = await parseLabReport(content, profile);
      setResult(data || "Parsing failed.");
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
          <FileText className="text-indigo-500" /> Lab Report Parser
        </h2>
        <p className="text-slate-500">Translate complex laboratory values into easy-to-understand language.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Paste Lab Results Text</label>
            <textarea 
              className="w-full bg-slate-50 border rounded-2xl p-4 h-48 focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
              placeholder="e.g. Hemoglobin 14.2 g/dL, WBC 7.5 x 10^3/uL..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={!!image}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Or Upload a Photo</label>
            <div className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${image ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-200 hover:border-indigo-300'}`}>
              {image ? (
                <div className="relative w-full h-full p-2">
                  <img src={image} className="w-full h-full object-contain rounded-xl" alt="Report" />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute top-4 right-4 bg-rose-500 text-white p-1.5 rounded-full shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="text-slate-300" size={40} />
                  <span className="text-sm text-slate-500 font-medium">Click to upload report photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={handleParse}
          disabled={(!text && !image) || loading}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <BookOpen size={20} />}
          Simplify Lab Results
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3">
            <AlertCircle className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700 font-medium italic">
              Disclaimer: This AI analysis is for informational purposes. Always review your results with a qualified healthcare provider.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm prose max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
            <h3 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Simplified Explanation</h3>
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default LabReportParser;
