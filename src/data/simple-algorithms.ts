import { EXTENDED_ALGORITHMS_PART1 } from './extended-algorithms-part1';
import { EXTENDED_ALGORITHMS_PART2 } from './extended-algorithms-part2';

export interface VisualParameter {
  id: string;
  label: string;
  type: 'slider' | 'select' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: any;
  unit?: string;
  options?: { label: string; value: any }[];
  description?: string;
}

export interface VisualAlgorithm {
  id: string;
  pillarId: 
    | 'preditiva' 
    | 'descritiva' 
    | 'anomalias' 
    | 'segmentacao' 
    | 'correlacao' 
    | 'distribuicao' 
    | 'comparacao'
    | 'classificacao'
    | 'series_temporais';
  pillarName: string;
  title: string;
  headerColor: string;
  accentColor: string;
  shortDesc: string;
  badge?: string;
  metricsSummary: string;
  
  // Card Visual Preview Type
  cardChartType: 
    | 'trend-line' 
    | 'forecast-bars' 
    | 'scatter-outliers' 
    | 'distribution' 
    | 'rfm-matrix'
    | 'correlation-scatter'
    | 'density-histogram'
    | 'stacked-bars'
    | 'kmeans-clusters'
    | 'cohort-retention'
    | 'ts-decomposition'
    | 'confusion-matrix'
    | 'pareto-curve'
    | 'feature-importance'
    | 'boxplot-tukey'
    | 'ab-test-distribution'
    | 'logistic-curve'
    | 'survival-curve'
    | 'holt-winters'
    | 'funnel-chart'
    | 'data-quality-bars'
    | 'correlation-heatmap'
    | 'market-basket'
    | 'roc-curve'
    | 'monte-carlo';
  
  // Python Code Snippet
  codeSnippet: string;
  
  // Application Article
  article: {
    title: string;
    subtitle: string;
    bodyText: string;
    keyPoints: string[];
    realWorldCase: string;
  };
  
  // Miniature Dataset
  datasetMini: {
    name: string;
    columns: string[];
    rows: Record<string, any>[];
  };

  // Live Chart Parameters
  parameters: VisualParameter[];
}

export const PILLARS = [
  { id: 'todos', name: 'TODAS AS TÉCNICAS (24)', desc: 'Visão unificada das 24 técnicas mais utilizadas pelo mercado analítico.' },
  { id: 'preditiva', name: 'ANÁLISE PREDITIVA', desc: 'Previsões estatísticas, regressão, séries temporais, Holt-Winters e Monte Carlo.' },
  { id: 'correlacao', name: 'CORRELAÇÃO & RELAÇÕES', desc: 'Dispersão, Pearson/Spearman, heatmap multivariado e regras Apriori.' },
  { id: 'distribuicao', name: 'DISTRIBUIÇÃO ESTATÍSTICA', desc: 'Histogramas, Curva KDE, Boxplot de Tukey e Teste A/B de hipóteses.' },
  { id: 'comparacao', name: 'COMPARAÇÃO CATEGÓRICA', desc: 'Tabelas dinâmicas (pivot), barras empilhadas e funil de conversão.' },
  { id: 'segmentacao', name: 'SEGMENTAÇÃO & CRM', desc: 'K-Means clustering, Matriz RFM de clientes e retenção por coorte.' },
  { id: 'classificacao', name: 'MODELAGEM & DIAGNÓSTICO', desc: 'Matrizes de confusão, Curva ROC-AUC, Regressão Logística, Pareto e Feature Drivers.' },
  { id: 'anomalias', name: 'AUDITORIA & ANOMALIAS', desc: 'Detecção Z-Score, análise de sobrevivência e profiling de qualidade de dados.' },
];

export const VISUAL_ALGORITHMS: VisualAlgorithm[] = [
  // ==========================================
  // 1. ANÁLISE DE TENDÊNCIA
  // ==========================================
  {
    id: 'analise-tendencia',
    pillarId: 'preditiva',
    pillarName: 'ANÁLISE PREDITIVA',
    title: 'ANÁLISE DE TENDÊNCIA',
    headerColor: 'bg-blue-100 text-blue-900 border-blue-200',
    accentColor: 'sky',
    shortDesc: 'Identifica padrões de crescimento ou declínio baseados em dados históricos.',
    metricsSummary: 'R² ≈ 0.94',
    cardChartType: 'trend-line',
    codeSnippet: `# Engenharia de Features & Tendência Linear
import pandas as pd
import numpy as np

# 1. Carregar série histórica
df = pd.DataFrame({
    'mes': [1, 2, 3, 4, 5, 6, 7, 8],
    'vendas_k': [52.0, 58.0, 68.0, 88.0, 95.0, 110.0, 128.0, 145.0]
})

# 2. Ajuste por Mínimos Quadrados (OLS)
x = df['mes']
y = df['vendas_k']
slope, intercept = np.polyfit(x, y, deg=1)

# 3. Projeção de Tendência
df['tendencia'] = slope * x + intercept
r_squared = np.corrcoef(x, y)[0, 1] ** 2

print(f"Taxa de Crescimento: +R$ {slope:.2f}k/mês")
print(f"Aderência (R²): {r_squared:.2f}")`,
    article: {
      title: 'Como a Análise de Tendência Antecipa o Mercado',
      subtitle: 'Compreendendo o pulso histórico das operações para evitar surpresas.',
      bodyText: 'A análise de tendência isola o ruído sazonal de curto prazo para revelar o vetor real de crescimento do negócio. Ela responde se a empresa está genuinamente expandindo ou apenas colhendo oscilações esporádicas.',
      keyPoints: [
        'R² > 0.85 indica forte previsibilidade linear sem necessidade de modelos complexos.',
        'A inclinação da reta (slope) quantifica a velocidade marginal de tração mensal.',
        'Ajuda a calibrar estoques e contratações com meses de antecedência.'
      ],
      realWorldCase: 'Um e-commerce de moda usou a inclinação histórica para evitar comprar 30% a mais de estoque no inverno, poupando R$ 420 mil em capital de giro.'
    },
    datasetMini: {
      name: 'Vendas Mensais (R$ Mil)',
      columns: ['mes', 'vendas_k', 'tendencia'],
      rows: [
        { mes: 'Jan (M1)', vendas_k: 52.0, tendencia: 49.5 },
        { mes: 'Fev (M2)', vendas_k: 58.0, tendencia: 62.8 },
        { mes: 'Mar (M3)', vendas_k: 68.0, tendencia: 76.1 },
        { mes: 'Abr (M4)', vendas_k: 88.0, tendencia: 89.4 },
        { mes: 'Mai (M5)', vendas_k: 95.0, tendencia: 102.7 },
        { mes: 'Jun (M6)', vendas_k: 110.0, tendencia: 116.0 },
        { mes: 'Jul (M7)', vendas_k: 128.0, tendencia: 129.3 },
        { mes: 'Ago (M8)', vendas_k: 145.0, tendencia: 142.6 },
      ]
    },
    parameters: [
      { id: 'horizonte', label: 'Horizonte de Projeção', type: 'slider', min: 1, max: 6, step: 1, defaultValue: 3, unit: 'meses', description: 'Número de meses à frente para projetar a tendência' },
      { id: 'sensibilidade', label: 'Taxa de Aceleração (%)', type: 'slider', min: 0, max: 30, step: 5, defaultValue: 10, unit: '%', description: 'Ajuste de incremento percentual projetado' }
    ]
  },

  // ==========================================
  // 2. PREVISÃO DE VENDAS
  // ==========================================
  {
    id: 'previsao-vendas',
    pillarId: 'preditiva',
    pillarName: 'ANÁLISE PREDITIVA',
    title: 'PREVISÃO DE VENDAS',
    headerColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    accentColor: 'emerald',
    shortDesc: 'Projeta volumes futuros de vendas e demanda com base em séries temporais.',
    metricsSummary: '+18.4% Previsto',
    cardChartType: 'forecast-bars',
    codeSnippet: `# Previsão de Demanda com Janela Deslizante
import pandas as pd

# Histórico recente e projeção
df_vendas = pd.DataFrame({
    'mes': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul* (Prev)', 'Ago* (Prev)', 'Set* (Prev)'],
    'tipo': ['Real', 'Real', 'Real', 'Real', 'Real', 'Real', 'Previsao', 'Previsao', 'Previsao'],
    'volume_unidades': [420, 460, 490, 530, 610, 690, 780, 840, 910]
})

# Cálculo da média móvel de 3 períodos
df_vendas['media_movel_3m'] = df_vendas['volume_unidades'].rolling(window=3).mean()

# Taxa composta esperada
print(df_vendas[['mes', 'volume_unidades', 'tipo']])`,
    article: {
      title: 'Como a Previsão de Vendas Revoluciona o Varejo',
      subtitle: 'Da intuição empírica à orquestração algorítmica de suprimentos.',
      bodyText: 'Prever vendas não é adivinhação: é conectar o histórico de pedidos recentes com janelas sazonais para antecipar a demanda dos próximos 3 a 6 meses com margem de segurança.',
      keyPoints: [
        'Separa claramente o volume realizado dos meses de projeção estatística.',
        'Previne rupturas de gôndola nos produtos de maior margem de lucro.',
        'Permite negociações de volume muito mais vantajosas com fornecedores.'
      ],
      realWorldCase: 'Uma rede varejista reduziu em 22% as sobras de estoque perecível sincronizando as compras com a previsão dinâmica de vendas.'
    },
    datasetMini: {
      name: 'Volume de Pedidos (Unidades)',
      columns: ['mes', 'tipo', 'volume_unidades'],
      rows: [
        { mes: 'Jan', tipo: 'Real', volume_unidades: 420 },
        { mes: 'Fev', tipo: 'Real', volume_unidades: 460 },
        { mes: 'Mar', tipo: 'Real', volume_unidades: 490 },
        { mes: 'Abr', tipo: 'Real', volume_unidades: 530 },
        { mes: 'Mai', tipo: 'Real', volume_unidades: 610 },
        { mes: 'Jun', tipo: 'Real', volume_unidades: 690 },
        { mes: 'Jul* (Prev)', tipo: 'Previsão', volume_unidades: 780 },
        { mes: 'Ago* (Prev)', tipo: 'Previsão', volume_unidades: 840 },
      ]
    },
    parameters: [
      { id: 'crescimento', label: 'Meta de Expansão', type: 'slider', min: 5, max: 35, step: 5, defaultValue: 15, unit: '%', description: 'Meta comercial para os próximos trimestres' },
      { id: 'fator_sazonal', label: 'Multiplicador Sazonal', type: 'slider', min: 0.8, max: 1.5, step: 0.1, defaultValue: 1.1, unit: 'x', description: 'Ajuste de pico sazonal' }
    ]
  },

  // ==========================================
  // 3. DETECÇÃO DE ANOMALIAS
  // ==========================================
  {
    id: 'deteccao-anomalias',
    pillarId: 'anomalias',
    pillarName: 'DETECÇÃO DE ANOMALIAS',
    title: 'DETECÇÃO DE ANOMALIAS',
    headerColor: 'bg-rose-100 text-rose-900 border-rose-200',
    accentColor: 'rose',
    shortDesc: 'Sinaliza desvios inesperados ou comportamentos irregulares nos dados.',
    metricsSummary: '4 Desvios Críticos',
    cardChartType: 'scatter-outliers',
    codeSnippet: `# Identificação de Outliers & Transações Atípicas
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'transacao_id': range(1, 11),
    'valor': [120, 115, 140, 1280, 95, 110, 1450, 105, 130, 98]
})

# Cálculo do Z-Score Vetorizado
media = df['valor'].mean()
desvio = df['valor'].std()
df['z_score'] = (df['valor'] - media) / desvio

# Critério de Alerta: |Z| > 2.0
df['is_outlier'] = df['z_score'].abs() > 2.0
anomalias = df[df['is_outlier']]
print(f"Total de Anomalias: {len(anomalias)}")`,
    article: {
      title: 'Auditoria de Dados: Como Detectar Anomalias em Tempo Real',
      subtitle: 'Encontrando fraudes e falhas antes que comprometam o caixa da empresa.',
      bodyText: 'Em qualquer fluxo de transações, 98% dos registros seguem uma distribuição consistente. Os 2% que se desviam da reta esperada representam fraudes, erros humanos de digitação ou falhas de integração.',
      keyPoints: [
        'Z-Scores elevados (> 2.0 ou 3.0) destacam pontos com desvio estatístico extremo.',
        'Visualização gráfica de dispersão torna evidente o que tabelas numéricas escondem.',
        'Reduz o tempo de auditoria de dias para segundos com filtragem vetorizada.'
      ],
      realWorldCase: 'Uma fintech de meios de pagamento bloqueou mais de R$ 1,2 milhão em tentativas de compras fraudulentas operando filtros automáticos de desvio padrão.'
    },
    datasetMini: {
      name: 'Log de Transações Financeiras',
      columns: ['transacao_id', 'valor', 'z_score', 'status'],
      rows: [
        { transacao_id: 1, valor: 120.0, z_score: -0.42, status: '✅ Normal' },
        { transacao_id: 2, valor: 115.0, z_score: -0.43, status: '✅ Normal' },
        { transacao_id: 3, valor: 140.0, z_score: -0.38, status: '✅ Normal' },
        { transacao_id: 4, valor: 1280.0, z_score: 2.14, status: '🚨 Anomalia' },
        { transacao_id: 5, valor: 95.0, z_score: -0.47, status: '✅ Normal' },
        { transacao_id: 6, valor: 110.0, z_score: -0.44, status: '✅ Normal' },
        { transacao_id: 7, valor: 1450.0, z_score: 2.51, status: '🚨 Anomalia' },
        { transacao_id: 8, valor: 105.0, z_score: -0.45, status: '✅ Normal' },
      ]
    },
    parameters: [
      { id: 'limiar_z', label: 'Sensibilidade de Corte (|Z|)', type: 'slider', min: 1.5, max: 3.5, step: 0.1, defaultValue: 2.0, unit: 'σ', description: 'Limiar em unidades de desvio padrão' },
      { id: 'filtro_valor', label: 'Valor Mínimo p/ Alerta', type: 'slider', min: 500, max: 2000, step: 100, defaultValue: 1000, unit: 'R$', description: 'Corte financeiro para validação' }
    ]
  },

  // =========================================================================
  // 4. GRÁFICO DE CORRELAÇÃO (SEABORN REGRESSION)
  // =========================================================================
  {
    id: 'grafico-correlacao',
    pillarId: 'correlacao',
    pillarName: 'CORRELAÇÃO & RELAÇÕES',
    title: 'GRÁFICO DE CORRELAÇÃO',
    headerColor: 'bg-violet-100 text-violet-900 border-violet-200',
    accentColor: 'indigo',
    shortDesc: 'Analisa a força e direção da relação entre duas variáveis contínuas com reta de regressão.',
    metricsSummary: 'Pearson r = 0.88',
    cardChartType: 'correlation-scatter',
    codeSnippet: `# Correlação Linear & Scatter Plot com Seaborn/Pandas
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

# 1. Dataset de Marketing & Geração de Leads
df = pd.DataFrame({
    'investimento_ads_k': [5.0, 8.5, 12.0, 15.2, 18.0, 22.5, 27.0, 31.5, 36.0, 42.0],
    'leads_gerados': [45, 78, 110, 125, 160, 195, 230, 265, 310, 360],
    'canal': ['Meta Ads', 'Google Ads', 'Meta Ads', 'LinkedIn', 'Google Ads', 'Google Ads', 'Meta Ads', 'LinkedIn', 'Google Ads', 'Meta Ads']
})

# 2. Coeficiente de Correlação de Pearson (e Spearman para robustez)
r_pearson = df['investimento_ads_k'].corr(df['leads_gerados'], method='pearson')
r_spearman = df['investimento_ads_k'].corr(df['leads_gerados'], method='spearman')

# 3. Visualização com Linha de Tendência OLS e Intervalo de Confiança 95%
plt.figure(figsize=(8, 5))
sns.regplot(
    data=df,
    x='investimento_ads_k',
    y='leads_gerados',
    scatter_kws={'alpha': 0.7, 'color': '#6366f1', 's': 70},
    line_kws={'color': '#4338ca', 'linewidth': 2}
)
plt.title(f"Correlação de Pearson: r = {r_pearson:.2f} (Forte Positiva)")
plt.xlabel("Investimento em Ads (R$ Mil)")
plt.ylabel("Novos Leads Gerados")
plt.grid(True, linestyle='--', alpha=0.5)

print(f"Coeficiente Pearson: {r_pearson:.3f}")
print(f"Coeficiente Spearman (Postos): {r_spearman:.3f}")`,
    article: {
      title: 'Decifrando Relações: O Gráfico de Correlação nos Negócios',
      subtitle: 'Como validar hipóteses de causa e efeito antes de alocar capital.',
      bodyText: 'O Gráfico de Dispersão combinado com a linha de regressão permite inspecionar se duas métricas caminham juntas de forma proporcional. É o passo fundamental para validar o Retorno Sobre Investimento (ROI) e evitar correlações espúrias.',
      keyPoints: [
        'r próximo de +1 indica correlação forte positiva (ao subir X, Y sobe de forma quase linear).',
        'r próximo de 0 indica ausência de relação linear entre as variáveis.',
        'A inspeção visual com regplot revela se existem agrupamentos (clusters) ou saturação (curvatura da reta).'
      ],
      realWorldCase: 'Uma empresa B2B descobriu que o número de reuniões comerciais tinha correlação de r = 0.91 com o faturamento, enquanto o número de seguidores em redes sociais tinha r = 0.08.'
    },
    datasetMini: {
      name: 'Investimento em Ads vs Leads',
      columns: ['investimento_ads_k', 'leads_gerados', 'canal', 'cac_estimado'],
      rows: [
        { investimento_ads_k: 5.0, leads_gerados: 45, canal: 'Meta Ads', cac_estimado: 'R$ 111' },
        { investimento_ads_k: 8.5, leads_gerados: 78, canal: 'Google Ads', cac_estimado: 'R$ 108' },
        { investimento_ads_k: 12.0, leads_gerados: 110, canal: 'Meta Ads', cac_estimado: 'R$ 109' },
        { investimento_ads_k: 15.2, leads_gerados: 125, canal: 'LinkedIn', cac_estimado: 'R$ 121' },
        { investimento_ads_k: 22.5, leads_gerados: 195, canal: 'Google Ads', cac_estimado: 'R$ 115' },
        { investimento_ads_k: 31.5, leads_gerados: 265, canal: 'LinkedIn', cac_estimado: 'R$ 118' },
        { investimento_ads_k: 42.0, leads_gerados: 360, canal: 'Meta Ads', cac_estimado: 'R$ 116' },
      ]
    },
    parameters: [
      { 
        id: 'metodo_corr', 
        label: 'Método de Coeficiente', 
        type: 'select', 
        defaultValue: 'pearson', 
        options: [
          { label: 'Pearson (Relação Linear Contínua)', value: 'pearson' },
          { label: 'Spearman (Monotônica / Não-Linear)', value: 'spearman' },
          { label: 'Kendall (Amostras Pequenas)', value: 'kendall' }
        ],
        description: 'Pearson avalia proporcionalidade exata; Spearman avalia ordenação de postos.'
      },
      { 
        id: 'dispersao_ruido', 
        label: 'Grau de Dispersão / Ruído (R²)', 
        type: 'slider', 
        min: 10, 
        max: 95, 
        step: 5, 
        defaultValue: 85, 
        unit: '%',
        description: 'Simula a variabilidade e consistência dos pontos em torno da reta.' 
      }
    ]
  },

  // =========================================================================
  // 5. DISTRIBUIÇÃO ESTATÍSTICA (KDE)
  // =========================================================================
  {
    id: 'distribuicao-kde',
    pillarId: 'distribuicao',
    pillarName: 'DISTRIBUIÇÃO ESTATÍSTICA',
    title: 'DISTRIBUIÇÃO ESTATÍSTICA',
    headerColor: 'bg-amber-100 text-amber-900 border-amber-200',
    accentColor: 'amber',
    shortDesc: 'Mapeia a frequência de valores com histograma e curva suave de densidade (KDE).',
    metricsSummary: 'Assimetria = +0.65',
    cardChartType: 'density-histogram',
    codeSnippet: `# Histograma & Estimação por Densidade de Kernel (KDE)
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

# 1. Carregar tempos de atendimento (SLA em minutos)
np.random.seed(42)
df = pd.DataFrame({
    'tempo_atendimento_min': np.random.gamma(shape=3.0, scale=4.0, size=150)
})

# 2. Diagnóstico de Assimetria (Skewness) e Curtose
assimetria = df['tempo_atendimento_min'].skew()
curtose = df['tempo_atendimento_min'].kurt()

# 3. Plotagem Combinada: Histograma Normalizado + Curva KDE
plt.figure(figsize=(8, 5))
sns.histplot(
    data=df['tempo_atendimento_min'],
    kde=True,
    stat='density',
    bins=15,
    color='#d97706',
    edgecolor='white',
    line_kws={'linewidth': 2.5, 'color': '#b45309'}
)

plt.axvline(df['tempo_atendimento_min'].mean(), color='red', linestyle='--', label=f"Média: {df['tempo_atendimento_min'].mean():.1f}m")
plt.axvline(df['tempo_atendimento_min'].median(), color='blue', linestyle='-', label=f"Mediana: {df['tempo_atendimento_min'].median():.1f}m")
plt.title(f"Distribuição Assimétrica Positiva (Skew: {assimetria:.2f})")
plt.legend()

print(f"Assimetria (Skewness): {assimetria:.3f} (> 0 indica cauda à direita)")
print(f"Curtose: {curtose:.3f}")`,
    article: {
      title: 'A Curva de Densidade: Além das Médias Enganosas',
      subtitle: 'Compreendendo assimetria e caudas longas para otimizar SLAs e processos.',
      bodyText: 'Enquanto o histograma agrupa dados em barras discretas dependentes do tamanho das caixas (bins), a curva KDE (Kernel Density Estimation) gera uma estimativa contínua e elegante da função de probabilidade subjacente.',
      keyPoints: [
        'Revela bimodalidade: quando existem dois picos distintos no mesmo processo operacional.',
        'Assimetria positiva (Skew > 0): a maioria dos eventos é rápida, mas poucos casos complexos geram cauda longa de atraso.',
        'Permite identificar se a distribuição é verdadeiramente Gaussiana (Normal) antes de aplicar testes paramétricos.'
      ],
      realWorldCase: 'Uma central de atendimento descobriu que a média de resolução de 12 minutos escondia dois perfis: 80% das dúvidas resolvidas em 3 min e 20% com erros de sistema levando 48 min.'
    },
    datasetMini: {
      name: 'Amostra de Chamados de Suporte',
      columns: ['chamado_id', 'tempo_minutos', 'faixa_sla', 'status'],
      rows: [
        { chamado_id: '#8901', tempo_minutos: 4.2, faixa_sla: '0-5 min', status: '🟢 Rápido' },
        { chamado_id: '#8902', tempo_minutos: 6.8, faixa_sla: '5-10 min', status: '🟢 Dentro do SLA' },
        { chamado_id: '#8903', tempo_minutos: 8.5, faixa_sla: '5-10 min', status: '🟢 Dentro do SLA' },
        { chamado_id: '#8904', tempo_minutos: 11.2, faixa_sla: '10-15 min', status: '🟡 Atenção' },
        { chamado_id: '#8905', tempo_minutos: 28.4, faixa_sla: '> 25 min', status: '🔴 Cauda Longa' },
        { chamado_id: '#8906', tempo_minutos: 5.1, faixa_sla: '5-10 min', status: '🟢 Dentro do SLA' },
        { chamado_id: '#8907', tempo_minutos: 34.0, faixa_sla: '> 25 min', status: '🔴 Cauda Longa' },
      ]
    },
    parameters: [
      { 
        id: 'largura_banda_kde', 
        label: 'Suavização KDE (Bandwidth)', 
        type: 'slider', 
        min: 0.2, 
        max: 2.0, 
        step: 0.1, 
        defaultValue: 0.8, 
        unit: 'bw',
        description: 'Controla a sensibilidade da curva: valores menores revelam múltiplos picos; maiores suavizam.' 
      },
      { 
        id: 'numero_bins', 
        label: 'Número de Intervalos (Bins)', 
        type: 'slider', 
        min: 5, 
        max: 30, 
        step: 5, 
        defaultValue: 15, 
        unit: 'barras',
        description: 'Número de divisões nas barras do histograma de frequência.' 
      }
    ]
  },

  // =========================================================================
  // 6. COMPARAÇÃO CATEGÓRICA (BARRAS EMPILHADAS)
  // =========================================================================
  {
    id: 'barras-empilhadas',
    pillarId: 'comparacao',
    pillarName: 'COMPARAÇÃO CATEGÓRICA',
    title: 'COMPARAÇÃO CATEGÓRICA',
    headerColor: 'bg-teal-100 text-teal-900 border-teal-200',
    accentColor: 'emerald',
    shortDesc: 'Cruza categorias e subcategorias em barras empilhadas para comparar proporções e totais.',
    metricsSummary: 'Pivot 4 Regiões x 3 Categorias',
    cardChartType: 'stacked-bars',
    codeSnippet: `# Tabela Dinâmica & Gráfico de Barras Empilhadas
import pandas as pd
import matplotlib.pyplot as plt

# 1. Dataset Transacional com Múltiplas Dimensões
df_vendas = pd.DataFrame({
    'regiao': ['Sudeste', 'Sudeste', 'Sul', 'Sul', 'Nordeste', 'Nordeste', 'Centro-Oeste', 'Centro-Oeste'],
    'departamento': ['Hardware', 'Software', 'Hardware', 'Software', 'Hardware', 'Software', 'Hardware', 'Software'],
    'receita_mil': [180.0, 95.0, 110.0, 70.0, 85.0, 60.0, 75.0, 45.0]
})

# 2. Criação da Tabela Dinâmica (Pivot Table)
pivot_df = pd.pivot_table(
    data=df_vendas,
    values='receita_mil',
    index='regiao',
    columns='departamento',
    aggfunc='sum',
    fill_value=0
)

# 3. Opcional: Normalização Percentual para Comparação Relativa 100%
pivot_100 = pivot_df.div(pivot_df.sum(axis=1), axis=0) * 100

# 4. Plotagem com Pandas Nativo (Stacked Bar)
ax = pivot_df.plot(
    kind='bar',
    stacked=True,
    figsize=(8, 5),
    color=['#0d9488', '#0284c7']
)
plt.title("Receita Total por Região Dividida por Departamento")
plt.ylabel("Receita (R$ Mil)")
plt.xticks(rotation=0)
plt.legend(title="Departamento")

print("Tabela Dinâmica (Valores Absolutos):\n", pivot_df)
print("\nTabela Dinâmica (Percentual 100%):\n", pivot_100.round(1))`,
    article: {
      title: 'Barras Empilhadas: O Poder das Tabelas Dinâmicas Visuais',
      subtitle: 'Como comparar simultaneamente o tamanho total e a composição interna de grupos.',
      bodyText: 'Gráficos de barras empilhadas (Stacked Bar Charts) resolvem um desafio comum: comparar o desempenho geral de filiais ou regiões enquanto revelam a contribuição exata de cada produto para aquele total.',
      keyPoints: [
        'Modo Absoluto: mostra quem fatura mais no total e a fatia de cada divisão.',
        'Modo 100% (Relativo): revela a participação de mercado (% share) independente do volume bruto.',
        'O uso do pd.pivot_table vetorizado no Pandas elimina a necessidade de múltiplos loops groupby manuais.'
      ],
      realWorldCase: 'Uma rede de farmácias percebeu que embora a filial Sudeste vendesse o dobro da filial Sul, o Sul tinha uma proporção 40% maior de vendas em dermocosméticos de alta margem de lucro.'
    },
    datasetMini: {
      name: 'Matriz Regional de Produtos',
      columns: ['regiao', 'hardware_k', 'software_k', 'total_k', 'share_software'],
      rows: [
        { regiao: 'Sudeste', hardware_k: 180.0, software_k: 95.0, total_k: 275.0, share_software: '34.5%' },
        { regiao: 'Sul', hardware_k: 110.0, software_k: 70.0, total_k: 180.0, share_software: '38.8%' },
        { regiao: 'Nordeste', hardware_k: 85.0, software_k: 60.0, total_k: 145.0, share_software: '41.3%' },
        { regiao: 'Centro-Oeste', hardware_k: 75.0, software_k: 45.0, total_k: 120.0, share_software: '37.5%' },
      ]
    },
    parameters: [
      { 
        id: 'modo_empilhamento', 
        label: 'Modo de Empilhamento', 
        type: 'select', 
        defaultValue: 'absoluto', 
        options: [
          { label: 'Valores Absolutos (R$ Total)', value: 'absoluto' },
          { label: 'Normalizado 100% (Proporção Relativa)', value: 'percentual' }
        ],
        description: 'Alterna entre faturamento bruto e proporção relativa percentual.'
      },
      { 
        id: 'destaque_subcategoria', 
        label: 'Destaque de Segmento', 
        type: 'select', 
        defaultValue: 'todos', 
        options: [
          { label: 'Ambos os Segmentos (Hardware + Software)', value: 'todos' },
          { label: 'Foco em Hardware', value: 'hardware' },
          { label: 'Foco em Software', value: 'software' }
        ],
        description: 'Isola ou contrasta departamentos específicos na composição.'
      }
    ]
  },

  // =========================================================================
  // 7. NOVO PILAR 4: CLUSTERIZAÇÃO K-MEANS (SEGMENTAÇÃO MULTIVARIADA)
  // =========================================================================
  {
    id: 'kmeans-clusters',
    pillarId: 'segmentacao',
    pillarName: 'SEGMENTAÇÃO & COORTE',
    title: 'CLUSTERIZAÇÃO K-MEANS',
    headerColor: 'bg-purple-100 text-purple-900 border-purple-200',
    accentColor: 'indigo',
    shortDesc: 'Agrupa clientes automaticamente por semelhança geométrica e calcula centróides de perfil.',
    metricsSummary: 'K = 3 Clusters',
    cardChartType: 'kmeans-clusters',
    codeSnippet: `# Segmentação Não-Supervisionada com Scikit-Learn e Pandas
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# 1. Base com Frequência de Uso e Ticket Médio
df = pd.DataFrame({
    'cliente': ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
    'frequencia_login': [28, 25, 30, 8, 6, 7, 15, 18, 14],
    'gasto_mensal': [450, 480, 510, 80, 95, 70, 220, 260, 240]
})

# 2. Padronização (Essencial para K-Means baseado em Distância Euclidiana)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df[['frequencia_login', 'gasto_mensal']])

# 3. Ajuste do Modelo K-Means
K = 3  # Número de personas a identificar
kmeans = KMeans(n_clusters=K, random_state=42, n_init=10)
df['cluster'] = kmeans.fit_predict(X_scaled)

# 4. Análise dos Centróides (Perfil Típico de Cada Grupo)
centroides = df.groupby('cluster')[['frequencia_login', 'gasto_mensal']].mean()
print("Perfis dos Centróides:\n", centroides)`,
    article: {
      title: 'K-Means: Descobrindo Personas sem Rótulos Prévios',
      subtitle: 'Como a inteligência algorítmica encontra padrões ocultos na sua base de clientes.',
      bodyText: 'O K-Means minimiza a distância euclidiana de cada ponto até o centróide do seu grupo. Em marketing e produtos digitais, isso substitui palpites subjetivos sobre personas por agrupamentos matematicamente homogêneos.',
      keyPoints: [
        'A padronização das features (StandardScaler) é obrigatória para variáveis em escalas diferentes.',
        'O método do cotovelo (Elbow Method) e Silhouette Score ajudam a escolher o valor ótimo de K.',
        'Permite criar jornadas de comunicação e produtos sob medida para cada cluster.'
      ],
      realWorldCase: 'Um banco digital agrupou 2 milhões de correntistas em 4 clusters, identificando um segmento silencioso de alta renda que gerou +R$ 18M em novos investimentos.'
    },
    datasetMini: {
      name: 'Clientes & Comportamento',
      columns: ['cliente', 'frequencia_login', 'gasto_mensal', 'cluster_atribuido'],
      rows: [
        { cliente: 'C1 (VIP)', frequencia_login: 28, gasto_mensal: 'R$ 450', cluster_atribuido: 'Cluster 0 (Power Users)' },
        { cliente: 'C2 (VIP)', frequencia_login: 25, gasto_mensal: 'R$ 480', cluster_atribuido: 'Cluster 0 (Power Users)' },
        { cliente: 'C4 (Inativo)', frequencia_login: 8, gasto_mensal: 'R$ 80', cluster_atribuido: 'Cluster 1 (Baixo Engajamento)' },
        { cliente: 'C5 (Inativo)', frequencia_login: 6, gasto_mensal: 'R$ 95', cluster_atribuido: 'Cluster 1 (Baixo Engajamento)' },
        { cliente: 'C7 (Médio)', frequencia_login: 15, gasto_mensal: 'R$ 220', cluster_atribuido: 'Cluster 2 (Intermediário)' },
        { cliente: 'C8 (Médio)', frequencia_login: 18, gasto_mensal: 'R$ 260', cluster_atribuido: 'Cluster 2 (Intermediário)' },
      ]
    },
    parameters: [
      { id: 'num_k', label: 'Número de Clusters (K)', type: 'slider', min: 2, max: 4, step: 1, defaultValue: 3, unit: 'grupos', description: 'Define quantas personas o algoritmo particionará' },
      { id: 'dispersao_cluster', label: 'Raio de Coesão', type: 'slider', min: 10, max: 40, step: 5, defaultValue: 20, unit: 'px', description: 'Simula a proximidade interna dos membros aos centróides' }
    ]
  },

  // =========================================================================
  // 8. NOVO PILAR 5: ANÁLISE DE COORTE (RETENÇÃO E CHURN AO LONGO DO TEMPO)
  // =========================================================================
  {
    id: 'analise-coorte',
    pillarId: 'segmentacao',
    pillarName: 'SEGMENTAÇÃO & COORTE',
    title: 'ANÁLISE DE COORTE',
    headerColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    accentColor: 'emerald',
    shortDesc: 'Acompanha a retenção e o decaimento de usuários agrupados pelo mês de entrada (M0 a M6).',
    metricsSummary: 'Retenção M3 = 48%',
    cardChartType: 'cohort-retention',
    codeSnippet: `# Matriz de Retenção de Coorte com Pandas
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# 1. Carregar transações com data do pedido e data do primeiro cadastro
df = pd.DataFrame({
    'usuario_id': [1, 1, 2, 2, 2, 3, 4, 4],
    'safra_cadastro': ['2026-01', '2026-01', '2026-01', '2026-01', '2026-01', '2026-02', '2026-02', '2026-02'],
    'mes_atividade': [0, 1, 0, 1, 2, 0, 0, 1]
})

# 2. Criar a Tabela Dinâmica de Contagem
cohort_counts = df.pivot_table(
    index='safra_cadastro',
    columns='mes_atividade',
    values='usuario_id',
    aggfunc='nunique'
)

# 3. Normalizar pela safra base (Mês 0 = 100%)
cohort_retention = cohort_counts.divide(cohort_counts.iloc[:, 0], axis=0) * 100

# 4. Heatmap Visual de Coorte
plt.figure(figsize=(8, 4))
sns.heatmap(cohort_retention, annot=True, fmt='.0f', cmap='Greens', vmin=0, vmax=100)
plt.title("Taxa de Retenção por Safra (%)")
print(cohort_retention.round(1))`,
    article: {
      title: 'Análise de Coorte: O Termômetro Definitivo de Product-Market Fit',
      subtitle: 'Entendendo se o seu produto retém clientes ou é um balde furado.',
      bodyText: 'Em empresas de assinatura (SaaS) ou e-commerce com recompra, a análise de coorte separa clientes pela data de aquisição. Isso impede que o fluxo de novos usuários mascarar o churn silencioso dos clientes antigos.',
      keyPoints: [
        'Curva plana de retenção: indica que os clientes restantes nunca mais cancelam (Product-Market Fit sólido).',
        'Compara safras: permite testar se melhorias recentes no onboarding aumentaram a retenção do Mês 1.',
        'Base direta para o cálculo do LTV (Lifetime Value) real.'
      ],
      realWorldCase: 'Uma plataforma EdTech identificou que alunos que completavam o primeiro projeto na primeira semana tinham retenção de 74% no Mês 3 contra apenas 18% dos demais.'
    },
    datasetMini: {
      name: 'Matriz de Retenção de Safras',
      columns: ['safra', 'usuarios_base', 'mes_0', 'mes_1', 'mes_2', 'mes_3'],
      rows: [
        { safra: 'Jan/2026', usuarios_base: 1200, mes_0: '100%', mes_1: '68%', mes_2: '54%', mes_3: '48%' },
        { safra: 'Fev/2026', usuarios_base: 1450, mes_0: '100%', mes_1: '72%', mes_2: '58%', mes_3: '52%' },
        { safra: 'Mar/2026', usuarios_base: 1600, mes_0: '100%', mes_1: '75%', mes_2: '62%', mes_3: '-' },
        { safra: 'Abr/2026', usuarios_base: 1800, mes_0: '100%', mes_1: '78%', mes_2: '-', mes_3: '-' },
      ]
    },
    parameters: [
      { id: 'taxa_churn_mensal', label: 'Taxa de Churn Base', type: 'slider', min: 5, max: 25, step: 2, defaultValue: 12, unit: '%/mês', description: 'Taxa média de evasão mensal após o primeiro mês' },
      { id: 'impacto_onboarding', label: 'Eficácia do Onboarding', type: 'slider', min: 50, max: 90, step: 5, defaultValue: 70, unit: '% M1', description: 'Percentual de retenção direta no primeiro mês' }
    ]
  },

  // =========================================================================
  // 9. NOVO PILAR 6: DECOMPOSIÇÃO DE SÉRIES TEMPORAIS
  // =========================================================================
  {
    id: 'decomposicao-temporal',
    pillarId: 'preditiva',
    pillarName: 'ANÁLISE PREDITIVA',
    title: 'DECOMPOSIÇÃO TEMPORAL',
    headerColor: 'bg-sky-100 text-sky-900 border-sky-200',
    accentColor: 'sky',
    shortDesc: 'Separa uma série temporal em Tendência secular, Sazonalidade periódica e Resíduo.',
    metricsSummary: 'Série = T + S + R',
    cardChartType: 'ts-decomposition',
    codeSnippet: `# Decomposição Clássica com Statsmodels e Pandas
import pandas as pd
import numpy as np
from statsmodels.tsa.seasonal import seasonal_decompose
import matplotlib.pyplot as plt

# 1. Série simulada com tendência positiva e padrão cíclico
np.random.seed(42)
dias = pd.date_range(start='2026-01-01', periods=60, freq='D')
tendencia = np.linspace(100, 250, 60)
sazonalidade = 25 * np.sin(np.linspace(0, 8 * np.pi, 60))
ruido = np.random.normal(0, 5, 60)
serie = pd.Series(tendencia + sazonalidade + ruido, index=dias)

# 2. Decomposição Aditiva: Y = Tendência + Sazonalidade + Resíduo
decomposicao = seasonal_decompose(serie, model='additive', period=7)

# 3. Plotagem das 4 camadas
fig = decomposicao.plot()
fig.set_size_inches(8, 6)
plt.tight_layout()
print("Decomposição Concluída com Período de 7 dias (Semanal)")`,
    article: {
      title: 'Decomposição Temporal: Enxergando Através do Ruído',
      subtitle: 'Como desmembrar qualquer métrica nos seus componentes fundamentais.',
      bodyText: 'Uma queda nas vendas de domingo significa que a empresa está perdendo clientes ou é apenas o efeito natural de fechamento no fim de semana? A decomposição temporal remove o efeito cíclico para responder com rigor.',
      keyPoints: [
        'Componente Tendência (Trend): o vetor contínuo de longo prazo.',
        'Componente Sazonal (Seasonal): os picos e vales repetitivos que ocorrem no mesmo dia ou mês.',
        'Componente Residual (Resid): o que sobra — útil para detectar eventos anômalos pontuais.'
      ],
      realWorldCase: 'Uma operadora de logística identificou que picos de frete nas terças-feiras eram 100% sazonais e evitou contratar frotas adicionais permanentes desnecessárias.'
    },
    datasetMini: {
      name: 'Decomposição de Tráfego Web',
      columns: ['data', 'serie_bruta', 'tendencia', 'sazonal', 'residuo'],
      rows: [
        { data: 'Seg', serie_bruta: 1420, tendencia: 1200, sazonal: +210, residuo: +10 },
        { data: 'Ter', serie_bruta: 1530, tendencia: 1210, sazonal: +310, residuo: +10 },
        { data: 'Qua', serie_bruta: 1490, tendencia: 1220, sazonal: +260, residuo: +10 },
        { data: 'Qui', serie_bruta: 1390, tendencia: 1230, sazonal: +150, residuo: +10 },
        { data: 'Sex', serie_bruta: 1280, tendencia: 1240, sazonal: +30, residuo: +10 },
        { data: 'Sab', serie_bruta: 890, tendencia: 1250, sazonal: -370, residuo: +10 },
        { data: 'Dom', serie_bruta: 820, tendencia: 1260, sazonal: -450, residuo: +10 },
      ]
    },
    parameters: [
      { id: 'amplitude_sazonal', label: 'Força da Sazonalidade', type: 'slider', min: 10, max: 50, step: 5, defaultValue: 25, unit: 'pts', description: 'Intensidade da variação periódica semanal' },
      { id: 'inclinacao_tendencia', label: 'Inclinação da Tendência', type: 'slider', min: 1, max: 5, step: 1, defaultValue: 2, unit: 'x', description: 'Taxa de crescimento da linha de base' }
    ]
  },

  // =========================================================================
  // 10. NOVO PILAR 7: MATRIZ DE CONFUSÃO & MÉTRICAS DE CLASSIFICAÇÃO
  // =========================================================================
  {
    id: 'matriz-confusao',
    pillarId: 'classificacao',
    pillarName: 'MODELAGEM & DIAGNÓSTICO',
    title: 'MATRIZ DE CONFUSÃO & MÉTRICAS',
    headerColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    accentColor: 'indigo',
    shortDesc: 'Avalia modelos de classificação supervisionada cruzando Verdadeiros/Falsos Positivos e Negativos.',
    metricsSummary: 'Acurácia = 92% | F1 = 0.89',
    cardChartType: 'confusion-matrix',
    codeSnippet: `# Avaliação de Modelo de Classificação com Scikit-Learn
import pandas as pd
from sklearn.metrics import confusion_matrix, classification_report

# 1. Valores Reais vs Predições do Modelo (ex: Previsão de Churn)
y_real = [1, 1, 1, 1, 0, 0, 0, 0, 0, 1]
y_pred = [1, 1, 1, 0, 0, 0, 0, 1, 0, 1]

# 2. Matriz de Confusão 2x2
# [ [Verdadeiro Negativo, Falso Positivo],
#   [Falso Negativo,       Verdadeiro Positivo] ]
cm = confusion_matrix(y_real, y_pred)
df_cm = pd.DataFrame(
    cm, 
    columns=['Previsto: Não Churn', 'Previsto: Churn'],
    index=['Real: Não Churn', 'Real: Churn']
)

# 3. Relatório com Precisão, Recall e F1-Score
print("Matriz de Confusão:\n", df_cm)
print("\nMétricas Detalhadas:\n", classification_report(y_real, y_pred, target_names=['Fiel', 'Churn']))`,
    article: {
      title: 'Além da Acurácia: O Dilema de Precisão vs. Recall',
      subtitle: 'Por que errar um falso negativo pode custar 10x mais caro que um falso positivo.',
      bodyText: 'Em problemas desbalanceados (como fraudes ou diagnósticos médicos), um modelo que simplesmente diz que ninguém vai cancelar tem 95% de acurácia, mas utilidade zero. A matriz de confusão disseca o tipo exato de erro que o algoritmo comete.',
      keyPoints: [
        'Precisão: Quando o modelo diz que é fraude, quão certo ele está? (Evita bloquear clientes bons).',
        'Recall (Sensibilidade): De todas as fraudes reais que existiram, quantas o modelo capturou? (Evita prejuízo).',
        'F1-Score: A média harmônica que equilibra precisão e sensibilidade.',
        'Threshold Tuning: Ajustar a régua de probabilidade (ex: de 0.5 para 0.3) prioriza recall ou precisão.'
      ],
      realWorldCase: 'Um banco reduziu as perdas por inadimplência em 35% ao calibrar o threshold de corte para maximizar o recall nos contratos de maior valor.'
    },
    datasetMini: {
      name: 'Desempenho de Classificação',
      columns: ['metrica', 'formula', 'valor_obtido', 'impacto_negocio'],
      rows: [
        { metrica: 'Acurácia Global', formula: '(VP + VN) / Total', valor_obtido: '92.0%', impacto_negocio: 'Visão geral de acertos' },
        { metrica: 'Precisão (Precision)', formula: 'VP / (VP + FP)', valor_obtido: '88.5%', impacto_negocio: 'Evita falsos alarmes' },
        { metrica: 'Recall (Sensibilidade)', formula: 'VP / (VP + FN)', valor_obtido: '89.2%', impacto_negocio: 'Evita perder clientes/fraudes' },
        { metrica: 'F1-Score', formula: '2 * (P * R) / (P + R)', valor_obtido: '0.89', impacto_negocio: 'Equilíbrio consolidado' },
      ]
    },
    parameters: [
      { id: 'threshold_corte', label: 'Limiar de Probabilidade (Threshold)', type: 'slider', min: 0.2, max: 0.8, step: 0.05, defaultValue: 0.5, unit: '', description: 'Probabilidade mínima para classificar como Positivo' },
      { id: 'peso_custo_fn', label: 'Penalidade de Falso Negativo', type: 'select', defaultValue: 'alto', options: [{ label: 'Alto Custo (Priorizar Recall)', value: 'alto' }, { label: 'Equilibrado (F1 Balanceado)', value: 'medio' }, { label: 'Baixo Custo (Priorizar Precisão)', value: 'baixo' }], description: 'Cenário de negócio para calibração' }
    ]
  },

  // =========================================================================
  // 11. NOVO PILAR 8: ANÁLISE DE PARETO (CURVA 80/20 & CLASSIFICAÇÃO ABC)
  // =========================================================================
  {
    id: 'curva-pareto',
    pillarId: 'classificacao',
    pillarName: 'MODELAGEM & DIAGNÓSTICO',
    title: 'ANÁLISE DE PARETO (CURVA 80/20)',
    headerColor: 'bg-amber-100 text-amber-900 border-amber-200',
    accentColor: 'amber',
    shortDesc: 'Identifica os 20% de causas/produtos que respondem por 80% do faturamento ou dos problemas.',
    metricsSummary: 'Curva ABC de Estoque',
    cardChartType: 'pareto-curve',
    codeSnippet: `# Curva de Pareto & Classificação ABC com Pandas
import pandas as pd

# 1. Carregar faturamento por SKU de Produto
df = pd.DataFrame({
    'produto': [f"Item {chr(65+i)}" for i in range(8)],
    'receita': [85000, 62000, 28000, 15000, 9500, 4200, 2100, 800]
}).sort_values(by='receita', ascending=False)

# 2. Cálculo do Percentual Acumulado
total_receita = df['receita'].sum()
df['pct_individual'] = (df['receita'] / total_receita) * 100
df['pct_acumulado'] = df['pct_individual'].cumsum()

# 3. Classificação ABC Clássica (A: até 80%, B: 80-95%, C: 95-100%)
def categorizar_abc(row):
    if row['pct_acumulado'] <= 80:
        return 'Classe A (Vital - 80% do Caixa)'
    elif row['pct_acumulado'] <= 95:
        return 'Classe B (Intermediário - 15%)'
    else:
        return 'Classe C (Trivial - 5% da Cauda)'

df['curva_abc'] = df.apply(categorizar_abc, axis=1)
print(df[['produto', 'receita', 'pct_acumulado', 'curva_abc']])`,
    article: {
      title: 'O Princípio 80/20: Onde Focar o Tempo e o Dinheiro',
      subtitle: 'Separando os poucos vitais dos muitos triviais em operações complexas.',
      bodyText: 'Vilfredo Pareto descobriu no século XIX que 80% das terras na Itália pertenciam a 20% da população. No mundo corporativo, essa lei se manifesta em quase todo dataset: 20% dos produtos geram 80% do lucro, e 20% dos bugs causam 80% das reclamações.',
      keyPoints: [
        'Classe A: O coração financeiro da empresa. Não pode faltar estoque nem atrasar entrega sob nenhuma hipótese.',
        'Classe C: Gera alto custo operacional de armazenagem e catalogação para uma fração minúscula de retorno.',
        'A linha cumulativa de Pareto mostra o ponto de inflexão exato onde os retornos marginais despencam.'
      ],
      realWorldCase: 'Uma distribuidora reduziu seu catálogo em 40% (eliminando itens C sem giro) e viu seu lucro líquido subir 18% devido à redução de custos de estocagem.'
    },
    datasetMini: {
      name: 'Classificação ABC de Estoque',
      columns: ['produto', 'receita', 'pct_share', 'pct_acumulado', 'classe'],
      rows: [
        { produto: 'Item A (Top 1)', receita: 'R$ 85.000', pct_share: '41.1%', pct_acumulado: '41.1%', classe: '⭐ Classe A' },
        { produto: 'Item B (Top 2)', receita: 'R$ 62.000', pct_share: '30.0%', pct_acumulado: '71.1%', classe: '⭐ Classe A' },
        { produto: 'Item C (Top 3)', receita: 'R$ 28.000', pct_share: '13.5%', pct_acumulado: '84.6%', classe: '🔷 Classe B' },
        { produto: 'Item D', receita: 'R$ 15.000', pct_share: '7.3%', pct_acumulado: '91.9%', classe: '🔷 Classe B' },
        { produto: 'Item E', receita: 'R$ 9.500', pct_share: '4.6%', pct_acumulado: '96.5%', classe: '⚪ Classe C' },
        { produto: 'Item F', receita: 'R$ 4.200', pct_share: '2.0%', pct_acumulado: '98.5%', classe: '⚪ Classe C' },
      ]
    },
    parameters: [
      { id: 'corte_pareto', label: 'Limiar da Linha Vital (Classe A)', type: 'slider', min: 70, max: 90, step: 5, defaultValue: 80, unit: '%', description: 'Percentual acumulado considerado prioritário' },
      { id: 'itens_amostra', label: 'Quantidade de SKUs Analisados', type: 'slider', min: 5, max: 20, step: 1, defaultValue: 8, unit: 'itens', description: 'Tamanho da amostra de produtos' }
    ]
  },

  // =========================================================================
  // 12. NOVO PILAR 9: IMPORTÂNCIA DE FEATURES (DRIVERS DE MACHINE LEARNING)
  // =========================================================================
  {
    id: 'feature-importance',
    pillarId: 'classificacao',
    pillarName: 'MODELAGEM & DIAGNÓSTICO',
    title: 'IMPORTÂNCIA DE FEATURES (DRIVERS)',
    headerColor: 'bg-purple-100 text-purple-900 border-purple-200',
    accentColor: 'indigo',
    shortDesc: 'Ranqueia o poder explicativo de cada variável de entrada em modelos de árvores de decisão.',
    metricsSummary: 'Top 1 Driver: 38% Peso',
    cardChartType: 'feature-importance',
    codeSnippet: `# Feature Importance com Random Forest no Pandas
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# 1. Dataset de Comportamento e Conversão
df = pd.DataFrame({
    'tempo_sessao_min': [12, 5, 25, 4, 30, 8, 15, 2, 45, 6],
    'paginas_visitadas': [8, 2, 14, 2, 18, 5, 9, 1, 22, 3],
    'abriu_email': [1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    'dias_desde_ultimo_login': [2, 18, 1, 25, 2, 10, 4, 30, 1, 15],
    'converteu': [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
})

X = df.drop(columns=['converteu'])
y = df['converteu']

# 2. Ajuste da Floresta Aleatória
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X, y)

# 3. Série Pandas Ordenada com Pesos Relativos (%)
importancias = pd.Series(rf.feature_importances_ * 100, index=X.columns).sort_values(ascending=False)
print("Importância Relativa dos Drivers de Conversão (%):\n", importancias.round(2))`,
    article: {
      title: 'Feature Importance: Abrindo a Caixa-Preta do Machine Learning',
      subtitle: 'Como saber com precisão cirúrgica quais alavancas mexem o ponteiro do negócio.',
      bodyText: 'Saber que um modelo acerta 90% das previsões não basta para a diretoria. Executivos precisam saber: "O que faz o cliente fechar o contrato?". O Feature Importance decompõe o peso de cada variável na decisão do algoritmo.',
      keyPoints: [
        'Mede a redução média da impureza (Gini) ou ganho de informação trazido por cada atributo.',
        'Ajuda a eliminar variáveis inúteis (feature selection), reduzindo custos de infraestrutura e latência.',
        'Orienta times de marketing e produto sobre onde focar esforços de melhoria.'
      ],
      realWorldCase: 'Uma seguradora descobriu que a "idade do veículo" tinha 4x mais peso na sinistralidade que o "bairro de residência", reformulando completamente seu motor de precificação.'
    },
    datasetMini: {
      name: 'Ranking de Drivers de Decisão',
      columns: ['variavel', 'peso_importancia', 'impacto_direto', 'acao_recomendada'],
      rows: [
        { variavel: 'Páginas Visitadas', peso_importancia: '38.4%', impacto_direto: 'Positivo Forte', acao_recomendada: 'Otimizar jornada interna de navegação' },
        { variavel: 'Tempo de Sessão', peso_importancia: '28.1%', impacto_direto: 'Positivo Forte', acao_recomendada: 'Reter usuário com conteúdos relevantes' },
        { variavel: 'Recência de Login', peso_importancia: '21.5%', impacto_direto: 'Negativo Forte', acao_recomendada: 'Disparar push de reengajamento até D+3' },
        { variavel: 'Abertura de E-mail', peso_importancia: '12.0%', impacto_direto: 'Moderado', acao_recomendada: 'Aprimorar linhas de assunto' },
      ]
    },
    parameters: [
      { id: 'top_n_features', label: 'Top N Drivers Exibidos', type: 'slider', min: 2, max: 6, step: 1, defaultValue: 4, unit: 'drivers', description: 'Filtra os fatores mais relevantes no ranking' },
      { id: 'corte_relevancia', label: 'Corte Mínimo de Peso', type: 'slider', min: 5, max: 25, step: 5, defaultValue: 10, unit: '%', description: 'Descarta ruído abaixo desse percentual' }
    ]
  },
  ...EXTENDED_ALGORITHMS_PART1,
  ...EXTENDED_ALGORITHMS_PART2
];
