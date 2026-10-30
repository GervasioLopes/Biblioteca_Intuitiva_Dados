import React from 'react';
import { AlgorithmItem, CategoryInfo, SkillLevel } from '../types/data-library';
import { 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  Table, 
  BarChart2, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  Sparkles as SparklesIcon,
  Tag
} from 'lucide-react';

interface Props {
  algorithms: AlgorithmItem[];
  categories: CategoryInfo[];
  selectedCategory: string;
  selectedLevel: string;
  searchQuery: string;
  onSelectAlgorithm: (algo: AlgorithmItem) => void;
  onOpenAIForAlgo: (algo: AlgorithmItem) => void;
}

export const AlgorithmCardGrid: React.FC<Props> = ({
  algorithms,
  categories,
  selectedCategory,
  selectedLevel,
  searchQuery,
  onSelectAlgorithm,
  onOpenAIForAlgo,
}) => {
  // Filter logic
  const filtered = algorithms.filter((algo) => {
    const matchesCategory = selectedCategory === 'all' || algo.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || algo.level === selectedLevel;
    const matchesSearch =
      !searchQuery ||
      algo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.shortObjective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesLevel && matchesSearch;
  });

  const getCategoryMeta = (catId: string) => {
    return categories.find((c) => c.id === catId);
  };

  if (filtered.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Terminal className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-200 mb-1">Nenhum algoritmo encontrado</h3>
        <p className="text-xs text-slate-400 mb-4">
          Tente ajustar os termos de busca ou selecione outro pilar analítico na barra superior.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {filtered.map((algo) => {
        const cat = getCategoryMeta(algo.category);

        return (
          <div
            key={algo.id}
            className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm"
          >
            {/* Top decorative gradient glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity"></div>

            <div>
              {/* Badges strip */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${cat?.tagColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                  {cat?.name || algo.category}
                </span>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                  {algo.level}
                </span>
              </div>

              {/* Title & Objective */}
              <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2 line-clamp-2">
                {algo.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                {algo.shortObjective}
              </p>

              {/* Miniature Dataset Preview Pill */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 mb-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Table className="w-3.5 h-3.5 text-teal-400" />
                  <span className="truncate max-w-[140px]">{algo.dataset.name}</span>
                </span>
                <span className="text-teal-300">
                  {algo.dataset.rawRows.length} linhas
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {algo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/60 text-slate-400 border border-slate-800/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => onOpenAIForAlgo(algo)}
                className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 text-xs transition-all cursor-pointer"
                title="Explicar com Gemini"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onSelectAlgorithm(algo)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-cyan-600/20 text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 rounded-xl text-xs font-semibold transition-all cursor-pointer group/btn"
              >
                <span>Explorar no Split-Screen</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
