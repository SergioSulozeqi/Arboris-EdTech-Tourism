import React, { useState } from 'react';
import { Droplets, CheckCircle2, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Checkpoint } from '../../types';

interface WaterBasinsGameProps {
  checkpoint: Checkpoint;
  onComplete: (score: number) => void;
  onClose: () => void;
}

interface BasinItem {
  id: string;
  name: string;
  targetBasinId: 'fontanello' | 'lavatoio' | 'labio';
  icon: string;
  assignedBasinId: 'fontanello' | 'lavatoio' | 'labio' | null;
}

export const WaterBasinsGame: React.FC<WaterBasinsGameProps> = ({
  checkpoint,
  onComplete,
  onClose,
}) => {
  const [items, setItems] = useState<BasinItem[]>([
    { id: 'borraccia', name: 'Borraccia Escursionista (Acqua Pura)', targetBasinId: 'fontanello', icon: '🚰', assignedBasinId: null },
    { id: 'lenzuola', name: 'Panni di Lino e Cenere', targetBasinId: 'lavatoio', icon: '🧺', assignedBasinId: null },
    { id: 'bestiame', name: 'Caprioli, Cavalli e Bestiame', targetBasinId: 'labio', icon: '🦌', assignedBasinId: null },
    { id: 'tritone', name: 'Tritone Crestato e Larve di Libellula', targetBasinId: 'labio', icon: '🦎', assignedBasinId: null },
  ]);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [gameStep, setGameStep] = useState<'puzzle' | 'quiz' | 'victory'>('puzzle');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const allAssigned = items.every((it) => it.assignedBasinId !== null);
  const allCorrect = items.every((it) => it.assignedBasinId === it.targetBasinId);

  const handleAssignToBasin = (basinId: 'fontanello' | 'lavatoio' | 'labio') => {
    if (!selectedItemId) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === selectedItemId ? { ...item, assignedBasinId: basinId } : item
      )
    );
    setSelectedItemId(null);
  };

  const handleAutoSolve = () => {
    setItems((prev) => prev.map((item) => ({ ...item, assignedBasinId: item.targetBasinId })));
  };

  const handleProceedToQuiz = () => {
    setGameStep('quiz');
  };

  const handleSubmitQuiz = () => {
    if (selectedQuizAnswer === null) return;
    setIsAnswerSubmitted(true);

    if (selectedQuizAnswer === checkpoint.quiz.correctIndex) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#38bdf8', '#a3e635'],
        });
      } catch (e) {}
      setTimeout(() => {
        setGameStep('victory');
        onComplete(100);
      }, 1400);
    }
  };

  return (
    <div id="water-basins-game" className="p-4 md:p-6 text-slate-800">
      {/* Step 1: Hydraulic Basins Sorting */}
      {gameStep === 'puzzle' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-blue-100 text-blue-600">
                  <Droplets className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-black text-slate-900 font-display">
                  Il Circuito delle Tre Vasche
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                La Fontana dei Xotta (metà '800, restaurata nel 2004) sfrutta l'acqua sorgiva a cascata. Assegna ogni elemento alla vasca corretta!
              </p>
            </div>
          </div>

          {/* Unassigned Items List */}
          <div className="mb-4">
            <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2 font-mono">1. Seleziona un elemento:</div>
            <div className="grid grid-cols-2 gap-2.5">
              {items.map((item) => {
                const isSelected = selectedItemId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItemId(isSelected ? null : item.id)}
                    className={`p-3 rounded-2xl border-2 text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer shadow-sm ${
                      isSelected
                        ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-400/30 text-orange-900 font-bold'
                        : item.assignedBasinId
                        ? 'bg-slate-100 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-orange-300 font-medium'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="truncate font-semibold">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3 Basins Target Grid */}
          <div className="mb-4">
            <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2 font-mono">2. Clicca sulla vasca di destinazione:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Basin 1: Fontanello Potabile */}
              <div
                onClick={() => handleAssignToBasin('fontanello')}
                className="cursor-pointer p-4 rounded-2xl bg-blue-50/70 border-2 border-blue-200 hover:border-blue-400 transition-all flex flex-col justify-between min-h-[140px] shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-black text-blue-700 mb-1">
                    <span>1. Fontanello (Sorgente)</span>
                    <span>💧</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium leading-relaxed">Prima uscita: acqua sorgiva pura e potabile.</div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {items.filter((it) => it.assignedBasinId === 'fontanello').map((it) => (
                    <div key={it.id} className="text-[11px] bg-white text-blue-900 px-2.5 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5 font-bold shadow-sm">
                      <span>{it.icon}</span>
                      <span className="truncate">{it.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Basin 2: Lavatoio */}
              <div
                onClick={() => handleAssignToBasin('lavatoio')}
                className="cursor-pointer p-4 rounded-2xl bg-cyan-50/70 border-2 border-cyan-200 hover:border-cyan-400 transition-all flex flex-col justify-between min-h-[140px] shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-black text-cyan-800 mb-1">
                    <span>2. Lavatoio Pubblico</span>
                    <span>🧼</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium leading-relaxed">Vasca centrale: lavaggio con liscivia e strofinatoi in pietra.</div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {items.filter((it) => it.assignedBasinId === 'lavatoio').map((it) => (
                    <div key={it.id} className="text-[11px] bg-white text-cyan-900 px-2.5 py-1.5 rounded-xl border border-cyan-200 flex items-center gap-1.5 font-bold shadow-sm">
                      <span>{it.icon}</span>
                      <span className="truncate">{it.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Basin 3: Lábio / Abbeveratoio */}
              <div
                onClick={() => handleAssignToBasin('labio')}
                className="cursor-pointer p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 hover:border-emerald-400 transition-all flex flex-col justify-between min-h-[140px] shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-black text-emerald-800 mb-1">
                    <span>3. Lábio (Abbeveratoio)</span>
                    <span>🌿</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium leading-relaxed">Vasca finale: abbeverata animali e rifugio per anfibi e tritoni.</div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {items.filter((it) => it.assignedBasinId === 'labio').map((it) => (
                    <div key={it.id} className="text-[11px] bg-white text-emerald-900 px-2.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 font-bold shadow-sm">
                      <span>{it.icon}</span>
                      <span className="truncate">{it.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button onClick={handleAutoSolve} className="text-xs text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer">
              Completa automaticamente
            </button>

            {allAssigned && allCorrect ? (
              <button
                onClick={handleProceedToQuiz}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-5 py-2.5 rounded-2xl text-xs shadow-lg shadow-orange-300 transition-all cursor-pointer"
              >
                <span>Passa al Quiz Storico</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs text-slate-500 font-medium">
                {allAssigned ? 'Alcune posizioni non sono corrette, riprova!' : 'Assegna tutti i 4 elementi...'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Quiz */}
      {gameStep === 'quiz' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-xl bg-blue-100 text-blue-600">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div className="text-xs font-black text-blue-600 uppercase tracking-wider font-mono">
              Quiz Tappa 02 • Fontana dei Xotta
            </div>
          </div>

          <h3 className="text-base md:text-lg font-black text-slate-900 mb-4">
            {checkpoint.quiz.question}
          </h3>

          <div className="space-y-2.5 mb-5">
            {checkpoint.quiz.options.map((opt, idx) => {
              const isSelected = selectedQuizAnswer === idx;
              const isCorrect = idx === checkpoint.quiz.correctIndex;

              let btnStyle = 'bg-white border-slate-200 hover:border-blue-300 text-slate-700 shadow-sm';
              if (isAnswerSubmitted) {
                if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-sm';
                else if (isSelected && !isCorrect) btnStyle = 'bg-red-50 border-red-400 text-red-900 font-medium shadow-sm';
              } else if (isSelected) {
                btnStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-400/30';
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
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 mb-4 animate-fade-in shadow-sm">
              <div className="text-xs font-black text-blue-700 mb-1 font-mono uppercase tracking-wider">Spiegazione Storica:</div>
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

      {/* Step 3: Victory */}
      {gameStep === 'victory' && (
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-blue-500 to-cyan-400 p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center text-4xl shadow-inner">
              💧
            </div>
          </div>

          <span className="text-xs font-black text-blue-600 uppercase tracking-widest font-mono">
            Badge Sbloccato!
          </span>
          <h3 className="text-xl font-black text-slate-900 font-display mt-1">
            Custode delle Sorgenti
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 font-medium">
            Hai svelato la logica rurale delle tre vasche storiche e tutelato l'habitat degli anfibi. Guadagni +150 XP!
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-8 py-3 rounded-2xl text-xs shadow-lg shadow-orange-300 transition-all cursor-pointer"
            >
              Continua il Percorso
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
