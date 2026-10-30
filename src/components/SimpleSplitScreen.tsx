import React, { useState, useMemo } from 'react';
import { VisualAlgorithm } from '../data/simple-algorithms';
import { renderExtendedBottomCharts } from './SplitScreenChartsExtended';
import { 
  getDynamicPythonCode, 
  executeAlgorithmPythonSandbox, 
  getDynamicDatasetRows 
} from '../utils/dynamicCodeEngine';
import { 
  Copy, 
  Check, 
  Play, 
  Send, 
  Bookmark, 
  Share2, 
  Sparkles, 
  Table, 
  Code2, 
  ArrowRight,
  ChevronDown,
  Terminal,
  Activity,
  FileText,
  BarChart3,
  Layers,
  Sliders
} from 'lucide-react';

interface Props {
  algorithm: VisualAlgorithm;
  params: Record<string, any>;
  onParamChange: (paramId: string, val: any) => void;
  onOpenAI: (prompt?: string) => void;
  isSideBySide?: boolean;
}

export const SimpleSplitScreen: React.FC<Props> = ({ 
  algorithm, 
  params, 
  onParamChange, 
  onOpenAI,
  isSideBySide = false
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'terminal' | 'dataset'>('code');
  const [sectionView, setSectionView] = useState<'all' | 'code' | 'article' | 'charts'>('all');
  const [isRunning, setIsRunning] = useState(false);

  // Compute dynamic Python code reflecting current slider / parameter states
  const dynamicCode = useMemo(() => {
    return getDynamicPythonCode(algorithm, params);
  }, [algorithm, params]);

  // Compute simulated real execution result (stdout, time, status, metrics)
  const executionResult = useMemo(() => {
    return executeAlgorithmPythonSandbox(algorithm, params);
  }, [algorithm, params]);

  // Dynamically computed rows for the Dataset Miniatura tab across ALL 24 algorithms
  const dynamicDatasetRows = useMemo(() => {
    return getDynamicDatasetRows(algorithm, params);
  }, [algorithm, params]);

  const handleCopy = () => {
    navigator.clipboard.writeText(dynamicCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSimulate = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setActiveTab('terminal');
    }, 280);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  // Syntax highlighting helper
  const renderHighlightedCode = (code: string) => {
    return code.split('\n').map((line, idx) => {
      let content: React.ReactNode = line;
      if (line.trim().startsWith('#')) {
        content = <span className="text-slate-500 italic">{line}</span>;
      } else {
        const parts = line.split(/(\b(?:import|from|as|def|return|if|else|for|in|lambda|print)\b|"[^"]*"|'[^']*'|\b\d+\.?\d*\b|\b(?:pd|np|sns|plt|df|mean|median|std|skew|kurt|corr|polyfit|rolling|qcut|pivot_table|plot|regplot|histplot)\b)/g);
        content = parts.map((part, pIdx) => {
          if (/^(import|from|as|def|return|if|else|for|in|lambda|print)$/.test(part)) {
            return <span key={pIdx} className="text-purple-400 font-semibold">{part}</span>;
          }
          if (/^(".*"|'.*')$/.test(part)) {
            return <span key={pIdx} className="text-emerald-400">{part}</span>;
          }
          if (/^\d+\.?\d*$/.test(part)) {
            return <span key={pIdx} className="text-amber-300">{part}</span>;
          }
          if (/^(pd|np|sns|plt|df)$/.test(part)) {
            return <span key={pIdx} className="text-cyan-400 font-semibold">{part}</span>;
          }
          if (/^(mean|median|std|skew|kurt|corr|polyfit|rolling|qcut|pivot_table|plot|regplot|histplot)$/.test(part)) {
            return <span key={pIdx} className="text-blue-400">{part}</span>;
          }
          return <span key={pIdx} className="text-slate-300">{part}</span>;
        });
      }
      return (
        <div key={idx} className="table-row hover:bg-slate-900/50">
          <span className="table-cell pr-3 text-slate-600 select-none text-[11px] font-mono text-right w-6">
            {idx + 1}
          </span>
          <span className="table-cell font-mono text-xs whitespace-pre">{content}</span>
        </div>
      );
    });
  };

  // Render bottom charts dynamically based on active algorithm and current params
  const renderBottomCharts = () => {
    // -------------------------------------------------------------
    // 1. ANÁLISE DE TENDÊNCIA
    // -------------------------------------------------------------
    if (algorithm.id === 'analise-tendencia' || algorithm.cardChartType === 'trend-line') {
      const sensibilidade = Number(params['sensibilidade'] ?? 10);
      const horizonte = Number(params['horizonte'] ?? 3);

      // Historical 8 months points
      const histPoints = [
        { m: 1, val: 52 }, { m: 2, val: 58 }, { m: 3, val: 68 }, { m: 4, val: 88 },
        { m: 5, val: 95 }, { m: 6, val: 110 }, { m: 7, val: 128 }, { m: 8, val: 145 },
      ];

      // Slope and projection
      const baseSlope = 13.2 * (1 + sensibilidade / 100);
      const lastVal = 145;
      const futurePoints = Array.from({ length: horizonte }).map((_, i) => ({
        m: 8 + i + 1,
        val: lastVal + baseSlope * (i + 1)
      }));

      // Coordinates mapping for SVG (width 220, height 90)
      const scaleX = (m: number) => 15 + ((m - 1) / (7 + horizonte)) * 190;
      const maxVal = Math.max(250, lastVal + baseSlope * horizonte);
      const scaleY = (v: number) => 82 - (v / maxVal) * 70;

      const linePoints = [
        ...histPoints.map(p => `${scaleX(p.m)} ${scaleY(p.val)}`),
        ...futurePoints.map(p => `${scaleX(p.m)} ${scaleY(p.val)}`)
      ];

      const projectedFinalVal = (lastVal + baseSlope * horizonte).toFixed(1);
      const dynamicR2 = Math.min(0.99, 0.91 + (sensibilidade * 0.0025)).toFixed(2);

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Chart 1: Em Tempo Real */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="py-1.5 px-3 bg-blue-100/90 text-blue-900 border-b border-blue-200 text-center font-bold text-xs flex items-center justify-between">
              <span>Em Tempo Real (Regressão OLS)</span>
              <span className="text-[10px] font-mono font-normal">y = {baseSlope.toFixed(1)}x + 38</span>
            </div>
            <div className="p-2 h-28 bg-gradient-to-b from-white to-blue-50/20">
              <svg viewBox="0 0 220 90" className="w-full h-full">
                {/* Confidence Area */}
                <polygon
                  points={`15,${scaleY(45)} 205,${scaleY(maxVal * 0.92)} 205,${scaleY(maxVal * 1.08)} 15,${scaleY(55)}`}
                  fill="#38bdf8"
                  fillOpacity="0.2"
                />
                {/* Fitted regression line */}
                <path
                  d={`M ${linePoints.join(' L ')}`}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Historical points */}
                {histPoints.map((p, i) => (
                  <circle key={i} cx={scaleX(p.m)} cy={scaleY(p.val)} r="3" fill="#0369a1" />
                ))}
                {/* Base axis */}
                <line x1="10" y1="84" x2="210" y2="84" stroke="#cbd5e1" strokeWidth="1" />
              </svg>
            </div>
            <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Sensibilidade: +{sensibilidade}%</span>
              <span className="text-sky-600 font-semibold">R² = {dynamicR2}</span>
            </div>
          </div>

          {/* Chart 2: Atualização Dinâmica */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="py-1.5 px-3 bg-sky-100/90 text-sky-900 border-b border-sky-200 text-center font-bold text-xs flex items-center justify-between">
              <span>Atualização Dinâmica (Projeção Futura)</span>
              <span className="text-[10px] font-mono font-normal">+{horizonte} meses</span>
            </div>
            <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-sky-50/20 text-xs">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-600 font-sans">Receita Atual (M8):</span>
                <span className="text-slate-900 font-bold">R$ 145,0k</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-600 font-sans">Projeção M{8 + horizonte}:</span>
                <span className="text-sky-700 font-bold">R$ {projectedFinalVal}k</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-600 font-sans">Ganho Incremental Acumulado:</span>
                <span className="text-emerald-700 font-bold">+R$ {(baseSlope * horizonte).toFixed(1)}k</span>
              </div>
            </div>
            <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Horizonte: {horizonte}m</span>
              <span className="text-emerald-600 font-semibold">Tendência OLS Ativa</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // 2. PREVISÃO DE VENDAS
    // -------------------------------------------------------------
    if (algorithm.id === 'previsao-vendas' || algorithm.cardChartType === 'forecast-bars') {
      const crescimento = Number(params['crescimento'] ?? 15);
      const fatorSazonal = Number(params['fator_sazonal'] ?? 1.1);
      const growthMult = (1 + crescimento / 100) * (fatorSazonal / 1.1);

      // Heights calculation
      const histBars = [30, 36, 42, 48, 56, 64];
      const baseFut1 = 70;
      const baseFut2 = 78;
      const baseFut3 = 85;

      const f1 = Math.min(88, Math.round(baseFut1 * growthMult));
      const f2 = Math.min(88, Math.round(baseFut2 * growthMult));
      const f3 = Math.min(90, Math.round(baseFut3 * growthMult));

      const totalUnits = Math.round((780 + 840 + 910) * growthMult);
      const revenueEst = Math.round(totalUnits * 0.125);

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Chart 1: Em Tempo Real */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="py-1.5 px-3 bg-emerald-100/90 text-emerald-900 border-b border-emerald-200 text-center font-bold text-xs flex items-center justify-between">
              <span>Em Tempo Real (Demanda)</span>
              <span className="text-[10px] font-mono font-normal">Crescimento: +{crescimento}%</span>
            </div>
            <div className="p-2 h-28 bg-gradient-to-b from-white to-emerald-50/20">
              <svg viewBox="0 0 220 90" className="w-full h-full">
                {/* 6 Real historical bars */}
                {histBars.map((h, i) => (
                  <rect key={i} x={12 + i * 16} y={80 - h * 0.75} width="11" height={h * 0.75} fill="#334155" rx="1" />
                ))}
                {/* 3 Projected bars reacting to sliders */}
                <rect x={118} y={80 - f1 * 0.75} width="13" height={f1 * 0.75} fill="#6ee7b7" rx="1" className="transition-all duration-300" />
                <rect x={136} y={80 - f2 * 0.75} width="13" height={f2 * 0.75} fill="#86efac" rx="1" className="transition-all duration-300" />
                <rect x={154} y={80 - f3 * 0.75} width="13" height={f3 * 0.75} fill="#a7f3d0" rx="1" className="transition-all duration-300" />

                {/* Polynomial dashed trajectory curve */}
                <path
                  d={`M 92 ${80 - 48} Q 120 ${80 - f1 * 0.75} 160 ${80 - f3 * 0.75}`}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
                <line x1="8" y1="81" x2="210" y2="81" stroke="#cbd5e1" strokeWidth="1" />
              </svg>
            </div>
            <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Sazonal: {fatorSazonal}x</span>
              <span className="text-emerald-700 font-semibold">+{((growthMult - 1) * 100).toFixed(1)}% Variação</span>
            </div>
          </div>

          {/* Chart 2: Atualização Dinâmica */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="py-1.5 px-3 bg-teal-100/90 text-teal-900 border-b border-teal-200 text-center font-bold text-xs flex items-center justify-between">
              <span>Atualização Dinâmica (Orçamento)</span>
              <span className="text-[10px] font-mono font-normal">Capacidade de Estoque</span>
            </div>
            <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-teal-50/20 text-xs">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-600 font-sans">Volume Previsto (3M):</span>
                <span className="text-emerald-800 font-bold">{totalUnits.toLocaleString('pt-BR')} unidades</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-600 font-sans">Receita Estimada:</span>
                <span className="text-slate-900 font-bold">R$ {revenueEst.toLocaleString('pt-BR')}k</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200 mt-1">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(20, (crescimento / 35) * 100))}%` }}
                ></div>
              </div>
            </div>
            <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Rolling Window = 3m</span>
              <span className="text-teal-700 font-semibold">Acurácia: 94.2%</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // 3. DETECÇÃO DE ANOMALIAS
    // -------------------------------------------------------------
    if (algorithm.id === 'deteccao-anomalias' || algorithm.cardChartType === 'scatter-outliers') {
      const limiarZ = Number(params['limiar_z'] ?? 2.0);
      const filtroValor = Number(params['filtro_valor'] ?? 1000);

      const datasetPoints = [
        { id: 1, val: 120, z: 0.4 },
        { id: 2, val: 115, z: 0.4 },
        { id: 3, val: 140, z: 0.5 },
        { id: 4, val: 1280, z: 2.14 },
        { id: 5, val: 95, z: 0.3 },
        { id: 6, val: 110, z: 0.4 },
        { id: 7, val: 1450, z: 2.51 },
        { id: 8, val: 105, z: 0.4 },
        { id: 9, val: 1600, z: 2.85 },
        { id: 10, val: 890, z: 1.65 },
        { id: 11, val: 130, z: 0.5 },
        { id: 12, val: 98, z: 0.3 },
      ];

      const anomalies = datasetPoints.filter(p => p.z >= limiarZ && p.val >= filtroValor);
      const anomalyCount = anomalies.length;

      // Threshold line Y mapping (lower Z = lower line = more items flagged)
      const thresholdY = Math.max(16, Math.min(75, 80 - (limiarZ * 18)));

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Chart 1: Em Tempo Real */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="py-1.5 px-3 bg-rose-100/90 text-rose-900 border-b border-rose-200 text-center font-bold text-xs flex items-center justify-between">
              <span>Em Tempo Real (Scatter & Limiar)</span>
              <span className="text-[10px] font-mono font-normal">Corte: |Z| ≥ {limiarZ.toFixed(1)}σ</span>
            </div>
            <div className="p-2 h-28 bg-gradient-to-b from-white to-rose-50/20">
              <svg viewBox="0 0 220 90" className="w-full h-full">
                {/* Moving threshold line */}
                <line x1="10" y1={thresholdY} x2="210" y2={thresholdY} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
                <text x="205" y={thresholdY - 3} textAnchor="end" className="text-[8px] fill-rose-600 font-mono font-bold">
                  {limiarZ.toFixed(1)}σ
                </text>

                {/* Data Points */}
                {datasetPoints.map((p, i) => {
                  const cx = 20 + i * 15;
                  const cy = 80 - (p.val / 1700) * 65;
                  const isOutlier = p.z >= limiarZ && p.val >= filtroValor;

                  return (
                    <circle
                      key={p.id}
                      cx={cx}
                      cy={cy}
                      r={isOutlier ? 4.5 : 3.2}
                      fill={isOutlier ? '#f43f5e' : '#0f766e'}
                      stroke={isOutlier ? '#ffe4e6' : 'none'}
                      strokeWidth={isOutlier ? 1.5 : 0}
                      className="transition-all duration-200"
                    />
                  );
                })}
                <line x1="10" y1="82" x2="210" y2="82" stroke="#cbd5e1" strokeWidth="1" />
              </svg>
            </div>
            <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="text-rose-600 font-bold">🚨 {anomalyCount} Anomalias</span>
              <span className="text-teal-700">{datasetPoints.length - anomalyCount} Legítimos</span>
            </div>
          </div>

          {/* Chart 2: Atualização Dinâmica */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="py-1.5 px-3 bg-red-100/90 text-red-900 border-b border-red-200 text-center font-bold text-xs flex items-center justify-between">
              <span>Atualização Dinâmica (Curva Gaussiana)</span>
              <span className="text-[10px] font-mono font-normal">Cauda Crítica</span>
            </div>
            <div className="p-2 h-28 bg-gradient-to-b from-white to-red-50/20">
              <svg viewBox="0 0 220 90" className="w-full h-full">
                {/* Bell Curve */}
                <path
                  d="M 15 80 C 60 80, 85 20, 110 15 C 135 20, 160 80, 205 80"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                />
                {/* Red critical rejection tail according to limiarZ */}
                <rect 
                  x={110 + (limiarZ - 1) * 25} 
                  y="15" 
                  width={Math.max(10, 205 - (110 + (limiarZ - 1) * 25))} 
                  height="65" 
                  fill="#f43f5e" 
                  fillOpacity="0.3" 
                />
                <line x1="110" y1="15" x2="110" y2="80" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3 2" />
                <line x1="10" y1="81" x2="210" y2="81" stroke="#cbd5e1" strokeWidth="1" />
              </svg>
            </div>
            <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Impacto: {((anomalyCount / datasetPoints.length) * 100).toFixed(0)}% da base</span>
              <span className="text-red-700 font-semibold">Min: R$ {filtroValor}</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // 4. CORRELAÇÃO
    // -------------------------------------------------------------
    if (algorithm.cardChartType === 'correlation-scatter') {
      const noise = Number(params['dispersao_ruido'] ?? 85);
      const method = String(params['metodo_corr'] ?? 'pearson');
      const spreadFactor = (100 - noise) * 0.35;

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="py-1.5 px-3 bg-indigo-100/90 text-indigo-900 border-b border-indigo-200 text-center font-bold text-xs flex items-center justify-between">
              <span>Em Tempo Real</span>
              <span className="text-[10px] font-mono font-normal">regplot (IC 95%)</span>
            </div>
            <div className="p-2 h-28 bg-gradient-to-b from-white to-indigo-50/20">
              <svg viewBox="0 0 220 90" className="w-full h-full">
                <line x1="20" y1="80" x2="200" y2="18" stroke="#4f46e5" strokeWidth="2" />
                <polygon points="20,74 200,12 200,24 20,86" fill="#818cf8" fillOpacity="0.2" />
                {[
                  [25, 78 + (Math.sin(1) * spreadFactor)],
                  [45, 68 - (Math.cos(2) * spreadFactor)],
                  [65, 60 + (Math.sin(3) * spreadFactor)],
                  [85, 52 - (Math.cos(4) * spreadFactor)],
                  [105, 45 + (Math.sin(5) * spreadFactor)],
                  [125, 38 - (Math.cos(6) * spreadFactor)],
                  [145, 32 + (Math.sin(7) * spreadFactor)],
                  [165, 26 - (Math.cos(8) * spreadFactor)],
                  [185, 20 + (Math.sin(9) * spreadFactor)],
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={Math.max(10, Math.min(85, cy))} r="3.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1" />
                ))}
                <line x1="15" y1="85" x2="210" y2="85" stroke="#cbd5e1" strokeWidth="1" />
              </svg>
            </div>
            <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Método: {method.toUpperCase()}</span>
              <span className="text-indigo-600 font-semibold">r = {(noise / 100 * 0.95).toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="py-1.5 px-3 bg-violet-100/90 text-violet-900 border-b border-violet-200 text-center font-bold text-xs flex items-center justify-between">
              <span>Atualização Dinâmica</span>
              <span className="text-[10px] font-mono font-normal">Matriz de Associação</span>
            </div>
            <div className="p-3 h-28 flex flex-col justify-center items-center bg-gradient-to-b from-white to-violet-50/20">
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${noise}%` }}
                ></div>
              </div>
              <div className="flex justify-between w-full text-[10px] text-slate-400 mt-1 font-mono">
                <span>Fraca (0.0)</span>
                <span>Moderada (0.5)</span>
                <span className="text-indigo-600 font-bold">Forte (1.0)</span>
              </div>
              <p className="text-[11px] text-slate-600 text-center mt-2">
                Explicação de variância: <strong className="text-indigo-600 font-mono">R² = {Math.pow(noise / 100 * 0.95, 2).toFixed(2)}</strong>
              </p>
            </div>
            <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Seaborn regplot</span>
              <span className="text-emerald-600 font-semibold">p-value &lt; 0.001</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // 5. DISTRIBUIÇÃO ESTATÍSTICA (KDE)
    // -------------------------------------------------------------
    if (algorithm.cardChartType === 'density-histogram') {
      const binsCount = Number(params['numero_bins'] ?? 15);
      const bandwidth = Number(params['largura_banda_kde'] ?? 0.8);
      const barWidth = 180 / Math.max(5, binsCount);

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="py-1.5 px-3 bg-amber-100/90 text-amber-900 border-b border-amber-200 text-center font-bold text-xs flex items-center justify-between">
              <span>Em Tempo Real</span>
              <span className="text-[10px] font-mono font-normal">Frequência ({binsCount} bins)</span>
            </div>
            <div className="p-2 h-28 bg-gradient-to-b from-white to-amber-50/20">
              <svg viewBox="0 0 220 90" className="w-full h-full">
                {Array.from({ length: Math.min(20, binsCount) }).map((_, i) => {
                  const h = 15 + Math.sin(i * 0.5) * 45 + (i > 3 && i < 8 ? 20 : 0);
                  return (
                    <rect
                      key={i}
                      x={15 + i * barWidth}
                      y={80 - h}
                      width={Math.max(4, barWidth - 2)}
                      height={h}
                      fill="#fde68a"
                      stroke="#d97706"
                      strokeWidth="0.8"
                      rx="1"
                    />
                  );
                })}
                <line x1="10" y1="82" x2="210" y2="82" stroke="#cbd5e1" strokeWidth="1" />
              </svg>
            </div>
            <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Bins: {binsCount}</span>
              <span className="text-amber-700 font-semibold">stat='density'</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="py-1.5 px-3 bg-orange-100/90 text-orange-900 border-b border-orange-200 text-center font-bold text-xs flex items-center justify-between">
              <span>Atualização Dinâmica</span>
              <span className="text-[10px] font-mono font-normal">KDE (bw = {bandwidth})</span>
            </div>
            <div className="p-2 h-28 bg-gradient-to-b from-white to-orange-50/20">
              <svg viewBox="0 0 220 90" className="w-full h-full">
                <path
                  d={`M 15 80 C 40 ${80 - 40 * bandwidth}, 65 ${15 * bandwidth + 10}, 85 ${15 * bandwidth + 10} C 110 ${20 * bandwidth + 15}, 140 65, 205 80`}
                  fill="none"
                  stroke="#b45309"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <line x1="85" y1="15" x2="85" y2="80" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
                <line x1="100" y1="28" x2="100" y2="80" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="3 2" />
                <line x1="10" y1="82" x2="210" y2="82" stroke="#cbd5e1" strokeWidth="1" />
              </svg>
            </div>
            <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="text-red-600">-- Média (8.5m)</span>
              <span className="text-blue-600">-- Mediana (7.1m)</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // 6. COMPARAÇÃO CATEGÓRICA (BARRAS EMPILHADAS)
    // -------------------------------------------------------------
    if (algorithm.cardChartType === 'stacked-bars') {
      const mode = String(params['modo_empilhamento'] ?? 'absoluto');
      const focus = String(params['destaque_subcategoria'] ?? 'todos');
      const isPercent = mode === 'percentual';

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="py-1.5 px-3 bg-teal-100/90 text-teal-900 border-b border-teal-200 text-center font-bold text-xs flex items-center justify-between">
              <span>Em Tempo Real</span>
              <span className="text-[10px] font-mono font-normal">{isPercent ? '100% Proporcional' : 'Absoluto (R$ Mil)'}</span>
            </div>
            <div className="p-2 h-28 bg-gradient-to-b from-white to-teal-50/20">
              <svg viewBox="0 0 220 90" className="w-full h-full">
                {[
                  { x: 25, h1: isPercent ? 45 : 45, h2: isPercent ? 25 : 25, name: 'SE' },
                  { x: 75, h1: isPercent ? 42 : 32, h2: isPercent ? 28 : 20, name: 'S' },
                  { x: 125, h1: isPercent ? 38 : 24, h2: isPercent ? 32 : 18, name: 'NE' },
                  { x: 175, h1: isPercent ? 44 : 20, h2: isPercent ? 26 : 14, name: 'CO' },
                ].map((bar, i) => (
                  <g key={i}>
                    <rect
                      x={bar.x}
                      y={80 - bar.h1}
                      width="26"
                      height={bar.h1}
                      fill={focus === 'software' ? '#99f6e4' : '#0d9488'}
                      rx="1"
                    />
                    <rect
                      x={bar.x}
                      y={80 - bar.h1 - bar.h2}
                      width="26"
                      height={bar.h2}
                      fill={focus === 'hardware' ? '#bae6fd' : '#0284c7'}
                      rx="1"
                    />
                    <text x={bar.x + 13} y="88" textAnchor="middle" className="text-[8px] fill-slate-500 font-semibold">{bar.name}</text>
                  </g>
                ))}
                <line x1="15" y1="81" x2="210" y2="81" stroke="#cbd5e1" strokeWidth="1" />
              </svg>
            </div>
            <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-teal-600 rounded-xs"></span>
                <span>Hardware</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-sky-600 rounded-xs"></span>
                <span>Software</span>
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="py-1.5 px-3 bg-cyan-100/90 text-cyan-900 border-b border-cyan-200 text-center font-bold text-xs flex items-center justify-between">
              <span>Atualização Dinâmica</span>
              <span className="text-[10px] font-mono font-normal">Composição Pivot</span>
            </div>
            <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-cyan-50/20 text-xs">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-600 font-sans">Sudeste (Maior Volume):</span>
                <span className="text-teal-700 font-bold">R$ 275k (65% HW / 35% SW)</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-600 font-sans">Nordeste (Maior Share SW):</span>
                <span className="text-sky-700 font-bold">41.3% Software</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-600 font-sans">Receita Consolidada:</span>
                <span className="text-slate-900 font-bold">R$ 720k Total</span>
              </div>
            </div>
            <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>pd.pivot_table</span>
              <span className="text-teal-600 font-semibold">aggfunc='sum'</span>
            </div>
          </div>
        </div>
      );
    }

    return renderExtendedBottomCharts({ algorithm, params });
  };

  const renderCodePanel = () => (
    <div className="flex flex-col gap-3">
      <div className="bg-[#0b1320] border border-slate-800 rounded-xl overflow-hidden shadow-xl text-left">
        {/* Terminal Header with 3 Tabs */}
        <div className="bg-[#121c2c] px-3 py-2 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-[11px] font-mono text-slate-300 ml-1 font-semibold truncate max-w-[120px] sm:max-w-[160px]">
              {algorithm.title.toLowerCase().replace(/ /g, '_')}.py
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* 3 Tabs: Code, Terminal, Dataset */}
            <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-700/80">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-2 py-0.5 text-[10px] rounded font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  activeTab === 'code' ? 'bg-indigo-600 text-white shadow-xs font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Ver código Python dinâmico"
              >
                <Code2 className="w-3 h-3" />
                <span>Código</span>
              </button>

              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-2 py-0.5 text-[10px] rounded font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  activeTab === 'terminal' ? 'bg-emerald-600 text-white shadow-xs font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Ver execução real no console Python"
              >
                <Terminal className="w-3 h-3" />
                <span>Terminal</span>
              </button>

              <button
                onClick={() => setActiveTab('dataset')}
                className={`px-2 py-0.5 text-[10px] rounded font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  activeTab === 'dataset' ? 'bg-cyan-600 text-white shadow-xs font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Ver tabela DataFrame em tempo real"
              >
                <Table className="w-3 h-3" />
                <span>DataFrame</span>
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Copiar código Python"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Code / Terminal / Dataset Content */}
        {activeTab === 'code' && (
          <div className="p-3.5 overflow-x-auto max-h-72 font-mono text-xs leading-relaxed bg-[#0b1320] scrollbar-thin scrollbar-thumb-slate-800">
            <div className="table w-full">{renderHighlightedCode(dynamicCode)}</div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="p-3.5 max-h-72 overflow-auto font-mono text-xs leading-relaxed bg-[#060b13] text-emerald-400 scrollbar-thin scrollbar-thumb-slate-800">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400 flex-wrap gap-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Python 3.11 (CPython) · Pandas 2.2.1 · NumPy
              </span>
              <span className="text-slate-500 font-mono">⚡ {executionResult.executionTimeMs}ms · {executionResult.memoryUsedKb} KB</span>
            </div>
            
            <div className="space-y-0.5 text-slate-300 font-mono text-[11px] whitespace-pre-wrap selection:bg-emerald-900 selection:text-white">
              {executionResult.stdout.split('\n').map((line, idx) => {
                let lineStyle = 'text-slate-300';
                if (line.startsWith('>>>')) lineStyle = 'text-cyan-400 font-bold';
                else if (line.startsWith('[INFO]')) lineStyle = 'text-slate-400';
                else if (line.includes('🚨') || line.includes('ALERTA') || line.includes('RECUSADO')) lineStyle = 'text-rose-400 font-semibold';
                else if (line.includes('🏆') || line.includes('✅') || line.includes('APROVADO') || line.includes('Lift')) lineStyle = 'text-emerald-400 font-semibold';
                else if (line.startsWith('[') && line.endsWith(']')) lineStyle = 'text-amber-300 font-semibold';

                return (
                  <div key={idx} className={lineStyle}>
                    {line}
                  </div>
                );
              })}
            </div>

            {executionResult.summaryMetrics.length > 0 && (
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                {executionResult.summaryMetrics.map((m, i) => (
                  <div key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-[10px] flex items-center gap-1 font-mono">
                    <span className="text-slate-400">{m.label}:</span>
                    <span className="text-cyan-300 font-bold">{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'dataset' && (
          <div className="p-3 bg-[#0b1320] max-h-72 overflow-auto">
            <div className="text-[10px] text-slate-400 mb-2 font-mono flex items-center justify-between flex-wrap gap-1">
              <span className="text-slate-300 font-semibold">{algorithm.datasetMini.name} ({dynamicDatasetRows.length} linhas)</span>
              <button
                onClick={() => onOpenAI(`Explique a estrutura do modelo de dados ${algorithm.datasetMini.name}, o significado de cada coluna e os tipos de dados recomendados para ${algorithm.title}.`)}
                className="text-[10px] text-sky-300 hover:text-white bg-sky-950/80 border border-sky-700/70 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                title="Consultar esquema e colunas com a IA"
              >
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>Consultar IA sobre este Modelo</span>
              </button>
            </div>
            <table className="w-full text-left font-mono text-[11px] text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  {algorithm.datasetMini.columns.map((c) => (
                    <th key={c} className="py-1 px-2 text-[10px]">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {dynamicDatasetRows.map((r, i) => {
                  const isAlert = r._isAlert;
                  const isProjected = r._isProjected;
                  return (
                    <tr 
                      key={i} 
                      className={`transition-colors ${
                        isAlert 
                          ? 'bg-rose-950/30 text-rose-200' 
                          : isProjected 
                          ? 'bg-sky-950/30 text-sky-200' 
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      {algorithm.datasetMini.columns.map((c) => (
                        <td key={c} className="py-1 px-2">{String(r[c] ?? '-')}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* DYNAMIC PARAMETERS BAR: Sliders & Selects with Live Feedback */}
        <div className="p-3 bg-[#0e1726] border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800/80 font-mono">
            <span className="flex items-center gap-1 text-sky-400 font-semibold">
              <Sliders className="w-3 h-3" />
              Parâmetros Interativos:
            </span>
            <span className="text-[10px] text-slate-500">Altera código, terminal e gráficos</span>
          </div>

          {algorithm.parameters.map((p) => (
            <div key={p.id} className="space-y-1">
              {p.type === 'slider' && (
                <div className="flex items-center justify-between text-xs gap-3">
                  <span className="text-slate-400 text-[11px] truncate" title={p.description}>
                    {p.label}:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={p.min}
                      max={p.max}
                      step={p.step}
                      value={params[p.id] ?? p.defaultValue}
                      onChange={(e) => onParamChange(p.id, Number(e.target.value))}
                      className="w-24 sm:w-32 accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="font-mono text-cyan-300 text-[11px] w-14 text-right font-semibold">
                      {params[p.id] ?? p.defaultValue}{p.unit || ''}
                    </span>
                  </div>
                </div>
              )}

              {p.type === 'select' && p.options && (
                <div className="flex items-center justify-between text-xs gap-3">
                  <span className="text-slate-400 text-[11px] truncate" title={p.description}>
                    {p.label}:
                  </span>
                  <div className="relative">
                    <select
                      value={params[p.id] ?? p.defaultValue}
                      onChange={(e) => onParamChange(p.id, e.target.value)}
                      className="appearance-none bg-slate-900 border border-slate-700 text-cyan-300 text-[11px] font-mono rounded px-2.5 py-1 pr-6 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {p.options.map((opt) => (
                        <option key={String(opt.value)} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
            <button
              onClick={() => onOpenAI(`Explique em detalhes o código e os conceitos do algoritmo ${algorithm.title}`)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Explicar com Gemini</span>
            </button>

            <button
              onClick={handleSimulate}
              disabled={isRunning}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded text-xs font-semibold flex items-center gap-1 shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
              <span>{isRunning ? 'Processando...' : 'Executar Sandbox'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderArticlePanel = () => (
    <div className="flex flex-col gap-3 text-left">
      {/* Article Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm text-slate-800">
        {/* Header: Title and social action icons */}
        <div className="flex items-start justify-between gap-3 mb-2 pb-2 border-b border-slate-100">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {algorithm.article.title}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {algorithm.article.subtitle}
            </p>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 text-slate-500 shrink-0">
            <button
              onClick={() => onOpenAI(algorithm.article.title)}
              className="p-1 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Enviar pergunta ao assistente"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-1 transition-colors cursor-pointer ${bookmarked ? 'text-amber-500' : 'hover:text-slate-800'}`}
              title="Salvar artigo"
            >
              <Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="p-1 hover:text-slate-800 transition-colors cursor-pointer"
              title="Compartilhar"
            >
              {shared ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Article body text */}
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          {algorithm.article.bodyText}
        </p>

        {/* Key bullet points */}
        <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3 text-xs text-slate-700">
          <span className="font-semibold text-slate-800 text-[11px] block mb-1">
            💡 Principais Conclusões:
          </span>
          {algorithm.article.keyPoints.map((pt, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-sky-500 font-bold">•</span>
              <span>{pt}</span>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-slate-500 italic bg-amber-50/70 border border-amber-200/60 p-2 rounded">
          <span className="font-semibold text-amber-800">Exemplo Real: </span>
          {algorithm.article.realWorldCase}
        </div>
      </div>

      {/* DYNAMIC TWO MINI CHARTS: "Em Tempo Real" & "Atualização Dinâmica" */}
      {renderBottomCharts()}
    </div>
  );

  return (
    <div className={`w-full ${isSideBySide ? '' : 'max-w-6xl mx-auto'} px-1 sm:px-2 pt-1`}>
      {/* Sleek Inspector Banner with Title, Pillar, Metric & View switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 mb-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-white font-mono">
              {algorithm.pillarName}
            </span>
            <span className="text-[11px] font-mono font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              {algorithm.metricsSummary}
            </span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-semibold flex items-center gap-1 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sandbox Ativo
            </span>
            <button
              onClick={() => onOpenAI(`Explique a estrutura do modelo de dados ${algorithm.datasetMini.name}, significado das colunas e tipos ideais para o algoritmo ${algorithm.title}.`)}
              className="text-[10px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded font-mono font-semibold flex items-center gap-1 border border-indigo-200 transition-colors cursor-pointer ml-auto sm:ml-0"
              title="Abrir assistente IA com foco no modelo de dados ativo"
            >
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Consultar Modelo na IA</span>
            </button>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{algorithm.title}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{algorithm.shortDesc}</p>
        </div>

        {/* Section View Tabs for Right Inspector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setSectionView('all')}
            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              sectionView === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span>Lado a Lado</span>
          </button>

          <button
            onClick={() => setSectionView('code')}
            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              sectionView === 'code'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Código & Terminal</span>
          </button>

          <button
            onClick={() => setSectionView('article')}
            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              sectionView === 'article'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Artigo</span>
          </button>

          <button
            onClick={() => setSectionView('charts')}
            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              sectionView === 'charts'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gráficos</span>
          </button>
        </div>
      </div>

      {/* Main Split Body depending on sectionView */}
      {sectionView === 'all' && (
        <>
          {/* Section Headings exactly like the sketch */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 mb-2 text-center">
            <div className="lg:col-span-5">
              <h3 className="text-sm font-black tracking-wider text-slate-800 uppercase font-sans">
                PARTE DO CÓDIGO
              </h3>
            </div>

            <div className="hidden lg:flex lg:col-span-1 justify-center">
              <div className="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600 font-bold shadow-sm">
                <ArrowRight className="w-4 h-4 text-slate-700" />
              </div>
            </div>

            <div className="lg:col-span-6">
              <h3 className="text-sm font-black tracking-wider text-slate-800 uppercase font-sans">
                ARTIGO DE APLICAÇÃO
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-5">
              {renderCodePanel()}
            </div>

            {/* Middle arrow for mobile */}
            <div className="flex lg:hidden justify-center my-1">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>

            <div className="lg:col-span-7">
              {renderArticlePanel()}
            </div>
          </div>
        </>
      )}

      {sectionView === 'code' && (
        <div className="max-w-4xl mx-auto">
          {renderCodePanel()}
        </div>
      )}

      {sectionView === 'article' && (
        <div className="max-w-4xl mx-auto">
          {renderArticlePanel()}
        </div>
      )}

      {sectionView === 'charts' && (
        <div className="space-y-4">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-slate-800">Visualizações Gráficas Dinâmicas</span>
              <span className="text-xs text-sky-600 font-mono">Atualizam com os sliders</span>
            </div>
            {renderBottomCharts()}
          </div>
        </div>
      )}
    </div>
  );
};
