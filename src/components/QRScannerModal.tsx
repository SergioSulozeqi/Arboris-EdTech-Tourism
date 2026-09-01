import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Sparkles, 
  Camera, 
  Flashlight, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  Eye,
  Layers,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Checkpoint, CheckpointId } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  targetCheckpoint?: Checkpoint | null;
  allCheckpoints: Checkpoint[];
  onClose: () => void;
  onScanSuccess: (checkpoint: Checkpoint) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  targetCheckpoint,
  allCheckpoints,
  onClose,
  onScanSuccess,
}) => {
  const [selectedCpId, setSelectedCpId] = useState<CheckpointId>(
    targetCheckpoint ? targetCheckpoint.id : 'museo'
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasScannedSuccess, setHasScannedSuccess] = useState<boolean>(false);
  const [flashlightOn, setFlashlightOn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'scanner' | 'totem-preview'>('scanner');

  useEffect(() => {
    if (targetCheckpoint) {
      setSelectedCpId(targetCheckpoint.id);
    }
  }, [targetCheckpoint]);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setHasScannedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCheckpoint = allCheckpoints.find((c) => c.id === selectedCpId) || allCheckpoints[0];

  const handleSimulateScan = (cp: Checkpoint) => {
    setIsScanning(false);
    setHasScannedSuccess(true);

    // Audio beep simulation using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // 880 Hz beep
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}

    // Vibration if available
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a3e635', '#06b6d4'],
      });
    } catch (e) {}

    setTimeout(() => {
      onScanSuccess(cp);
    }, 1200);
  };

  return (
    <div 
      id="qr-scanner-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white border border-orange-200/80 rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4.5 bg-orange-50/80 border-b border-orange-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-md shadow-orange-500/20">
              <QrCode className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 font-display">
                Scanner QR Totem Checkpoint
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Inquadra il totem fisico o simula la scansione
              </p>
            </div>
          </div>

          <button
            id="close-scanner-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Toggle: Camera Scanner vs Totem Preview */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-white text-orange-600 shadow-sm border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Simulatore Scanner AR</span>
          </button>
          <button
            onClick={() => setActiveTab('totem-preview')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'totem-preview'
                ? 'bg-white text-orange-600 shadow-sm border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Visualizza Totem Fisico</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 space-y-4">
          {activeTab === 'scanner' && (
            <div>
              {/* Camera Viewfinder Box */}
              <div className="relative w-full h-64 md:h-72 bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
                {/* Simulated Camera Feed (Nature Canvas) */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 blur-[1px]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${currentCheckpoint.color}44, transparent 70%), url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80')`,
                  }}
                />

                {/* Viewfinder Target Frame with Corner Accents */}
                <div className="relative w-48 h-48 rounded-2xl border-2 border-dashed border-orange-400/80 flex items-center justify-center">
                  {/* Corners */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-orange-500 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-orange-500 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-orange-500 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-orange-500 rounded-br-lg" />

                  {/* Laser Scan Animation Line */}
                  {isScanning && (
                    <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_8px_#f97316] animate-scan-laser" />
                  )}

                  {/* QR Pattern Placeholder inside frame */}
                  <div className="p-3 bg-white/95 rounded-2xl border border-slate-200 shadow-2xl flex flex-col items-center">
                    <QrCode className="w-20 h-20 text-slate-900" />
                    <span className="text-[10px] font-mono font-black text-orange-600 mt-1">
                      {currentCheckpoint.code}
                    </span>
                  </div>

                  {/* Flash / Success State Overlay */}
                  {hasScannedSuccess && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl flex flex-col items-center justify-center text-white font-black animate-fade-in shadow-xl">
                      <CheckCircle2 className="w-10 h-10 mb-1 animate-bounce" />
                      <span className="text-sm uppercase tracking-wider">Totem Riconosciuto!</span>
                    </div>
                  )}
                </div>

                {/* Top Flashlight and Lens helper */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => setFlashlightOn(!flashlightOn)}
                    className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                      flashlightOn
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-lg'
                        : 'bg-slate-900/80 text-slate-300 border-slate-700'
                    }`}
                    title="Torcia Flash"
                  >
                    <Flashlight className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom hint text */}
                <div className="absolute bottom-3 left-0 right-0 text-center">
                  <span className="text-[11px] bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-slate-200 border border-slate-700 font-medium">
                    Punta la fotocamera sul QR Code del Totem
                  </span>
                </div>
              </div>

              {/* Checkpoint Target Selector */}
              <div className="mt-4">
                <div className="text-xs font-bold text-slate-600 mb-2">
                  Seleziona il Totem da scansionare:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allCheckpoints.map((cp) => {
                    const isSelected = selectedCpId === cp.id;
                    return (
                      <button
                        key={cp.id}
                        onClick={() => {
                          setSelectedCpId(cp.id);
                          setHasScannedSuccess(false);
                          setIsScanning(true);
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-50/90 border-2 border-orange-500 text-orange-700 font-black shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-orange-50/40 hover:border-orange-200'
                        }`}
                      >
                        <div className="font-mono text-[10px] text-slate-400">{cp.code}</div>
                        <div className="truncate text-xs font-bold">{cp.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scan Trigger Action Button */}
              <div className="mt-5 flex items-center gap-3">
                <button
                  id="trigger-simulate-scan-btn"
                  onClick={() => handleSimulateScan(currentCheckpoint)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-3.5 px-4 rounded-2xl text-xs shadow-lg shadow-orange-300 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>SIMULA SCANSIONE TOTEM {currentCheckpoint.order}</span>
                </button>
              </div>
            </div>
          )}

          {/* Totem Mockup Preview */}
          {activeTab === 'totem-preview' && (
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-b from-amber-100/50 via-orange-50/40 to-amber-50 rounded-2xl border-2 border-amber-200 flex flex-col items-center text-center shadow-inner">
                {/* Physical Totem Wood & Slate Header */}
                <div className="w-16 h-3 bg-amber-700 rounded-t-lg mb-2" />
                <div className="w-3/4 max-w-xs bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xl flex flex-col items-center">
                  <span className="text-[11px] font-black text-orange-600 font-mono tracking-widest uppercase">
                    ARBORIS • MONTE DI MALO
                  </span>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {currentCheckpoint.code}
                  </div>

                  <div className="text-sm font-black text-slate-900 mt-1">
                    {currentCheckpoint.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mb-3">
                    {currentCheckpoint.subtitle}
                  </div>

                  {/* Scannable Large QR Code Block */}
                  <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-md my-1">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono mt-2.5 flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3 text-orange-500" />
                    <span>Inquadra con fotocamera per il Quiz</span>
                  </div>
                </div>
                <div className="w-12 h-10 bg-amber-800 border-x-2 border-b-2 border-amber-900 rounded-b-md" />
              </div>

              <button
                onClick={() => handleSimulateScan(currentCheckpoint)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-3.5 px-4 rounded-2xl text-xs shadow-lg shadow-orange-300 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>SCANSIONA QUESTO TOTEM ORA</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
