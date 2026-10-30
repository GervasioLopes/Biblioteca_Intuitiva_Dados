import React from 'react';
import { PILLARS, VisualAlgorithm } from '../data/simple-algorithms';
import { ChevronDown, Layers, BarChart2, TrendingUp, AlertTriangle, GitFork, PieChart, Users, CheckCircle2 } from 'lucide-react';

interface Props {
  selectedPillarId: string;
  onSelectPillar: (pillarId: string) => void;
  selectedAlgoId: string;
  onSelectAlgo: (algoId: string) => void;
  algorithms: VisualAlgorithm[];
  allAlgorithms: VisualAlgorithm[];
  businessContext: string;
  onSelectBusinessContext: (ctx: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const SimpleFilterBar: React.FC<Props> = ({
  selectedPillarId,
  onSelectPillar,
  selectedAlgoId,
  onSelectAlgo,
  algorithms,
  allAlgorithms,
  businessContext,
  onSelectBusinessContext,
  searchQuery,
  onSearchChange,
}) => {
  const currentPillar = PILLARS.find((p) => p.id === selectedPillarId) || PILLARS[0];

  const getPillarIcon = (id: string) => {
    switch (id) {
      case 'preditiva': return <TrendingUp className="w-3.5 h-3.5" />;
      case 'correlacao': return <GitFork className="w-3.5 h-3.5" />;
      case 'distribuicao': return <BarChart2 className="w-3.5 h-3.5" />;
      case 'comparacao': return <PieChart className="w-3.5 h-3.5" />;
      case 'segmentacao': return <Users className="w-3.5 h-3.5" />;
      case 'classificacao': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'anomalias': return <AlertTriangle className="w-3.5 h-3.5" />;
      default: return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full text-center space-y-3.5 pt-1">
      {/* Quick Navigation Chips Row for all pillars */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-4xl mx-auto px-2">
        {PILLARS.map((p) => {
          const isActive = selectedPillarId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPillar(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm ring-2 ring-sky-500/50'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span className={isActive ? 'text-sky-400' : 'text-slate-400'}>
                {getPillarIcon(p.id)}
              </span>
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Big clean pillar title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-wider uppercase font-sans">
          {currentPillar.name}
        </h2>
        <p className="text-xs text-slate-500 max-w-xl mx-auto mt-0.5">
          {currentPillar.desc}
        </p>
      </div>

      {/* 3 Dropdown Selectors Row exactly like the photo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto px-2">
        {/* Dropdown 1: Pilar / Categoria */}
        <div className="relative">
          <select
            value={selectedPillarId}
            onChange={(e) => onSelectPillar(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-medium rounded-md px-3 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors cursor-pointer"
          >
            {PILLARS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown 2: Algoritmo / Técnica */}
        <div className="relative">
          <select
            value={selectedAlgoId}
            onChange={(e) => onSelectAlgo(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-medium rounded-md px-3 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors cursor-pointer"
          >
            {allAlgorithms.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.pillarName.split(' ')[0]})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown 3: Contexto de Negócio / Aplicação */}
        <div className="relative">
          <select
            value={businessContext}
            onChange={(e) => onSelectBusinessContext(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-medium rounded-md px-3 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors cursor-pointer"
          >
            <option value="todos">Todos os Cenários de Negócio</option>
            <option value="varejo">Varejo & E-commerce</option>
            <option value="marketing">Marketing & Aquisição de Clientes</option>
            <option value="operacoes">Operações, SLAs & Atendimento</option>
            <option value="financeiro">Financeiro, Fraudes & Auditoria</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
