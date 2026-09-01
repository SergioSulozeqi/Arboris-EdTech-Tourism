import React from 'react';
import { X, Sparkles, Gamepad2 } from 'lucide-react';
import { Checkpoint } from '../types';
import { FossilHuntGame } from './Minigames/FossilHuntGame';
import { WaterBasinsGame } from './Minigames/WaterBasinsGame';
import { FrogCounterGame } from './Minigames/FrogCounterGame';
import { TreeHerbGame } from './Minigames/TreeHerbGame';
import { SkylinePanoramaGame } from './Minigames/SkylinePanoramaGame';

interface MinigameContainerModalProps {
  isOpen: boolean;
  checkpoint: Checkpoint | null;
  onClose: () => void;
  onGameCompleted: (checkpoint: Checkpoint, score: number) => void;
}

export const MinigameContainerModal: React.FC<MinigameContainerModalProps> = ({
  isOpen,
  checkpoint,
  onClose,
  onGameCompleted,
}) => {
  if (!isOpen || !checkpoint) return null;

  const handleComplete = (score: number) => {
    onGameCompleted(checkpoint, score);
  };

  const renderGame = () => {
    switch (checkpoint.id) {
      case 'museo':
        return <FossilHuntGame checkpoint={checkpoint} onComplete={handleComplete} onClose={onClose} />;
      case 'fontana-xotta':
        return <WaterBasinsGame checkpoint={checkpoint} onComplete={handleComplete} onClose={onClose} />;
      case 'faedo-casaron':
        return <FrogCounterGame checkpoint={checkpoint} onComplete={handleComplete} onClose={onClose} />;
      case 'parco-agane':
        return <TreeHerbGame checkpoint={checkpoint} onComplete={handleComplete} onClose={onClose} />;
      case 'san-vittore':
        return <SkylinePanoramaGame checkpoint={checkpoint} onComplete={handleComplete} onClose={onClose} />;
      default:
        return <FossilHuntGame checkpoint={checkpoint} onComplete={handleComplete} onClose={onClose} />;
    }
  };

  return (
    <div 
      id="minigame-container-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white border border-orange-200/80 rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/20 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4.5 bg-orange-50/80 border-b border-orange-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-md shadow-orange-500/20">
              <Gamepad2 className="w-4 h-4" />
            </span>
            <div>
              <div className="text-[10px] font-black text-orange-600 uppercase tracking-wider font-mono">
                {checkpoint.code} • SFIDA INTERATTIVA
              </div>
              <h3 className="text-sm font-black text-slate-900 font-display">
                {checkpoint.name}
              </h3>
            </div>
          </div>

          <button
            id="close-minigame-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Game Canvas Body */}
        <div className="overflow-y-auto flex-1 bg-[#fdfaf5]">
          {renderGame()}
        </div>
      </div>
    </div>
  );
};
