import React from 'react';

export function renderExtendedMiniChart(type: string, params: Record<string, any> = {}): React.ReactNode {
  // 13. BOXPLOT & TUKEY IQR
  if (type === 'boxplot-tukey') {
    const fator = Number(params['fator_iqr'] ?? 1.5);
    const whiskerRight = Math.min(210, 160 + fator * 22);

    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-amber-900/85 text-amber-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-amber-700">
          IQR = R$ 420 ({fator}x Cerca)
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          {/* Whiskers */}
          <line x1="30" y1="50" x2="70" y2="50" stroke="#78350f" strokeWidth="2" />
          <line x1="30" y1="35" x2="30" y2="65" stroke="#78350f" strokeWidth="2" />
          <line x1="150" y1="50" x2={whiskerRight} y2="50" stroke="#78350f" strokeWidth="2" />
          <line x1={whiskerRight} y1="35" x2={whiskerRight} y2="65" stroke="#78350f" strokeWidth="2" />

          {/* Box (Q1 to Q3) */}
          <rect x="70" y="25" width="80" height="50" fill="#fef3c7" stroke="#b45309" strokeWidth="2" rx="2" />
          {/* Median line */}
          <line x1="108" y1="25" x2="108" y2="75" stroke="#b45309" strokeWidth="3" />

          {/* Outliers */}
          <circle cx="218" cy="50" r="4.5" fill="#f43f5e" stroke="#ffe4e6" strokeWidth="1.5" />
          <circle cx="230" cy="50" r="4.5" fill="#f43f5e" stroke="#ffe4e6" strokeWidth="1.5" />

          <text x="70" y="88" textAnchor="middle" className="text-[8px] fill-slate-500 font-mono">Q1</text>
          <text x="108" y="88" textAnchor="middle" className="text-[8px] fill-amber-900 font-bold font-mono">Med</text>
          <text x="150" y="88" textAnchor="middle" className="text-[8px] fill-slate-500 font-mono">Q3</text>
        </svg>
      </div>
    );
  }

  // 14. SEGMENTAÇÃO RFM
  if (type === 'rfm-matrix') {
    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[9px] font-semibold text-slate-700 mb-1">
          <span className="font-mono text-emerald-800">Matriz RFM (Recência x Freq)</span>
          <span className="bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-mono text-[9px]">5 Clusters</span>
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          {/* Grid segments */}
          <rect x="25" y="10" width="90" height="38" fill="#15803d" rx="2" />
          <text x="70" y="32" textAnchor="middle" className="text-[9px] fill-white font-bold">🏆 Campeões</text>

          <rect x="120" y="10" width="95" height="38" fill="#0284c7" rx="2" />
          <text x="167" y="32" textAnchor="middle" className="text-[9px] fill-white font-bold">💎 Fiéis</text>

          <rect x="25" y="52" width="90" height="38" fill="#f59e0b" rx="2" />
          <text x="70" y="74" textAnchor="middle" className="text-[9px] fill-white font-bold">⚠️ Em Risco</text>

          <rect x="120" y="52" width="95" height="38" fill="#64748b" rx="2" />
          <text x="167" y="74" textAnchor="middle" className="text-[9px] fill-white font-bold">💤 Hibernando</text>
        </svg>
      </div>
    );
  }

  // 15. TESTE A/B
  if (type === 'ab-test-distribution') {
    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-cyan-900/85 text-cyan-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-cyan-700">
          p-valor = 0.014 (&lt; 0.05)
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          {/* Curve A (Control - Grey/Slate) */}
          <path d="M 20 85 C 50 85, 70 25, 95 25 C 120 25, 140 85, 170 85" fill="none" stroke="#64748b" strokeWidth="2" />
          {/* Curve B (Variant - Cyan/Blue) */}
          <path d="M 60 85 C 90 85, 115 15, 140 15 C 165 15, 185 85, 220 85" fill="none" stroke="#0891b2" strokeWidth="2.5" />
          {/* Mean lines */}
          <line x1="95" y1="25" x2="95" y2="85" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="140" y1="15" x2="140" y2="85" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="2 2" />
          {/* Delta arrow */}
          <line x1="95" y1="45" x2="140" y2="45" stroke="#059669" strokeWidth="2" />
          <text x="117" y="40" textAnchor="middle" className="text-[8px] fill-emerald-700 font-bold font-mono">+26% Lift</text>
          <line x1="15" y1="86" x2="225" y2="86" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 16. REGRESSÃO LOGÍSTICA
  if (type === 'logistic-curve') {
    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-indigo-900/85 text-indigo-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-indigo-700">
          Curva Sigmóide P(Y=1)
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          {/* Sigmoid Curve */}
          <path d="M 25 82 C 75 82, 105 78, 120 50 C 135 22, 165 18, 215 18" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
          {/* Decision threshold 0.5 */}
          <line x1="20" y1="50" x2="220" y2="50" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 2" />
          <text x="215" y="46" textAnchor="end" className="text-[8px] fill-rose-600 font-mono">Cut: 0.50</text>
          {/* Observed Points 0 and 1 */}
          {[35, 55, 75, 90].map((cx, i) => (
            <circle key={`bot-${i}`} cx={cx} cy={82} r="3" fill="#0284c7" />
          ))}
          {[145, 165, 185, 205].map((cx, i) => (
            <circle key={`top-${i}`} cx={cx} cy={18} r="3" fill="#4f46e5" />
          ))}
          <line x1="20" y1="88" x2="225" y2="88" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 17. ANÁLISE DE SOBREVIVÊNCIA
  if (type === 'survival-curve') {
    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-rose-900/85 text-rose-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-rose-700">
          Kaplan-Meier S(t)
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          {/* Step curve */}
          <path d="M 25 20 H 60 V 38 H 100 V 55 H 145 V 68 H 190 V 78 H 220" fill="none" stroke="#e11d48" strokeWidth="2.5" />
          {/* Censored ticks */}
          <line x1="80" y1="33" x2="80" y2="43" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="160" y1="63" x2="160" y2="73" stroke="#0284c7" strokeWidth="1.5" />
          {/* 50% Half-life */}
          <line x1="25" y1="55" x2="100" y2="55" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="100" y1="55" x2="100" y2="90" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="105" y="88" className="text-[8px] fill-slate-700 font-mono font-bold">Meia-Vida: 8.5m</text>
          <line x1="20" y1="90" x2="225" y2="90" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 18. HOLT-WINTERS
  if (type === 'holt-winters') {
    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-sky-900/85 text-sky-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-sky-700">
          Holt-Winters Suavizado
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          {/* Historical raw */}
          <path d="M 25 80 L 45 70 L 65 74 L 85 60 L 105 65 L 125 48 L 145 52" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Smoothed curve */}
          <path d="M 25 78 Q 85 64 145 50" fill="none" stroke="#0284c7" strokeWidth="2.5" />
          {/* Projection with confidence cone */}
          <polygon points="145,50 215,25 215,45" fill="#38bdf8" fillOpacity="0.25" />
          <line x1="145" y1="50" x2="215" y2="35" stroke="#0369a1" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="20" y1="88" x2="225" y2="88" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 19. FUNIL DE CONVERSÃO
  if (type === 'funnel-chart') {
    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[9px] font-semibold text-slate-700 mb-1">
          <span className="font-mono text-teal-800">Funil de Conversão</span>
          <span className="bg-teal-100 text-teal-800 px-1 py-0.2 rounded font-mono text-[9px]">4.8% Final</span>
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          <polygon points="30,12 210,12 185,28 55,28" fill="#0f766e" />
          <polygon points="57,31 183,31 160,47 80,47" fill="#0d9488" />
          <polygon points="82,50 158,50 140,66 100,66" fill="#14b8a6" />
          <polygon points="102,69 138,69 126,85 114,85" fill="#2dd4bf" />
          <text x="120" y="22" textAnchor="middle" className="text-[8px] fill-white font-bold">1. Visitas (10k)</text>
          <text x="120" y="41" textAnchor="middle" className="text-[8px] fill-white font-bold">2. Cadastro (3.8k)</text>
          <text x="120" y="60" textAnchor="middle" className="text-[8px] fill-white font-bold">3. Checkout (720)</text>
          <text x="120" y="79" textAnchor="middle" className="text-[8px] fill-teal-950 font-bold">480 Vendas</text>
        </svg>
      </div>
    );
  }

  // 20. DATA QUALITY BARS
  if (type === 'data-quality-bars') {
    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[9px] font-semibold text-slate-700 mb-1">
          <span className="font-mono text-rose-900">Auditoria & Completude</span>
          <span className="bg-rose-100 text-rose-800 px-1 py-0.2 rounded font-mono text-[9px]">91.4% Score</span>
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          <text x="50" y="24" textAnchor="end" className="text-[8px] fill-slate-600 font-mono">Nome</text>
          <rect x="55" y="16" width="160" height="10" fill="#10b981" rx="2" />
          <text x="50" y="44" textAnchor="end" className="text-[8px] fill-slate-600 font-mono">E-mail</text>
          <rect x="55" y="36" width="110" height="10" fill="#f59e0b" rx="2" />
          <text x="50" y="64" textAnchor="end" className="text-[8px] fill-slate-600 font-mono">Telefone</text>
          <rect x="55" y="56" width="55" height="10" fill="#f43f5e" rx="2" />
          <text x="50" y="84" textAnchor="end" className="text-[8px] fill-slate-600 font-mono">Renda</text>
          <rect x="55" y="76" width="135" height="10" fill="#10b981" rx="2" />
          <line x1="55" y1="10" x2="55" y2="92" stroke="#cbd5e1" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 21. CORRELATION HEATMAP
  if (type === 'correlation-heatmap') {
    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[9px] font-semibold text-slate-700 mb-1">
          <span className="font-mono text-indigo-900">Matriz de Correlação 4x4</span>
          <span className="bg-indigo-100 text-indigo-800 px-1 py-0.2 rounded font-mono text-[9px]">Pearson R</span>
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          {/* 4x4 grid */}
          <rect x="55" y="15" width="32" height="16" fill="#dc2626" rx="1" /><text x="71" y="26" textAnchor="middle" className="text-[7px] fill-white font-mono">1.00</text>
          <rect x="90" y="15" width="32" height="16" fill="#ef4444" rx="1" /><text x="106" y="26" textAnchor="middle" className="text-[7px] fill-white font-mono">0.96</text>
          <rect x="125" y="15" width="32" height="16" fill="#f87171" rx="1" /><text x="141" y="26" textAnchor="middle" className="text-[7px] fill-white font-mono">0.74</text>
          <rect x="160" y="15" width="32" height="16" fill="#38bdf8" rx="1" /><text x="176" y="26" textAnchor="middle" className="text-[7px] fill-slate-900 font-mono">-0.42</text>

          <rect x="55" y="34" width="32" height="16" fill="#ef4444" rx="1" /><text x="71" y="45" textAnchor="middle" className="text-[7px] fill-white font-mono">0.96</text>
          <rect x="90" y="34" width="32" height="16" fill="#dc2626" rx="1" /><text x="106" y="45" textAnchor="middle" className="text-[7px] fill-white font-mono">1.00</text>
          <rect x="125" y="34" width="32" height="16" fill="#f87171" rx="1" /><text x="141" y="45" textAnchor="middle" className="text-[7px] fill-white font-mono">0.81</text>
          <rect x="160" y="34" width="32" height="16" fill="#60a5fa" rx="1" /><text x="176" y="45" textAnchor="middle" className="text-[7px] fill-slate-900 font-mono">-0.55</text>

          <rect x="55" y="53" width="32" height="16" fill="#f87171" rx="1" /><text x="71" y="64" textAnchor="middle" className="text-[7px] fill-white font-mono">0.74</text>
          <rect x="90" y="53" width="32" height="16" fill="#f87171" rx="1" /><text x="106" y="64" textAnchor="middle" className="text-[7px] fill-white font-mono">0.81</text>
          <rect x="125" y="53" width="32" height="16" fill="#dc2626" rx="1" /><text x="141" y="64" textAnchor="middle" className="text-[7px] fill-white font-mono">1.00</text>
          <rect x="160" y="53" width="32" height="16" fill="#cbd5e1" rx="1" /><text x="176" y="64" textAnchor="middle" className="text-[7px] fill-slate-800 font-mono">0.05</text>

          <rect x="55" y="72" width="32" height="16" fill="#38bdf8" rx="1" /><text x="71" y="83" textAnchor="middle" className="text-[7px] fill-slate-900 font-mono">-0.42</text>
          <rect x="90" y="72" width="32" height="16" fill="#60a5fa" rx="1" /><text x="106" y="83" textAnchor="middle" className="text-[7px] fill-slate-900 font-mono">-0.55</text>
          <rect x="125" y="72" width="32" height="16" fill="#cbd5e1" rx="1" /><text x="141" y="83" textAnchor="middle" className="text-[7px] fill-slate-800 font-mono">0.05</text>
          <rect x="160" y="72" width="32" height="16" fill="#dc2626" rx="1" /><text x="176" y="83" textAnchor="middle" className="text-[7px] fill-white font-mono">1.00</text>
        </svg>
      </div>
    );
  }

  // 22. MARKET BASKET
  if (type === 'market-basket') {
    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-emerald-900/85 text-emerald-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-emerald-700">
          Apriori: Lift = 3.2x
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          {/* Network association graph */}
          <circle cx="65" cy="50" r="22" fill="#047857" />
          <text x="65" y="53" textAnchor="middle" className="text-[9px] fill-white font-bold">Pão</text>

          <circle cx="175" cy="50" r="22" fill="#0284c7" />
          <text x="175" y="53" textAnchor="middle" className="text-[9px] fill-white font-bold">Manteiga</text>

          <circle cx="120" cy="82" r="15" fill="#f59e0b" />
          <text x="120" y="85" textAnchor="middle" className="text-[8px] fill-white font-bold">Café</text>

          {/* Links */}
          <line x1="87" y1="50" x2="153" y2="50" stroke="#059669" strokeWidth="3" />
          <line x1="78" y1="65" x2="108" y2="76" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="162" y1="65" x2="132" y2="76" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />

          <text x="120" y="44" textAnchor="middle" className="text-[8px] fill-emerald-800 font-bold font-mono">Conf: 82%</text>
        </svg>
      </div>
    );
  }

  // 23. ROC CURVE & AUC
  if (type === 'roc-curve') {
    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-indigo-900/85 text-indigo-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-indigo-700">
          ROC AUC = 0.89
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          {/* Diagonal random line (0.5 AUC) */}
          <line x1="30" y1="85" x2="210" y2="15" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 3" />
          {/* ROC Curve */}
          <path d="M 30 85 C 32 30, 75 18, 210 15" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
          {/* Filled AUC area */}
          <path d="M 30 85 C 32 30, 75 18, 210 15 L 210 85 Z" fill="#818cf8" fillOpacity="0.2" />
          <text x="140" y="60" className="text-[9px] fill-indigo-900 font-bold font-mono">AUC = 0.89</text>
          <line x1="30" y1="85" x2="215" y2="85" stroke="#64748b" strokeWidth="1" />
          <line x1="30" y1="10" x2="30" y2="85" stroke="#64748b" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 24. SIMULAÇÃO DE MONTE CARLO
  if (type === 'monte-carlo') {
    return (
      <div className="relative w-full h-36 bg-white border border-slate-200 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="absolute top-2 left-2 z-10 bg-purple-900/85 text-purple-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-purple-700">
          Monte Carlo (10.000 Runs)
        </div>
        <svg viewBox="0 0 240 100" className="w-full h-full">
          {/* Bell curve distribution */}
          <path d="M 25 85 C 75 85, 95 20, 130 20 C 165 20, 185 85, 225 85" fill="none" stroke="#7c3aed" strokeWidth="2.2" />
          {/* VaR 95% Left Tail in Red */}
          <rect x="25" y="60" width="45" height="25" fill="#f43f5e" fillOpacity="0.4" />
          <line x1="70" y1="20" x2="70" y2="85" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="2 2" />
          <text x="68" y="32" textAnchor="end" className="text-[7px] fill-red-600 font-mono font-bold">VaR 95%</text>
          {/* Mean */}
          <line x1="130" y1="20" x2="130" y2="85" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="20" y1="86" x2="230" y2="86" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  return null;
}
