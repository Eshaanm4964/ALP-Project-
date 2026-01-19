
import React, { useRef } from 'react';
import { UserProfile } from '../types';
import { Bell, Search, User, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  profile: UserProfile;
  onLanguageChange?: (lang: string) => void;
}

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Hindi', 'Chinese', 'Arabic', 'Japanese', 'Portuguese'
];

const Header: React.FC<HeaderProps> = ({ profile, onLanguageChange }) => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSearchClick = () => {
    searchInputRef.current?.focus();
  };

  return (
    <header className="h-16 glass border-b flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 
          className="text-xl font-bold text-blue-900 hidden md:block cursor-pointer hover:text-blue-700 transition-colors"
          onClick={() => navigate('/')}
        >
          MediGenie AI
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Dark Themed Multilingual Pill with White Text */}
        <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-700 shadow-lg shadow-slate-200/50 group hover:border-blue-500 transition-all">
          <Globe className="w-4 h-4 text-blue-400 group-hover:animate-spin-slow" />
          <div className="flex flex-col">
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-blue-400 leading-none mb-0.5">Lang</span>
            <select 
              className="bg-transparent text-[11px] font-black outline-none cursor-pointer text-white appearance-none pr-1"
              value={profile.preferredLanguage}
              onChange={(e) => onLanguageChange?.(e.target.value)}
            >
              {LANGUAGES.map(lang => <option key={lang} value={lang} className="text-slate-900">{lang}</option>)}
            </select>
          </div>
        </div>

        <div 
          className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5 border border-slate-200 cursor-text hover:bg-slate-200 transition-colors"
          onClick={handleSearchClick}
        >
          <Search className="w-4 h-4 text-slate-500 mr-2" />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search health records..." 
            className="bg-transparent text-sm focus:outline-none w-48"
          />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div 
          className="flex items-center gap-3 border-l pl-6 cursor-pointer group hover:opacity-80 transition-all"
          onClick={handleProfileClick}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{profile.name}</p>
            <p className="text-xs text-slate-500 capitalize">{profile.gender}, {profile.age}y</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center group-hover:bg-blue-200 group-hover:border-blue-300 transition-all">
            <User className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .group:hover .group-hover\\:animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;
