import { AlgorithmItem, CategoryInfo } from '../types/data-library';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'descritiva',
    name: 'Estatística Descritiva',
    iconName: 'BarChart2',
    shortDesc: 'Dispersão, assimetria, medidas de tendência central e quantis.',
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    tagColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
  {
    id: 'segmentacao',
    name: 'Segmentação & Clusters',
    iconName: 'Users',
    shortDesc: 'Agrupamento não-supervisionado, personas e segmentação RFM.',
    color: 'indigo',
    gradient: 'from-indigo-500/20 to-violet-500/10 border-indigo-500/30 text-indigo-400',
    tagColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  },
  {
    id: 'anomalias',
    name: 'Detecção de Anomalias',
    iconName: 'AlertTriangle',
    shortDesc: 'Identificação de outliers por Z-Score, IQR e desvios temporais.',
    color: 'amber',
    gradient: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    tagColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  {
    id: 'preditiva',
    name: 'Análise Preditiva & Tendência',
    iconName: 'TrendingUp',
    shortDesc: 'Regressão, correlações causais, projeção de tendências e R².',
    color: 'sky',
    gradient: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400',
    tagColor: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  },
  {
    id: 'limpeza',
    name: 'Limpeza & Transformação',
    iconName: 'Sparkles',
    shortDesc: 'Tratamento de nulos, One-Hot Encoding e higienização tabular.',
    color: 'purple',
    gradient: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    tagColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  },
];

export const ALGORITHMS: AlgorithmItem[] = [
  // 1. Z-SCORE OUTLIER DETECTION
  {
    id: 'zscore-anomalias',
    title: 'Detecção de Outliers por Z-Score',
    category: 'anomalias',
    level: 'Iniciante',
    badge: 'Fundamental',
    shortObjective: 'Identifica transações ou métricas que se afastam anormalmente da média amostral em unidades de desvio padrão.',
    tags: ['pandas', 'numpy', 'scipy', 'estatistica', 'outliers'],
    pythonCode: `import pandas as pd
import numpy as np

# 1. Carregar dataframe miniatura
df = pd.DataFrame({
    'transacao_id': [101, 102, 103, 104, 105, 106, 107, 108],
    'usuario': ['Alice', 'Bob', 'Carlos', 'Diana', 'Edu', 'Fernanda', 'Gabriel', 'Helena'],
    'valor_compra': [120.50, 95.00, 110.20, 1500.00, 105.80, 88.00, 1300.00, 115.40]
})

# 2. Calcular Média e Desvio Padrão populacional/amostral
media = df['valor_compra'].mean()
desvio_padrao = df['valor_compra'].std(ddof=1)

# 3. Vetorização: Calcular Z-Score para cada linha
# Fórmula: Z = (X - μ) / σ
df['z_score'] = (df['valor_compra'] - media) / desvio_padrao

# 4. Flag booleana baseada no limiar de corte (Threshold)
THRESHOLD = 2.0  # Parametrizável (ex: 2.0 ou 3.0)
df['is_anomalia'] = df['z_score'].abs() > THRESHOLD

# 5. Filtrar apenas registros suspeitos
anomalias_df = df[df['is_anomalia']]
print(f"Total de anomalias encontradas: {len(anomalias_df)}")
print(df[['transacao_id', 'valor_compra', 'z_score', 'is_anomalia']])`,
    dataset: {
      name: 'Transações de E-commerce',
      description: 'Amostra de pagamentos com tentativas legítimas e transações fraudulentas de alto valor.',
      columns: [
        { key: 'transacao_id', label: 'ID Transação', type: 'int64' },
        { key: 'usuario', label: 'Cliente', type: 'object' },
        { key: 'valor_compra', label: 'Valor (R$)', type: 'float64' },
      ],
      rawRows: [
        { transacao_id: 101, usuario: 'Alice', valor_compra: 120.50 },
        { transacao_id: 102, usuario: 'Bob', valor_compra: 95.00 },
        { transacao_id: 103, usuario: 'Carlos', valor_compra: 110.20 },
        { transacao_id: 104, usuario: 'Diana', valor_compra: 1500.00 },
        { transacao_id: 105, usuario: 'Edu', valor_compra: 105.80 },
        { transacao_id: 106, usuario: 'Fernanda', valor_compra: 88.00 },
        { transacao_id: 107, usuario: 'Gabriel', valor_compra: 1300.00 },
        { transacao_id: 108, usuario: 'Helena', valor_compra: 115.40 },
        { transacao_id: 109, usuario: 'Igor', valor_compra: 102.00 },
        { transacao_id: 110, usuario: 'Julia', valor_compra: 140.10 },
      ]
    },
    parameters: [
      {
        id: 'threshold',
        label: 'Limiar Z-Score (|Z| > threshold)',
        type: 'slider',
        min: 1.0,
        max: 3.5,
        step: 0.1,
        defaultValue: 2.0,
        unit: 'σ',
        description: 'Em distribuições normais, ~95% dos dados ficam em |Z| ≤ 2.0 e 99.7% em |Z| ≤ 3.0.'
      }
    ],
    processDataset: (raw, params) => {
      const th = params.threshold || 2.0;
      const values = raw.map(r => r.valor_compra);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (values.length - 1);
      const std = Math.sqrt(variance);

      return raw.map(row => {
        const z = (row.valor_compra - mean) / (std || 1);
        const isAnomalia = Math.abs(z) > th;
        return {
          ...row,
          z_score: Number(z.toFixed(2)),
          is_anomalia: isAnomalia ? '🚨 Sim' : '✅ Não',
          _isAlert: isAnomalia,
        };
      });
    },
    article: {
      headline: 'A Régua Universal de Excentricidade',
      oneLiner: 'O Z-Score converte qualquer escala monetária ou métrica em "quantos desvios padrão um ponto está longe da média central".',
      coreIntuition: [
        'Z = 0 significa que o ponto é rigorosamente idêntico à média do grupo.',
        'Z = +1.5 significa que o valor está 1.5 desvios padrão acima da média.',
        'Se os dados seguem uma distribuição aproximadamente Normal (Gaussiana), a regra 68-95-99.7 dita que pontos além de |Z| > 3.0 ocorrem menos de 0.3% das vezes por acaso.',
        'Portanto, qualquer ponto acima do threshold definido merece investigação imediata por fraude, falha de medição ou evento extremo.'
      ],
      analogy: 'Imagine medir a altura de passageiros em um aeroporto. Se a média é 1,75 m com desvio de 8 cm, alguém com 2,15 m tem Z = 5.0 — uma anomalia tão evidente quanto um pagamento de R$ 1.500 em um carrinho onde a média é R$ 110.',
      whenToUse: [
        'Detecção de fraudes em pagamentos com padrão de gasto regular',
        'Monitoramento de telemetria de servidores (CPU, memória e latência)',
        'Padronização prévia de features para modelos de Machine Learning (StandardScaler)'
      ],
      whenToAvoid: [
        'Distribuições extremamente bimodais ou com cauda longa (onde a própria média é distorcida pelos outliers)',
        'Para dados assimétricos severos, prefira o método do Boxplot (IQR) ou Hampel Filter'
      ],
      businessValue: 'Permite que sistemas de checkout barrem preventivamente roubos de cartão antes do faturamento, economizando centenas de milhares em chargebacks.',
      pandasPitfalls: [
        'Cuidado com df["col"].std(): o Pandas usa ddof=1 (amostral) por padrão, enquanto o NumPy np.std() usa ddof=0 (populacional).',
        'Nunca recalcule média e desvio em loops for iterrows() — utilize sempre a sintaxe vetorizada direta.'
      ],
      performanceNotes: {
        timeComplexity: 'O(N) - Varredura linear em tempo quase instantâneo',
        memoryComplexity: 'O(N) - Alocação de 1 coluna adicional float64',
        vectorized: true
      }
    },
    chart: {
      type: 'distribution-histogram',
      title: 'Distribuição dos Valores com Faixas de Z-Score',
      subtitle: 'Pontos coloridos em vermelho caem na região crítica de anomalia.',
      xAxisLabel: 'Valor da Transação (R$)',
      yAxisLabel: 'Desvio em Z (σ)',
      metrics: [
        { label: 'Média Amostral (μ)', value: 'R$ 373,70' },
        { label: 'Desvio Padrão (σ)', value: 'R$ 546,12' },
        { label: 'Anomalias Identificadas', value: '2 transações' }
      ],
      computeData: (params) => {
        const th = params.threshold || 2.0;
        const rawPoints = [
          { id: 101, user: 'Alice', val: 120.50 },
          { id: 102, user: 'Bob', val: 95.00 },
          { id: 103, user: 'Carlos', val: 110.20 },
          { id: 104, user: 'Diana', val: 1500.00 },
          { id: 105, user: 'Edu', val: 105.80 },
          { id: 106, user: 'Fernanda', val: 88.00 },
          { id: 107, user: 'Gabriel', val: 1300.00 },
          { id: 108, user: 'Helena', val: 115.40 },
          { id: 109, user: 'Igor', val: 102.00 },
          { id: 110, user: 'Julia', val: 140.10 },
        ];
        const vals = rawPoints.map(p => p.val);
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        const std = Math.sqrt(vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (vals.length - 1));

        const points = rawPoints.map(p => {
          const z = (p.val - mean) / std;
          const isOutlier = Math.abs(z) > th;
          return {
            x: p.val,
            y: Number(z.toFixed(2)),
            label: `${p.user}: R$ ${p.val.toFixed(2)} (Z: ${z.toFixed(2)})`,
            isOutlier,
            category: isOutlier ? 'Anomalia' : 'Padrão Normal',
          };
        });

        const anomalyCount = points.filter(p => p.isOutlier).length;

        return {
          points,
          metrics: [
            { label: 'Média (μ)', value: `R$ ${mean.toFixed(2)}`, helper: 'Centro da massa' },
            { label: 'Desvio (σ)', value: `R$ ${std.toFixed(2)}`, helper: 'Dispersão típica' },
            { label: 'Limiar Ativo', value: `± ${th.toFixed(1)} σ`, helper: `Sensibilidade: ${th}` },
            { label: 'Outliers', value: `${anomalyCount} registros`, helper: `${((anomalyCount/points.length)*100).toFixed(0)}% da base` },
          ],
          highlightNotes: [
            `Diana (R$ 1500.00) está a +${((1500 - mean) / std).toFixed(1)}σ da média.`,
            `Gabriel (R$ 1300.00) está a +${((1300 - mean) / std).toFixed(1)}σ da média.`
          ]
        };
      }
    }
  },

  // 2. SEGMENTAÇÃO RFM (RECÊNCIA, FREQUÊNCIA, VALOR)
  {
    id: 'rfm-segmentacao',
    title: 'Segmentação de Clientes por Matriz RFM',
    category: 'segmentacao',
    level: 'Intermediário',
    badge: 'Marketing Analítico',
    shortObjective: 'Classifica a base de clientes em clusters estratégicos (Campeões, Fiéis, Em Risco, Hibernando) usando pd.qcut.',
    tags: ['pandas', 'qcut', 'clustering', 'crm', 'negocios'],
    pythonCode: `import pandas as pd
import datetime as dt

# 1. Carregar histórico transacional agregado por cliente
df_clientes = pd.DataFrame({
    'cliente': ['Alpha Tech', 'Beta Corp', 'Gama SA', 'Delta Ltda', 'Omega Co', 'Zeta Inc', 'Nexus Sol', 'Vortex BR'],
    'recencia_dias': [4, 18, 120, 210, 8, 340, 25, 95],
    'frequencia_pedidos': [32, 18, 5, 2, 28, 1, 14, 7],
    'valor_monetario': [45000.0, 24000.0, 6200.0, 1800.0, 39500.0, 950.0, 18200.0, 8900.0]
})

# 2. Atribuir Notas de 1 a 4 por Quartis usando pd.qcut
# Para Recência: Menor número de dias = Melhor nota (inverter labels)
df_clientes['R_Score'] = pd.qcut(df_clientes['recencia_dias'], q=4, labels=[4, 3, 2, 1])

# Para Frequência e Valor: Maior = Melhor nota
df_clientes['F_Score'] = pd.qcut(df_clientes['frequencia_pedidos'].rank(method='first'), q=4, labels=[1, 2, 3, 4])
df_clientes['M_Score'] = pd.qcut(df_clientes['valor_monetario'], q=4, labels=[1, 2, 3, 4])

# 3. Concatenar Score Composto
df_clientes['RFM_Segmento'] = df_clientes['R_Score'].astype(str) + df_clientes['F_Score'].astype(str) + df_clientes['M_Score'].astype(str)

# 4. Mapear em Personas Acionáveis
def categorizar_rfm(row):
    r = int(row['R_Score'])
    fm = (int(row['F_Score']) + int(row['M_Score'])) / 2
    if r >= 3 and fm >= 3:
        return '👑 Campeões / VIPs'
    elif r >= 3 and fm < 3:
        return '🌱 Recentes / Promissores'
    elif r < 3 and fm >= 3:
        return '⚠️ Em Risco (Churn Iminente)'
    else:
        return '❄️ Hibernando / Inativos'

df_clientes['Perfil_Negocio'] = df_clientes.apply(categorizar_rfm, axis=1)
print(df_clientes[['cliente', 'recencia_dias', 'valor_monetario', 'Perfil_Negocio']])`,
    dataset: {
      name: 'Clientes Corporativos B2B',
      description: 'Métricas de compra consolidadas dos últimos 12 meses.',
      columns: [
        { key: 'cliente', label: 'Empresa', type: 'object' },
        { key: 'recencia_dias', label: 'Recência (Dias)', type: 'int64' },
        { key: 'frequencia_pedidos', label: 'Pedidos (Qtd)', type: 'int64' },
        { key: 'valor_monetario', label: 'Receita Total (R$)', type: 'float64' },
      ],
      rawRows: [
        { cliente: 'Alpha Tech', recencia_dias: 4, frequencia_pedidos: 32, valor_monetario: 45000.0 },
        { cliente: 'Beta Corp', recencia_dias: 18, frequencia_pedidos: 18, valor_monetario: 24000.0 },
        { cliente: 'Gama SA', recencia_dias: 120, frequencia_pedidos: 5, valor_monetario: 6200.0 },
        { cliente: 'Delta Ltda', recencia_dias: 210, frequencia_pedidos: 2, valor_monetario: 1800.0 },
        { cliente: 'Omega Co', recencia_dias: 8, frequencia_pedidos: 28, valor_monetario: 39500.0 },
        { cliente: 'Zeta Inc', recencia_dias: 340, frequencia_pedidos: 1, valor_monetario: 950.0 },
        { cliente: 'Nexus Sol', recencia_dias: 25, frequencia_pedidos: 14, valor_monetario: 18200.0 },
        { cliente: 'Vortex BR', recencia_dias: 95, frequencia_pedidos: 7, valor_monetario: 8900.0 },
      ]
    },
    parameters: [
      {
        id: 'churn_days_threshold',
        label: 'Tolerância de Recência (Dias p/ Risco)',
        type: 'slider',
        min: 30,
        max: 180,
        step: 10,
        defaultValue: 60,
        unit: 'dias',
        description: 'Clientes sem comprar há mais dias que esse limite entram em alerta de retenção.'
      }
    ],
    processDataset: (raw, params) => {
      const churnThreshold = params.churn_days_threshold || 60;
      return raw.map(r => {
        let perfil = '❄️ Hibernando';
        if (r.recencia_dias <= 30 && r.valor_monetario > 20000) {
          perfil = '👑 Campeão VIP';
        } else if (r.recencia_dias <= churnThreshold && r.valor_monetario > 10000) {
          perfil = '🌱 Leal / Promissor';
        } else if (r.recencia_dias > churnThreshold && r.valor_monetario > 10000) {
          perfil = '⚠️ Em Risco (Churn)';
        }
        return {
          ...r,
          score_rfm: `${r.recencia_dias < 30 ? '4' : '2'}${r.frequencia_pedidos > 15 ? '4' : '2'}${r.valor_monetario > 20000 ? '4' : '2'}`,
          perfil_negocio: perfil,
          _isAlert: perfil.includes('⚠️ Em Risco')
        };
      });
    },
    article: {
      headline: 'A Bússola Estratégica do CRM',
      oneLiner: 'Não trate todos os clientes de forma igual: a regra de Pareto dita que 20% da base gera 80% do faturamento.',
      coreIntuition: [
        'Recência (R): Quanto mais recente foi a última compra, mais propensa a marca está na mente do cliente.',
        'Frequência (F): Clientes habituais criam previsibilidade e reduzem o Custo de Aquisição de Clientes (CAC).',
        'Valor Monetário (M): O volume financeiro gasto separa contas estratégicas enterprise de clientes ocasionais.',
        'O pd.qcut do Pandas cria divisões baseadas em percentis exatos, evitando viés de faixas arbitrárias manuais.'
      ],
      analogy: 'Tratar sua carteira como uma festa: os VIPs merecem atendimento com tapete vermelho imediato, enquanto aqueles que não aparecem há 6 meses precisam de um convite irresistível antes que esqueçam sua existência.',
      whenToUse: [
        'Campanhas de e-mail marketing segmentadas por ciclo de vida',
        'Alocação de executivos de Customer Success (CS) para contas prioritárias',
        'Definição de campanhas de reativação para clientes "Em Risco"'
      ],
      whenToAvoid: [
        'Produtos de compra única ou ciclo de reposição longo de 10 anos (ex: compra de imóveis ou carros)',
        'Bases de clientes muito pequenas (< 50 registros), onde quartis perdem relevância estatística'
      ],
      businessValue: 'Aumenta a taxa de conversão de campanhas em até 3x ao parar de disparar cupom de desconto para quem já compraria pelo preço cheio.',
      pandasPitfalls: [
        'Se muitos clientes tiverem valores idênticos (ex: muitas compras com frequência = 1), pd.qcut falhará com erro de "Bin edges must be unique". Solução: use rank(method="first") antes do qcut.',
        'Ajuste labels com cuidado: a recência tem ordem inversa à frequência!'
      ],
      performanceNotes: {
        timeComplexity: 'O(N log N) - Devido à ordenação dos quantis',
        memoryComplexity: 'O(N) - Eficiente para milhões de linhas com Categorical dtypes',
        vectorized: true
      }
    },
    chart: {
      type: 'rfm-matrix',
      title: 'Matriz de Clientes: Recência vs. Receita Monetária',
      subtitle: 'O tamanho das bolhas reflete o volume de pedidos realizados.',
      xAxisLabel: 'Recência (Dias sem comprar)',
      yAxisLabel: 'Receita Total Acumulada (R$)',
      metrics: [
        { label: 'Receita VIP', value: 'R$ 108.500' },
        { label: 'Receita em Risco', value: 'R$ 24.400' },
        { label: 'Ticket Médio', value: 'R$ 17.437' }
      ],
      computeData: (params) => {
        const churnLimit = params.churn_days_threshold || 60;
        const clients = [
          { name: 'Alpha Tech', rec: 4, freq: 32, val: 45000 },
          { name: 'Omega Co', rec: 8, freq: 28, val: 39500 },
          { name: 'Beta Corp', rec: 18, freq: 18, val: 24000 },
          { name: 'Nexus Sol', rec: 25, freq: 14, val: 18200 },
          { name: 'Vortex BR', rec: 95, freq: 7, val: 8900 },
          { name: 'Gama SA', rec: 120, freq: 5, val: 6200 },
          { name: 'Delta Ltda', rec: 210, freq: 2, val: 1800 },
          { name: 'Zeta Inc', rec: 340, freq: 1, val: 950 },
        ];

        const points = clients.map(c => {
          let cat = '❄️ Hibernando';
          if (c.rec <= 30 && c.val > 20000) cat = '👑 Campeão VIP';
          else if (c.rec <= churnLimit && c.val >= 10000) cat = '🌱 Leal / Promissor';
          else if (c.rec > churnLimit && c.val >= 10000) cat = '⚠️ Em Risco (Churn)';

          return {
            x: c.rec,
            y: c.val,
            label: `${c.name}: ${c.rec} dias, R$ ${c.val.toLocaleString('pt-BR')} (${c.freq} pedidos)`,
            category: cat,
            size: c.freq,
            isOutlier: cat.includes('Em Risco')
          };
        });

        const totalRevenue = clients.reduce((a, b) => a + b.val, 0);
        const vipRevenue = clients.filter(c => c.val > 20000).reduce((a, b) => a + b.val, 0);

        return {
          points,
          metrics: [
            { label: 'Faturamento Total', value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`, helper: '8 contas analisadas' },
            { label: 'Concentração VIP', value: `${((vipRevenue/totalRevenue)*100).toFixed(0)}%`, helper: 'Top 3 clientes' },
            { label: 'Limite de Churn', value: `${churnLimit} dias`, helper: 'Regra de alerta ativo' },
            { label: 'Contas em Risco', value: `${points.filter(p => p.category.includes('Risco')).length} contas`, helper: 'Ação imediata necessária' }
          ],
          highlightNotes: [
            'Alpha Tech e Omega Co geram mais de 60% de toda a receita recorrente.',
            `Qualquer cliente com recência > ${churnLimit} dias necessita de playbook de retenção.`
          ]
        };
      }
    }
  },

  // 3. REGRESSÃO LINEAR & PREVISÃO DE VENDAS
  {
    id: 'regressao-linear',
    title: 'Regressão Linear & Coeficiente de Determinação (R²)',
    category: 'preditiva',
    level: 'Iniciante',
    badge: 'Modelagem Preditiva',
    shortObjective: 'Modela a relação funcional entre Investimento em Marketing e Vendas, calculando linha de tendência e força da correlação.',
    tags: ['pandas', 'numpy', 'scipy', 'predicao', 'regressao'],
    pythonCode: `import pandas as pd
import numpy as np

# 1. Dataset histórico de investimento vs receita mensal
df = pd.DataFrame({
    'mes': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
    'investimento_mkt_k': [10.0, 15.0, 12.0, 25.0, 30.0, 22.0, 35.0, 40.0, 48.0, 55.0],
    'vendas_geradas_k': [52.0, 68.0, 58.0, 95.0, 110.0, 88.0, 128.0, 145.0, 168.0, 192.0]
})

# 2. Ajuste dos coeficientes (Mínimos Quadrados Ordinários - OLS)
# y = a * x + b
x = df['investimento_mkt_k']
y = df['vendas_geradas_k']
coef_angular, intercepto = np.polyfit(x, y, deg=1)

# 3. Gerar previsões e resíduos no dataframe
df['vendas_preditas'] = coef_angular * x + intercepto
df['residuo_erro'] = df['vendas_geradas_k'] - df['vendas_preditas']

# 4. Cálculo do R² (Coeficiente de Determinação)
ss_res = np.sum(df['residuo_erro'] ** 2)
ss_tot = np.sum((y - y.mean()) ** 2)
r_quadrado = 1 - (ss_res / ss_tot)

print(f"Equação: Vendas = {coef_angular:.2f} * MKT + {intercepto:.2f}")
print(f"R² (Poder Explicativo): {r_quadrado:.4f} ({r_quadrado*100:.1f}%)")`,
    dataset: {
      name: 'Investimento em Mídia vs Receita',
      description: 'Histórico de 10 meses de campanhas de Google/Meta Ads e vendas brutas.',
      columns: [
        { key: 'mes', label: 'Mês', type: 'object' },
        { key: 'investimento_mkt_k', label: 'MKT (R$ Mil)', type: 'float64' },
        { key: 'vendas_geradas_k', label: 'Vendas (R$ Mil)', type: 'float64' },
      ],
      rawRows: [
        { mes: 'Jan', investimento_mkt_k: 10.0, vendas_geradas_k: 52.0 },
        { mes: 'Fev', investimento_mkt_k: 15.0, vendas_geradas_k: 68.0 },
        { mes: 'Mar', investimento_mkt_k: 12.0, vendas_geradas_k: 58.0 },
        { mes: 'Abr', investimento_mkt_k: 25.0, vendas_geradas_k: 95.0 },
        { mes: 'Mai', investimento_mkt_k: 30.0, vendas_geradas_k: 110.0 },
        { mes: 'Jun', investimento_mkt_k: 22.0, vendas_geradas_k: 88.0 },
        { mes: 'Jul', investimento_mkt_k: 35.0, vendas_geradas_k: 128.0 },
        { mes: 'Ago', investimento_mkt_k: 40.0, vendas_geradas_k: 145.0 },
        { mes: 'Set', investimento_mkt_k: 48.0, vendas_geradas_k: 168.0 },
        { mes: 'Out', investimento_mkt_k: 55.0, vendas_geradas_k: 192.0 },
      ]
    },
    parameters: [
      {
        id: 'budget_simulacao',
        label: 'Simular Investimento Futuro (R$ Mil)',
        type: 'slider',
        min: 10,
        max: 80,
        step: 5,
        defaultValue: 60,
        unit: 'k',
        description: 'Altera o ponto de projeção futura na reta de regressão.'
      }
    ],
    processDataset: (raw, params) => {
      const budget = params.budget_simulacao || 60;
      const x = raw.map(r => r.investimento_mkt_k);
      const y = raw.map(r => r.vendas_geradas_k);
      const n = x.length;
      const xMean = x.reduce((a, b) => a + b, 0) / n;
      const yMean = y.reduce((a, b) => a + b, 0) / n;

      let num = 0;
      let den = 0;
      for (let i = 0; i < n; i++) {
        num += (x[i] - xMean) * (y[i] - yMean);
        den += Math.pow(x[i] - xMean, 2);
      }
      const slope = den !== 0 ? num / den : 1;
      const intercept = yMean - slope * xMean;

      const processed: Record<string, any>[] = raw.map(r => {
        const pred = slope * r.investimento_mkt_k + intercept;
        const res = r.vendas_geradas_k - pred;
        return {
          ...r,
          vendas_preditas: Number(pred.toFixed(1)),
          residuo_erro: Number(res.toFixed(1)),
        };
      });

      // Add future projection row
      const futurePred = slope * budget + intercept;
      processed.push({
        mes: '🔮 Projeção',
        investimento_mkt_k: budget,
        vendas_geradas_k: '-',
        vendas_preditas: Number(futurePred.toFixed(1)),
        residuo_erro: 0,
        _isAlert: true
      });

      return processed;
    },
    article: {
      headline: 'A Reta Que Prevê o Amanhã',
      oneLiner: 'A Regressão Linear traduz a intuição de que "ao aumentar X em uma unidade, Y tende a subir em b unidades".',
      coreIntuition: [
        'O coeficiente angular (inclinação) representa o Retorno Marginal: cada R$ 1.000 investido a mais em ads gera em média R$ 3.080 em vendas adicionais.',
        'O intercepto representa a receita de linha de base (vendas orgânicas sem nenhum centavo de tráfego pago).',
        'O R² (R-Quadrado) oscila entre 0 e 1: indica qual proporção da variabilidade das vendas é explicada unicamente pelo investimento em marketing.',
        'Resíduos pequenos e dispersos aleatoriamente em torno de zero confirmam a solidez do modelo.'
      ],
      analogy: 'Como a relação entre pisar no acelerador e a velocidade do carro: cada centímetro de pressão no pedal adiciona uma quantidade previsível de km/h, a menos que o carro esteja subindo uma ladeira íngreme.',
      whenToUse: [
        'Planejamento orçamentário anual e previsão de faturamento',
        'Elasticidade de preço de produtos no e-commerce',
        'Estimativa de tempo de resposta em relação ao número de requisições simultâneas'
      ],
      whenToAvoid: [
        'Fenômenos com rendimentos decrescentes severos (onde o gráfico curva, exigindo polinômio ou logaritmo)',
        'Quando há multicolinearidade extrema entre variáveis independentes'
      ],
      businessValue: 'Responde à pergunta mais feita pelos diretores financeiros: "Se dobrarmos o investimento em marketing no próximo trimestre, quanto de receita líquida podemos esperar?"',
      pandasPitfalls: [
        'Nunca aplique regressão antes de checar valores nulos; polyfit do numpy gera NaN se houver um único dado ausente.',
        'Cuidado com a cilada "Correlação não implica Causalidade" (sorvete vs afogamentos no verão).'
      ],
      performanceNotes: {
        timeComplexity: 'O(N) - Solução analítica direta sem iterações de gradiente',
        memoryComplexity: 'O(1) - Mantém apenas somatórios em memória',
        vectorized: true
      }
    },
    chart: {
      type: 'scatter-regression',
      title: 'Dispersão de Dados & Linha de Regressão OLS',
      subtitle: 'A linha azul representa a função matemática ajustada aos pontos reais.',
      xAxisLabel: 'Investimento em Marketing (R$ Mil)',
      yAxisLabel: 'Vendas Geradas (R$ Mil)',
      metrics: [
        { label: 'Inclinação (Slope)', value: '+3.08x' },
        { label: 'Vendas Base (Orgânico)', value: 'R$ 21,4k' },
        { label: 'Poder Explicativo (R²)', value: '98.8%' }
      ],
      computeData: (params) => {
        const budget = params.budget_simulacao || 60;
        const historical = [
          { x: 10.0, y: 52.0, mes: 'Jan' },
          { x: 15.0, y: 68.0, mes: 'Fev' },
          { x: 12.0, y: 58.0, mes: 'Mar' },
          { x: 25.0, y: 95.0, mes: 'Abr' },
          { x: 30.0, y: 110.0, mes: 'Mai' },
          { x: 22.0, y: 88.0, mes: 'Jun' },
          { x: 35.0, y: 128.0, mes: 'Jul' },
          { x: 40.0, y: 145.0, mes: 'Ago' },
          { x: 48.0, y: 168.0, mes: 'Set' },
          { x: 55.0, y: 192.0, mes: 'Out' },
        ];

        const xVals = historical.map(h => h.x);
        const yVals = historical.map(h => h.y);
        const n = xVals.length;
        const xMean = xVals.reduce((a, b) => a + b, 0) / n;
        const yMean = yVals.reduce((a, b) => a + b, 0) / n;

        let num = 0, den = 0;
        for (let i = 0; i < n; i++) {
          num += (xVals[i] - xMean) * (yVals[i] - yMean);
          den += Math.pow(xVals[i] - xMean, 2);
        }
        const slope = num / den;
        const intercept = yMean - slope * xMean;

        const points: import('../types/data-library').ChartPoint[] = historical.map(h => {
          const trendY = slope * h.x + intercept;
          return {
            x: h.x,
            y: h.y,
            trend: Number(trendY.toFixed(1)),
            label: `${h.mes}: R$ ${h.x}k MKT -> R$ ${h.y}k Vendas`,
            category: 'Histórico Real'
          };
        });

        // Add projected point
        const projY = slope * budget + intercept;
        points.push({
          x: budget,
          y: Number(projY.toFixed(1)),
          trend: Number(projY.toFixed(1)),
          label: `🔮 Simulação: R$ ${budget}k MKT -> R$ ${projY.toFixed(1)}k Previsto`,
          category: 'Projeção Futura',
          isOutlier: true
        });

        return {
          points,
          metrics: [
            { label: 'Retorno Marginal', value: `R$ ${slope.toFixed(2)} por R$ 1`, helper: 'Inclinação da reta' },
            { label: 'Vendas de Base', value: `R$ ${intercept.toFixed(1)}k`, helper: 'Intercepto em X=0' },
            { label: 'Investimento Simulado', value: `R$ ${budget}k`, helper: 'Entrada do usuário' },
            { label: 'Venda Prevista', value: `R$ ${projY.toFixed(1)}k`, helper: 'Resultado estimado' }
          ],
          highlightNotes: [
            `Para um investimento de R$ ${budget} mil, a receita prevista é de aproximadamente R$ ${projY.toFixed(1)} mil.`,
            'O R² elevado (0.988) indica que quase toda variação de receita foi acompanhada pelo orçamento.'
          ]
        };
      }
    }
  },

  // 4. BOXPLOT & AMPLITUDE INTERQUARTIL (IQR)
  {
    id: 'boxplot-iqr',
    title: 'Análise de Boxplot & Filtro IQR (Tukey)',
    category: 'descritiva',
    level: 'Iniciante',
    badge: 'Estatística Robusta',
    shortObjective: 'Detecta outliers sem ser influenciado por valores extremos, usando a mediana e a amplitude interquartil (Q3 - Q1).',
    tags: ['pandas', 'estatistica', 'iqr', 'quartis', 'boxplot'],
    pythonCode: `import pandas as pd
import numpy as np

# 1. Dataset de Salários em Tecnologia (com distorção severa)
df = pd.DataFrame({
    'cargo': ['Dev Jr', 'Dev Jr', 'Dev Pl', 'Dev Pl', 'Dev Sr', 'Dev Sr', 'Arquiteto', 'CTO Fundador'],
    'salario_k': [4.5, 5.0, 8.2, 8.8, 14.5, 15.0, 19.0, 85.0]
})

# 2. Calcular Primeiro (Q1) e Terceiro (Q3) Quartis
Q1 = df['salario_k'].quantile(0.25)
Q3 = df['salario_k'].quantile(0.75)
IQR = Q3 - Q1

# 3. Definir Cercas de Tukey (Whiskers)
K = 1.5  # Multiplicador clássico de Tukey
limite_inferior = Q1 - (K * IQR)
limite_superior = Q3 + (K * IQR)

# 4. Rotular Outliers
df['is_outlier_iqr'] = (df['salario_k'] < limite_inferior) | (df['salario_k'] > limite_superior)

print(f"Q1: {Q1:.2f} | Mediana: {df['salario_k'].median():.2f} | Q3: {Q3:.2f}")
print(f"IQR: {IQR:.2f} | Cerca Superior: {limite_superior:.2f}")
print(df[['cargo', 'salario_k', 'is_outlier_iqr']])`,
    dataset: {
      name: 'Remunerações de Engenharia',
      description: 'Salários em milhares de reais contendo remuneração de diretoria como outlier evidente.',
      columns: [
        { key: 'cargo', label: 'Cargo', type: 'object' },
        { key: 'salario_k', label: 'Salário (R$ Mil)', type: 'float64' },
      ],
      rawRows: [
        { cargo: 'Dev Jr 1', salario_k: 4.5 },
        { cargo: 'Dev Jr 2', salario_k: 5.0 },
        { cargo: 'Dev Pleno 1', salario_k: 8.2 },
        { cargo: 'Dev Pleno 2', salario_k: 8.8 },
        { cargo: 'Dev Senior 1', salario_k: 14.5 },
        { cargo: 'Dev Senior 2', salario_k: 15.0 },
        { cargo: 'Arquiteto', salario_k: 19.0 },
        { cargo: 'CTO / Fundador', salario_k: 85.0 },
      ]
    },
    parameters: [
      {
        id: 'iqr_multiplier',
        label: 'Multiplicador de Cerca (K x IQR)',
        type: 'slider',
        min: 1.0,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.5,
        unit: 'x IQR',
        description: 'Tukey recomendou 1.5 para outliers moderados e 3.0 para outliers severos.'
      }
    ],
    processDataset: (raw, params) => {
      const k = params.iqr_multiplier || 1.5;
      const sorted = [...raw.map(r => r.salario_k)].sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      const upper = q3 + k * iqr;
      const lower = q1 - k * iqr;

      return raw.map(r => {
        const isOut = r.salario_k > upper || r.salario_k < lower;
        return {
          ...r,
          faixa_cerca: `[${lower.toFixed(1)}k a ${upper.toFixed(1)}k]`,
          status_outlier: isOut ? '🚨 Outlier Severo' : '✅ Dentro da Cerca',
          _isAlert: isOut
        };
      });
    },
    article: {
      headline: 'A Blindagem Contra Médias Ilusórias',
      oneLiner: 'Enquanto um único bilionário sentado no bar eleva a renda média de todos a milhões, a Mediana e o IQR permanecem impassíveis.',
      coreIntuition: [
        'A Mediana divide a população exatamente em 50% acima e 50% abaixo.',
        'O IQR (Interquartile Range) mede a largura da caixa central onde habitam os 50% mais representativos da amostra (entre o percentil 25 e o 75).',
        'Ao aplicar a cerca de Tukey (Q3 + 1.5 * IQR), você cria um critério matemático independente da forma da distribuição.',
        'Ao contrário do Z-Score, o IQR não supõe normalidade dos dados.'
      ],
      analogy: 'Imagine julgar notas de ginástica artística onde a maior e a menor nota são descartadas. O IQR foca exclusivamente no núcleo consistente da competição.',
      whenToUse: [
        'Distribuições de renda, preços de imóveis e tempo de permanência em sites (severamente assimétricas)',
        'Limpeza inicial de dados antes do treinamento de redes neurais',
        'Relatórios de RH e faixas salariais para não gerar conclusões equivocadas com médias'
      ],
      whenToAvoid: [
        'Bases de dados onde eventos raros são o próprio objeto de interesse (ex: sinais de terremotos ou meteoritos)'
      ],
      businessValue: 'Evita decisões catastróficas de precificação ou bônus baseadas em médias puxadas por 1 ou 2 contratos fora da curva.',
      pandasPitfalls: [
        'df.describe() mostra os quartis diretamente, mas não calcula o IQR automaticamente; lembre-se de subtrair Q3 - Q1.',
        'A interpolação dos quantis no Pandas tem 5 métodos diferentes (linear, lower, higher, midpoint, nearest).'
      ],
      performanceNotes: {
        timeComplexity: 'O(N log N) para ordenação do quantile',
        memoryComplexity: 'O(N)',
        vectorized: true
      }
    },
    chart: {
      type: 'boxplot-comparison',
      title: 'Diagrama de Caixa (Boxplot) com Cercas de Tukey',
      subtitle: 'A caixa azul engloba o Q1, Mediana e Q3. Pontos além dos bigodes são anomalias.',
      xAxisLabel: 'Profissionais Analisados',
      yAxisLabel: 'Salário (R$ Mil)',
      metrics: [
        { label: 'Q1 (25%)', value: 'R$ 6,6k' },
        { label: 'Mediana (50%)', value: 'R$ 11,6k' },
        { label: 'Q3 (75%)', value: 'R$ 15,0k' }
      ],
      computeData: (params) => {
        const k = params.iqr_multiplier || 1.5;
        const vals = [4.5, 5.0, 8.2, 8.8, 14.5, 15.0, 19.0, 85.0];
        const labels = ['Dev Jr 1', 'Dev Jr 2', 'Dev Pleno 1', 'Dev Pleno 2', 'Dev Sr 1', 'Dev Sr 2', 'Arquiteto', 'CTO'];
        const q1 = 6.6;
        const median = 11.65;
        const q3 = 15.0;
        const iqr = q3 - q1;
        const upper = q3 + k * iqr;
        const lower = Math.max(0, q1 - k * iqr);

        const points = vals.map((v, i) => {
          const isOutlier = v > upper || v < lower;
          return {
            x: labels[i],
            y: v,
            label: `${labels[i]}: R$ ${v}k`,
            isOutlier,
            category: isOutlier ? 'Outlier Externo' : 'Dentro da Cerca',
            upperBand: upper,
            lowerBand: lower
          };
        });

        return {
          points,
          metrics: [
            { label: 'Mediana Robusta', value: `R$ ${median.toFixed(1)}k`, helper: 'Valor central' },
            { label: 'IQR (Amplitude)', value: `R$ ${iqr.toFixed(1)}k`, helper: 'Q3 - Q1' },
            { label: 'Cerca Superior', value: `R$ ${upper.toFixed(1)}k`, helper: `Q3 + ${k}x IQR` },
            { label: 'Média Ilusória', value: `R$ 20,0k`, helper: 'Distorcida pelo CTO (+72%)' }
          ],
          highlightNotes: [
            `O salário do CTO (R$ 85k) ultrapassa com folga a cerca superior de R$ ${upper.toFixed(1)}k.`,
            'A média (R$ 20k) é quase o dobro da mediana real do time (R$ 11.6k).'
          ]
        };
      }
    }
  },

  // 5. TRATAMENTO E IMPUTAÇÃO DE NULOS
  {
    id: 'imputacao-nulos',
    title: 'Imputação de Valores Nulos & Auditoria de Integridade',
    category: 'limpeza',
    level: 'Iniciante',
    badge: 'Engenharia de Dados',
    shortObjective: 'Diagnostica padrões de valores ausentes (NaN) e aplica imputação condicional por mediana com rastreamento.',
    tags: ['pandas', 'dropna', 'fillna', 'imputer', 'qualidade'],
    pythonCode: `import pandas as pd
import numpy as np

# 1. Dataset com falhas de preenchimento (dados ausentes)
df = pd.DataFrame({
    'paciente_id': [201, 202, 203, 204, 205, 206, 207],
    'idade': [28, 45, np.nan, 39, 62, np.nan, 34],
    'pressao_arterial': [120, np.nan, 135, 118, 142, 128, np.nan],
    'fumante': ['Não', 'Sim', 'Não', np.nan, 'Sim', 'Não', 'Não']
})

# 2. Diagnóstico: Percentual de Nulos por Coluna
taxa_nulos = (df.isnull().sum() / len(df)) * 100

# 3. Criar coluna indicadora (Indicator Flag) antes de imputar
df['idade_era_nulo'] = df['idade'].isnull()

# 4. Imputar coluna numérica pela MEDIANA (robusta a outliers)
mediana_idade = df['idade'].median()
df['idade_imputada'] = df['idade'].fillna(mediana_idade)

# 5. Imputar categórica pela MODA (valor mais frequente)
moda_fumante = df['fumante'].mode()[0]
df['fumante_imputado'] = df['fumante'].fillna(moda_fumante)

print("Taxa de Nulos (%):\n", taxa_nulos)
print(df[['paciente_id', 'idade', 'idade_imputada', 'idade_era_nulo']])`,
    dataset: {
      name: 'Triagem Clínica Hospitalar',
      description: 'Prontuários com omissões no preenchimento de idade e pressão.',
      columns: [
        { key: 'paciente_id', label: 'ID Paciente', type: 'int64' },
        { key: 'idade', label: 'Idade Original', type: 'float64' },
        { key: 'pressao_arterial', label: 'Pressão (mmHg)', type: 'float64' },
        { key: 'fumante', label: 'Fumante', type: 'object' },
      ],
      rawRows: [
        { paciente_id: 201, idade: 28, pressao_arterial: 120, fumante: 'Não' },
        { paciente_id: 202, idade: 45, pressao_arterial: null, fumante: 'Sim' },
        { paciente_id: 203, idade: null, pressao_arterial: 135, fumante: 'Não' },
        { paciente_id: 204, idade: 39, pressao_arterial: 118, fumante: null },
        { paciente_id: 205, idade: 62, pressao_arterial: 142, fumante: 'Sim' },
        { paciente_id: 206, idade: null, pressao_arterial: 128, fumante: 'Não' },
        { paciente_id: 207, idade: 34, pressao_arterial: null, fumante: 'Não' },
      ]
    },
    parameters: [
      {
        id: 'estrategia_imputacao',
        label: 'Estratégia Numérica de Imputação',
        type: 'select',
        defaultValue: 'mediana',
        options: [
          { value: 'mediana', label: 'Mediana (Recomendado)' },
          { value: 'media', label: 'Média Aritmética' },
          { value: 'zero', label: 'Constante Zero (0)' }
        ],
        description: 'Define qual valor estatístico preencherá os registros nulos.'
      }
    ],
    processDataset: (raw, params) => {
      const strategy = params.estrategia_imputacao || 'mediana';
      const validAges = raw.map(r => r.idade).filter((v): v is number => v !== null && !isNaN(v));
      const sorted = [...validAges].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)] || 39;
      const mean = validAges.reduce((a, b) => a + b, 0) / (validAges.length || 1);

      const fillVal = strategy === 'mediana' ? median : strategy === 'media' ? Number(mean.toFixed(1)) : 0;

      return raw.map(r => {
        const wasNull = r.idade === null;
        return {
          ...r,
          idade_imputada: wasNull ? `${fillVal} (Imputado)` : r.idade,
          status_dado: wasNull ? '🟡 Preenchido por Algoritmo' : '🟢 Original Válido',
          _isAlert: wasNull
        };
      });
    },
    article: {
      headline: 'O Vazio Não É Neutro',
      oneLiner: 'Excluir linhas com nulos sem critério pode eliminar 40% do seu dataset e enviesar sistematicamente toda a análise.',
      coreIntuition: [
        'MCAR (Missing Completely at Random): O dado sumiu por acaso puro (ex: falha de cabo no sensor).',
        'MAR (Missing at Random): O sumiço depende de outra variável conhecida (ex: homens relatam menos certas condições de saúde).',
        'MNAR (Missing Not at Random): O fato do dado estar ausente tem significado próprio (ex: devedores que se recusam a declarar a renda no cadastro).',
        'Sempre crie uma coluna booleana indicadora (ex: is_imputed = True) antes de preencher, permitindo que futuros modelos saibam quais dados foram deduzidos.'
      ],
      analogy: 'Consertar um mosaico antigo que perdeu pedras: em vez de jogar fora o quadro inteiro ou colar cimento cinza grosseiro, você esculpe uma peça que combine perfeitamente com a cor e textura do entorno.',
      whenToUse: [
        'Modelos de Machine Learning do Scikit-Learn que não aceitam NaNs nativamente',
        'Manutenção do tamanho amostral para testes de hipótese com alta potência estatística'
      ],
      whenToAvoid: [
        'Quando a coluna tiver mais de 60-70% de dados faltantes (neste caso, a coluna inteira costuma ser descartada)',
        'Quando o dado faltante for a própria variável-alvo (Y) que você deseja prever'
      ],
      businessValue: 'Salva dados de clientes valiosos que seriam descartados por causa de um único campo opcional deixado em branco.',
      pandasPitfalls: [
        'df.fillna(inplace=True) está sendo depreciado em versões modernas do Pandas; prefira atribuir: df["col"] = df["col"].fillna(...)',
        'Cuidado com None vs np.nan vs string vazia "": o Pandas trata np.nan como tipo float.'
      ],
      performanceNotes: {
        timeComplexity: 'O(N) - Substituição em bloco vetorizado',
        memoryComplexity: 'O(1) in-place ou O(N) com cópia',
        vectorized: true
      }
    },
    chart: {
      type: 'distribution-histogram',
      title: 'Auditoria de Completude: Registros Válidos vs Ausentes',
      subtitle: 'Colunas críticas e suas taxas de disponibilidade amostral.',
      xAxisLabel: 'Atributo Clínico',
      yAxisLabel: 'Preenchimento (%)',
      metrics: [
        { label: 'Completude Geral', value: '81.0%' },
        { label: 'Idade Ausente', value: '28.5%' },
        { label: 'Estratégia Ativa', value: 'Mediana' }
      ],
      computeData: (params) => {
        const strat = params.estrategia_imputacao || 'mediana';
        const cols = [
          { name: 'paciente_id', total: 7, valid: 7, missing: 0 },
          { name: 'idade', total: 7, valid: 5, missing: 2 },
          { name: 'pressao_arterial', total: 7, valid: 5, missing: 2 },
          { name: 'fumante', total: 7, valid: 6, missing: 1 },
        ];

        const points = cols.map(c => {
          const pct = (c.valid / c.total) * 100;
          return {
            x: c.name,
            y: Number(pct.toFixed(1)),
            label: `${c.name}: ${c.valid}/${c.total} preenchidos (${pct.toFixed(0)}%)`,
            category: c.missing > 0 ? 'Requer Tratamento' : '100% Íntegro',
            isOutlier: c.missing > 1
          };
        });

        return {
          points,
          metrics: [
            { label: 'Registros Totais', value: '7 prontuários', helper: 'Amostra da UTI' },
            { label: 'Campos com Nulos', value: '3 de 4 colunas', helper: '75% dos atributos' },
            { label: 'Método Selecionado', value: strat.toUpperCase(), helper: 'Vetorizado' },
            { label: 'Perda se fizesse dropna', value: '57% das linhas', helper: '4 pacientes perdidos' }
          ],
          highlightNotes: [
            'Se você utilizasse df.dropna(), restariam apenas 3 pacientes na análise.',
            `Com a imputação por ${strat}, todos os 7 registros são preservados para treinamento.`
          ]
        };
      }
    }
  }
];
