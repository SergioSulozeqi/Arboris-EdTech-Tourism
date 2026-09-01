import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  QrCode, 
  Sparkles, 
  Gamepad2, 
  CheckCircle2, 
  Leaf, 
  MapPin, 
  Mountain, 
  Share2, 
  Info,
  ChevronRight,
  Footprints,
  Compass
} from 'lucide-react';
import { Checkpoint, CheckpointId } from '../types';

interface CheckpointDetailModalProps {
  checkpoint: Checkpoint | null;
  isOpen: boolean;
  isVisited: boolean;
  isCurrentInRoute: boolean;
  onClose: () => void;
  onOpenScanner: (checkpoint: Checkpoint) => void;
  onStartMiniGame: (checkpoint: Checkpoint) => void;
  onFocusOnMap: (checkpoint: Checkpoint) => void;
}

export const CheckpointDetailModal: React.FC<CheckpointDetailModalProps> = ({
  checkpoint,
  isOpen,
  isVisited,
  isCurrentInRoute,
  onClose,
  onOpenScanner,
  onStartMiniGame,
  onFocusOnMap,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'info' | 'flora-fauna' | 'geologia'>('info');

  useEffect(() => {
    // Stop any playing audio when modal closes or changes checkpoint
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [checkpoint, isOpen]);

  if (!isOpen || !checkpoint) return null;

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Sintesi vocale non supportata nel tuo browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const fullText = `${checkpoint.name}. ${checkpoint.subtitle}. ${checkpoint.audioGuideText}. ${checkpoint.curiositaGeologia}`;
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = 'it-IT';
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div 
      id="checkpoint-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-orange-200/80 rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Banner */}
        <div 
          className="relative p-6 text-white overflow-hidden shrink-0 border-b border-orange-200 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400"
        >
          {/* Top Row Badges & Close Button */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-black font-mono border border-white/30 flex items-center gap-1.5 text-white">
                <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
                {checkpoint.code}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-mono text-white/95 border border-white/30 flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-white" />
                {checkpoint.altitude} m s.l.m.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleAudio}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-white text-orange-600 border-white shadow-md shadow-orange-950/10'
                    : 'bg-white/20 text-white hover:bg-white/30 border-white/30'
                }`}
                title={isPlayingAudio ? 'Ferma Audioguida' : 'Ascolta Audioguida Vocale'}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                id="close-checkpoint-modal-btn"
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white font-display tracking-tight">
            {checkpoint.name}
          </h2>
          <div className="text-xs md:text-sm text-white/90 mt-1 flex items-center gap-2 font-medium">
            <MapPin className="w-3.5 h-3.5 text-white/80 shrink-0" />
            <span>{checkpoint.subtitle}</span>
          </div>

          {/* Navigation Tab Buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'info'
                  ? 'bg-white text-orange-600 shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Panoramica & Audioguida
            </button>
            <button
              onClick={() => setActiveTab('flora-fauna')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'flora-fauna'
                  ? 'bg-white text-orange-600 shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Flora & Fauna
            </button>
            <button
              onClick={() => setActiveTab('geologia')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'geologia'
                  ? 'bg-white text-orange-600 shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Curiosità & Geologia
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 flex-1">
          {/* TAB 1: INFO & AUDIO */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Audio guide player banner */}
              <div className="p-4 bg-orange-50/80 rounded-2xl border border-orange-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isPlayingAudio ? 'bg-orange-500 text-white animate-pulse' : 'bg-orange-100 text-orange-600'}`}>
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Audioguida Ufficiale Arboris</div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {isPlayingAudio ? 'Riproduzione in corso...' : 'Ascolta la narrazione del luogo'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleToggleAudio}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-md shadow-orange-200 transition-all cursor-pointer"
                >
                  {isPlayingAudio ? 'Stop' : 'Ascolta'}
                </button>
              </div>

              <div className="text-sm text-slate-600 leading-relaxed font-medium">
                {checkpoint.audioGuideText}
              </div>

              {/* Status pill card */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Posizione Coordinate</div>
                  <div className="text-xs font-extrabold text-slate-800 mt-0.5">
                    Lat {checkpoint.coordinates.lat.toFixed(4)}, Lng {checkpoint.coordinates.lng.toFixed(4)}
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Stato Tappa</div>
                  <div className="text-xs font-bold mt-0.5 flex items-center gap-1.5">
                    {isVisited ? (
                      <span className="text-emerald-700 flex items-center gap-1 font-black">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completato
                      </span>
                    ) : (
                      <span className="text-orange-600 flex items-center gap-1 font-black">
                        <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Da Scansionare
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FLORA & AMBIENTE + FAUNA (Direct from PDF) */}
          {activeTab === 'flora-fauna' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Flora & Ambiente Card */}
              <div className="p-4.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex flex-col shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-emerald-800">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black tracking-wider uppercase font-mono">
                    FLORA & AMBIENTE
                  </span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed flex-1 font-medium">
                  {checkpoint.floraAmbiente.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fauna - Chi vive qui Card */}
              <div className="p-4.5 bg-amber-50/70 rounded-2xl border border-amber-200 flex flex-col shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-amber-900">
                  <span className="text-sm">🐾</span>
                  <span className="text-xs font-black tracking-wider uppercase font-mono">
                    FAUNA — CHI VIVE QUI
                  </span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed flex-1 font-medium">
                  {checkpoint.faunaChiViveQui.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: CURIOSITA & GEOLOGIA */}
          {activeTab === 'geologia' && (
            <div className="space-y-4">
              <div className="p-4.5 bg-orange-50/80 rounded-2xl border border-orange-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-orange-700">
                  <span className="text-lg">💡</span>
                  <span className="text-xs font-black tracking-wider uppercase font-mono">
                    CURIOSITÀ DEL TERRITORIO & GEOLOGIA
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed italic font-medium">
                  "{checkpoint.curiositaGeologia}"
                </p>
              </div>

              <div className="p-4.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Badge Associato:</div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center text-xl shadow-md shadow-orange-300">
                    🏆
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">{checkpoint.badge.name}</div>
                    <div className="text-xs text-slate-500">{checkpoint.badge.description}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 md:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              onFocusOnMap(checkpoint);
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-orange-500" />
            <span>Mostra sulla Mappa</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="detail-modal-scan-qr-btn"
              onClick={() => {
                onClose();
                onOpenScanner(checkpoint);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-200 shadow-sm transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-orange-600" />
              <span>Inquadra QR Totem</span>
            </button>

            <button
              id="detail-modal-start-game-btn"
              onClick={() => {
                onClose();
                onStartMiniGame(checkpoint);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-orange-300 transition-all cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Avvia Minigioco & Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
