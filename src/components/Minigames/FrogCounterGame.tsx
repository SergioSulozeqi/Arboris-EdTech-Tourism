import React, { useState, useEffect, useRef } from 'react';
import { Compass, CheckCircle2, Sparkles, HelpCircle, Timer, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Checkpoint } from '../../types';

interface FrogCounterGameProps {
  checkpoint: Checkpoint;
  onComplete: (score: number) => void;
  onClose: () => void;
}

interface JumpingFrog {
  id: number;
  x: number;
  y: number;
  type: 'temporaria' | 'dalmatina' | 'salamandra';
  points: number;
}

export const FrogCounterGame: React.FC<FrogCounterGameProps> = ({
  checkpoint,
  onComplete,
  onClose,
}) => {
  const [gameStep, setGameStep] = useState<'intro' | 'playing' | 'quiz' | 'victory'>('intro');
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [frogCount, setFrogCount] = useState<number>(0);
  const [activeFrogs, setActiveFrogs] = useState<JumpingFrog[]>([]);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const frogIdRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnerRef = useRef<NodeJS.Timeout | null>(null);

  // Spawning logic during active game
  useEffect(() => {
    if (gameStep === 'playing') {
      setTimeLeft(15);
      setFrogCount(0);

      // Countdown
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            clearInterval(spawnerRef.current!);
            setGameStep('quiz');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Spawn frogs
      spawnerRef.current = setInterval(() => {
        frogIdRef.current += 1;
        const types: ('temporaria' | 'dalmatina' | 'salamandra')[] = ['temporaria', 'dalmatina', 'salamandra'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        
        const newFrog: JumpingFrog = {
          id: frogIdRef.current,
          x: Math.floor(Math.random() * 80) + 10,
          y: Math.floor(Math.random() * 70) + 15,
          type: chosenType,
          points: chosenType === 'salamandra' ? 3 : 1,
        };

        setActiveFrogs((prev) => [...prev.slice(-6), newFrog]);
      }, 650);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (spawnerRef.current) clearInterval(spawnerRef.current);
      };
    }
  }, [gameStep]);

  const handleCatchFrog = (frog: JumpingFrog) => {
    setFrogCount((prev) => prev + frog.points);
    setActiveFrogs((prev) => prev.filter((f) => f.id !== frog.id));
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
          colors: ['#10b981', '#34d399', '#a3e635'],
        });
      } catch (e) {}
      setTimeout(() => {
        setGameStep('victory');
        onComplete(100);
      }, 1400);
    }
  };

  return (
    <div id="frog-counter-game" className="p-4 md:p-6 text-slate-800">
      {/* Step 1: Intro */}
      {gameStep === 'intro' && (
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-4xl shadow-md">
            🐸
          </div>
          <h3 className="text-xl font-black text-slate-900 font-display">
            Il Grande Censimento delle Rane del Faedo
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed font-medium">
            Curiosità del territorio di Monte di Malo: <em>"In queste zone i ricercatori contano le rane una ad una. Ad oggi risultano 32.853 rane censite!"</em>
          </p>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 max-w-sm mx-auto my-5 text-xs text-emerald-800 font-mono font-bold shadow-sm">
            ⏱️ Hai 15 secondi per cliccare sulle rane che saltano tra le doline carsiche e il Buso della Rana!
          </div>
          <button
            onClick={() => setGameStep('playing')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-8 py-3 rounded-2xl text-xs shadow-lg shadow-orange-300 transition-all cursor-pointer"
          >
            Avvia Censimento Rapido
          </button>
        </div>
      )}

      {/* Step 2: Arcade Frog Counting Canvas */}
      {gameStep === 'playing' && (
        <div>
          {/* Header with Stats */}
          <div className="flex items-center justify-between mb-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-orange-500 animate-spin" />
              <span className="text-xs font-mono font-bold text-slate-900">Tempo: {timeLeft}s</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono font-bold">Rane Censite:</span>
              <span className="text-base font-black text-emerald-600 font-mono">{frogCount}</span>
            </div>
          </div>

          {/* Karst Field Area */}
          <div className="relative w-full h-64 md:h-72 bg-gradient-to-b from-emerald-100 via-teal-50 to-emerald-100 rounded-2xl border-2 border-emerald-300 overflow-hidden shadow-inner mb-4">
            {/* Cave background textures */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute bottom-2 left-3 text-[11px] text-emerald-800 font-mono font-bold bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-lg">
              📍 Ingresso Buso della Rana (28km di gallerie)
            </div>

            {/* Render Active Frogs */}
            {activeFrogs.map((frog) => (
              <button
                key={frog.id}
                onClick={() => handleCatchFrog(frog)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 p-2.5 bg-white hover:bg-emerald-100 rounded-full border-2 border-emerald-500 shadow-xl transition-all active:scale-90 animate-bounce cursor-pointer"
                style={{ left: `${frog.x}%`, top: `${frog.y}%` }}
              >
                <span className="text-2xl">{frog.type === 'salamandra' ? '🦎' : '🐸'}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Clicca rapidamente sugli anfibi per catturarli nel registro!</span>
            <button
              onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current);
                if (spawnerRef.current) clearInterval(spawnerRef.current);
                setGameStep('quiz');
              }}
              className="underline hover:text-slate-900 cursor-pointer font-bold"
            >
              Salta al Quiz
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Quiz */}
      {gameStep === 'quiz' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div className="text-xs font-black text-emerald-700 uppercase tracking-wider font-mono">
              Quiz Tappa 03 • Altopiano del Faedo & Buso della Rana
            </div>
          </div>

          <h3 className="text-base md:text-lg font-black text-slate-900 mb-4">
            {checkpoint.quiz.question}
          </h3>

          <div className="space-y-2.5 mb-5">
            {checkpoint.quiz.options.map((opt, idx) => {
              const isSelected = selectedQuizAnswer === idx;
              const isCorrect = idx === checkpoint.quiz.correctIndex;

              let btnStyle = 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700 shadow-sm';
              if (isAnswerSubmitted) {
                if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-sm';
                else if (isSelected && !isCorrect) btnStyle = 'bg-red-50 border-red-400 text-red-900 font-medium shadow-sm';
              } else if (isSelected) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400/30';
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
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 mb-4 animate-fade-in shadow-sm">
              <div className="text-xs font-black text-emerald-800 mb-1 font-mono uppercase tracking-wider">Dato Scientifico & Territoriale:</div>
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

      {/* Step 4: Victory */}
      {gameStep === 'victory' && (
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center text-4xl shadow-inner">
              🐸
            </div>
          </div>

          <span className="text-xs font-black text-emerald-700 uppercase tracking-widest font-mono">
            Badge Sbloccato!
          </span>
          <h3 className="text-xl font-black text-slate-900 font-display mt-1">
            Speleologo delle Rane
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 font-medium">
            Hai partecipato al censimento e svelato i segreti carsici del Faedo Casaron e del Buso della Rana. Guadagni +180 XP!
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
