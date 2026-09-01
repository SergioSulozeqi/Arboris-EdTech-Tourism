import React from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Footprints, 
  Trophy, 
  Download,
  Share2
} from 'lucide-react';
import { Checkpoint, UserProgress } from '../types';
import { ALL_BADGES } from '../data/checkpointsData';

interface PassportModalProps {
  isOpen: boolean;
  userProgress: UserProgress;
  checkpoints: Checkpoint[];
  onClose: () => void;
}

export const PassportModal: React.FC<PassportModalProps> = ({
  isOpen,
  userProgress,
  checkpoints,
  onClose,
}) => {
  if (!isOpen) return null;

  const totalVisited = userProgress.visitedCheckpoints.length;
  const isAllComplete = totalVisited === checkpoints.length;

  return (
    <div 
      id="passport-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-orange-200/80 rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 border-b border-orange-200 flex items-center justify-between shrink-0 text-white">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center font-black text-2xl shadow-md">
              📜
            </div>
            <div>
              <div className="text-[11px] font-black text-white/90 uppercase tracking-wider font-mono">
                Monte di Malo • Territorio & Sapere
              </div>
              <h2 className="text-xl font-black text-white font-display tracking-tight">
                Passaporto dell'Esploratore Arboris
              </h2>
            </div>
          </div>

          <button
            id="close-passport-modal-btn"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* User Status Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-orange-50/70 rounded-2xl border border-orange-200 text-center shadow-sm">
            <div>
              <div className="text-[10px] text-slate-500 font-mono font-bold uppercase">Tappe Completate</div>
              <div className="text-xl font-black text-orange-600 font-mono mt-0.5">
                {totalVisited}/{checkpoints.length}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono font-bold uppercase">Punteggio XP</div>
              <div className="text-xl font-black text-amber-600 font-mono mt-0.5">
                {userProgress.totalXp} XP
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono font-bold uppercase">Badges Sbloccati</div>
              <div className="text-xl font-black text-blue-600 font-mono mt-0.5">
                {userProgress.unlockedBadges.length}/{ALL_BADGES.length}
              </div>
            </div>
          </div>

          {/* Section: 5 Digital Totem Stamps */}
          <div>
            <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Timbri Ufficiali dei 5 Totem</span>
              <span className="text-[11px] text-orange-600 font-mono font-bold">{totalVisited} su 5 timbrati</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {checkpoints.map((cp) => {
                const isStamped = userProgress.visitedCheckpoints.includes(cp.id);

                return (
                  <div
                    key={cp.id}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                      isStamped
                        ? 'bg-orange-50/90 border-orange-500 shadow-md ring-2 ring-orange-500/20'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    {/* Stamp Circle Ring */}
                    <div className={`w-14 h-14 rounded-full border-2 border-dashed flex flex-col items-center justify-center mb-2.5 transition-all ${
                      isStamped
                        ? 'border-orange-500 bg-orange-100 text-orange-700 rotate-[-8deg] shadow-sm'
                        : 'border-slate-300 bg-white text-slate-400'
                    }`}>
                      {isStamped ? (
                        <>
                          <span className="text-[9px] font-black text-orange-600 font-mono uppercase">
                            ARBORIS
                          </span>
                          <span className="text-xs font-black text-slate-900 font-mono">
                            CHK 0{cp.order}
                          </span>
                          <span className="text-[8px] font-black text-orange-600 font-mono">TIMBRATO</span>
                        </>
                      ) : (
                        <span className="text-xs font-black text-slate-400 font-mono">0{cp.order}</span>
                      )}
                    </div>

                    <div className="text-[11px] font-bold text-slate-900 truncate w-full">
                      {cp.name}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono font-semibold">{cp.altitude}m</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Badges */}
          <div>
            <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
              Collezione Medaglie & Riconoscimenti
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_BADGES.map((badge) => {
                const isUnlocked = userProgress.unlockedBadges.includes(badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                        : 'bg-slate-50 border-slate-200 opacity-50'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                      isUnlocked ? 'bg-amber-400/30 text-amber-900 border border-amber-300 shadow-sm' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {isUnlocked ? '🏅' : '🔒'}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 truncate flex items-center gap-1.5">
                        <span>{badge.name}</span>
                        {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 font-medium">
                        {badge.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grand Tour Completion Certificate if all complete */}
          {isAllComplete && (
            <div className="p-5 bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 rounded-2xl border-2 border-orange-400 text-center animate-fade-in shadow-md">
              <Trophy className="w-10 h-10 text-orange-500 mx-auto mb-2" />
              <div className="text-xs font-black text-orange-600 uppercase tracking-widest font-mono">
                Attestato Ufficiale di Esplorazione
              </div>
              <h3 className="text-lg font-black text-slate-900 font-display mt-0.5">
                Custode Ufficiale del Territorio di Monte di Malo
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 font-medium">
                Hai dimostrato profonda conoscenza della flora, della fauna e del patrimonio geologico del Priaboniano!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-6 py-2.5 rounded-2xl text-xs shadow-lg shadow-orange-300 transition-all cursor-pointer"
          >
            Chiudi Passaporto
          </button>
        </div>
      </div>
    </div>
  );
};
