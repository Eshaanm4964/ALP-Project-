
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageCircle, 
  Stethoscope, 
  UserCircle, 
  TrendingUp,
  ShieldCheck,
  Settings,
  Cpu
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: MessageCircle, label: 'Medi Chat', path: '/chat' },
    { icon: Cpu, label: 'Patient Twin', path: '/twin' },
    { icon: Stethoscope, label: 'Medical Tools', path: '/tools' },
    { icon: TrendingUp, label: 'Health Progress', path: '/progress' },
    { icon: UserCircle, label: 'My Profile', path: '/profile' },
  ];

  return (
    <aside className="w-20 md:w-64 glass border-r flex flex-col h-screen shrink-0">
      <div className="p-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-blue-900 hidden md:block">MediGenie</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}
            `}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="font-medium hidden md:block">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t space-y-1">
        <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-blue-600 rounded-xl transition-colors">
          <Settings className="w-5 h-5 shrink-0" />
          <span className="font-medium hidden md:block">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
