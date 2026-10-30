import React, { useState } from 'react';
import { X, Copy, Check, Layers, Database, Code2, Cpu, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'codeExample'>('architecture');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const schemaSnippet = `// types/data-library.ts
export type AnalyticalCategory = 
  | 'descritiva' 
  | 'segmentacao' 
  | 'anomalias' 
  | 'preditiva' 
  | 'limpeza';

export interface ColumnMeta {
  key: string;
  label: string;
  type: 'int64' | 'float64' | 'object' | 'bool' | 'datetime64';
}

export interface MiniDataset {
  name: string;
  description: string;
  columns: ColumnMeta[];
  rawRows: Record<string, any>[];
}

export interface ConceptualArticle {
  headline: string;
  oneLiner: string;
  coreIntuition: string[];
  analogy: string;
  whenToUse: string[];
  whenToAvoid: string[];
  businessValue: string;
  pandasPitfalls: string[];
  performanceNotes: {
    timeComplexity: string;
    memoryComplexity: string;
    vectorized: boolean;
  };
}

export interface AlgorithmItem {
  id: string;
  title: string;
  category: AnalyticalCategory;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  badge: string;
  shortObjective: string;
  tags: string[];
  pythonCode: string;
  dataset: MiniDataset;
  parameters: InteractiveParameter[];
  processDataset: (raw: Record<string, any>[], params: Record<string, any>) => Record<string, any>[];
  article: ConceptualArticle;
  chart: ChartSimulationConfig;
}`;

  const componentTreeSnippet = `src/
├── components/
│   ├── HeaderNav.tsx               # Barra superior com abas de categorias e busca
│   ├── AlgorithmCardGrid.tsx       # Grid de cartões resumindo cada técnica
│   ├── SplitScreenViewer.tsx       # Container Master de Tela Dividida
│   │   ├── PythonCodeBlock.tsx     # Editor/Sandbox com Syntax Highlight & Sliders
│   │   ├── MiniatureDatasetViewer.tsx # Tabela antes/depois (Raw vs Processado)
│   │   ├── ApplicationArticle.tsx  # Artigo conceitual editorial de teoria
│   │   └── InteractiveDataChart.tsx# Visualizador dinâmico de gráficos SVG
│   ├── ArchitectureModal.tsx       # Documentação arquitetural para o usuário
│   └── GeminiAssistantDrawer.tsx   # Assistente IA com Gemini 3.8 Flash
├── data/
│   └── algorithms.ts               # Catálogo de dados estruturados dos pilares
├── types/
│   └── data-library.ts             # Interfaces TypeScript e contratos
└── server.ts                       # Backend Express com Proxy para Gemini API`;

  const splitScreenComponentSnippet = `import React, { useState, useMemo } from 'react';
import { AlgorithmItem } from './types/data-library';

export function SplitScreenView({ algorithm }: { algorithm: AlgorithmItem }) {
  // 1. Estado reativo para os parâmetros interativos
  const [params, setParams] = useState(() => 
    algorithm.parameters.reduce((acc, p) => ({ ...acc, [p.id]: p.defaultValue }), {})
  );

  // 2. Execução vetorizada em memória (simulando Pandas)
  const processedData = useMemo(() => {
    return algorithm.processDataset(algorithm.dataset.rawRows, params);
  }, [algorithm, params]);

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Top Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs text-cyan-400 font-mono">{algorithm.category}</span>
          <h1 className="text-xl font-bold">{algorithm.title}</h1>
        </div>
      </header>

      {/* Grid Dividido (Split Screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lado Esquerdo (7 cols): Código Python + Dataset */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Bloco de Código com Parâmetros */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs">
            <pre><code>{algorithm.pythonCode}</code></pre>
            
            {/* Controles de Parâmetros */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              {algorithm.parameters.map(param => (
                <div key={param.id} className="flex justify-between items-center my-2">
                  <label className="text-xs">{param.label}</label>
                  <input
                    type="range"
                    min={param.min} max={param.max} step={param.step}
                    value={params[param.id]}
                    onChange={(e) => setParams({ ...params, [param.id]: Number(e.target.value) })}
                    className="accent-cyan-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dataset Miniatura Resultante */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  {Object.keys(processedData[0] || {}).map(k => <th key={k} className="p-2">{k}</th>)}
                </tr>
              </thead>
              <tbody>
                {processedData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/50">
                    {Object.values(row).map((val, idx) => (
                      <td key={idx} className="p-2">{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Lado Direito (5 cols): Artigo Conceitual */}
        <aside className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-lg font-bold mb-2">{algorithm.article.headline}</h2>
          <p className="text-sm text-slate-300 italic mb-4">"{algorithm.article.analogy}"</p>
          <div className="text-xs space-y-2 text-slate-300">
            {algorithm.article.coreIntuition.map((pt, i) => <p key={i}>• {pt}</p>)}
          </div>
        </aside>
      </div>

      {/* Inferior: Visualização Gráfica Dinâmica */}
      <footer className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4">
        {/* Renderiza o SVG reativo aos dados e parâmetros */}
        <InteractiveDataChart config={algorithm.chart} params={params} />
      </footer>
    </div>
  );
}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Blueprint Arquitetural & Especificação UX/UI
              </h2>
              <p className="text-xs text-slate-400">
                Padrões de engenharia sênior para a "Biblioteca Intuitiva de Dados"
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-2">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Arquitetura de Componentes</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'schema'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>2. Estrutura de Dados (TypeScript)</span>
          </button>

          <button
            onClick={() => setActiveTab('codeExample')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'codeExample'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>3. Exemplo Split-Screen em React</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-thin scrollbar-thumb-slate-800 space-y-6 text-slate-200">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  Árvore de Componentes & Separação de Responsabilidades
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Para garantir escalabilidade, testabilidade e separação de interesses (Clean Architecture no Frontend),
                  dividimos a aplicação em quatro camadas funcionais:
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300/90 relative">
                  <button
                    onClick={() => handleCopy(componentTreeSnippet, 'tree')}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-900 border border-slate-800"
                    title="Copiar árvore"
                  >
                    {copied === 'tree' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="whitespace-pre overflow-x-auto">{componentTreeSnippet}</pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <h4 className="text-xs font-bold text-indigo-300 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Fluxo de Estado & Reatividade
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li><strong>Single Source of Truth:</strong> O estado dos parâmetros reside no container master (`SplitScreenViewer`).</li>
                    <li><strong>Vetorização em Memória:</strong> O cálculo de `processDataset` roda via `useMemo`, eliminando re-renders desnecessários.</li>
                    <li><strong>Gráfico Reativo:</strong> O SVG dinâmico consome diretamente a função analítica com os parâmetros correntes.</li>
                  </ul>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <h4 className="text-xs font-bold text-emerald-300 mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Motor de Execução Python
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li><strong>Navegador (Zero Latência):</strong> Demonstração interativa instantânea com simulação de vetorização Pandas.</li>
                    <li><strong>Pyodide / WASM (Opcional):</strong> Executa o binário real do CPython e Pandas direto no navegador via WebWorker.</li>
                    <li><strong>Gemini 3.8 Flash (Backend):</strong> Roda no Express (`/api/gemini/assist`) para explicar lógica e adaptar código.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Contrato de Dados TypeScript (schema.ts)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Estrutura tipada necessária para alimentar dinamicamente os algoritmos, artigos e gráficos.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(schemaSnippet, 'schema')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 border border-slate-700 transition-all cursor-pointer"
                >
                  {copied === 'schema' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copiar Interfaces</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-[460px]">
                <pre>{schemaSnippet}</pre>
              </div>
            </div>
          )}

          {activeTab === 'codeExample' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Componente React Completo (SplitScreenView.tsx)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Código pronto para uso com Next.js (App Router / Pages Router) e Tailwind CSS.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(splitScreenComponentSnippet, 'code')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 border border-slate-700 transition-all cursor-pointer"
                >
                  {copied === 'code' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copiar Componente</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-[460px]">
                <pre>{splitScreenComponentSnippet}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
