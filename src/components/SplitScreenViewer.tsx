import React, { useState, useMemo } from 'react';
import { AlgorithmItem, CategoryInfo } from '../types/data-library';
import { PythonCodeBlock } from './PythonCodeBlock';
import { MiniatureDatasetViewer } from './MiniatureDatasetViewer';
import { ApplicationArticle } from './ApplicationArticle';
import { InteractiveDataChart } from './InteractiveDataChart';
import { 
  ArrowLeft, 
  Sparkles, 
  Code2, 
  Table, 
  BarChart3, 
  Share2, 
  Check, 
  Layers,
  HelpCircle,
  FileCode2
} from 'lucide-react';

interface Props {
  algorithm: AlgorithmItem;
  category: CategoryInfo;
  onBack: () => void;
  onOpenAI: (mode?: 'explain' | 'adapt') => void;
  onOpenArchitecture: () => void;
}

export const SplitScreenViewer: React.FC<Props> = ({
  algorithm,
  category,
  onBack,
  onOpenAI,
  onOpenArchitecture
}) => {
  // Initialize parameter values
  const [paramValues, setParamValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    algorithm.parameters.forEach(p => {
      initial[p.id] = p.defaultValue;
    });
    return initial;
  });

  const [leftTab, setLeftTab] = useState<'code' | 'dataset'>('code');
  const [isRunning, setIsRunning] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Compute processed rows reactively whenever paramValues change
  const processedRows = useMemo(() => {
    return algorithm.processDataset(algorithm.dataset.rawRows, paramValues);
  }, [algorithm, paramValues]);

  const handleParamChange = (paramId: string, val: any) => {
    setParamValues(prev => ({ ...prev, [paramId]: val }));
  };

  const handleResetParams = () => {
    const reset: Record<string, any> = {};
    algorithm.parameters.forEach(p => {
      reset[p.id] = p.defaultValue;
    });
    setParamValues(reset);
  };

  const handleSimulateRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 400);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs"
            title="Voltar ao Catálogo"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Voltar</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${category.tagColor}`}>
                {category.name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Nível: {algorithm.level}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {algorithm.badge}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
              {algorithm.title}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAI('explain')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-medium rounded-lg shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explicar com Gemini IA</span>
          </button>

          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-lg border border-slate-700 transition-all cursor-pointer"
            title="Ver Arquitetura e Estrutura de Componentes"
          >
            <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Blueprint Técnico</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-all cursor-pointer"
            title="Copiar Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* SPLIT SCREEN MAIN CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LADO ESQUERDO: Bloco de Código Python & Dataset Miniatura (7 Colunas no Desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Sub-Tabs Selector for Left Column */}
          <div className="flex items-center justify-between bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLeftTab('code')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  leftTab === 'code'
                    ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Código Python (Pandas)</span>
              </button>

              <button
                onClick={() => setLeftTab('dataset')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  leftTab === 'dataset'
                    ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Dataset Miniatura ({algorithm.dataset.rawRows.length} linhas)</span>
              </button>
            </div>

            <button
              onClick={() => onOpenAI('adapt')}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 px-2 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Adaptar ao meu dataset</span>
            </button>
          </div>

          {/* Left Tab Content */}
          {leftTab === 'code' ? (
            <div className="space-y-4">
              <PythonCodeBlock
                code={algorithm.pythonCode}
                parameters={algorithm.parameters}
                paramValues={paramValues}
                onParamChange={handleParamChange}
                onResetParams={handleResetParams}
                onSimulateRun={handleSimulateRun}
                isRunning={isRunning}
              />

              {/* Quick miniature preview below code */}
              <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/50 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-teal-400" />
                    <span>Visualização Rápida do DataFrame Resultante</span>
                  </span>
                  <button
                    onClick={() => setLeftTab('dataset')}
                    className="text-teal-400 hover:underline text-[11px] cursor-pointer"
                  >
                    Ver tabela completa →
                  </button>
                </div>
                <div className="overflow-x-auto max-h-36">
                  <table className="w-full text-left font-mono text-[11px] text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        {Object.keys(processedRows[0] || {})
                          .filter(k => !k.startsWith('_'))
                          .slice(0, 5)
                          .map(k => (
                            <th key={k} className="py-1 px-2 text-[10px]">{k}</th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {processedRows.slice(0, 3).map((r, i) => (
                        <tr key={i} className={r._isAlert ? 'bg-rose-950/20 text-rose-300' : ''}>
                          {Object.keys(r)
                            .filter(k => !k.startsWith('_'))
                            .slice(0, 5)
                            .map(k => (
                              <td key={k} className="py-1 px-2">
                                {typeof r[k] === 'number' ? r[k].toLocaleString('pt-BR') : String(r[k])}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <MiniatureDatasetViewer
                dataset={algorithm.dataset}
                processedRows={processedRows}
              />
              <button
                onClick={() => setLeftTab('code')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Voltar para o Bloco de Código</span>
              </button>
            </div>
          )}
        </div>

        {/* LADO DIREITO: Artigo de Aplicação Conceitual (5 Colunas no Desktop) */}
        <div className="lg:col-span-5">
          <ApplicationArticle article={algorithm.article} title={algorithm.title} />
        </div>
      </div>

      {/* ÁREA INFERIOR: Visualização Gráfica Dinâmica em Tempo Real */}
      <div className="w-full">
        <InteractiveDataChart config={algorithm.chart} params={paramValues} />
      </div>
    </div>
  );
};
