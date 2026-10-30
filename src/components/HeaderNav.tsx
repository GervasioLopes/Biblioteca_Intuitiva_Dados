import React from 'react';
import { CategoryInfo, SkillLevel } from '../types/data-library';
import { 
  Database, 
  Search, 
  Sparkles, 
  Layers, 
  BarChart2, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles as SparklesIcon,
  Filter,
  FileCode2
} from 'lucide-react';

interface Props {
  categories: CategoryInfo[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  selectedLevel: string;
  onSelectLevel: (lvl: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenArchitecture: () => void;
  onOpenAI: () => void;
}

export const HeaderNav: React.FC<Props> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedLevel,
  onSelectLevel,
  searchQuery,
  onSearchChange,
  onOpenArchitecture,
  onOpenAI,
}) => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'descritiva': return <BarChart2 className="w-3.5 h-3.5" />;
      case 'segmentacao': return <Users className="w-3.5 h-3.5" />;
      case 'anomalias': return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'preditiva': return <TrendingUp className="w-3.5 h-3.5" />;
      case 'limpeza': return <SparklesIcon className="w-3.5 h-3.5" />;
      default: return <Database className="w-3.5 h-3.5" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md shadow-xl">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white font-sans">
                  Biblioteca Intuitiva de Dados
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                  Python & Pandas
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Livro interativo de consulta: teoria, código vetorizado e gráficos em tempo real
              </p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar algoritmo, métrica ou tag..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500/60 placeholder:text-slate-500"
              />
            </div>

            {/* Blueprint Architecture Button */}
            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-sm"
              title="Ver Blueprint de Arquitetura e Estrutura de Componentes"
            >
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Blueprint UX & Arq</span>
            </button>

            {/* Gemini AI Assistant Button */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assistente IA</span>
            </button>
          </div>
        </div>

        {/* Analytical Category Navigation Tabs */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-900 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <nav className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onSelectCategory('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Todos os Pilares</span>
            </button>

            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
                    {getCategoryIcon(cat.id)}
                  </span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Level Filter Dropdown */}
          <div className="flex items-center gap-1 shrink-0 pl-2">
            <Filter className="w-3 h-3 text-slate-500" />
            <select
              value={selectedLevel}
              onChange={(e) => onSelectLevel(e.target.value)}
              className="bg-slate-900 text-slate-300 text-[11px] font-medium border border-slate-800 rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">Nível: Todos</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
