import React, { useState, useMemo } from 'react';
import { VISUAL_ALGORITHMS, PILLARS, VisualAlgorithm } from './data/simple-algorithms';
import { SimpleHeader } from './components/SimpleHeader';
import { SimpleFilterBar } from './components/SimpleFilterBar';
import { AlgorithmCardRow } from './components/AlgorithmCardRow';
import { SimpleSplitScreen } from './components/SimpleSplitScreen';
import { ArchitectureModal } from './components/ArchitectureModal';
import { GeminiAssistantDrawer } from './components/GeminiAssistantDrawer';
import { Columns2, LayoutGrid, Search, Sparkles } from 'lucide-react';

export default function App() {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('todos');
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('analise-tendencia');
  const [businessContext, setBusinessContext] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'side-by-side' | 'grid'>('side-by-side');

  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState<string | undefined>();

  // Centralized live parameters state for ALL algorithms
  const [algorithmParams, setAlgorithmParams] = useState<Record<string, Record<string, any>>>(() => {
    const initial: Record<string, Record<string, any>> = {};
    VISUAL_ALGORITHMS.forEach(algo => {
      initial[algo.id] = {};
      algo.parameters.forEach(p => {
        initial[algo.id][p.id] = p.defaultValue;
      });
    });
    return initial;
  });

  const handleParamChange = (algoId: string, paramId: string, value: any) => {
    setAlgorithmParams(prev => ({
      ...prev,
      [algoId]: {
        ...(prev[algoId] || {}),
        [paramId]: value
      }
    }));
  };

  // Filter algorithms belonging to the selected pillar, search query and business context
  const filteredAlgorithms = useMemo(() => {
    return VISUAL_ALGORITHMS.filter((a) => {
      const matchesPillar = selectedPillarId === 'todos' || a.pillarId === selectedPillarId;
      const matchesSearch = !searchQuery || 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.pillarName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.article.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesContext = true;
      if (businessContext === 'varejo') {
        matchesContext = ['analise-tendencia', 'previsao-vendas', 'analise-cesta-compras', 'rfm-segmentacao', 'funil-conversao', 'tabela-dinamica', 'agrupamento-k-means'].includes(a.id);
      } else if (businessContext === 'marketing') {
        matchesContext = ['funil-conversao', 'teste-ab-hipotese', 'coorte-retencao', 'rfm-segmentacao', 'regressao-logistica', 'curva-roc-auc'].includes(a.id);
      } else if (businessContext === 'operacoes') {
        matchesContext = ['deteccao-anomalias', 'auditoria-qualidade-dados', 'decomposicao-temporal', 'boxplot-tukey', 'suavizacao-exponencial'].includes(a.id);
      } else if (businessContext === 'financeiro') {
        matchesContext = ['simulacao-monte-carlo', 'regressao-logistica', 'analise-sobrevivencia', 'analise-correlacao', 'matriz-confusao', 'correlacao-heatmap'].includes(a.id);
      }

      return matchesPillar && matchesSearch && matchesContext;
    });
  }, [selectedPillarId, searchQuery, businessContext]);

  const cardsToDisplay = filteredAlgorithms.length > 0 ? filteredAlgorithms : VISUAL_ALGORITHMS;

  // Active selected algorithm for the split-screen
  const currentAlgorithm =
    VISUAL_ALGORITHMS.find((a) => a.id === selectedAlgoId) ||
    cardsToDisplay[0] ||
    VISUAL_ALGORITHMS[0];

  const handleSelectPillar = (pillarId: string) => {
    setSelectedPillarId(pillarId);
    if (pillarId !== 'todos') {
      const firstAlgo = VISUAL_ALGORITHMS.find((a) => a.pillarId === pillarId);
      if (firstAlgo) {
        setSelectedAlgoId(firstAlgo.id);
      }
    }
  };

  const handleSelectAlgo = (algo: VisualAlgorithm) => {
    setSelectedAlgoId(algo.id);
  };

  const handleOpenAI = (prompt?: string) => {
    setAiCustomPrompt(prompt);
    setIsAIDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* 1. Dark Top Header Bar */}
      <SimpleHeader
        onOpenAI={() => handleOpenAI()}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
      />

      {/* 2. Main Page Layout */}
      <main className="flex-1 max-w-7xl 2xl:max-w-[1600px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-5 flex flex-col gap-4">
        {/* Title & 3 Filter Dropdowns */}
        <SimpleFilterBar
          selectedPillarId={selectedPillarId}
          onSelectPillar={handleSelectPillar}
          selectedAlgoId={selectedAlgoId}
          onSelectAlgo={(id) => {
            const found = VISUAL_ALGORITHMS.find((a) => a.id === id);
            if (found) handleSelectAlgo(found);
          }}
          algorithms={cardsToDisplay}
          allAlgorithms={VISUAL_ALGORITHMS}
          businessContext={businessContext}
          onSelectBusinessContext={setBusinessContext}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* View Mode Bar: Side-by-Side (Master-Detail) vs Traditional Grid */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Modo de Visualização:
            </span>
            <span className="text-xs text-slate-500 hidden md:inline">
              {viewMode === 'side-by-side'
                ? 'Painel Lado a Lado: clique em qualquer box para ver código, terminal e artigo diretamente ao lado'
                : 'Grade completa de cards com painel inferior'}
            </span>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'side-by-side'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Exibir catálogo à esquerda e detalhes ao lado"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Painel Lado a Lado</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Exibir cards em grade ampla"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grade Ampla</span>
            </button>
          </div>
        </div>

        {/* LAYOUT OPTION 1: SIDE-BY-SIDE (MASTER-DETAIL) */}
        {viewMode === 'side-by-side' ? (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-start w-full">
            {/* LEFT SIDEBAR: List of all interactive boxes */}
            <div className="w-full lg:w-[350px] xl:w-[390px] shrink-0 lg:sticky lg:top-3 flex flex-col gap-2.5">
              {/* Sidebar Header */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                    Catálogo ({cardsToDisplay.length} técnicas)
                  </span>
                  <span className="text-[10px] text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    Clique p/ abrir ao lado
                  </span>
                </div>

                {/* Search Bar inside sidebar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filtrar técnica ou métrica..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-6 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-sans"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable list of algorithm cards */}
              <div className="overflow-y-auto pr-1 flex-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 max-h-[500px] lg:max-h-[calc(100vh-140px)]">
                <AlgorithmCardRow
                  algorithms={cardsToDisplay}
                  selectedAlgoId={currentAlgorithm.id}
                  onSelectAlgo={handleSelectAlgo}
                  allParams={algorithmParams}
                  layoutMode="sidebar"
                />
              </div>
            </div>

            {/* RIGHT PANEL: Live Code, Terminal Execution, Article & Charts directly beside */}
            <div className="flex-1 min-w-0 w-full">
              <SimpleSplitScreen
                algorithm={currentAlgorithm}
                params={algorithmParams[currentAlgorithm.id] || {}}
                onParamChange={(paramId, val) => handleParamChange(currentAlgorithm.id, paramId, val)}
                onOpenAI={handleOpenAI}
                isSideBySide={true}
              />
            </div>
          </div>
        ) : (
          /* LAYOUT OPTION 2: TRADITIONAL GRID WITH SPLIT SCREEN BELOW */
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-2">
                <span>
                  Exibindo <strong>{cardsToDisplay.length}</strong> técnicas analíticas
                </span>
                <span className="text-[11px] text-sky-600 font-medium">
                  Clique em qualquer card para carregar no painel inferior
                </span>
              </div>

              <AlgorithmCardRow
                algorithms={cardsToDisplay}
                selectedAlgoId={currentAlgorithm.id}
                onSelectAlgo={handleSelectAlgo}
                allParams={algorithmParams}
                layoutMode="grid"
              />
            </div>

            <div className="w-full border-t border-slate-300/80 my-1"></div>

            <SimpleSplitScreen
              algorithm={currentAlgorithm}
              params={algorithmParams[currentAlgorithm.id] || {}}
              onParamChange={(paramId, val) => handleParamChange(currentAlgorithm.id, paramId, val)}
              onOpenAI={handleOpenAI}
              isSideBySide={false}
            />
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Biblioteca Intuitiva de Dados · Python, Pandas & Estatística Aplicada</span>
          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 cursor-pointer underline"
            >
              Ver Especificação de Arquitetura
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenAI()}
              className="text-indigo-600 hover:text-indigo-800 cursor-pointer font-semibold"
            >
              Assistente Gemini IA
            </button>
          </div>
        </div>
      </footer>

      {/* Global Architectural Blueprint Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Floating Gemini AI Drawer with Real-Time Data Model Context */}
      <GeminiAssistantDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        activeAlgorithm={currentAlgorithm}
        currentParams={algorithmParams[currentAlgorithm.id] || {}}
        allAlgorithms={VISUAL_ALGORITHMS}
        onSelectAlgorithm={handleSelectAlgo}
        initialPrompt={aiCustomPrompt}
      />
    </div>
  );
}
