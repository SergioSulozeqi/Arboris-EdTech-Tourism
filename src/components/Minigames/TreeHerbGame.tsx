import React, { useState } from 'react';
import { Leaf, CheckCircle2, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Checkpoint } from '../../types';

interface TreeHerbGameProps {
  checkpoint: Checkpoint;
  onComplete: (score: number) => void;
  onClose: () => void;
}

interface BotanicalCard {
  id: string;
  name: string;
  scientificName: string;
  leafShape: string;
  icon: string;
  curiosity: string;
  matched: boolean;
}

export const TreeHerbGame: React.FC<TreeHerbGameProps> = ({
  checkpoint,
  onComplete,
  onClose,
}) => {
  const [cards, setCards] = useState<BotanicalCard[]>([
    {
      id: 'castagno',
      name: 'Castagno Monumentale',
      scientificName: 'Castanea sativa',
      leafShape: 'Foglia allungata con margini a denti di sega',
      icon: '🌰',
      curiosity: 'Albero del pane montano: nei secoli ha nutrito generazioni a Monte di Malo.',
      matched: false,
    },
    {
      id: 'roverella',
      name: 'Roverella (Quercia Termofila)',
      scientificName: 'Quercus pubescens',
      leafShape: 'Foglia lobata vellutata e resistente al sole',
      icon: '🪵',
      curiosity: 'Funge da rifugio per caprioli e produce ghiande per la ghiandaia.',
      matched: false,
    },
    {
      id: 'carpino',
      name: 'Carpino Nero',
      scientificName: 'Ostrya carpinifolia',
      leafShape: 'Foglia ovale doppiamente seghettata con frutti a grappolo',
      icon: '🌿',
      curiosity: 'Legno robusto e tenace tipico delle pendici calcaree delle prealpi.',
      matched: false,
    },
  ]);

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [gameStep, setGameStep] = useState<'matching' | 'quiz' | 'victory'>('matching');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const matchedCount = cards.filter((c) => c.matched).length;

  const handleMatchLeaf = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, matched: true } : c))
    );
    setSelectedCardId(null);
  };

  const handleAutoMatch = () => {
    setCards((prev) => prev.map((c) => ({ ...c, matched: true })));
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
          colors: ['#a855f7', '#c084fc', '#a3e635'],
        });
      } catch (e) {}
      setTimeout(() => {
        setGameStep('victory');
        onComplete(100);
      }, 1400);
    }
  };

  return (
    <div id="tree-herb-game" className="p-4 md:p-6 text-slate-800">
      {/* Step 1: Botanical Leaves Matching */}
      {gameStep === 'matching' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-purple-100 text-purple-600">
                  <Leaf className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-black text-slate-900 font-display">
                  L'Erbario Segreto delle Agane
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Esplora la flora del Parco Natura Aganè. Identifica e cataloga le 3 specie arboree dominanti dei boschi di Monte di Malo!
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-mono font-bold">Catalogati:</span>
              <div className="text-sm font-black text-purple-600 font-mono">{matchedCount}/3</div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => !card.matched && handleMatchLeaf(card.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between shadow-sm ${
                  card.matched
                    ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-400/30'
                    : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{card.icon}</span>
                    {card.matched ? (
                      <span className="text-xs bg-purple-100 text-purple-800 font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Catalogato
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono font-medium">Clicca per identificare</span>
                    )}
                  </div>

                  <div className="text-sm font-black text-slate-900">{card.name}</div>
                  <div className="text-xs text-purple-700 font-mono italic mb-2 font-semibold">{card.scientificName}</div>
                  <p className="text-xs text-slate-600 mb-2 font-medium">🍃 {card.leafShape}</p>
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-medium leading-relaxed">
                  {card.curiosity}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button onClick={handleAutoMatch} className="text-xs text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer">
              Identifica tutto automaticamente
            </button>

            {matchedCount === 3 ? (
              <button
                onClick={handleProceedToQuiz}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-5 py-2.5 rounded-2xl text-xs shadow-lg shadow-orange-300 transition-all cursor-pointer"
              >
                <span>Passa al Quiz delle Agane</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs text-slate-500 font-medium">
                Clicca su tutti i 3 alberi per catalogarli...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Quiz */}
      {gameStep === 'quiz' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-xl bg-purple-100 text-purple-600">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div className="text-xs font-black text-purple-600 uppercase tracking-wider font-mono">
              Quiz Tappa 04 • Parco Natura Aganè
            </div>
          </div>

          <h3 className="text-base md:text-lg font-black text-slate-900 mb-4">
            {checkpoint.quiz.question}
          </h3>

          <div className="space-y-2.5 mb-5">
            {checkpoint.quiz.options.map((opt, idx) => {
              const isSelected = selectedQuizAnswer === idx;
              const isCorrect = idx === checkpoint.quiz.correctIndex;

              let btnStyle = 'bg-white border-slate-200 hover:border-purple-300 text-slate-700 shadow-sm';
              if (isAnswerSubmitted) {
                if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-sm';
                else if (isSelected && !isCorrect) btnStyle = 'bg-red-50 border-red-400 text-red-900 font-medium shadow-sm';
              } else if (isSelected) {
                btnStyle = 'bg-purple-50 border-purple-500 text-purple-900 font-bold ring-2 ring-purple-400/30';
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
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 mb-4 animate-fade-in shadow-sm">
              <div className="text-xs font-black text-purple-700 mb-1 font-mono uppercase tracking-wider">Mito & Tradizione Alpina:</div>
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
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-purple-500 to-pink-400 p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center text-4xl shadow-inner">
              🌿
            </div>
          </div>

          <span className="text-xs font-black text-purple-600 uppercase tracking-widest font-mono">
            Badge Sbloccato!
          </span>
          <h3 className="text-xl font-black text-slate-900 font-display mt-1">
            Custode delle Agane
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 font-medium">
            Hai svelato i misteri botanici e la magia naturale dei castagneti secolari del Parco Natura Aganè. Guadagni +160 XP!
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
