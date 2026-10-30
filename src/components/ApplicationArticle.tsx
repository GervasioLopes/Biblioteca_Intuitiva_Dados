import React from 'react';
import { ConceptualArticle } from '../types/data-library';
import { BookOpen, Lightbulb, CheckCircle2, XCircle, AlertTriangle, Zap, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';

interface Props {
  article: ConceptualArticle;
  title: string;
}

export const ApplicationArticle: React.FC<Props> = ({ article, title }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full overflow-y-auto max-h-[720px] scrollbar-thin scrollbar-thumb-slate-800">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Artigo de Aplicação Prática
            </span>
            <h3 className="text-base font-bold text-slate-100">{article.headline}</h3>
          </div>
        </div>

        {/* Big-O / Vectorized Pill */}
        <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400">
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span>{article.performanceNotes.timeComplexity}</span>
        </div>
      </div>

      {/* One-Liner Box */}
      <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-lg p-3.5 mb-4 text-xs text-indigo-200 leading-relaxed font-sans shadow-sm">
        <span className="font-semibold text-indigo-300 block mb-1">🎯 A Ideia Central em 1 Frase:</span>
        {article.oneLiner}
      </div>

      {/* Real-World Analogy */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1.5">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Analogia do Mundo Real</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed italic">
          "{article.analogy}"
        </p>
      </div>

      {/* Core Intuition */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Intuição Matemática & Estatística</span>
        </h4>
        <ul className="space-y-2">
          {article.coreIntuition.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Two columns: When to use vs When to avoid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {/* When to use */}
        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-3">
          <h5 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Quando Utilizar</span>
          </h5>
          <ul className="space-y-1.5">
            {article.whenToUse.map((item, idx) => (
              <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-snug">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* When to avoid */}
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3">
          <h5 className="text-xs font-semibold text-rose-400 mb-2 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Quando Evitar / Riscos</span>
          </h5>
          <ul className="space-y-1.5">
            {article.whenToAvoid.map((item, idx) => (
              <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-snug">
                <span className="text-rose-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Business Value */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 mb-4">
        <h5 className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Impacto e Tomada de Decisão em Negócios</span>
        </h5>
        <p className="text-xs text-slate-300 leading-relaxed">
          {article.businessValue}
        </p>
      </div>

      {/* Classic Pandas Pitfalls */}
      <div className="bg-amber-950/20 border border-amber-900/40 rounded-lg p-3.5 mt-auto">
        <h5 className="text-xs font-semibold text-amber-300 mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Pegadinhas Clássicas no Pandas (Pitfalls)</span>
        </h5>
        <ul className="space-y-1.5">
          {article.pandasPitfalls.map((pitfall, idx) => (
            <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-snug">
              <span className="text-amber-400 font-mono">⚠️</span>
              <span>{pitfall}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
