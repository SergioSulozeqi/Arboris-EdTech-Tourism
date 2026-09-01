import React from 'react';
import { Map, Footprints, QrCode, Award, Mountain } from 'lucide-react';
import { UserProgress } from '../types';

interface FooterProps {
  activeTab: 'map' | 'routes' | 'passport';
  userProgress: UserProgress;
  onSelectTab: (tab: 'map' | 'routes' | 'passport') => void;
  onOpenScanner: () => void;
  onOpenPassport: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTab,
  userProgress,
  onSelectTab,
  onOpenScanner,
  onOpenPassport,
}) => {
  return (
    <>
      {/* Desktop Informational Footer */}
      <footer className="mt-12 border-t border-orange-100 bg-white/80 backdrop-blur-md py-8 px-4 text-slate-500 text-xs shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm" />
            <span className="font-bold text-slate-800">
              ARBORIS • Monte di Malo & Priabona
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">Smart Guide per giovani e famiglie alla scoperta del territorio</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono font-medium">
            <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">5 Totem Checkpoint</span>
            <span>•</span>
            <span>Museo del Priaboniano</span>
            <span>•</span>
            <span>Buso della Rana</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => onSelectTab('map')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'map' ? 'text-orange-600' : 'text-slate-500'
          }`}
        >
          <Map className="w-5 h-5" />
          <span>Mappa</span>
        </button>

        <button
          onClick={() => onSelectTab('routes')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'routes' ? 'text-orange-600' : 'text-slate-500'
          }`}
        >
          <Footprints className="w-5 h-5" />
          <span>Percorsi</span>
        </button>

        {/* Big Center Scanner Button */}
        <button
          onClick={onOpenScanner}
          className="flex flex-col items-center justify-center -mt-6 w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-xl shadow-orange-300/60 active:scale-90 transition-transform"
        >
          <QrCode className="w-6 h-6" />
        </button>

        <button
          onClick={onOpenPassport}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'passport' ? 'text-orange-600' : 'text-slate-500'
          }`}
        >
          <Award className="w-5 h-5" />
          <span>Passaporto</span>
        </button>
      </nav>
    </>
  );
};
