import React from 'react';
import { VisualAlgorithm } from '../data/simple-algorithms';

interface Props {
  algorithm: VisualAlgorithm;
  params: Record<string, any>;
}

export function renderExtendedBottomCharts({ algorithm, params }: Props): React.ReactNode {
  const { id, cardChartType } = algorithm;

  // 1. BOXPLOT & TUKEY IQR
  if (cardChartType === 'boxplot-tukey' || id === 'boxplot-tukey') {
    const fator = Number(params['fator_iqr'] ?? 1.5);
    const assimetria = Number(params['corte_assimetria'] ?? 15);
    const whiskerRight = Math.min(210, 150 + fator * 24);
    const cercaSup = (260 + fator * 95).toFixed(0);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-amber-100/90 text-amber-900 border-b border-amber-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (Boxplot Tukey)</span>
            <span className="text-[10px] font-mono font-normal">Cerca = {fator}x IQR</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-amber-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              <line x1="25" y1="45" x2="65" y2="45" stroke="#78350f" strokeWidth="2" />
              <line x1="25" y1="30" x2="25" y2="60" stroke="#78350f" strokeWidth="2" />
              <line x1="145" y1="45" x2={whiskerRight} y2="45" stroke="#78350f" strokeWidth="2" />
              <line x1={whiskerRight} y1="30" x2={whiskerRight} y2="60" stroke="#78350f" strokeWidth="2" />

              <rect x="65" y="22" width="80" height="46" fill="#fef3c7" stroke="#b45309" strokeWidth="2" rx="2" />
              <line x1="102" y1="22" x2="102" y2="68" stroke="#b45309" strokeWidth="3" />

              <circle cx="205" cy="45" r="4.5" fill="#f43f5e" stroke="#ffe4e6" strokeWidth="1.5" />
              <circle cx="215" cy="45" r="4.5" fill="#f43f5e" stroke="#ffe4e6" strokeWidth="1.5" />

              <text x="65" y="80" textAnchor="middle" className="text-[8px] fill-slate-500 font-mono">Q1 (165)</text>
              <text x="102" y="80" textAnchor="middle" className="text-[8px] fill-amber-900 font-bold font-mono">Med (210)</text>
              <text x="145" y="80" textAnchor="middle" className="text-[8px] fill-slate-500 font-mono">Q3 (260)</text>
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Dispersão: IQR R$ 95</span>
            <span className="text-amber-700 font-semibold">Cerca: R$ {cercaSup}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-orange-100/90 text-orange-900 border-b border-orange-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Auditoria)</span>
            <span className="text-[10px] font-mono font-normal">Assimetria +{assimetria}%</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-orange-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Limite Superior:</span>
              <span className="text-slate-900 font-bold">R$ {cercaSup}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Status da Amostra:</span>
              <span className="text-emerald-700 font-bold">96.8% Dados Válidos</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (fator / 2.5) * 100)}%` }}></div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Filtro Não-Paramétrico</span>
            <span className="text-orange-700 font-semibold">Blindagem Tukey</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. MATRIZ RFM
  if (cardChartType === 'rfm-matrix' || id === 'rfm-segmentacao') {
    const recencia = Number(params['limiar_recencia'] ?? 30);
    const pisoVip = Number(params['gasto_minimo_vip'] ?? 2500);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-emerald-100/90 text-emerald-900 border-b border-emerald-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (Grid RFM)</span>
            <span className="text-[10px] font-mono font-normal">Corte: {recencia}d</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-emerald-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              <rect x="20" y="8" width="85" height="34" fill="#15803d" rx="2" />
              <text x="62" y="28" textAnchor="middle" className="text-[8px] fill-white font-bold">🏆 VIP (23.6%)</text>
              <rect x="115" y="8" width="85" height="34" fill="#0284c7" rx="2" />
              <text x="157" y="28" textAnchor="middle" className="text-[8px] fill-white font-bold">💎 Fiéis (31.2%)</text>
              <rect x="20" y="48" width="85" height="34" fill="#f59e0b" rx="2" />
              <text x="62" y="68" textAnchor="middle" className="text-[8px] fill-white font-bold">⚠️ Risco (18.1%)</text>
              <rect x="115" y="48" width="85" height="34" fill="#64748b" rx="2" />
              <text x="157" y="68" textAnchor="middle" className="text-[8px] fill-white font-bold">💤 Inativo (27.1%)</text>
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Piso VIP: R$ {pisoVip}</span>
            <span className="text-emerald-700 font-semibold">4 Clusters Ativos</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-teal-100/90 text-teal-900 border-b border-teal-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Potencial CRM)</span>
            <span className="text-[10px] font-mono font-normal">LTV Médio</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-teal-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Receita Campeões VIP:</span>
              <span className="text-emerald-800 font-bold">58% do Faturamento</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Contas 'Em Risco':</span>
              <span className="text-amber-700 font-bold">R$ 142k a Recuperar</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '74%' }}></div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>pd.qcut quantil 1-5</span>
            <span className="text-teal-700 font-semibold">ROI CRM: +320%</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. TESTE A/B
  if (cardChartType === 'ab-test-distribution' || id === 'ab-testing') {
    const conf = Number(params['nivel_confianca'] ?? 95);
    const amostra = Number(params['tamanho_amostra'] ?? 2500);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-cyan-100/90 text-cyan-900 border-b border-cyan-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (Gaussiana A vs B)</span>
            <span className="text-[10px] font-mono font-normal">IC {conf}%</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-cyan-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              <path d="M 15 80 C 45 80, 65 20, 90 20 C 115 20, 135 80, 165 80" fill="none" stroke="#64748b" strokeWidth="2" />
              <path d="M 55 80 C 85 80, 110 12, 135 12 C 160 12, 180 80, 210 80" fill="none" stroke="#0891b2" strokeWidth="2.5" />
              <line x1="90" y1="20" x2="90" y2="80" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="135" y1="12" x2="135" y2="80" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="2 2" />
              <line x1="90" y1="40" x2="135" y2="40" stroke="#059669" strokeWidth="2" />
              <text x="112" y="35" textAnchor="middle" className="text-[8px] fill-emerald-700 font-bold font-mono">+26%</text>
              <line x1="10" y1="81" x2="215" y2="81" stroke="#cbd5e1" strokeWidth="1" />
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Amostra: {amostra} users/var</span>
            <span className="text-cyan-700 font-semibold">p = 0.014 (&lt; 0.05)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-sky-100/90 text-sky-900 border-b border-sky-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Lift Estatístico)</span>
            <span className="text-[10px] font-mono font-normal">Poder: 84%</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-sky-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Taxa A (Controle):</span>
              <span className="text-slate-900 font-bold">8.40% ± 0.8%</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Taxa B (Variante):</span>
              <span className="text-emerald-700 font-bold">10.60% (Vencedor)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Decisão Recomendada:</span>
              <span className="text-sky-700 font-bold">Subir para 100% dos usuários</span>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Teste Z de Proporções</span>
            <span className="text-emerald-600 font-semibold">{conf}% Certeza</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. REGRESSÃO LOGÍSTICA
  if (cardChartType === 'logistic-curve' || id === 'regressao-logistica') {
    const corte = Number(params['corte_risco'] ?? 40);
    const cutY = 80 - (corte / 100) * 60;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-indigo-100/90 text-indigo-900 border-b border-indigo-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (Curva Sigmóide)</span>
            <span className="text-[10px] font-mono font-normal">Corte: {corte}%</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-indigo-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              <path d="M 20 78 C 70 78, 100 74, 115 48 C 130 22, 160 18, 205 18" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
              <line x1="15" y1={cutY} x2="205" y2={cutY} stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3 2" />
              <text x="200" y={cutY - 3} textAnchor="end" className="text-[7px] fill-rose-600 font-mono font-bold">Threshold: {corte}%</text>

              {[30, 50, 70, 85].map((cx, i) => (
                <circle key={`b-${i}`} cx={cx} cy={78} r="3" fill="#0284c7" />
              ))}
              {[140, 160, 180, 195].map((cx, i) => (
                <circle key={`t-${i}`} cx={cx} cy={18} r="3" fill="#4f46e5" />
              ))}
              <line x1="15" y1="84" x2="210" y2="84" stroke="#cbd5e1" strokeWidth="1" />
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>P(Y=1) = 1/(1+e^-z)</span>
            <span className="text-indigo-600 font-semibold">Odds Ratio: 2.4x</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-violet-100/90 text-violet-900 border-b border-violet-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Esteira de Crédito)</span>
            <span className="text-[10px] font-mono font-normal">Aprovação</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-violet-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Taxa de Aprovação:</span>
              <span className="text-emerald-700 font-bold">{Math.round(45 + corte * 0.45)}% da base</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Default Projetado:</span>
              <span className="text-slate-900 font-bold">{(corte * 0.08).toFixed(1)}% carteira</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${corte}%` }}></div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Gini: 0.768</span>
            <span className="text-violet-700 font-semibold">KS: 0.62</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. ANÁLISE DE SOBREVIVÊNCIA (KAPLAN-MEIER)
  if (cardChartType === 'survival-curve' || id === 'analise-sobrevivencia') {
    const desgaste = Number(params['fator_desgaste'] ?? 15);
    const meiaVida = (8.5 * (15 / desgaste)).toFixed(1);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-rose-100/90 text-rose-900 border-b border-rose-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (Kaplan-Meier S(t))</span>
            <span className="text-[10px] font-mono font-normal">Desgaste: {desgaste}%</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-rose-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              <path d={`M 20 20 H 55 V ${20 + desgaste * 1.2} H 95 V ${20 + desgaste * 2.1} H 140 V ${20 + desgaste * 2.8} H 185 V ${20 + desgaste * 3.3} H 210`} fill="none" stroke="#e11d48" strokeWidth="2.5" />
              <line x1="75" y1="32" x2="75" y2="42" stroke="#0284c7" strokeWidth="1.5" />
              <line x1="150" y1="60" x2="150" y2="70" stroke="#0284c7" strokeWidth="1.5" />
              <line x1="20" y1="52" x2="105" y2="52" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="105" y1="52" x2="105" y2="84" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
              <text x="110" y="82" className="text-[8px] fill-slate-700 font-mono font-bold">Meia-Vida</text>
              <line x1="15" y1="84" x2="215" y2="84" stroke="#cbd5e1" strokeWidth="1" />
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Dados Censurados: |</span>
            <span className="text-rose-700 font-semibold">Meia-Vida: {meiaVida}m</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-pink-100/90 text-pink-900 border-b border-pink-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Retenção M12)</span>
            <span className="text-[10px] font-mono font-normal">Assinaturas</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-pink-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Retenção no Ano 1:</span>
              <span className="text-emerald-700 font-bold">{Math.max(20, 100 - desgaste * 3.3).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Ponto Crítico de Evasão:</span>
              <span className="text-rose-700 font-bold">Mês 3 (Pós-Trial)</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${Math.max(20, 100 - desgaste * 3.3)}%` }}></div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>LTV Médio Projetado</span>
            <span className="text-pink-700 font-semibold">R$ {(Number(meiaVida) * 89).toFixed(0)}</span>
          </div>
        </div>
      </div>
    );
  }

  // 6. SUAVIZAÇÃO EXPONENCIAL (HOLT-WINTERS)
  if (cardChartType === 'holt-winters' || id === 'suavizacao-exponencial') {
    const alpha = Number(params['alpha_peso'] ?? 0.35);
    const beta = Number(params['beta_tendencia'] ?? 0.20);
    const prev = (255 + 14.5 * (1 + alpha)).toFixed(1);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-sky-100/90 text-sky-900 border-b border-sky-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (Holt-Winters)</span>
            <span className="text-[10px] font-mono font-normal">α = {alpha} | β = {beta}</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-sky-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              <path d="M 20 78 L 40 68 L 60 72 L 80 58 L 100 62 L 120 46 L 140 50" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
              <path d="M 20 76 Q 80 62 140 48" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <polygon points="140,48 205,20 205,42" fill="#38bdf8" fillOpacity="0.25" />
              <line x1="140" y1="48" x2="205" y2="30" stroke="#0369a1" strokeWidth="2" strokeDasharray="3 2" />
              <line x1="15" y1="84" x2="210" y2="84" stroke="#cbd5e1" strokeWidth="1" />
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Previsão t+1: {prev} un</span>
            <span className="text-sky-700 font-semibold">IC 95% Ativo</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-cyan-100/90 text-cyan-900 border-b border-cyan-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Acurácia de Estoque)</span>
            <span className="text-[10px] font-mono font-normal">MAPE: 3.8%</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-cyan-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Velocidade de Reação:</span>
              <span className="text-sky-800 font-bold">{alpha >= 0.5 ? 'Alta (Reage a picos)' : 'Suave (Filtra ruídos)'}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Inércia de Tendência:</span>
              <span className="text-emerald-700 font-bold">+{beta * 100}% peso recente</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Modelo Aditivo</span>
            <span className="text-cyan-700 font-semibold">RMSE: 4.1 un</span>
          </div>
        </div>
      </div>
    );
  }

  // 7. FUNIL DE CONVERSÃO & DROP-OFF
  if (cardChartType === 'funnel-chart' || id === 'funil-conversao') {
    const friccao = Number(params['friccao_cadastro'] ?? 60);
    const abandono = Number(params['abandono_carrinho'] ?? 50);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-teal-100/90 text-teal-900 border-b border-teal-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (Funil de Vendas)</span>
            <span className="text-[10px] font-mono font-normal">Fricção: {friccao}%</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-teal-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              <polygon points="20,10 200,10 180,24 40,24" fill="#0f766e" />
              <polygon points="42,26 178,26 155,40 65,40" fill="#0d9488" />
              <polygon points="67,42 153,42 135,56 85,56" fill="#14b8a6" />
              <polygon points="87,58 133,58 120,72 100,72" fill="#2dd4bf" />
              <polygon points="102,74 118,74 113,84 107,84" fill="#5eead4" />
              <text x="110" y="19" textAnchor="middle" className="text-[7px] fill-white font-bold">1. Visitas (10k)</text>
              <text x="110" y="35" textAnchor="middle" className="text-[7px] fill-white font-bold">2. Cadastro ({(100-friccao).toFixed(0)}%)</text>
              <text x="110" y="51" textAnchor="middle" className="text-[7px] fill-white font-bold">3. Carrinho</text>
              <text x="110" y="67" textAnchor="middle" className="text-[7px] fill-teal-950 font-bold">Checkout</text>
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Drop Cadastro: {friccao}%</span>
            <span className="text-teal-700 font-semibold">Abandono: {abandono}%</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-emerald-100/90 text-emerald-900 border-b border-emerald-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Receita Perdida)</span>
            <span className="text-[10px] font-mono font-normal">Gargalo</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-emerald-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Maior Vazamento:</span>
              <span className="text-rose-700 font-bold">Checkout ({abandono}% drop)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Ganho Otimizando 20%:</span>
              <span className="text-emerald-700 font-bold">+R$ 145k faturamento</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-teal-500 h-full rounded-full" style={{ width: `${100 - abandono}%` }}></div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Conversão Geral</span>
            <span className="text-emerald-700 font-semibold">4.8% Final</span>
          </div>
        </div>
      </div>
    );
  }

  // 8. DATA QUALITY & COMPLETUDE
  if (cardChartType === 'data-quality-bars' || id === 'auditoria-qualidade-dados') {
    const tol = Number(params['tolerancia_nulos'] ?? 20);
    const est = String(params['estrategia_imputacao'] ?? 'mediana');

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-rose-100/90 text-rose-900 border-b border-rose-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (Completude)</span>
            <span className="text-[10px] font-mono font-normal">Tol: {tol}%</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-rose-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              <text x="45" y="20" textAnchor="end" className="text-[7px] fill-slate-600 font-mono">Nome</text>
              <rect x="50" y="13" width="150" height="9" fill="#10b981" rx="1.5" />

              <text x="45" y="38" textAnchor="end" className="text-[7px] fill-slate-600 font-mono">Email</text>
              <rect x="50" y="31" width="100" height="9" fill={33.3 > tol ? "#f43f5e" : "#f59e0b"} rx="1.5" />

              <text x="45" y="56" textAnchor="end" className="text-[7px] fill-slate-600 font-mono">Telefone</text>
              <rect x="50" y="49" width="50" height="9" fill="#f43f5e" rx="1.5" />

              <text x="45" y="74" textAnchor="end" className="text-[7px] fill-slate-600 font-mono">Renda</text>
              <rect x="50" y="67" width="125" height="9" fill="#10b981" rx="1.5" />

              <line x1={50 + 150 * (1 - tol / 100)} y1="8" x2={50 + 150 * (1 - tol / 100)} y2="82" stroke="#dc2626" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Linha Vermelha: Corte {tol}%</span>
            <span className="text-rose-700 font-semibold">1 Coluna Crítica</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-amber-100/90 text-amber-900 border-b border-amber-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Tratamento)</span>
            <span className="text-[10px] font-mono font-normal">{est.toUpperCase()}</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-amber-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Coluna 'Telefone':</span>
              <span className="text-rose-700 font-bold">Descartar (66% nulos)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Coluna 'Renda':</span>
              <span className="text-emerald-700 font-bold">Imputar por {est}</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '91%' }}></div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Score Geral DQI</span>
            <span className="text-amber-800 font-semibold">91.4% Saúde</span>
          </div>
        </div>
      </div>
    );
  }

  // 9. CORRELAÇÃO HEATMAP
  if (cardChartType === 'correlation-heatmap' || id === 'correlacao-heatmap') {
    const limiar = Number(params['limiar_destaque'] ?? 0.7);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-indigo-100/90 text-indigo-900 border-b border-indigo-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (Matriz 4x4)</span>
            <span className="text-[10px] font-mono font-normal">|r| ≥ {limiar}</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-indigo-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              <rect x="50" y="10" width="30" height="15" fill="#dc2626" rx="1" /><text x="65" y="21" textAnchor="middle" className="text-[7px] fill-white font-mono">1.00</text>
              <rect x="85" y="10" width="30" height="15" fill={0.96 >= limiar ? "#ef4444" : "#fca5a5"} rx="1" /><text x="100" y="21" textAnchor="middle" className="text-[7px] fill-white font-mono">0.96</text>
              <rect x="120" y="10" width="30" height="15" fill={0.74 >= limiar ? "#f87171" : "#fca5a5"} rx="1" /><text x="135" y="21" textAnchor="middle" className="text-[7px] fill-white font-mono">0.74</text>
              <rect x="155" y="10" width="30" height="15" fill="#38bdf8" rx="1" /><text x="170" y="21" textAnchor="middle" className="text-[7px] fill-slate-900 font-mono">-0.42</text>

              <rect x="50" y="28" width="30" height="15" fill={0.96 >= limiar ? "#ef4444" : "#fca5a5"} rx="1" /><text x="65" y="39" textAnchor="middle" className="text-[7px] fill-white font-mono">0.96</text>
              <rect x="85" y="28" width="30" height="15" fill="#dc2626" rx="1" /><text x="100" y="39" textAnchor="middle" className="text-[7px] fill-white font-mono">1.00</text>
              <rect x="120" y="28" width="30" height="15" fill={0.81 >= limiar ? "#f87171" : "#fca5a5"} rx="1" /><text x="135" y="39" textAnchor="middle" className="text-[7px] fill-white font-mono">0.81</text>
              <rect x="155" y="28" width="30" height="15" fill="#60a5fa" rx="1" /><text x="170" y="39" textAnchor="middle" className="text-[7px] fill-slate-900 font-mono">-0.55</text>

              <rect x="50" y="46" width="30" height="15" fill={0.74 >= limiar ? "#f87171" : "#fca5a5"} rx="1" /><text x="65" y="57" textAnchor="middle" className="text-[7px] fill-white font-mono">0.74</text>
              <rect x="85" y="46" width="30" height="15" fill={0.81 >= limiar ? "#f87171" : "#fca5a5"} rx="1" /><text x="100" y="57" textAnchor="middle" className="text-[7px] fill-white font-mono">0.81</text>
              <rect x="120" y="46" width="30" height="15" fill="#dc2626" rx="1" /><text x="135" y="57" textAnchor="middle" className="text-[7px] fill-white font-mono">1.00</text>
              <rect x="155" y="46" width="30" height="15" fill="#cbd5e1" rx="1" /><text x="170" y="57" textAnchor="middle" className="text-[7px] fill-slate-800 font-mono">0.05</text>

              <rect x="50" y="64" width="30" height="15" fill="#38bdf8" rx="1" /><text x="65" y="75" textAnchor="middle" className="text-[7px] fill-slate-900 font-mono">-0.42</text>
              <rect x="85" y="64" width="30" height="15" fill="#60a5fa" rx="1" /><text x="100" y="75" textAnchor="middle" className="text-[7px] fill-slate-900 font-mono">-0.55</text>
              <rect x="120" y="64" width="30" height="15" fill="#cbd5e1" rx="1" /><text x="135" y="75" textAnchor="middle" className="text-[7px] fill-slate-800 font-mono">0.05</text>
              <rect x="155" y="64" width="30" height="15" fill="#dc2626" rx="1" /><text x="170" y="75" textAnchor="middle" className="text-[7px] fill-white font-mono">1.00</text>
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Pearson Paramétrico</span>
            <span className="text-indigo-600 font-semibold">3 Pares Fortes</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-blue-100/90 text-blue-900 border-b border-blue-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Multicolinearidade)</span>
            <span className="text-[10px] font-mono font-normal">Drivers</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-blue-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Mkt Ads &lt;-&gt; Vendas:</span>
              <span className="text-emerald-700 font-bold">r = +0.92 (Prioritário)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Desconto &lt;-&gt; Vendas:</span>
              <span className="text-rose-700 font-bold">r = -0.74 (Trade-off)</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>VIF &lt; 5.0</span>
            <span className="text-blue-700 font-semibold">Sem Colinearidade Severa</span>
          </div>
        </div>
      </div>
    );
  }

  // 10. MARKET BASKET (APRIORI)
  if (cardChartType === 'market-basket' || id === 'analise-cesta-compras') {
    const sup = Number(params['suporte_minimo'] ?? 10);
    const lift = Number(params['lift_minimo'] ?? 2.0);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-emerald-100/90 text-emerald-900 border-b border-emerald-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (Grafo de Associação)</span>
            <span className="text-[10px] font-mono font-normal">Lift &gt; {lift}x</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-emerald-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              <circle cx="55" cy="45" r="20" fill="#047857" />
              <text x="55" y="48" textAnchor="middle" className="text-[8px] fill-white font-bold">Pão</text>

              <circle cx="165" cy="45" r="20" fill="#0284c7" />
              <text x="165" y="48" textAnchor="middle" className="text-[8px] fill-white font-bold">Manteiga</text>

              <circle cx="110" cy="72" r="14" fill="#f59e0b" />
              <text x="110" y="75" textAnchor="middle" className="text-[7px] fill-white font-bold">Café</text>

              <line x1="75" y1="45" x2="145" y2="45" stroke="#059669" strokeWidth="3" />
              <line x1="68" y1="58" x2="98" y2="67" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
              <line x1="152" y1="58" x2="122" y2="67" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
              <text x="110" y="40" textAnchor="middle" className="text-[8px] fill-emerald-800 font-bold font-mono">Conf: 82%</text>
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Suporte Mín: {sup}%</span>
            <span className="text-emerald-700 font-semibold">Lift Top: 5.2x</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-teal-100/90 text-teal-900 border-b border-teal-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Cross-Selling)</span>
            <span className="text-[10px] font-mono font-normal">Ticket Médio</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-teal-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Smartphone -&gt; Película:</span>
              <span className="text-emerald-700 font-bold">Lift: 5.2x (Conf: 88%)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Pão -&gt; Manteiga:</span>
              <span className="text-sky-700 font-bold">Lift: 2.8x (Conf: 75%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-teal-500 h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Ganho Estimado</span>
            <span className="text-teal-700 font-semibold">+14.6% por Pedido</span>
          </div>
        </div>
      </div>
    );
  }

  // 11. MONTE CARLO (RISCO)
  if (cardChartType === 'monte-carlo' || id === 'simulacao-monte-carlo') {
    const vol = Number(params['volatilidade_mercado'] ?? 20);
    const conf = Number(params['confianca_var'] ?? 95);
    const varVal = (38.5 * (vol / 20)).toFixed(1);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-purple-100/90 text-purple-900 border-b border-purple-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (10.000 Cenários)</span>
            <span className="text-[10px] font-mono font-normal">Volatilidade: {vol}%</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-purple-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              <path d="M 20 80 C 65 80, 85 18, 115 18 C 145 18, 165 80, 205 80" fill="none" stroke="#7c3aed" strokeWidth="2.2" />
              <rect x="20" y="55" width="45" height="25" fill="#f43f5e" fillOpacity="0.35" />
              <line x1="65" y1="18" x2="65" y2="80" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="2 2" />
              <text x="63" y="28" textAnchor="end" className="text-[7px] fill-red-600 font-mono font-bold">VaR {conf}%</text>
              <line x1="115" y1="18" x2="115" y2="80" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="15" y1="81" x2="210" y2="81" stroke="#cbd5e1" strokeWidth="1" />
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>VaR {conf}%: -R$ {varVal}k</span>
            <span className="text-purple-700 font-semibold">10k Runs</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-violet-100/90 text-violet-900 border-b border-violet-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Probabilidade de Ruína)</span>
            <span className="text-[10px] font-mono font-normal">Tesouraria</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-violet-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Lucro Médio Esperado:</span>
              <span className="text-slate-900 font-bold">+R$ 34.500</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Risco de Prejuízo:</span>
              <span className="text-rose-700 font-bold">{(vol * 0.28).toFixed(1)}% dos cenários</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${Math.min(100, vol * 2.8)}%` }}></div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Reserva Sugerida</span>
            <span className="text-violet-700 font-semibold">R$ {varVal}k</span>
          </div>
        </div>
      </div>
    );
  }

  // 12. PARETO 80/20 & CLASSIFICAÇÃO ABC
  if (cardChartType === 'pareto-curve' || id === 'analise-pareto') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-amber-100/90 text-amber-900 border-b border-amber-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (Curva 80/20)</span>
            <span className="text-[10px] font-mono font-normal">Lorenz</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-amber-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              {[
                { x: 25, h: 55 }, { x: 55, h: 32 }, { x: 85, h: 20 }, { x: 115, h: 12 }, { x: 145, h: 7 }, { x: 175, h: 4 }
              ].map((b, i) => (
                <rect key={i} x={b.x} y={80 - b.h} width="20" height={b.h} fill="#f59e0b" rx="1.5" />
              ))}
              <path d="M 35 25 Q 75 14 185 10" fill="none" stroke="#dc2626" strokeWidth="2.2" />
              <line x1="20" y1="24" x2="200" y2="24" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 2" />
              <text x="195" y="21" textAnchor="end" className="text-[7px] fill-red-600 font-mono font-bold">Corte 80%</text>
              <line x1="15" y1="81" x2="205" y2="81" stroke="#cbd5e1" strokeWidth="1" />
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Curva Cumulativa</span>
            <span className="text-amber-700 font-semibold">20% Itens = 80% Faturamento</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-orange-100/90 text-orange-900 border-b border-orange-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Classificação ABC)</span>
            <span className="text-[10px] font-mono font-normal">Estoques</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-orange-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Classe A (Críticos):</span>
              <span className="text-emerald-700 font-bold">3 SKUs (79.2% da receita)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Classe C (Cauda Longa):</span>
              <span className="text-slate-500 font-bold">84 SKUs (5.4% receita)</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Foco Operacional</span>
            <span className="text-orange-700 font-semibold">Auditoria Semanal Classe A</span>
          </div>
        </div>
      </div>
    );
  }

  // 13. FEATURE IMPORTANCE (DRIVERS)
  if (cardChartType === 'feature-importance' || id === 'importancia-features') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-indigo-100/90 text-indigo-900 border-b border-indigo-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (Gini Importance)</span>
            <span className="text-[10px] font-mono font-normal">Random Forest</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-indigo-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              <text x="55" y="20" textAnchor="end" className="text-[7px] fill-slate-600 font-mono">tempo_site</text>
              <rect x="60" y="12" width="135" height="10" fill="#4f46e5" rx="1.5" />

              <text x="55" y="38" textAnchor="end" className="text-[7px] fill-slate-600 font-mono">recencia</text>
              <rect x="60" y="30" width="95" height="10" fill="#6366f1" rx="1.5" />

              <text x="55" y="56" textAnchor="end" className="text-[7px] fill-slate-600 font-mono">paginas_vistas</text>
              <rect x="60" y="48" width="60" height="10" fill="#818cf8" rx="1.5" />

              <text x="55" y="74" textAnchor="end" className="text-[7px] fill-slate-600 font-mono">desconto</text>
              <rect x="60" y="66" width="35" height="10" fill="#a5b4fc" rx="1.5" />
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Top Driver: tempo_site (38%)</span>
            <span className="text-indigo-600 font-semibold">100 Árvores</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-violet-100/90 text-violet-900 border-b border-violet-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Impacto de Negócio)</span>
            <span className="text-[10px] font-mono font-normal">Alavancas</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-violet-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Engajamento (2 Drivers):</span>
              <span className="text-emerald-700 font-bold">64.5% da Decisão de Compra</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Sensibilidade a Preço:</span>
              <span className="text-slate-700 font-bold">12.1% (Menor relevância)</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '64%' }}></div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Ação Recomendada</span>
            <span className="text-violet-700 font-semibold">Focar em UX e Retenção</span>
          </div>
        </div>
      </div>
    );
  }

  // 14. DECOMPOSIÇÃO TEMPORAL
  if (cardChartType === 'ts-decomposition' || id === 'decomposicao-temporal') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-blue-100/90 text-blue-900 border-b border-blue-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Em Tempo Real (3 Componentes)</span>
            <span className="text-[10px] font-mono font-normal">STL Aditivo</span>
          </div>
          <div className="p-2 h-28 bg-gradient-to-b from-white to-blue-50/20">
            <svg viewBox="0 0 220 90" className="w-full h-full">
              <path d="M 20 22 Q 110 18 200 12" fill="none" stroke="#0284c7" strokeWidth="2" />
              <text x="205" y="16" className="text-[6px] fill-sky-700 font-mono">Tend</text>

              <path d="M 20 46 Q 35 34 50 46 T 80 46 T 110 46 T 140 46 T 170 46 T 200 46" fill="none" stroke="#10b981" strokeWidth="1.5" />
              <text x="205" y="48" className="text-[6px] fill-emerald-700 font-mono">Sazon</text>

              <path d="M 20 74 L 35 70 L 50 78 L 70 72 L 90 76 L 115 71 L 135 77 L 160 72 L 180 75 L 200 73" fill="none" stroke="#94a3b8" strokeWidth="1" />
              <text x="205" y="75" className="text-[6px] fill-slate-500 font-mono">Resíduo</text>
            </svg>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Y = Tend + Sazon + Res</span>
            <span className="text-blue-700 font-semibold">Ciclo Semanal</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="py-1.5 px-3 bg-sky-100/90 text-sky-900 border-b border-sky-200 text-center font-bold text-xs flex items-center justify-between">
            <span>Atualização Dinâmica (Variância Explicada)</span>
            <span className="text-[10px] font-mono font-normal">Pureza</span>
          </div>
          <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-sky-50/20 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Tendência Estrutural:</span>
              <span className="text-sky-800 font-bold">58.4% da variação</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-600 font-sans">Ruído / Resíduo:</span>
              <span className="text-slate-500 font-bold">3.2% (Excelente ajuste)</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: '96%' }}></div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Sazonalidade Explicada</span>
            <span className="text-emerald-700 font-semibold">38.4% Ciclo</span>
          </div>
        </div>
      </div>
    );
  }

  // 15. DEFAULT FALLBACK
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="py-1.5 px-3 bg-slate-800 text-white text-center font-bold text-xs flex items-center justify-between">
          <span>Processamento Vetorial em Tempo Real</span>
          <span className="text-[10px] font-mono text-cyan-300">Live Pandas</span>
        </div>
        <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-slate-900 to-slate-950 text-cyan-400 font-mono text-xs">
          <div className="text-[11px] text-slate-300">
            &gt; engine.execute('{algorithm.id}')
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold">
            ✓ Parâmetros Ativos: {JSON.stringify(params)}
          </div>
          <div className="text-[10px] text-slate-400">
            Vetorização: NumPy Array · Latência: &lt; 2ms
          </div>
        </div>
        <div className="px-3 py-1 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>{algorithm.title}</span>
          <span className="text-cyan-400 font-semibold">100% Reativo</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="py-1.5 px-3 bg-sky-100/90 text-sky-900 border-b border-sky-200 text-center font-bold text-xs flex items-center justify-between">
          <span>Métricas Dinâmicas</span>
          <span className="text-[10px] font-mono font-normal">Negócio</span>
        </div>
        <div className="p-3 h-28 flex flex-col justify-around bg-gradient-to-b from-white to-sky-50/20 text-xs">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-slate-600 font-sans">Métrica Central:</span>
            <span className="text-sky-800 font-bold">{algorithm.metricsSummary}</span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-slate-600 font-sans">Pilar:</span>
            <span className="text-slate-900 font-bold">{algorithm.pillarName}</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: '85%' }}></div>
          </div>
        </div>
        <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>{algorithm.datasetMini.name}</span>
          <span className="text-emerald-700 font-semibold">Validado</span>
        </div>
      </div>
    </div>
  );
}
