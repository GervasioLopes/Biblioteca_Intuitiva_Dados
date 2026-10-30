import React from 'react';
import { VisualAlgorithm } from '../data/simple-algorithms';
import { CardMiniChart } from './CardMiniChart';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  algorithms: VisualAlgorithm[];
  selectedAlgoId: string;
  onSelectAlgo: (algo: VisualAlgorithm) => void;
  allParams?: Record<string, Record<string, any>>;
  layoutMode?: 'sidebar' | 'grid';
}

export const AlgorithmCardRow: React.FC<Props> = ({
  algorithms,
  selectedAlgoId,
  onSelectAlgo,
  allParams = {},
  layoutMode = 'grid',
}) => {
  const isSidebar = layoutMode === 'sidebar';

  return (
    <div
      className={
        isSidebar
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 w-full'
          : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto px-2'
      }
    >
      {algorithms.map((algo) => {
        const isSelected = algo.id === selectedAlgoId;
        const currentParams = allParams[algo.id] || {};

        return (
          <div
            key={algo.id}
            onClick={() => onSelectAlgo(algo)}
            className={`cursor-pointer rounded-xl bg-white border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col overflow-hidden text-left ${
              isSelected
                ? 'ring-2 ring-sky-500 border-sky-400 bg-sky-50/10 shadow-md transform -translate-y-0.5'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
            }`}
          >
            {/* Card Colored Header Banner */}
            <div
              className={`py-2 px-3 text-center border-b font-bold text-xs uppercase tracking-wider flex items-center justify-between ${algo.headerColor}`}
            >
              <span className="truncate">{algo.title}</span>
              {isSelected && (
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-700 shrink-0 ml-1" />
              )}
            </div>

            {/* Embedded Mini Chart Preview with Live Parameters */}
            <div className={`p-2.5 bg-slate-50/70 ${isSidebar ? 'pb-1' : 'p-3'}`}>
              <CardMiniChart
                type={algo.cardChartType}
                metricsSummary={algo.metricsSummary}
                params={currentParams}
              />
            </div>

            {/* Bottom Caption explanation & Selection status */}
            <div className="p-3 text-[11px] leading-relaxed text-slate-600 bg-white border-t border-slate-100 flex-1 flex flex-col justify-between">
              <p className="line-clamp-2">{algo.shortDesc}</p>

              <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-mono font-medium truncate max-w-[140px]">
                  {algo.metricsSummary}
                </span>

                {isSelected ? (
                  <span className="font-semibold text-sky-600 flex items-center gap-1 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    <span>{isSidebar ? 'Inspecionando ao lado' : 'Ativo no painel'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></span>
                  </span>
                ) : (
                  <span className="text-slate-400 hover:text-slate-600 flex items-center gap-0.5 font-medium transition-colors">
                    <span>{isSidebar ? 'Ver ao lado' : 'Selecionar'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
