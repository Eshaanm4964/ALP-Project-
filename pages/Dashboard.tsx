
import React from 'react';
import { UserProfile } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Activity, Thermometer, Heart, Droplets, ArrowRight, BrainCircuit, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockActivityData = [
  { name: 'Mon', steps: 4000, heart: 72 },
  { name: 'Tue', steps: 3000, heart: 75 },
  { name: 'Wed', steps: 2000, heart: 68 },
  { name: 'Thu', steps: 2780, heart: 70 },
  { name: 'Fri', steps: 1890, heart: 74 },
  { name: 'Sat', steps: 2390, heart: 76 },
  { name: 'Sun', steps: 3490, heart: 72 },
];

const StatCard = ({ icon: Icon, label, value, unit, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <p className="text-slate-500 text-sm font-medium">{label}</p>
    <h3 className="text-2xl font-bold text-slate-900 mt-1">
      {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
    </h3>
  </div>
);

const Dashboard: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const navigate = useNavigate();
  const bmi = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Health Overview</h2>
          <p className="text-slate-500">Welcome back, {profile.name}. Your Agentic Memory is synced.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center gap-2 w-fit">
          Generate Health Report <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Long Term Memory Summary */}
        <div 
          onClick={() => navigate('/progress')}
          className="lg:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl cursor-pointer hover:scale-[1.01] transition-transform"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
            <BrainCircuit size={120} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-blue-200 font-bold uppercase tracking-widest text-[10px]">
              <ShieldCheck size={14} /> Agentic Health Narrative
            </div>
            <p className="text-lg md:text-xl font-medium leading-relaxed italic max-w-4xl">
              {profile.healthSummary ? `"${profile.healthSummary}"` : "MediGenie is still learning your health patterns. Log some data to generate an insight."}
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-100/60">
              <Activity size={12} /> Last synced moments ago
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Heart} label="Heart Rate" value="72" unit="bpm" color="bg-rose-500" />
        <StatCard icon={Activity} label="BMI Index" value={bmi} unit="kg/m²" color="bg-amber-500" />
        <StatCard icon={Thermometer} label="Body Temp" value="36.6" unit="°C" color="bg-indigo-500" />
        <StatCard icon={Droplets} label="Blood Group" value={profile.bloodGroup} unit="" color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Activity Trends</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-slate-500">Steps</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockActivityData}>
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="steps" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSteps)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Medical Logs</h3>
          <div className="space-y-4">
            {[
              { title: 'General Checkup', date: 'Oct 24, 2023', status: 'Completed', color: 'text-emerald-600 bg-emerald-50' },
              { title: 'Blood Test', date: 'Nov 12, 2023', status: 'Pending', color: 'text-amber-600 bg-amber-50' },
              { title: 'Dental Screening', date: 'Dec 05, 2023', status: 'Upcoming', color: 'text-blue-600 bg-blue-50' }
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="font-semibold text-slate-900">{log.title}</h4>
                  <p className="text-xs text-slate-500">{log.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${log.color}`}>
                  {log.status}
                </span>
              </div>
            ))}
            <button className="w-full py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
              View All Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
