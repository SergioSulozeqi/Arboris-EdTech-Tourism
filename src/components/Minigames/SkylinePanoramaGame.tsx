import React, { useState } from 'react';
import { Mountain, CheckCircle2, Sparkles, HelpCircle, Award, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Checkpoint } from '../../types';

interface SkylinePanoramaGameProps {
  checkpoint: Checkpoint;
  onComplete: (score: number) => void;
  onClose: () => void;
}

interface MountainPeak {
  id: string;
  name: string;
  altitude: string;
  description: string;
  icon: string;
  identified: boolean;
}

export const SkylinePanoramaGame: React.FC<SkylinePanoramaGameProps> = ({
  checkpoint,
  onComplete,
  onClose,
}) => {
  const [peaks, setPeaks] = useState<MountainPeak[]>([
    {
      id: 'piccole-dolomiti',
      name: 'Piccole Dolomiti (Carega)',
      altitude: '2.259 m',
      description: 'Guglie dolomitiche calcaree visibili a nord-ovest, teatro storico alpino.',
      icon: '🏔️',
      identified: false,
    },
    {
      id: 'pasubio',
      name: 'Massiccio del Pasubio',
      altitude: '2.232 m',
      description: 'Celebre per la Strada delle 52 Gallerie e le pareti verticali.',
      icon: '⛰️',
      identified: false,
    },
    {
      id: 'novegno',
      name: 'Monte Novegno & Priaforà',
      altitude: '1.652 m',
      description: 'Altopiano prealpino che domina la conca di Schio e la Val Leogra.',
      icon: '🌄',
      identified: false,
    },
  ]);

  const [gameStep, setGameStep] = useState<'panorama' | 'quiz' | 'victory'>('panorama');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const identifiedCount = peaks.filter((p) => p.identified).length;

  const handleIdentifyPeak = (peakId: string) => {
    setPeaks((prev) =>
      prev.map((p) => (p.id === peakId ? { ...p, identified: true } : p))
    );
  };

  const handleAutoIdentify = () => {
    setPeaks((prev) => prev.map((p) => ({ ...p, identified: true })));
  };

  const handleSubmitQuiz = () => {
    if (selectedQuizAnswer === null) return;
    setIsAnswerSubmitted(true);

    if (selectedQuizAnswer === checkpoint.quiz.correctIndex) {
      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#eab308', '#a3e635', '#06b6d4', '#ec4899'],
        });
      } catch (e) {}
      setTimeout(() => {
        setGameStep('victory');
        onComplete(100);
      }, 1400);
    }
  };

  return (
    <div id="skyline-panorama-game" className="p-4 md:p-6 text-slate-800">
      {/* Step 1: Panorama Recognition */}
      {gameStep === 'panorama' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-100 text-amber-700">
                  <Mountain className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-black text-slate-900 font-display">
                  Lo Skyline a 360° dell'Oratorio di San Vittore
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                A 420 metri di quota, dalla terrazza dell'oratorio medievale, ammira e cataloga le vette montane all'orizzonte!
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-mono font-bold">Vette:</span>
              <div className="text-sm font-black text-amber-600 font-mono">{identifiedCount}/3</div>
            </div>
          </div>

          {/* Panoramic View Simulation Canvas */}
          <div className="relative w-full h-44 md:h-52 bg-gradient-to-t from-slate-900 via-sky-900 to-sky-600 rounded-2xl border-2 border-amber-300 overflow-hidden shadow-xl mb-4 p-4 flex items-end">
            <div className="absolute top-2 left-3 text-[11px] text-amber-300 font-mono font-bold flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-xs px-2 py-0.5 rounded-lg">
              <span>🔭 Vista Panoramica Nord-Ovest</span>
            </div>

            {/* Mountains Vector Silhouette */}
            <svg className="w-full h-full absolute inset-0 opacity-80" viewBox="0 0 800 200" preserveAspectRatio="none">
              <path d="M 0 200 L 0 140 L 100 80 L 180 130 L 260 50 L 380 160 L 520 70 L 640 140 L 750 60 L 800 120 L 800 200 Z" fill="rgba(15, 23, 42, 0.9)" />
              <path d="M 0 200 L 0 160 L 120 110 L 240 150 L 360 90 L 500 160 L 680 110 L 800 170 L 800 200 Z" fill="rgba(30, 41, 59, 0.7)" />
            </svg>

            {/* Floating Summit Target Markers */}
            <div className="relative z-10 w-full grid grid-cols-3 gap-2">
              {peaks.map((peak) => (
                <button
                  key={peak.id}
                  onClick={() => handleIdentifyPeak(peak.id)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all backdrop-blur-md cursor-pointer shadow-sm ${
                    peak.identified
                      ? 'bg-amber-500/90 border-amber-300 text-white font-bold'
                      : 'bg-white/90 border-white/80 hover:bg-white text-slate-800'
                  }`}
                >
                  <div className="text-xs font-black flex items-center justify-between">
                    <span className="truncate">{peak.name}</span>
                    <span>{peak.identified ? '✅' : '📍'}</span>
                  </div>
                  <div className={`text-[10px] font-mono font-bold ${peak.identified ? 'text-amber-100' : 'text-amber-600'}`}>{peak.altitude}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button onClick={handleAutoIdentify} className="text-xs text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer">
              Identifica tutto automaticamente
            </button>

            {identifiedCount === 3 ? (
              <button
                onClick={() => setGameStep('quiz')}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-5 py-2.5 rounded-2xl text-xs shadow-lg shadow-orange-300 transition-all cursor-pointer"
              >
                <span>Passa al Gran Quiz Finale</span>
                <Sparkles className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs text-slate-500 font-medium">
                Clicca su tutte le 3 vette per identificarle...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Final Quiz */}
      {gameStep === 'quiz' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-700">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div className="text-xs font-black text-amber-700 uppercase tracking-wider font-mono">
              Quiz Tappa 05 • Oratorio di San Vittore (Traguardo)
            </div>
          </div>

          <h3 className="text-base md:text-lg font-black text-slate-900 mb-4">
            {checkpoint.quiz.question}
          </h3>

          <div className="space-y-2.5 mb-5">
            {checkpoint.quiz.options.map((opt, idx) => {
              const isSelected = selectedQuizAnswer === idx;
              const isCorrect = idx === checkpoint.quiz.correctIndex;

              let btnStyle = 'bg-white border-slate-200 hover:border-amber-300 text-slate-700 shadow-sm';
              if (isAnswerSubmitted) {
                if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-sm';
                else if (isSelected && !isCorrect) btnStyle = 'bg-red-50 border-red-400 text-red-900 font-medium shadow-sm';
              } else if (isSelected) {
                btnStyle = 'bg-amber-50 border-amber-500 text-amber-900 font-bold ring-2 ring-amber-400/30';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isAnswerSubmitted && setSelectedQuizAnswer(idx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {isAnswerSubmitted && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 mb-4 animate-fade-in shadow-sm">
              <div className="text-xs font-black text-amber-800 mb-1 font-mono uppercase tracking-wider">Geografia Alpina:</div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">{checkpoint.quiz.explanation}</p>
            </div>
          )}

          <div className="flex items-center justify-end">
            {!isAnswerSubmitted ? (
              <button
                disabled={selectedQuizAnswer === null}
                onClick={handleSubmitQuiz}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-white font-black px-6 py-2.5 rounded-2xl text-xs shadow-lg shadow-orange-300 transition-all cursor-pointer"
              >
                Verifica Risposta
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Step 3: Grand Victory & Full Tour Complete */}
      {gameStep === 'victory' && (
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-emerald-400 p-1 shadow-2xl flex items-center justify-center animate-bounce">
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-4xl shadow-inner">
              🏆
            </div>
          </div>

          <span className="text-xs font-black text-amber-700 uppercase tracking-widest font-mono">
            Sigillo d'Oro Arboris Conquistato!
          </span>
          <h3 className="text-2xl font-black text-slate-900 font-display mt-1">
            Gran Maestro di Monte di Malo
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed font-medium">
            Hai completato tutte le 5 tappe dell'itinerario Arboris, risolto tutti i quiz e censito le meraviglie geologiche e naturali di Monte di Malo. Guadagni +200 XP!
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-8 py-3 rounded-2xl text-xs shadow-lg shadow-orange-300 transition-all cursor-pointer"
            >
              Apri il Passaporto Territoriale
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
