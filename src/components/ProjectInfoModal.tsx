import React from 'react';
import { X, Sparkles, Compass, Users, Mountain, BookOpen, Target, CheckCircle2 } from 'lucide-react';

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      id="project-info-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-orange-200/80 rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 border-b border-orange-200 flex items-center justify-between shrink-0 text-white">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center font-black text-2xl shadow-md">
              🌲
            </div>
            <div>
              <div className="text-[11px] font-black text-white/90 uppercase tracking-wider font-mono">
                Concept & Missione Territoriale
              </div>
              <h2 className="text-xl font-black text-white font-display tracking-tight">
                Progetto ARBORIS • Monte di Malo
              </h2>
            </div>
          </div>

          <button
            id="close-info-modal-btn"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm leading-relaxed flex-1">
          {/* Box 1: Concept & Target */}
          <div className="p-4.5 bg-orange-50/70 rounded-2xl border border-orange-200 shadow-sm">
            <div className="flex items-center gap-2 text-orange-700 font-black text-xs uppercase tracking-wider mb-2 font-mono">
              <Users className="w-4 h-4 text-orange-600" />
              <span>Target & Destinatari</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Il nostro concept è dedicato ai <strong>giovani e alle famiglie</strong> accomunati dalla passione per la montagna e il sapere. Si rivolge a chi desidera mettersi alla prova, affrontando sfide personali e confrontandosi con il resto della community.
            </p>
          </div>

          {/* Box 2: Obiettivo Primario */}
          <div className="p-4.5 bg-amber-50/70 rounded-2xl border border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wider mb-2 font-mono">
              <Target className="w-4 h-4 text-amber-700" />
              <span>Obiettivo Primario & Affluenza Controllata</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Offrire agli utenti l'opportunità di appassionarsi e approfondire la conoscenza del territorio di <strong>Monte di Malo e Priabona</strong>. Attraverso la creazione di un'affluenza "controllata", si intende accompagnare i visitatori alla scoperta di tutte le potenzialità e le bellezze che l'ambiente locale può offrire.
            </p>
          </div>

          {/* Box 3: I 5 Checkpoint Strategici */}
          <div>
            <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Mountain className="w-4 h-4 text-orange-600" />
              <span>I 5 Checkpoint & Totem Fisici</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <span className="text-xs font-black font-mono bg-orange-100 text-orange-700 px-2.5 py-1 rounded-xl">01</span>
                <div>
                  <div className="text-xs font-black text-slate-900">Museo del Priaboniano ("Renato Gasparella")</div>
                  <div className="text-[11px] text-slate-500 font-medium">Stratotipo geologico dell'Eocene, marne tropicali, fossili di nummuliti e squali fossili.</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <span className="text-xs font-black font-mono bg-blue-100 text-blue-700 px-2.5 py-1 rounded-xl">02</span>
                <div>
                  <div className="text-xs font-black text-slate-900">Fontana dei Xotta (≈ 300 m)</div>
                  <div className="text-[11px] text-slate-500 font-medium">Lavatoio ottocentesco a tre vasche, mulattiera storica e biodiversità anfibia.</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <span className="text-xs font-black font-mono bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-xl">03</span>
                <div>
                  <div className="text-xs font-black text-slate-900">Altopiano del Faedo Casaron & Buso della Rana (≈ 450 m)</div>
                  <div className="text-[11px] text-slate-500 font-medium">Complesso carsico di 28 km di gallerie, biospeleologia e monitoraggio delle 32.853 rane.</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <span className="text-xs font-black font-mono bg-purple-100 text-purple-700 px-2.5 py-1 rounded-xl">04</span>
                <div>
                  <div className="text-xs font-black text-slate-900">Parco Natura Aganè (≈ 380 m)</div>
                  <div className="text-[11px] text-slate-500 font-medium">Castagneti monumentali, leggende delle Agane custodi delle acque ed erbario alpino.</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <span className="text-xs font-black font-mono bg-amber-100 text-amber-800 px-2.5 py-1 rounded-xl">05</span>
                <div>
                  <div className="text-xs font-black text-slate-900">Oratorio di San Vittore (≈ 420 m)</div>
                  <div className="text-[11px] text-slate-500 font-medium">Belvedere a 360° con vista sublime sulle Piccole Dolomiti e sul Pasubio.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-6 py-2.5 rounded-2xl text-xs shadow-lg shadow-orange-300 transition-all cursor-pointer"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
