import React from 'react';
import { VisualAlgorithm } from '../data/simple-algorithms';
import { renderExtendedMiniChart } from './CardMiniChartExtended';

interface Props {
  type: VisualAlgorithm['cardChartType'];
  metricsSummary?: string;
  params?: Record<string, any>;
}

export const CardMiniChart: React.FC<Props> = ({ type, metricsSummary, params = {} }) => {
  // 1. ANÁLISE DE TENDÊNCIA
  if (type === 'trend-line') {
    const sensibilidade = Number(params['sensibilidade'] ?? 10);
    const horizonte = Number(params['horizonte'] ?? 3);
    const endY = Math.max(16, 42 - (sensibilidade * 0.9));
    const bandSpread = 12 + (horizonte * 2.5);
    const dynamicR2 = Math.min(0.99, 0.91 + (sensibilidade * 0.0025)).toFixed(2);
    const displayBadge = `R² ≈ ${dynamicR2} (+${sensibilidade}%)`;

    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-slate-800/90 text-sky-300 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-slate-700">
          {displayBadge}
        </div>
        <svg viewBox="0 0 240 120" className="w-full h-full">
          <polygon
            points={`20,105 220,${Math.max(8, endY - bandSpread)} 220,${Math.min(100, endY + bandSpread)} 20,115`}
            fill="#38bdf8"
            fillOpacity="0.25"
          />
          <line x1="20" y1="110" x2="220" y2={endY} stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={220 - (6 - horizonte) * 15} y1="15" x2={220 - (6 - horizonte) * 15} y2="115" stroke="#94a3b8" strokeDasharray="2 2" strokeWidth="1" />
          <line x1="15" y1="115" x2="225" y2="115" stroke="#94a3b8" strokeWidth="1" />
          <line x1="15" y1="15" x2="15" y2="115" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 2. PREVISÃO DE VENDAS
  if (type === 'forecast-bars') {
    const crescimento = Number(params['crescimento'] ?? 15);
    const fatorSazonal = Number(params['fator_sazonal'] ?? 1.1);
    const growthMult = (1 + crescimento / 100) * (fatorSazonal / 1.1);
    const h1 = Math.min(95, Math.max(30, 48 * growthMult));
    const h2 = Math.min(95, Math.max(35, 56 * growthMult));
    const h3 = Math.min(98, Math.max(40, 64 * growthMult));
    const totalGrowthPercent = ((growthMult - 1) * 100).toFixed(1);

    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[9px] font-semibold text-slate-700 mb-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-slate-700 inline-block"></span><span>Real</span></span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-emerald-400 inline-block"></span><span>Previsão</span></span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
            {Number(totalGrowthPercent) >= 0 ? '+' : ''}{totalGrowthPercent}% Previsto
          </span>
        </div>
        <svg viewBox="0 0 240 105" className="w-full h-full">
          <rect x="15" y="70" width="16" height="30" fill="#334155" rx="1" />
          <rect x="36" y="62" width="16" height="38" fill="#334155" rx="1" />
          <rect x="57" y="55" width="16" height="45" fill="#334155" rx="1" />
          <rect x="78" y="48" width="16" height="52" fill="#334155" rx="1" />
          <rect x="99" y="38" width="16" height="62" fill="#334155" rx="1" />
          <rect x="120" y="30" width="16" height="70" fill="#1e293b" rx="1" />
          <rect x="145" y={100 - h1} width="18" height={h1} fill="#6ee7b7" rx="1" className="transition-all duration-300" />
          <rect x="169" y={100 - h2} width="18" height={h2} fill="#86efac" rx="1" className="transition-all duration-300" />
          <rect x="193" y={100 - h3} width="18" height={h3} fill="#a7f3d0" rx="1" className="transition-all duration-300" />
          <path d={`M 128 30 Q 155 ${Math.min(70, 100 - h1)} 202 ${Math.max(5, 100 - h3)}`} fill="none" stroke="#059669" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="10" y1="100" x2="225" y2="100" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 3. DETECÇÃO DE ANOMALIAS
  if (type === 'scatter-outliers') {
    const limiarZ = Number(params['limiar_z'] ?? 2.0);
    const pointsData = [
      { cx: 30, cy: 90, z: 0.4 }, { cx: 45, cy: 98, z: 0.2 }, { cx: 62, cy: 82, z: 0.7 },
      { cx: 78, cy: 68, z: 1.3 }, { cx: 92, cy: 60, z: 1.5 }, { cx: 110, cy: 56, z: 1.6 },
      { cx: 128, cy: 48, z: 1.8 }, { cx: 145, cy: 42, z: 2.1 }, { cx: 165, cy: 38, z: 2.3 },
      { cx: 172, cy: 16, z: 2.8 }, { cx: 185, cy: 18, z: 2.6 }, { cx: 210, cy: 38, z: 2.2 },
    ];
    const outliers = pointsData.filter(p => p.z >= limiarZ);
    const thresholdY = Math.max(15, Math.min(80, 105 - (limiarZ * 26)));

    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-rose-900/85 text-rose-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-rose-700">
          {outliers.length} Anomalias (|Z| &gt; {limiarZ.toFixed(1)}σ)
        </div>
        <svg viewBox="0 0 240 115" className="w-full h-full">
          <line x1="20" y1={thresholdY} x2="220" y2={thresholdY - 15} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="25" y1="95" x2="220" y2="30" stroke="#334155" strokeWidth="1.2" />
          {pointsData.map((p, i) => {
            const isOutlier = p.z >= limiarZ;
            return (
              <circle key={i} cx={p.cx} cy={p.cy} r={isOutlier ? 4.5 : 3.2} fill={isOutlier ? '#f43f5e' : '#0f766e'} stroke={isOutlier ? '#ffe4e6' : 'none'} strokeWidth={isOutlier ? 1.5 : 0} />
            );
          })}
          <line x1="15" y1="105" x2="225" y2="105" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 4. CORRELAÇÃO (SEABORN REGPLOT)
  if (type === 'correlation-scatter') {
    const noise = Number(params['dispersao_ruido'] ?? 85);
    const rVal = (noise / 100 * 0.95).toFixed(2);

    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-indigo-700/85 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm">
          r = {rVal} ({noise}% conc.)
        </div>
        <svg viewBox="0 0 240 115" className="w-full h-full">
          <polygon points="20,102 215,22 215,36 20,112" fill="#818cf8" fillOpacity={0.15 + (100 - noise) * 0.002} />
          <line x1="20" y1="107" x2="215" y2="28" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
          {[[25, 102], [48, 92], [65, 80], [88, 72], [112, 62], [138, 52], [160, 42], [188, 34], [212, 22]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1" />
          ))}
          <line x1="15" y1="110" x2="225" y2="110" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 5. DISTRIBUIÇÃO ESTATÍSTICA (KDE)
  if (type === 'density-histogram') {
    const bins = Number(params['numero_bins'] ?? 15);
    const bw = Number(params['largura_banda_kde'] ?? 0.8);

    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 right-2 z-10 bg-amber-700/85 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm">
          {bins} bins · bw={bw}
        </div>
        <svg viewBox="0 0 240 115" className="w-full h-full">
          <rect x="20" y="85" width="14" height="20" fill="#fde68a" stroke="#d97706" strokeWidth="0.8" rx="1" />
          <rect x="36" y="60" width="14" height="45" fill="#fde68a" stroke="#d97706" strokeWidth="0.8" rx="1" />
          <rect x="52" y="32" width="14" height="73" fill="#fcd34d" stroke="#d97706" strokeWidth="0.8" rx="1" />
          <rect x="68" y="18" width="14" height="87" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" rx="1" />
          <rect x="84" y="24" width="14" height="81" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" rx="1" />
          <rect x="100" y="40" width="14" height="65" fill="#fcd34d" stroke="#d97706" strokeWidth="0.8" rx="1" />
          <rect x="116" y="55" width="14" height="50" fill="#fde68a" stroke="#d97706" strokeWidth="0.8" rx="1" />
          <path d={`M 15 95 C 40 ${85 - 20 * bw}, 55 ${15 * bw + 10}, 75 ${15 * bw + 10} C 95 ${15 * bw + 10}, 115 50, 140 70 C 165 82, 190 95, 215 102`} fill="none" stroke="#b45309" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="15" y1="105" x2="225" y2="105" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 6. COMPARAÇÃO CATEGÓRICA (BARRAS EMPILHADAS)
  if (type === 'stacked-bars') {
    const isPercent = params['modo_empilhamento'] === 'percentual';

    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[9px] font-semibold text-slate-700 mb-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-teal-600 inline-block"></span><span>HW</span></span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-sky-500 inline-block"></span><span>SW</span></span>
          </div>
          <span className="text-slate-500 font-mono text-[9px] bg-slate-100 px-1 py-0.2 rounded">
            {isPercent ? '100% Relativo' : 'Absoluto R$'}
          </span>
        </div>
        <svg viewBox="0 0 240 105" className="w-full h-full">
          <rect x="25" y={isPercent ? 45 : 45} width="35" height="55" fill="#0d9488" rx="1" />
          <rect x="25" y={isPercent ? 15 : 15} width="35" height="30" fill="#0284c7" rx="1" />
          <rect x="75" y={isPercent ? 52 : 55} width="35" height={isPercent ? 48 : 45} fill="#0d9488" rx="1" />
          <rect x="75" y={isPercent ? 20 : 25} width="35" height={isPercent ? 32 : 30} fill="#0284c7" rx="1" />
          <rect x="125" y={isPercent ? 55 : 65} width="35" height={isPercent ? 45 : 35} fill="#0d9488" rx="1" />
          <rect x="125" y={isPercent ? 22 : 35} width="35" height={isPercent ? 33 : 30} fill="#0284c7" rx="1" />
          <rect x="175" y={isPercent ? 58 : 70} width="35" height={isPercent ? 42 : 30} fill="#0d9488" rx="1" />
          <rect x="175" y={isPercent ? 25 : 50} width="35" height={isPercent ? 33 : 20} fill="#0284c7" rx="1" />
          <line x1="15" y1="100" x2="225" y2="100" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 7. NOVO: CLUSTERIZAÇÃO K-MEANS
  if (type === 'kmeans-clusters') {
    const k = Number(params['num_k'] ?? 3);

    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-purple-900/85 text-purple-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-purple-700">
          K = {k} Clusters Ativos
        </div>
        <svg viewBox="0 0 240 115" className="w-full h-full">
          {/* Cluster 1 (Purple - High Spenders) */}
          <circle cx="185" cy="30" r="18" fill="#c084fc" fillOpacity="0.25" stroke="#9333ea" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="180" cy="28" r="3.5" fill="#9333ea" />
          <circle cx="192" cy="24" r="3.5" fill="#9333ea" />
          <circle cx="186" cy="36" r="3.5" fill="#9333ea" />
          <text x="185" y="32" textAnchor="middle" className="text-[12px] fill-purple-900 font-bold">×</text>

          {/* Cluster 2 (Emerald - Low Spenders) */}
          <circle cx="55" cy="85" r="18" fill="#6ee7b7" fillOpacity="0.25" stroke="#059669" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="50" cy="82" r="3.5" fill="#059669" />
          <circle cx="62" cy="88" r="3.5" fill="#059669" />
          <circle cx="56" cy="78" r="3.5" fill="#059669" />
          <text x="55" y="87" textAnchor="middle" className="text-[12px] fill-emerald-900 font-bold">×</text>

          {/* Cluster 3 (Cyan - Medium) */}
          {k >= 3 && (
            <>
              <circle cx="120" cy="55" r="18" fill="#7dd3fc" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="115" cy="52" r="3.5" fill="#0284c7" />
              <circle cx="126" cy="58" r="3.5" fill="#0284c7" />
              <text x="120" y="57" textAnchor="middle" className="text-[12px] fill-sky-900 font-bold">×</text>
            </>
          )}

          {/* Cluster 4 (Amber - Extra) */}
          {k >= 4 && (
            <>
              <circle cx="95" cy="25" r="14" fill="#fde68a" fillOpacity="0.3" stroke="#d97706" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="95" cy="25" r="3.5" fill="#d97706" />
            </>
          )}

          <line x1="15" y1="105" x2="225" y2="105" stroke="#94a3b8" strokeWidth="1" />
          <line x1="15" y1="10" x2="15" y2="105" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 8. NOVO: ANÁLISE DE COORTE (HEATMAP DE SAFFRAS)
  if (type === 'cohort-retention') {
    const churn = Number(params['taxa_churn_mensal'] ?? 12);
    const m1 = Number(params['impacto_onboarding'] ?? 70);
    const m2 = Math.round(m1 * (1 - churn / 100));
    const m3 = Math.round(m2 * (1 - churn / 100));

    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[9px] font-semibold text-slate-700 mb-1">
          <span className="font-mono text-emerald-800">Retenção de Safras (Heatmap)</span>
          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-mono">M3 = {m3}%</span>
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          {/* Cohort Matrix Cells (Safra Jan, Fev, Mar) */}
          {/* Row 1: Jan */}
          <rect x="25" y="15" width="45" height="18" fill="#15803d" rx="2" /><text x="47" y="27" textAnchor="middle" className="text-[8px] fill-white font-bold font-mono">100%</text>
          <rect x="75" y="15" width="45" height="18" fill="#16a34a" rx="2" /><text x="97" y="27" textAnchor="middle" className="text-[8px] fill-white font-bold font-mono">{m1}%</text>
          <rect x="125" y="15" width="45" height="18" fill="#22c55e" rx="2" /><text x="147" y="27" textAnchor="middle" className="text-[8px] fill-white font-bold font-mono">{m2}%</text>
          <rect x="175" y="15" width="45" height="18" fill="#86efac" rx="2" /><text x="197" y="27" textAnchor="middle" className="text-[8px] fill-emerald-950 font-bold font-mono">{m3}%</text>

          {/* Row 2: Fev */}
          <rect x="25" y="38" width="45" height="18" fill="#15803d" rx="2" /><text x="47" y="50" textAnchor="middle" className="text-[8px] fill-white font-bold font-mono">100%</text>
          <rect x="75" y="38" width="45" height="18" fill="#16a34a" rx="2" /><text x="97" y="50" textAnchor="middle" className="text-[8px] fill-white font-bold font-mono">{Math.min(95, m1 + 2)}%</text>
          <rect x="125" y="38" width="45" height="18" fill="#22c55e" rx="2" /><text x="147" y="50" textAnchor="middle" className="text-[8px] fill-white font-bold font-mono">{Math.min(90, m2 + 2)}%</text>
          <rect x="175" y="38" width="45" height="18" fill="#f1f5f9" rx="2" /><text x="197" y="50" textAnchor="middle" className="text-[8px] fill-slate-400 font-mono">-</text>

          {/* Row 3: Mar */}
          <rect x="25" y="61" width="45" height="18" fill="#15803d" rx="2" /><text x="47" y="73" textAnchor="middle" className="text-[8px] fill-white font-bold font-mono">100%</text>
          <rect x="75" y="61" width="45" height="18" fill="#16a34a" rx="2" /><text x="97" y="73" textAnchor="middle" className="text-[8px] fill-white font-bold font-mono">{Math.min(95, m1 + 4)}%</text>
          <rect x="125" y="61" width="45" height="18" fill="#f1f5f9" rx="2" /><text x="147" y="73" textAnchor="middle" className="text-[8px] fill-slate-400 font-mono">-</text>
          <rect x="175" y="61" width="45" height="18" fill="#f1f5f9" rx="2" /><text x="197" y="73" textAnchor="middle" className="text-[8px] fill-slate-400 font-mono">-</text>

          {/* Column labels */}
          <text x="47" y="92" textAnchor="middle" className="text-[8px] fill-slate-500 font-mono">M0</text>
          <text x="97" y="92" textAnchor="middle" className="text-[8px] fill-slate-500 font-mono">M1</text>
          <text x="147" y="92" textAnchor="middle" className="text-[8px] fill-slate-500 font-mono">M2</text>
          <text x="197" y="92" textAnchor="middle" className="text-[8px] fill-slate-500 font-mono">M3</text>
        </svg>
      </div>
    );
  }

  // 9. NOVO: DECOMPOSIÇÃO TEMPORAL
  if (type === 'ts-decomposition') {
    const amp = Number(params['amplitude_sazonal'] ?? 25);
    const inc = Number(params['inclinacao_tendencia'] ?? 2);

    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-sky-900/85 text-sky-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-sky-700">
          Série = T + S + R
        </div>
        <svg viewBox="0 0 240 115" className="w-full h-full">
          {/* Layer 1: Trend line */}
          <line x1="20" y1={85} x2="220" y2={85 - inc * 12} stroke="#0284c7" strokeWidth="2" strokeDasharray="3 2" />
          <text x="225" y={88 - inc * 12} textAnchor="start" className="text-[7px] fill-sky-700 font-mono">Tend</text>

          {/* Layer 2: Seasonal oscillation */}
          <path
            d={`M 20 50 Q 40 ${50 - amp * 0.5} 60 50 T 100 50 T 140 50 T 180 50 T 220 50`}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.8"
          />
          <text x="225" y="52" textAnchor="start" className="text-[7px] fill-emerald-700 font-mono">Sazon</text>

          {/* Layer 3: Combined Raw Series with Noise */}
          <path
            d={`M 20 ${80} Q 40 ${70 - amp * 0.4} 60 ${65} T 100 ${55} T 140 ${45} T 180 ${35} T 220 ${25}`}
            fill="none"
            stroke="#1e293b"
            strokeWidth="2.2"
          />
          <text x="225" y="27" textAnchor="start" className="text-[7px] fill-slate-900 font-bold font-mono">Bruta</text>
        </svg>
      </div>
    );
  }

  // 10. NOVO: MATRIZ DE CONFUSÃO
  if (type === 'confusion-matrix') {
    const threshold = Number(params['threshold_corte'] ?? 0.5);
    const vp = Math.round(85 * (1.1 - threshold * 0.4));
    const fn = 100 - vp;
    const vn = Math.round(90 * (0.8 + threshold * 0.4));
    const fp = 100 - vn;

    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[9px] font-semibold text-slate-700 mb-1">
          <span className="font-mono text-indigo-900">Matriz de Confusão 2x2</span>
          <span className="bg-indigo-100 text-indigo-800 px-1 py-0.2 rounded font-mono text-[9px]">Corte = {threshold}</span>
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          {/* VP (Verdadeiro Positivo) */}
          <rect x="45" y="15" width="70" height="35" fill="#4338ca" rx="2" />
          <text x="80" y="32" textAnchor="middle" className="text-[11px] fill-white font-bold font-mono">VP: {vp}</text>
          <text x="80" y="44" textAnchor="middle" className="text-[7px] fill-indigo-200">Acerto Churn</text>

          {/* FP (Falso Positivo) */}
          <rect x="125" y="15" width="70" height="35" fill="#f43f5e" rx="2" />
          <text x="160" y="32" textAnchor="middle" className="text-[11px] fill-white font-bold font-mono">FP: {fp}</text>
          <text x="160" y="44" textAnchor="middle" className="text-[7px] fill-rose-200">Falso Alarme</text>

          {/* FN (Falso Negativo) */}
          <rect x="45" y="55" width="70" height="35" fill="#fb7185" rx="2" />
          <text x="80" y="72" textAnchor="middle" className="text-[11px] fill-white font-bold font-mono">FN: {fn}</text>
          <text x="80" y="84" textAnchor="middle" className="text-[7px] fill-rose-950">Churn Perdido</text>

          {/* VN (Verdadeiro Negativo) */}
          <rect x="125" y="55" width="70" height="35" fill="#6366f1" rx="2" />
          <text x="160" y="72" textAnchor="middle" className="text-[11px] fill-white font-bold font-mono">VN: {vn}</text>
          <text x="160" y="84" textAnchor="middle" className="text-[7px] fill-indigo-200">Fiel Confirmado</text>
        </svg>
      </div>
    );
  }

  // 11. NOVO: ANÁLISE DE PARETO (CURVA 80/20)
  if (type === 'pareto-curve') {
    const cut = Number(params['corte_pareto'] ?? 80);

    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-amber-900/85 text-amber-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-amber-700">
          Princípio 80/20 (Cut: {cut}%)
        </div>
        <svg viewBox="0 0 240 115" className="w-full h-full">
          {/* Pareto Decreasing Bars */}
          <rect x="25" y="30" width="18" height="75" fill="#f59e0b" rx="1" />
          <rect x="50" y="45" width="18" height="60" fill="#f59e0b" rx="1" />
          <rect x="75" y="65" width="18" height="40" fill="#fbbf24" rx="1" />
          <rect x="100" y="78" width="18" height="27" fill="#fcd34d" rx="1" />
          <rect x="125" y="86" width="18" height="19" fill="#fde68a" rx="1" />
          <rect x="150" y="92" width="18" height="13" fill="#fef3c7" rx="1" />
          <rect x="175" y="97" width="18" height="8" fill="#fef3c7" rx="1" />

          {/* Cumulative Percentage Curve (Rising to 100%) */}
          <path
            d="M 25 80 Q 55 35 100 28 T 195 18"
            fill="none"
            stroke="#b45309"
            strokeWidth="2.5"
          />

          {/* 80% Horizontal Threshold line */}
          <line x1="15" y1="28" x2="225" y2="28" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
          <text x="220" y="24" textAnchor="end" className="text-[8px] fill-red-600 font-mono font-bold">{cut}% Linha Vital</text>

          <line x1="15" y1="105" x2="225" y2="105" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 12. NOVO: IMPORTÂNCIA DE FEATURES (DRIVERS)
  if (type === 'feature-importance') {
    const topN = Number(params['top_n_features'] ?? 4);

    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[9px] font-semibold text-slate-700 mb-1">
          <span className="font-mono text-purple-900">Feature Importance (Drivers)</span>
          <span className="bg-purple-100 text-purple-800 px-1 py-0.2 rounded font-mono text-[9px]">Top {topN}</span>
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          {/* Driver 1 */}
          <text x="70" y="22" textAnchor="end" className="text-[8px] fill-slate-600 font-mono">Páginas</text>
          <rect x="75" y="14" width="135" height="11" fill="#7c3aed" rx="2" />
          <text x="215" y="22" textAnchor="start" className="text-[8px] fill-purple-900 font-bold font-mono">38%</text>

          {/* Driver 2 */}
          <text x="70" y="42" textAnchor="end" className="text-[8px] fill-slate-600 font-mono">Sessão</text>
          <rect x="75" y="34" width="98" height="11" fill="#8b5cf6" rx="2" />
          <text x="178" y="42" textAnchor="start" className="text-[8px] fill-purple-900 font-bold font-mono">28%</text>

          {/* Driver 3 */}
          {topN >= 3 && (
            <>
              <text x="70" y="62" textAnchor="end" className="text-[8px] fill-slate-600 font-mono">Recência</text>
              <rect x="75" y="54" width="75" height="11" fill="#a78bfa" rx="2" />
              <text x="155" y="62" textAnchor="start" className="text-[8px] fill-purple-900 font-bold font-mono">21%</text>
            </>
          )}

          {/* Driver 4 */}
          {topN >= 4 && (
            <>
              <text x="70" y="82" textAnchor="end" className="text-[8px] fill-slate-600 font-mono">E-mail</text>
              <rect x="75" y="74" width="42" height="11" fill="#c4b5fd" rx="2" />
              <text x="122" y="82" textAnchor="start" className="text-[8px] fill-purple-900 font-bold font-mono">12%</text>
            </>
          )}

          <line x1="75" y1="10" x2="75" y2="90" stroke="#cbd5e1" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // Check extended algorithms mini charts
  const extendedChart = renderExtendedMiniChart(type, params);
  if (extendedChart) {
    return <>{extendedChart}</>;
  }

  // Fallback
  return (
    <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
      <div className="text-xs text-slate-500 font-mono text-center pt-10">Gráfico Analítico</div>
    </div>
  );
};
