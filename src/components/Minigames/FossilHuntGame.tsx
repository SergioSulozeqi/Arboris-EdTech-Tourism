import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Award, RefreshCw, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Checkpoint } from '../../types';

interface FossilHuntGameProps {
  checkpoint: Checkpoint;
  onComplete: (score: number) => void;
  onClose: () => void;
}

interface Fossil {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  icon: string;
  found: boolean;
  position: { x: number; y: number };
}

export const FossilHuntGame: React.FC<FossilHuntGameProps> = ({
  checkpoint,
  onComplete,
  onClose,
}) => {
  const [fossils, setFossils] = useState<Fossil[]>([
    {
      id: 'nummuliti',
      name: 'Nummuliti Fossili',
      scientificName: 'Nummulites fabianii',
      description: 'Foraminiferi unicellulari giganti a forma di monetina, fossili guida dell\'Eocene e del Priaboniano.',
      icon: '🐚',
      found: false,
      position: { x: 25, y: 35 },
    },
    {
      id: 'otodus',
      name: 'Dente di Squalo Gigante',
      scientificName: 'Otodus sokolovi',
      description: 'Dente aguzzo di un gigantesco predatore marino lungo fino a 9 metri che nuotava nel mare tropicale di Priabona.',
      icon: '🦈',
      found: false,
      position: { x: 70, y: 25 },
    },
    {
      id: 'prototherium',
      name: 'Sirenide Marino',
      scientificName: 'Prototherium veronense',
      description: 'Antico mammifero erbivoro affine al dugongo, che pascolava nelle praterie marine calde dell\'era eocenica.',
      icon: '🦭',
      found: false,
      position: { x: 50, y: 70 },
    },
  ]);

  const [excavationGrid, setExcavationGrid] = useState<number[]>(Array(16).fill(100)); // 100% rock covered
  const [selectedFossil, setSelectedFossil] = useState<Fossil | null>(null);
  const [gameStep, setGameStep] = useState<'digging' | 'quiz' | 'victory'>('digging');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const foundCount = fossils.filter((f) => f.found).length;

  const handleBrushCell = (index: number) => {
    const newGrid = [...excavationGrid];
    if (newGrid[index] > 0) {
      newGrid[index] = Math.max(0, newGrid[index] - 50);
      setExcavationGrid(newGrid);

      // Check if uncovering reveals any fossil
      // Grid is 4x4
      const row = Math.floor(index / 4);
      const col = index % 4;
      const cellCenterX = (col + 0.5) * 25;
      const cellCenterY = (row + 0.5) * 25;

      setFossils((prev) =>
        prev.map((fossil) => {
          if (!fossil.found) {
            const dist = Math.sqrt(
              Math.pow(fossil.position.x - cellCenterX, 2) + Math.pow(fossil.position.y - cellCenterY, 2)
            );
            if (dist < 18 && newGrid[index] === 0) {
              setSelectedFossil(fossil);
              return { ...fossil, found: true };
            }
          }
          return fossil;
        })
      );
    }
  };

  const handleDigAll = () => {
    setExcavationGrid(Array(16).fill(0));
    setFossils((prev) => prev.map((f) => ({ ...f, found: true })));
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
          colors: ['#a3e635', '#4ade80', '#06b6d4'],
        });
      } catch (err) {
        // Confetti fallback
      }
      setTimeout(() => {
        setGameStep('victory');
        onComplete(100);
      }, 1400);
    }
  };

  return (
    <div id="fossil-hunt-game" className="p-4 md:p-6 text-slate-800">
      {/* Step 1: Fossil Excavation Canvas */}
      {gameStep === 'digging' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">⛏️</span>
                <h3 className="text-lg font-black text-slate-900 font-display">
                  Scavo Paleontologico del Priaboniano
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Spazzola i blocchi di marna rocciosa per dissotterrare i 3 reperti dell'antico mare tropicale!
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-mono font-bold">Reperti:</span>
              <div className="text-sm font-black text-orange-600 font-mono">{foundCount}/3</div>
            </div>
          </div>

          {/* Excavation Area */}
          <div className="relative w-full h-64 md:h-72 bg-amber-100 rounded-2xl border-2 border-orange-300 overflow-hidden shadow-inner mb-4">
            {/* Underlying Fossil Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-200/50 via-orange-100 to-amber-200 p-4">
              {fossils.map((fossil) => (
                <div
                  key={fossil.id}
                  onClick={() => setSelectedFossil(fossil)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                    fossil.found ? 'scale-110 opacity-100 animate-bounce' : 'opacity-20 scale-75'
                  }`}
                  style={{ left: `${fossil.position.x}%`, top: `${fossil.position.y}%` }}
                >
                  <div className="p-2.5 bg-white rounded-2xl border-2 border-orange-500 shadow-xl flex flex-col items-center">
                    <span className="text-3xl">{fossil.icon}</span>
                    <span className="text-[10px] font-black text-orange-600 whitespace-nowrap mt-1">
                      {fossil.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Grid of Rock / Marl Tiles overlay */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 p-1">
              {excavationGrid.map((coverage, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBrushCell(idx)}
                  className="w-full h-full rounded-xl transition-all duration-200 flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer"
                  style={{
                    backgroundColor: `rgba(180, 130, 90, ${0.4 + (coverage / 100) * 0.6})`,
                    border: coverage > 0 ? '1px solid rgba(220, 180, 130, 0.8)' : 'none',
                    backdropFilter: coverage > 0 ? 'blur(2px)' : 'none',
                    pointerEvents: coverage === 0 ? 'none' : 'auto',
                  }}
                >
                  {coverage > 0 && (
                    <span className="text-amber-100 text-xs drop-shadow">
                      {coverage === 100 ? '🪨' : '🧹'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Discovered Fossil Detail Card */}
          {selectedFossil && (
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 mb-4 animate-fade-in shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-white rounded-2xl shadow-sm border border-orange-100">{selectedFossil.icon}</span>
                <div>
                  <div className="text-xs text-orange-600 font-mono font-bold uppercase tracking-wider">
                    {selectedFossil.scientificName}
                  </div>
                  <div className="text-sm font-black text-slate-900">{selectedFossil.name}</div>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">{selectedFossil.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleDigAll}
              className="text-xs text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer"
            >
              Scava tutto automaticamente
            </button>

            {foundCount === 3 ? (
              <button
                id="fossil-proceed-quiz-btn"
                onClick={handleProceedToQuiz}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-5 py-2.5 rounded-2xl text-xs shadow-lg shadow-orange-300 transition-all cursor-pointer"
              >
                <span>Passa al Quiz Paleontologico</span>
                <Sparkles className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs text-slate-500 font-medium">
                Trova ancora <span className="text-orange-600 font-bold">{3 - foundCount}</span> fossili...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Paleontology Quick Quiz */}
      {gameStep === 'quiz' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-xl bg-orange-100 text-orange-600">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div className="text-xs font-black text-orange-600 uppercase tracking-wider font-mono">
              Quiz Tappa 01 • Museo del Priaboniano
            </div>
          </div>

          <h3 className="text-base md:text-lg font-black text-slate-900 mb-4">
            {checkpoint.quiz.question}
          </h3>

          <div className="space-y-2.5 mb-5">
            {checkpoint.quiz.options.map((opt, idx) => {
              const isSelected = selectedQuizAnswer === idx;
              const isCorrect = idx === checkpoint.quiz.correctIndex;

              let btnStyle = 'bg-white border-slate-200 hover:border-orange-300 text-slate-700 shadow-sm';
              if (isAnswerSubmitted) {
                if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-sm';
                else if (isSelected && !isCorrect) btnStyle = 'bg-red-50 border-red-400 text-red-900 font-medium shadow-sm';
              } else if (isSelected) {
                btnStyle = 'bg-orange-50 border-orange-500 text-orange-900 font-bold ring-2 ring-orange-400/30';
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
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 mb-4 animate-fade-in shadow-sm">
              <div className="text-xs font-black text-orange-600 mb-1 font-mono uppercase tracking-wider">Spiegazione Scientifica:</div>
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

      {/* Step 3: Victory & Badge Unlock */}
      {gameStep === 'victory' && (
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center text-4xl shadow-inner">
              🐚
            </div>
          </div>

          <span className="text-xs font-black text-orange-600 uppercase tracking-widest font-mono">
            Badge Sbloccato!
          </span>
          <h3 className="text-xl font-black text-slate-900 font-display mt-1">
            Paleontologo dell'Eocene
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 font-medium">
            Hai completato lo scavo dei fossili e superato il quiz del Museo del Priaboniano. Guadagni +150 XP!
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
