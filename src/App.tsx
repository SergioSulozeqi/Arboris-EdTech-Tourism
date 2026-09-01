import React, { useState, useEffect } from 'react';
import { 
  CHECKPOINTS, 
  ROUTE_LEVELS, 
  ALL_BADGES 
} from './data/checkpointsData';
import { 
  Checkpoint, 
  CheckpointId, 
  RouteLevel, 
  UserProgress, 
  UserLocation 
} from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InteractiveMap } from './components/InteractiveMap';
import { RouteNavigationPanel } from './components/RouteNavigationPanel';
import { CheckpointDetailModal } from './components/CheckpointDetailModal';
import { QRScannerModal } from './components/QRScannerModal';
import { MinigameContainerModal } from './components/MinigameContainerModal';
import { PassportModal } from './components/PassportModal';
import { ProjectInfoModal } from './components/ProjectInfoModal';
import { 
  Footprints, 
  QrCode, 
  Award, 
  Sparkles, 
  MapPin, 
  Play, 
  Compass, 
  Volume2, 
  CheckCircle2,
  Mountain,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'arboris_user_progress_v1';

export default function App() {
  // Main Navigation state
  const [activeTab, setActiveTab] = useState<'map' | 'routes' | 'passport'>('map');

  // User Progress state
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      activeRouteId: null,
      isRouteActive: false,
      currentStepIndex: 0,
      visitedCheckpoints: [],
      completedQuizzes: {} as any,
      completedMiniGames: {} as any,
      unlockedBadges: [],
      totalXp: 0,
      userLocation: {
        x: 76, // Start near Priabona Museo del Priaboniano
        y: 82,
        isRealGps: false,
      },
    };
  });

  // Modals state
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannerTargetCp, setScannerTargetCp] = useState<Checkpoint | null>(null);

  const [isMinigameOpen, setIsMinigameOpen] = useState<boolean>(false);
  const [minigameCp, setMinigameCp] = useState<Checkpoint | null>(null);

  const [isPassportOpen, setIsPassportOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save progress changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
  }, [userProgress]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Start a chosen Route
  const handleStartRoute = (levelId: 'family' | 'explorer' | 'grand-tour') => {
    const chosenLevel = ROUTE_LEVELS.find((l) => l.id === levelId) || ROUTE_LEVELS[2];
    const firstCp = CHECKPOINTS.find((c) => c.id === chosenLevel.checkpointIds[0]) || CHECKPOINTS[0];

    setUserProgress((prev) => ({
      ...prev,
      activeRouteId: levelId,
      isRouteActive: true,
      currentStepIndex: 0,
      userLocation: {
        x: firstCp.coordinates.x,
        y: firstCp.coordinates.y,
        isRealGps: prev.userLocation.isRealGps,
      },
      unlockedBadges: prev.unlockedBadges.includes('badge-first-step')
        ? prev.unlockedBadges
        : [...prev.unlockedBadges, 'badge-first-step'],
      totalXp: prev.totalXp + (prev.unlockedBadges.includes('badge-first-step') ? 0 : 50),
    }));

    showToast(`Percorso "${chosenLevel.name}" avviato! Segui la mappa verso il primo Totem.`);
    setActiveTab('map');
  };

  const handleStopRoute = () => {
    setUserProgress((prev) => ({
      ...prev,
      isRouteActive: false,
      activeRouteId: null,
    }));
    showToast('Navigazione percorso terminata.');
  };

  // Move user location on map
  const handleMoveUserLocation = (x: number, y: number) => {
    setUserProgress((prev) => ({
      ...prev,
      userLocation: {
        ...prev.userLocation,
        x,
        y,
        isRealGps: false,
      },
    }));
  };

  // Toggle real GPS using Geolocation API
  const handleToggleGps = () => {
    if (!navigator.geolocation) {
      showToast('Geolocalizzazione non supportata dal browser.');
      return;
    }

    if (userProgress.userLocation.isRealGps) {
      setUserProgress((prev) => ({
        ...prev,
        userLocation: { ...prev.userLocation, isRealGps: false },
      }));
      showToast('GPS disattivato. Modalità manuale / simulazione.');
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Map real lat/lng to Monte di Malo map bounds roughly
          // Monte di Malo bounds: lat 45.650 to 45.695, lng 11.355 to 11.410
          const { latitude, longitude } = pos.coords;
          const mapX = Math.max(10, Math.min(90, ((longitude - 11.355) / 0.055) * 100));
          const mapY = Math.max(10, Math.min(90, (1 - (latitude - 45.650) / 0.045) * 100));

          setUserProgress((prev) => ({
            ...prev,
            userLocation: {
              x: Math.round(mapX),
              y: Math.round(mapY),
              lat: latitude,
              lng: longitude,
              isRealGps: true,
            },
          }));
          showToast(`Posizione GPS rilevata: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (err) => {
          showToast('Impossibile accedere al GPS. Usa la simulazione toccando la mappa.');
        },
        { enableHighAccuracy: true }
      );
    }
  };

  // Open Checkpoint Detail
  const handleSelectCheckpoint = (checkpoint: Checkpoint) => {
    setSelectedCheckpoint(checkpoint);
    setIsDetailModalOpen(true);
  };

  // Open Scanner
  const handleOpenScanner = (targetCp?: Checkpoint) => {
    setScannerTargetCp(targetCp || null);
    setIsScannerOpen(true);
  };

  // Scan Success -> triggers Minigame & Quiz!
  const handleScanSuccess = (checkpoint: Checkpoint) => {
    setIsScannerOpen(false);
    setMinigameCp(checkpoint);
    setIsMinigameOpen(true);
  };

  // Minigame / Quiz Completed -> rewards badge, XP, passport stamp
  const handleGameCompleted = (checkpoint: Checkpoint, score: number) => {
    setUserProgress((prev) => {
      const isAlreadyVisited = prev.visitedCheckpoints.includes(checkpoint.id);
      const newVisited = isAlreadyVisited
        ? prev.visitedCheckpoints
        : [...prev.visitedCheckpoints, checkpoint.id];

      const newBadges = prev.unlockedBadges.includes(checkpoint.badge.id)
        ? prev.unlockedBadges
        : [...prev.unlockedBadges, checkpoint.badge.id];

      // Next step advancement if in route
      let nextStep = prev.currentStepIndex;
      if (prev.isRouteActive && nextStep < CHECKPOINTS.length - 1) {
        nextStep += 1;
      }

      return {
        ...prev,
        visitedCheckpoints: newVisited,
        unlockedBadges: newBadges,
        totalXp: prev.totalXp + (isAlreadyVisited ? 25 : checkpoint.miniGame.rewardXp),
        currentStepIndex: nextStep,
      };
    });

    showToast(`Tappa "${checkpoint.name}" completata! Timbrata sul Passaporto.`);
  };

  const activeRoute = ROUTE_LEVELS.find((r) => r.id === userProgress.activeRouteId);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-lime-400 selection:text-zinc-950 pb-20 md:pb-0">
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        userProgress={userProgress}
        onSelectTab={setActiveTab}
        onOpenScanner={() => handleOpenScanner()}
        onOpenPassport={() => setIsPassportOpen(true)}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 transform -translate-x-1/2 z-50 bg-lime-400 text-zinc-950 font-bold px-4 py-2 rounded-2xl shadow-2xl border border-lime-300 text-xs flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Main Content Container */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 flex-1 flex flex-col gap-6">
        {/* TAB 1: INTERACTIVE MAP VIEW (Default) */}
        {activeTab === 'map' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Hero Banner / Action bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-lime-950/40 p-4 rounded-2xl border border-zinc-800 shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-lime-400 uppercase tracking-widest font-mono">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Esplorazione Territoriale Monte di Malo</span>
                </div>
                <h2 className="text-lg md:text-xl font-black text-white font-display mt-0.5">
                  Mappa Interattiva dei Totem & Sentieri Naturalistici
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                  Clicca su qualunque totem per ascoltare l'audioguida e scoprire flora, fauna e geologia. Sposta il puntino blu o avvia il percorso guidato.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                <button
                  id="hero-scan-totem-btn"
                  onClick={() => handleOpenScanner()}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-zinc-700 transition-all"
                >
                  <QrCode className="w-4 h-4 text-lime-400" />
                  <span>Scansiona Totem</span>
                </button>

                {!userProgress.isRouteActive ? (
                  <button
                    id="hero-start-route-btn"
                    onClick={() => setActiveTab('routes')}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-zinc-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-lg shadow-lime-500/20 transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Inizia Percorso</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('routes')}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-lg transition-all"
                  >
                    <Footprints className="w-4 h-4" />
                    <span>Gestisci Tappe</span>
                  </button>
                )}
              </div>
            </div>

            {/* The SVG Canvas Interactive Map */}
            <InteractiveMap
              checkpoints={CHECKPOINTS}
              activeCheckpointId={selectedCheckpoint ? selectedCheckpoint.id : null}
              visitedCheckpoints={userProgress.visitedCheckpoints}
              userLocation={userProgress.userLocation}
              isRouteActive={userProgress.isRouteActive}
              activeRouteName={activeRoute?.name}
              onSelectCheckpoint={handleSelectCheckpoint}
              onMoveUserLocation={handleMoveUserLocation}
              onOpenScanner={handleOpenScanner}
              onToggleGps={handleToggleGps}
            />

            {/* Bottom 5 Checkpoints Fast Row */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                <span>Luoghi di Interesse & Totem Checkpoint (Monte di Malo)</span>
                <span className="text-lime-400 text-[11px] font-mono">
                  {userProgress.visitedCheckpoints.length}/5 Completati
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {CHECKPOINTS.map((cp) => {
                  const isDone = userProgress.visitedCheckpoints.includes(cp.id);

                  return (
                    <div
                      key={cp.id}
                      id={`bottom-card-${cp.id}`}
                      onClick={() => handleSelectCheckpoint(cp)}
                      className={`group cursor-pointer p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/40 hover:bg-emerald-950/30'
                          : 'bg-zinc-900/80 border-zinc-800 hover:border-lime-400 hover:bg-zinc-850'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span 
                            className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: `${cp.color}22`, color: cp.color }}
                          >
                            0{cp.order}
                          </span>
                          {isDone ? (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Fatto
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-500 font-mono">{cp.altitude}m</span>
                          )}
                        </div>

                        <div className="text-xs font-bold text-white group-hover:text-lime-400 transition-colors line-clamp-1">
                          {cp.name}
                        </div>
                        <div className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                          {cp.subtitle}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-400">
                        <span className="font-mono text-lime-400/80">{cp.tag}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROUTES & STAGE NAVIGATION VIEW */}
        {activeTab === 'routes' && (
          <div className="space-y-6 animate-fade-in">
            <RouteNavigationPanel
              routeLevels={ROUTE_LEVELS}
              activeRouteId={userProgress.activeRouteId}
              isRouteActive={userProgress.isRouteActive}
              currentStepIndex={userProgress.currentStepIndex}
              checkpoints={CHECKPOINTS}
              visitedCheckpoints={userProgress.visitedCheckpoints}
              onStartRoute={handleStartRoute}
              onStopRoute={handleStopRoute}
              onSelectCheckpoint={handleSelectCheckpoint}
              onOpenScanner={handleOpenScanner}
            />
          </div>
        )}

        {/* TAB 3: PASSPORT & STAMPS VIEW */}
        {activeTab === 'passport' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 bg-zinc-900/90 rounded-2xl border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">
                    Il Tuo Passaporto Territoriale
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Colleziona i timbri dei 5 totem di Monte di Malo e sblocca il diploma finale
                  </p>
                </div>
                <button
                  onClick={() => setIsPassportOpen(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black px-4 py-2 rounded-xl text-xs shadow-lg transition-all"
                >
                  Espandi Passaporto
                </button>
              </div>

              {/* Grid of stamps preview */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {CHECKPOINTS.map((cp) => {
                  const isDone = userProgress.visitedCheckpoints.includes(cp.id);
                  return (
                    <div
                      key={cp.id}
                      className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center ${
                        isDone ? 'bg-zinc-950 border-lime-400 text-white' : 'bg-zinc-950/40 border-zinc-800 text-zinc-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{isDone ? '🎖️' : '🔒'}</div>
                      <div className="text-xs font-bold truncate w-full">{cp.name}</div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {isDone ? 'TIMBRATO' : 'DA SBLOCCARE'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        activeTab={activeTab}
        userProgress={userProgress}
        onSelectTab={setActiveTab}
        onOpenScanner={() => handleOpenScanner()}
        onOpenPassport={() => setIsPassportOpen(true)}
      />

      {/* Modals */}
      <CheckpointDetailModal
        checkpoint={selectedCheckpoint}
        isOpen={isDetailModalOpen}
        isVisited={selectedCheckpoint ? userProgress.visitedCheckpoints.includes(selectedCheckpoint.id) : false}
        isCurrentInRoute={selectedCheckpoint ? CHECKPOINTS[userProgress.currentStepIndex]?.id === selectedCheckpoint.id : false}
        onClose={() => setIsDetailModalOpen(false)}
        onOpenScanner={handleOpenScanner}
        onStartMiniGame={(cp) => {
          setMinigameCp(cp);
          setIsMinigameOpen(true);
        }}
        onFocusOnMap={(cp) => {
          handleMoveUserLocation(cp.coordinates.x, cp.coordinates.y);
          setActiveTab('map');
        }}
      />

      <QRScannerModal
        isOpen={isScannerOpen}
        targetCheckpoint={scannerTargetCp}
        allCheckpoints={CHECKPOINTS}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      <MinigameContainerModal
        isOpen={isMinigameOpen}
        checkpoint={minigameCp}
        onClose={() => setIsMinigameOpen(false)}
        onGameCompleted={handleGameCompleted}
      />

      <PassportModal
        isOpen={isPassportOpen}
        userProgress={userProgress}
        checkpoints={CHECKPOINTS}
        onClose={() => setIsPassportOpen(false)}
      />

      <ProjectInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </div>
  );
}
