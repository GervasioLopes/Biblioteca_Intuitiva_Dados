import { VisualAlgorithm } from './simple-algorithms';

export const EXTENDED_ALGORITHMS_PART1: VisualAlgorithm[] = [
  // 13. BOXPLOT & CERCAS DE TUKEY (IQR)
  {
    id: 'boxplot-tukey',
    pillarId: 'distribuicao',
    pillarName: 'DISTRIBUIÇÃO ESTATÍSTICA',
    title: 'BOXPLOT & CERCAS DE TUKEY (IQR)',
    headerColor: 'bg-amber-100 text-amber-900 border-amber-200',
    accentColor: 'amber',
    shortDesc: 'Mapeia a mediana, quartis Q1/Q3 e identifica outliers não-paramétricos além de 1.5x IQR.',
    metricsSummary: 'IQR = R$ 420 | 3 Outliers',
    cardChartType: 'boxplot-tukey',
    codeSnippet: `# Boxplot & Detecção por Intervalo Interquartil (IQR)
import pandas as pd
import numpy as np

# 1. Dataset de Salários / Tickets de Clientes
df = pd.DataFrame({
    'ticket': [120, 140, 150, 165, 180, 195, 210, 225, 240, 260, 290, 850, 920]
})

# 2. Cálculo dos Quartis Q1 (25%), Mediana (50%) e Q3 (75%)
q1 = df['ticket'].quantile(0.25)
mediana = df['ticket'].median()
q3 = df['ticket'].quantile(0.75)
iqr = q3 - q1

# 3. Limites de Tukey (Cercas Superior e Inferior)
fator = 1.5
limite_inferior = max(0, q1 - fator * iqr)
limite_superior = q3 + fator * iqr

# 4. Filtragem Robusta sem depender de Distribuição Normal
outliers = df[(df['ticket'] < limite_inferior) | (df['ticket'] > limite_superior)]
print(f"Q1: {q1} | Mediana: {mediana} | Q3: {q3} | IQR: {iqr}")
print(f"Cerca Superior: {limite_superior} | Outliers Encontrados: {len(outliers)}")`,
    article: {
      title: 'Boxplot e Tukey: A Anatomia dos Quartis',
      subtitle: 'Como entender dispersão e extremos sem ser enganado pela média.',
      bodyText: 'Quando os dados contêm valores discrepantes severos, a média e o desvio padrão sofrem distorções massivas. O método IQR de John Tukey utiliza a mediana e a distância interquartil, oferecendo uma blindagem estatística não-paramétrica.',
      keyPoints: [
        'A caixa central contém exatamente 50% dos dados centrais da empresa.',
        'Pontos além de 1.5x IQR são outliers moderados; além de 3.0x são outliers severos.',
        'Excelente para auditoria salarial, tickets de e-commerce e tempos de atendimento.'
      ],
      realWorldCase: 'Um marketplace identificou vendedores inflando avaliações com pedidos de R$ 1 que distorciam o faturamento médio geral.'
    },
    datasetMini: {
      name: 'Tickets e Auditoria IQR',
      columns: ['pedido_id', 'ticket_reais', 'posicao_quartil', 'status_tukey'],
      rows: [
        { pedido_id: '#101', ticket_reais: 140, posicao_quartil: 'Abaixo Q1', status_tukey: 'Normal' },
        { pedido_id: '#102', ticket_reais: 195, posicao_quartil: 'Mediana (Q2)', status_tukey: 'Normal' },
        { pedido_id: '#103', ticket_reais: 260, posicao_quartil: 'Q3', status_tukey: 'Normal' },
        { pedido_id: '#104', ticket_reais: 850, posicao_quartil: '> Cerca Superior', status_tukey: '🚨 Outlier IQR' },
        { pedido_id: '#105', ticket_reais: 920, posicao_quartil: '> Cerca Superior', status_tukey: '🚨 Outlier IQR' },
      ]
    },
    parameters: [
      { id: 'fator_iqr', label: 'Multiplicador de Tukey', type: 'slider', min: 1.0, max: 2.5, step: 0.1, defaultValue: 1.5, unit: 'x IQR', description: 'Largura das hastes de corte para considerar outlier' },
      { id: 'corte_assimetria', label: 'Assimetria da Base', type: 'slider', min: 0, max: 40, step: 5, defaultValue: 15, unit: '%', description: 'Distorção da cauda superior de dados' }
    ]
  },

  // 14. SEGMENTAÇÃO RFM (CRM & E-COMMERCE)
  {
    id: 'rfm-segmentacao',
    pillarId: 'segmentacao',
    pillarName: 'SEGMENTAÇÃO & CRM',
    title: 'SEGMENTAÇÃO RFM (RECÊNCIA, FREQ, VALOR)',
    headerColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    accentColor: 'emerald',
    shortDesc: 'Classifica a base de clientes em Campeões, Fiéis, Em Risco e Hibernando via pontuação 1-5.',
    metricsSummary: 'Score 1 a 5 | 5 Clusters CRM',
    cardChartType: 'rfm-matrix',
    codeSnippet: `# Matriz RFM (Recency, Frequency, Monetary)
import pandas as pd

df_pedidos = pd.DataFrame({
    'cliente_id': [1, 2, 3, 4, 5, 6, 7, 8],
    'recencia_dias': [4, 12, 180, 210, 8, 45, 90, 2],
    'pedidos_total': [18, 14, 2, 1, 9, 6, 4, 22],
    'gasto_total_reais': [3400, 2800, 190, 95, 1400, 850, 420, 4900]
})

# Notas de 1 a 5 usando quantis (qcut)
df_pedidos['R_Score'] = pd.qcut(df_pedidos['recencia_dias'], 4, labels=[4, 3, 2, 1])
df_pedidos['F_Score'] = pd.qcut(df_pedidos['pedidos_total'].rank(method='first'), 4, labels=[1, 2, 3, 4])
df_pedidos['M_Score'] = pd.qcut(df_pedidos['gasto_total_reais'], 4, labels=[1, 2, 3, 4])

def definir_segmento(row):
    r, f = int(row['R_Score']), int(row['F_Score'])
    if r >= 4 and f >= 4: return '🏆 Campeões (VIP)'
    if r >= 3 and f >= 3: return '💎 Clientes Fiéis'
    if r <= 2 and f >= 3: return '⚠️ Em Risco de Churn'
    return '💤 Hibernando / Novos'

df_pedidos['segmento'] = df_pedidos.apply(definir_segmento, axis=1)
print(df_pedidos[['cliente_id', 'R_Score', 'F_Score', 'segmento']])`,
    article: {
      title: 'RFM: A Bússola Estratégica do Marketing de Retenção',
      subtitle: 'Como parar de tratar clientes VIP e contas inativas da mesma forma.',
      bodyText: 'A análise RFM pontua cada consumidor em 3 eixos universais: quão recente foi o último pedido, com que frequência compra e quanto dinheiro já gastou. É o pilar das maiores operações de CRM do mundo.',
      keyPoints: [
        'Campeões: alta frequência e recência recente — merecem atendimento concierge.',
        'Em Risco: compravam muito no passado mas sumiram há meses — campanhas de win-back urgentes.',
        'Permite ROI até 400% maior em e-mail marketing e cupons direcionados.'
      ],
      realWorldCase: 'Uma marca de cosméticos recuperou R$ 890 mil em faturamento com uma campanha de reativação desenhada exclusivamente para clientes "Em Risco".'
    },
    datasetMini: {
      name: 'Base de Clientes & RFM',
      columns: ['cliente_id', 'recencia_dias', 'freq_compras', 'monetario', 'segmento_crm'],
      rows: [
        { cliente_id: '#C-01', recencia_dias: 2, freq_compras: 22, monetario: 'R$ 4.900', segmento_crm: '🏆 Campeão VIP' },
        { cliente_id: '#C-02', recencia_dias: 4, freq_compras: 18, monetario: 'R$ 3.400', segmento_crm: '🏆 Campeão VIP' },
        { cliente_id: '#C-03', recencia_dias: 45, freq_compras: 6, monetario: 'R$ 850', segmento_crm: '💎 Fiel' },
        { cliente_id: '#C-04', recencia_dias: 180, freq_compras: 12, monetario: 'R$ 2.100', segmento_crm: '⚠️ Em Risco' },
        { cliente_id: '#C-05', recencia_dias: 210, freq_compras: 1, monetario: 'R$ 95', segmento_crm: '💤 Hibernando' },
      ]
    },
    parameters: [
      { id: 'limiar_recencia', label: 'Corte de Recência VIP', type: 'slider', min: 7, max: 60, step: 7, defaultValue: 30, unit: 'dias', description: 'Dias máximos sem compra para manter status ativo' },
      { id: 'gasto_minimo_vip', label: 'Piso Monetário Campeões', type: 'slider', min: 1000, max: 5000, step: 500, defaultValue: 2500, unit: 'R$', description: 'LTV mínimo para cluster VIP' }
    ]
  },

  // 15. TESTE A/B & INFERÊNCIA ESTATÍSTICA
  {
    id: 'ab-testing',
    pillarId: 'distribuicao',
    pillarName: 'DISTRIBUIÇÃO ESTATÍSTICA',
    title: 'TESTE A/B & INFERÊNCIA ESTATÍSTICA',
    headerColor: 'bg-cyan-100 text-cyan-900 border-cyan-200',
    accentColor: 'cyan',
    shortDesc: 'Compara taxas de conversão de duas variantes com Teste T/Z, p-valor e intervalo de confiança.',
    metricsSummary: 'p-valor = 0.014 | +24% Lift',
    cardChartType: 'ab-test-distribution',
    codeSnippet: `# Teste de Hipótese para Taxa de Conversão (A/B Test)
import numpy as np
from scipy import stats

# Variante A (Controle) vs Variante B (Novo Layout)
visitantes_A, conversoes_A = 2500, 210  # 8.4%
visitantes_B, conversoes_B = 2500, 265  # 10.6%

p_A = conversoes_A / visitantes_A
p_B = conversoes_B / visitantes_B
lift = (p_B - p_A) / p_A * 100

# Teste Z de proporções com scipy.stats
p_pool = (conversoes_A + conversoes_B) / (visitantes_A + visitantes_B)
se = np.sqrt(p_pool * (1 - p_pool) * (1/visitantes_A + 1/visitantes_B))
z_score = (p_B - p_A) / se
p_valor = 2 * (1 - stats.norm.cdf(abs(z_score)))

significativo = p_valor < 0.05
print(f"Taxa A: {p_A*100:.2f}% | Taxa B: {p_B*100:.2f}% | Lift: +{lift:.1f}%")
print(f"Z-Score: {z_score:.2f} | P-Valor: {p_valor:.4f} (Estatisticamente Significativo: {significativo})")`,
    article: {
      title: 'Teste A/B: A Ciência Decidindo o Design de Produto',
      subtitle: 'Como saber se uma nova funcionalidade venceu de verdade ou foi apenas sorte.',
      bodyText: 'No marketing digital e desenvolvimento de software, opiniões do "chefe mais bem pago" (HiPPO) devem ser substituídas por testes controlados. O teste A/B divide o tráfego e usa intervalos de confiança para comprovar causalidade.',
      keyPoints: [
        'P-valor < 0.05: menos de 5% de chance da diferença observada ser puro acaso.',
        'Poder estatístico (1 - Beta): capacidade de detectar um efeito real sem falsos negativos.',
        'Evita lançar redesigns caros que na verdade diminuem a receita da empresa.'
      ],
      realWorldCase: 'Uma fintech aumentou a taxa de abertura de contas em 18% ao simplificar o formulário mobile após 14 dias de teste com 60 mil visitantes.'
    },
    datasetMini: {
      name: 'Resumo do Experimento A/B',
      columns: ['variante', 'trafego', 'conversoes', 'taxa_conversao', 'resultado'],
      rows: [
        { variante: 'Versão A (Controle)', trafego: 2500, conversoes: 210, taxa_conversao: '8.4%', resultado: 'Base Atual' },
        { variante: 'Versão B (Nova)', trafego: 2500, conversoes: 265, taxa_conversao: '10.6%', resultado: '🏆 Vencedor (+26%)' },
      ]
    },
    parameters: [
      { id: 'nivel_confianca', label: 'Nível de Confiança', type: 'select', defaultValue: '95', options: [{ label: '90% (Exploratório)', value: '90' }, { label: '95% (Padrão de Mercado)', value: '95' }, { label: '99% (Rigor Científico)', value: '99' }], description: 'Garante o rigor contra falsos positivos' },
      { id: 'tamanho_amostra', label: 'Tamanho da Amostra', type: 'slider', min: 1000, max: 10000, step: 1000, defaultValue: 2500, unit: 'users', description: 'Total de visitantes por variante' }
    ]
  },

  // 16. REGRESSÃO LOGÍSTICA & ODDS RATIO
  {
    id: 'regressao-logistica',
    pillarId: 'classificacao',
    pillarName: 'MODELAGEM & DIAGNÓSTICO',
    title: 'REGRESSÃO LOGÍSTICA & RISCO',
    headerColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    accentColor: 'indigo',
    shortDesc: 'Modela probabilidades sigmóides binárias de eventos como inadimplência, churn ou compra.',
    metricsSummary: 'Odds Ratio = 2.4x | Sigmóide',
    cardChartType: 'logistic-curve',
    codeSnippet: `# Regressão Logística & Cálculo de Probabilidade Sigmóide
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression

# Dataset de Score de Crédito vs Inadimplência (0 = Pagador, 1 = Default)
df = pd.DataFrame({
    'score_serasa': [420, 510, 580, 640, 710, 780, 850, 920],
    'renda_k': [2.8, 3.5, 4.2, 5.0, 7.5, 8.2, 12.0, 15.0],
    'inadimplente': [1, 1, 1, 0, 0, 0, 0, 0]
})

X = df[['score_serasa', 'renda_k']]
y = df['inadimplente']

modelo = LogisticRegression()
modelo.fit(X, y)

# Odds Ratio (Razão de Chances)
odds_ratio = np.exp(modelo.coef_[0])
print(f"Coeficientes: {modelo.coef_[0]}")
print(f"Odds Ratio do Score: {odds_ratio[0]:.4f}")`,
    article: {
      title: 'A Curva Sigmóide: Transformando Números em Chances Reais',
      subtitle: 'Como a regressão logística projeta probabilidades exatas entre 0% e 100%.',
      bodyText: 'Diferente da regressão linear comum, que pode prever valores absurdos como 130% ou -20%, a função logística comprime qualquer valor contínuo na curva em forma de "S", tornando-a a espinha dorsal de esteiras de crédito.',
      keyPoints: [
        'A saída do modelo é uma probabilidade calibrada de 0 a 1.',
        'Odds Ratio (OR): indica quantas vezes mais provável o evento se torna a cada unidade de acréscimo.',
        'Base para concessão de crédito, detecção de propensão de churn e lead scoring.'
      ],
      realWorldCase: 'Uma cooperativa de crédito calibrou a taxa de juros individual de acordo com a probabilidade logística de cada cliente, reduzindo a inadimplência em 29%.'
    },
    datasetMini: {
      name: 'Score de Risco de Crédito',
      columns: ['cliente', 'score', 'renda_k', 'prob_inadimplencia', 'decisao'],
      rows: [
        { cliente: 'Cliente #01', score: 420, renda_k: 'R$ 2.8k', prob_inadimplencia: '82%', decisao: '⛔ Recusado' },
        { cliente: 'Cliente #02', score: 580, renda_k: 'R$ 4.2k', prob_inadimplencia: '44%', decisao: '⚠️ Análise Manual' },
        { cliente: 'Cliente #03', score: 850, renda_k: 'R$ 12.0k', prob_inadimplencia: '4%', decisao: '✅ Aprovado VIP' },
      ]
    },
    parameters: [
      { id: 'corte_risco', label: 'Threshold de Aprovação', type: 'slider', min: 20, max: 70, step: 5, defaultValue: 40, unit: '%', description: 'Probabilidade máxima de risco tolerada pelo comitê' },
      { id: 'peso_score', label: 'Inclinação Sigmóide', type: 'slider', min: 1, max: 5, step: 1, defaultValue: 3, unit: 'k', description: 'Rigidez da curva de corte' }
    ]
  },

  // 17. ANÁLISE DE SOBREVIVÊNCIA (KAPLAN-MEIER)
  {
    id: 'analise-sobrevivencia',
    pillarId: 'preditiva',
    pillarName: 'ANÁLISE PREDITIVA',
    title: 'ANÁLISE DE SOBREVIVÊNCIA (KAPLAN-MEIER)',
    headerColor: 'bg-rose-100 text-rose-900 border-rose-200',
    accentColor: 'rose',
    shortDesc: 'Modela o tempo até a ocorrência de um evento (churn, falha de máquina) com dados censurados.',
    metricsSummary: 'Meia-Vida: 8.5 Meses',
    cardChartType: 'survival-curve',
    codeSnippet: `# Curva de Sobrevivência de Kaplan-Meier com Pandas
import pandas as pd
import numpy as np

# Tempo de permanência (meses) e status (1 = Churn, 0 = Censurado/Ativo)
df = pd.DataFrame({
    'tempo_meses': [1, 2, 3, 4, 6, 8, 12, 14, 18, 24],
    'evento_churn': [1, 1, 0, 1, 1, 0, 1, 0, 1, 0]
}).sort_values('tempo_meses')

# Cálculo da probabilidade acumulada de sobrevivência S(t)
total_em_risco = len(df)
df['em_risco'] = [total_em_risco - i for i in range(total_em_risco)]
df['taxa_sobrevivencia_passo'] = 1 - (df['evento_churn'] / df['em_risco'])
df['curva_kaplan_meier'] = df['taxa_sobrevivencia_passo'].cumprod() * 100

print(df[['tempo_meses', 'evento_churn', 'curva_kaplan_meier']])`,
    article: {
      title: 'Sobrevivência: Quanto Tempo Seu Cliente Fica Antes do Churn?',
      subtitle: 'Resolvendo o problema dos dados censurados em produtos de assinatura.',
      bodyText: 'Calcular a média de permanência de clientes que ainda estão na base é matematicamente errado, pois eles ainda não cancelaram (dados censurados). O estimador de Kaplan-Meier calcula a probabilidade acumulada de sobrevivência mês a mês.',
      keyPoints: [
        'Meia-vida do cliente: o mês exato onde 50% da safra já cancelou a assinatura.',
        'Identifica os "pontos críticos de desistência" (ex: fim do período de teste ou renovação anual).',
        'Permite projetar receitas de longo prazo sem subestimar a fidelidade.'
      ],
      realWorldCase: 'Um serviço de streaming detectou que 45% dos cancelamentos aconteciam exatamente no 3º mês, criando um benefício surpresa no 75º dia que salvou R$ 3,1 milhões de receita.'
    },
    datasetMini: {
      name: 'Sobrevivência por Mês',
      columns: ['mes_permanencia', 'em_risco', 'cancelamentos', 'sobrevivencia_pct'],
      rows: [
        { mes_permanencia: 'M1', em_risco: 1000, cancelamentos: 140, sobrevivencia_pct: '86.0%' },
        { mes_permanencia: 'M3', em_risco: 860, cancelamentos: 190, sobrevivencia_pct: '67.0%' },
        { mes_permanencia: 'M6', em_risco: 670, cancelamentos: 80, sobrevivencia_pct: '59.0%' },
        { mes_permanencia: 'M12', em_risco: 590, cancelamentos: 45, sobrevivencia_pct: '54.5%' },
      ]
    },
    parameters: [
      { id: 'fator_desgaste', label: 'Intensidade de Risco', type: 'slider', min: 5, max: 30, step: 5, defaultValue: 15, unit: '%', description: 'Taxa intrínseca de desistência inicial' },
      { id: 'horizonte_meses', label: 'Janela de Acompanhamento', type: 'slider', min: 12, max: 36, step: 6, defaultValue: 24, unit: 'meses', description: 'Meses projetados na curva de Kaplan-Meier' }
    ]
  },

  // 18. SUAVIZAÇÃO EXPONENCIAL (HOLT-WINTERS)
  {
    id: 'suavizacao-exponencial',
    pillarId: 'preditiva',
    pillarName: 'ANÁLISE PREDITIVA',
    title: 'SUAVIZAÇÃO EXPONENCIAL (HOLT-WINTERS)',
    headerColor: 'bg-sky-100 text-sky-900 border-sky-200',
    accentColor: 'sky',
    shortDesc: 'Projeção adaptativa ponderada por recência com componentes de nível, tendência e sazonalidade.',
    metricsSummary: 'Alpha: 0.35 | Beta: 0.20',
    cardChartType: 'holt-winters',
    codeSnippet: `# Suavização Exponencial Holt-Winters
import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing

# Série temporal de demanda diária
dados = [110, 118, 125, 142, 150, 165, 178, 190, 205, 220, 240, 255]
serie = pd.Series(dados)

# Ajuste com tendência aditiva e amortecimento
modelo = ExponentialSmoothing(
    serie, 
    trend='add', 
    seasonal=None, 
    damped_trend=True
).fit(smoothing_level=0.35, smoothing_trend=0.20)

projecao = modelo.forecast(steps=4)
print("Valores Históricos:", dados[-3:])
print("Projeção Próximos 4 Períodos:", projecao.round(1).tolist())`,
    article: {
      title: 'Holt-Winters: O Equilíbrio Perfeito entre Passado e Presente',
      subtitle: 'Por que dados de ontem importam mais que dados do ano passado.',
      bodyText: 'Médias móveis simples tratam o dado de 6 meses atrás com o mesmo peso do dado de hoje. A suavização exponencial aplica decaimento geométrico (Alpha), adaptando-se rapidamente a choques de demanda sem perder a tendência de fundo.',
      keyPoints: [
        'Alpha (Nível): velocidade de reação ao valor mais recente.',
        'Beta (Tendência): suaviza a aceleração de crescimento ou declínio.',
        'Gamma (Sazonalidade): captura ciclos repetitivos (ex: compras semanais).',
        'Amplamente utilizado em sistemas ERP de supply chain e previsão de inventário.'
      ],
      realWorldCase: 'Uma indústria de bebidas reduziu em 31% os custos de frete emergencial adotando modelos de Holt-Winters para abastecer seus 14 centros de distribuição.'
    },
    datasetMini: {
      name: 'Projeção de Abastecimento',
      columns: ['periodo', 'demanda_real', 'nivel_suavizado', 'previsao_holt'],
      rows: [
        { periodo: 'Semana 10', demanda_real: 220, nivel_suavizado: 218.4, previsao_holt: 221.0 },
        { periodo: 'Semana 11', demanda_real: 240, nivel_suavizado: 236.2, previsao_holt: 239.5 },
        { periodo: 'Semana 12', demanda_real: 255, nivel_suavizado: 251.0, previsao_holt: 256.0 },
        { periodo: 'Semana 13*', demanda_real: '-', nivel_suavizado: '-', previsao_holt: '272.4 (Prev)' },
      ]
    },
    parameters: [
      { id: 'alpha_peso', label: 'Peso Alpha (Recência)', type: 'slider', min: 0.1, max: 0.9, step: 0.05, defaultValue: 0.35, unit: '', description: 'Valores maiores reagem mais rápido a mudanças recentes' },
      { id: 'beta_tendencia', label: 'Peso Beta (Tendência)', type: 'slider', min: 0.05, max: 0.5, step: 0.05, defaultValue: 0.2, unit: '', description: 'Ajuste de inércia da reta de crescimento' }
    ]
  }
];
