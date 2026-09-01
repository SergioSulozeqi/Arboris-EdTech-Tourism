import React from 'react';
import { 
  Compass, 
  Map, 
  Footprints, 
  QrCode, 
  Award, 
  Info, 
  Sparkles,
  Zap,
  Navigation
} from 'lucide-react';
import { UserProgress } from '../types';

interface HeaderProps {
  activeTab: 'map' | 'routes' | 'passport';
  userProgress: UserProgress;
  onSelectTab: (tab: 'map' | 'routes' | 'passport') => void;
  onOpenScanner: () => void;
  onOpenPassport: () => void;
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  userProgress,
  onSelectTab,
  onOpenScanner,
  onOpenPassport,
  onOpenInfo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-orange-100/80 px-4 lg:px-8 py-3.5 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => onSelectTab('map')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-md shadow-orange-300/40 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <span className="font-black text-orange-600 text-lg font-display tracking-tight">
                A
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-black text-slate-900 tracking-tight font-display">
                ARBORIS
              </h1>
              <span className="text-[10px] bg-orange-100 text-orange-600 font-black px-2.5 py-0.5 rounded-full font-mono uppercase tracking-widest border border-orange-200/50">
                MONTE DI MALO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Smart Guide v1.0 • Mappa dei Totem
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70 shadow-inner">
          <button
            id="nav-tab-map-btn"
            onClick={() => onSelectTab('map')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'map'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Mappa Totem</span>
          </button>

          <button
            id="nav-tab-routes-btn"
            onClick={() => onSelectTab('routes')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'routes'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>Percorsi & Tappe</span>
          </button>

          <button
            id="nav-tab-passport-btn"
            onClick={onOpenPassport}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'passport'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Passaporto</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeTab === 'passport' ? 'bg-white/20 text-white font-bold' : 'bg-amber-100 text-amber-700 font-bold'
            }`}>
              {userProgress.visitedCheckpoints.length}/5
            </span>
          </button>
        </nav>

        {/* Right Side Quick Actions: Scanner QR & Info */}
        <div className="flex items-center gap-2">
          {/* XP Pill */}
          <div 
            onClick={onOpenPassport}
            className="hidden sm:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/80 px-3 py-1.5 rounded-xl border border-amber-200/80 cursor-pointer transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-current" />
            <span className="text-xs font-black text-amber-900 font-mono">{userProgress.totalXp}</span>
            <span className="text-[10px] text-amber-600 font-mono font-bold">XP</span>
          </div>

          {/* QR Scanner Trigger Button */}
          <button
            id="header-scanner-btn"
            onClick={onOpenScanner}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-orange-200 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Scanner QR</span>
          </button>

          {/* Info Button */}
          <button
            id="header-info-btn"
            onClick={onOpenInfo}
            className="p-2.5 rounded-2xl bg-white hover:bg-orange-50 text-slate-600 hover:text-orange-600 border border-slate-200 transition-colors shadow-sm cursor-pointer"
            title="Info Concept Arboris"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
