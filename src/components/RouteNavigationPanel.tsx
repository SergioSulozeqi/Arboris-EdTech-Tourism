import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  MapPin, 
  Footprints, 
  Clock, 
  TrendingUp, 
  ChevronRight, 
  QrCode, 
  Sparkles, 
  Award,
  AlertCircle,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { Checkpoint, RouteLevel, CheckpointId } from '../types';

interface RouteNavigationPanelProps {
  routeLevels: RouteLevel[];
  activeRouteId: 'family' | 'explorer' | 'grand-tour' | null;
  isRouteActive: boolean;
  currentStepIndex: number;
  checkpoints: Checkpoint[];
  visitedCheckpoints: CheckpointId[];
  onStartRoute: (levelId: 'family' | 'explorer' | 'grand-tour') => void;
  onStopRoute: () => void;
  onSelectCheckpoint: (cp: Checkpoint) => void;
  onOpenScanner: (cp?: Checkpoint) => void;
  onPlayStepAudio?: (cp: Checkpoint) => void;
}

export const RouteNavigationPanel: React.FC<RouteNavigationPanelProps> = ({
  routeLevels,
  activeRouteId,
  isRouteActive,
  currentStepIndex,
  checkpoints,
  visitedCheckpoints,
  onStartRoute,
  onStopRoute,
  onSelectCheckpoint,
  onOpenScanner,
  onPlayStepAudio,
}) => {
  const [selectedLevelId, setSelectedLevelId] = useState<'family' | 'explorer' | 'grand-tour'>('grand-tour');

  const activeLevel = routeLevels.find((l) => l.id === (activeRouteId || selectedLevelId)) || routeLevels[2];
  const activeCheckpoint = checkpoints[currentStepIndex] || checkpoints[0];

  const filteredCheckpoints = checkpoints.filter((cp) => activeLevel.checkpointIds.includes(cp.id));
  const completedCount = filteredCheckpoints.filter((cp) => visitedCheckpoints.includes(cp.id)).length;
  const progressPercent = Math.round((completedCount / filteredCheckpoints.length) * 100);

  return (
    <div id="route-navigation-panel" className="bg-white/95 backdrop-blur-md rounded-3xl border border-orange-200/80 p-6 shadow-xl shadow-orange-950/5">
      {/* Header with Title & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Footprints className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900 font-display tracking-tight">
              {isRouteActive ? 'Navigazione Percorso Attiva' : 'Pianifica & Inizia Percorso'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {isRouteActive 
              ? 'Segui i totem lungo il sentiero di Monte di Malo e sblocca i quiz per ogni tappa'
              : 'Seleziona il livello adatto al tuo gruppo e avvia l\'esperienza interattiva'
            }
          </p>
        </div>

        {isRouteActive ? (
          <button
            id="stop-route-btn"
            onClick={onStopRoute}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-2xl border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Termina Percorso</span>
          </button>
        ) : (
          <button
            id="start-route-main-btn"
            onClick={() => onStartRoute(selectedLevelId)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black px-5 py-3 rounded-2xl shadow-lg shadow-orange-300 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>INIZIA PERCORSO</span>
          </button>
        )}
      </div>

      {/* Level Selector Tabs if not active */}
      {!isRouteActive && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-5">
          {routeLevels.map((lvl) => {
            const isChosen = selectedLevelId === lvl.id;
            return (
              <div
                key={lvl.id}
                id={`level-card-${lvl.id}`}
                onClick={() => setSelectedLevelId(lvl.id)}
                className={`cursor-pointer p-4.5 rounded-2xl border-2 transition-all shadow-sm ${
                  isChosen
                    ? 'bg-orange-50/90 border-orange-500 shadow-md shadow-orange-500/10'
                    : 'bg-white border-slate-200/90 hover:bg-orange-50/40 hover:border-orange-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                    lvl.difficulty === 'Facile'
                      ? 'bg-emerald-100 text-emerald-800'
                      : lvl.difficulty === 'Medio'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {lvl.difficulty}
                  </span>
                  <span className="text-xs font-extrabold text-slate-500">{lvl.checkpointIds.length} Tappe</span>
                </div>

                <div className="text-base font-black text-slate-900 mb-1">{lvl.name}</div>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3.5">{lvl.description}</p>

                <div className="flex items-center justify-between text-xs text-slate-600 font-mono font-semibold pt-2.5 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-orange-600">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                    {lvl.distanceKm} km
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {lvl.durationHours}
                  </span>
                  <span className="text-orange-600 font-bold">
                    +{lvl.elevationGainM}m
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Navigation Tracker Bar */}
      {isRouteActive && (
        <div className="my-5 p-4.5 bg-orange-50/70 rounded-2xl border border-orange-200 shadow-sm">
          <div className="flex items-center justify-between mb-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-semibold">Progresso Percorso:</span>
              <span className="font-extrabold text-orange-600 font-mono">{completedCount}/{filteredCheckpoints.length} Tappe</span>
            </div>
            <span className="text-slate-600 font-mono font-bold">{progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mb-3.5">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Current Target Objective */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 p-3.5 bg-white rounded-2xl border-2 border-orange-300 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-orange-500/20">
                0{activeCheckpoint.order}
              </div>
              <div>
                <div className="text-[10px] uppercase font-black text-orange-600 tracking-wider">Tappa Attuale</div>
                <div className="text-sm font-black text-slate-900">{activeCheckpoint.name}</div>
                <div className="text-xs text-slate-500">{activeCheckpoint.subtitle}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                id="scanner-active-step-btn"
                onClick={() => onOpenScanner(activeCheckpoint)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-orange-200 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Scansiona Totem</span>
              </button>
              <button
                onClick={() => onSelectCheckpoint(activeCheckpoint)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Dettagli
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage Progression Checklist (All 5 Checkpoints) */}
      <div className="mt-5">
        <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Tappe dell'itinerario Arboris</span>
          <span className="text-slate-400 text-[11px] font-medium">Clicca per consultare scheda o scansionare</span>
        </div>

        <div className="space-y-2.5">
          {filteredCheckpoints.map((cp, idx) => {
            const isCompleted = visitedCheckpoints.includes(cp.id);
            const isCurrent = isRouteActive && currentStepIndex === idx;

            return (
              <div
                key={cp.id}
                id={`checkpoint-step-row-${cp.id}`}
                onClick={() => onSelectCheckpoint(cp)}
                className={`group flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer shadow-sm ${
                  isCurrent
                    ? 'bg-orange-50/90 border-orange-500 ring-2 ring-orange-500/20'
                    : isCompleted
                    ? 'bg-emerald-50/80 border-emerald-200 hover:bg-emerald-50'
                    : 'bg-white border-slate-200 hover:bg-orange-50/40 hover:border-orange-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `0${cp.order}`}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold truncate ${isCurrent ? 'text-orange-600' : 'text-slate-900'}`}>
                        {cp.name}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          Completato
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 truncate flex items-center gap-2">
                      <span>{cp.subtitle}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-mono font-semibold text-slate-600">{cp.altitude}m</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-2">
                  <button
                    id={`scan-step-btn-${cp.id}`}
                    title="Simula Scansione Totem QR"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenScanner(cp);
                    }}
                    className="p-2 rounded-xl bg-orange-100 hover:bg-orange-500 hover:text-white text-orange-600 transition-colors shadow-sm cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
