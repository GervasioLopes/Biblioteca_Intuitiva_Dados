import { VisualAlgorithm } from './simple-algorithms';

export const EXTENDED_ALGORITHMS_PART2: VisualAlgorithm[] = [
  // 19. ANÁLISE DE FUNIL DE CONVERSÃO & DROP-OFF
  {
    id: 'funil-conversao',
    pillarId: 'comparacao',
    pillarName: 'COMPARAÇÃO CATEGÓRICA',
    title: 'ANÁLISE DE FUNIL & DROP-OFF',
    headerColor: 'bg-teal-100 text-teal-900 border-teal-200',
    accentColor: 'emerald',
    shortDesc: 'Quantifica as perdas de usuários etapa a etapa na jornada de produto ou e-commerce.',
    metricsSummary: 'Drop-off Crítico: 62% no Checkout',
    cardChartType: 'funnel-chart',
    codeSnippet: `# Análise de Funil e Taxas de Evasão (Drop-off)
import pandas as pd

etapas_funil = pd.DataFrame({
    'etapa': ['1. Visita Landing', '2. Cadastro/Login', '3. Adicionou Carrinho', '4. Checkout Iniciado', '5. Pagamento Concluído'],
    'usuarios': [10000, 3800, 1900, 720, 480]
})

# Conversão absoluta (base no topo) e conversão relativa (passo a passo)
etapas_funil['pct_topo'] = (etapas_funil['usuarios'] / etapas_funil['usuarios'].iloc[0]) * 100
etapas_funil['conversao_passo'] = (etapas_funil['usuarios'] / etapas_funil['usuarios'].shift(1)).fillna(1.0) * 100
etapas_funil['taxa_dropoff'] = 100 - etapas_funil['conversao_passo']

print(etapas_funil[['etapa', 'usuarios', 'pct_topo', 'taxa_dropoff']])`,
    article: {
      title: 'O Funil de Conversão: Onde Seus Clientes Estão Vazando?',
      subtitle: 'Diagnóstico cirúrgico de atrito em fluxos digitais de alta escala.',
      bodyText: 'Investir fortunas em anúncios e tráfego é inútil se o carrinho de compras ou formulário de cadastro tiver alta fricção. O funil decompõe cada transição para encontrar o exato botão ou campo que afasta clientes.',
      keyPoints: [
        'Drop-off acumulado vs. Drop-off marginal: onde está o maior vazamento financeiro.',
        'Permite testar hipóteses pontuais (ex: adicionar checkout transparente ou login via Google).',
        'Métrica número um de Product Managers e times de Growth.'
      ],
      realWorldCase: 'Um SaaS B2B removeu a obrigatoriedade de cartão de crédito no cadastro inicial e a conversão final do funil triplicou, gerando +R$ 1,8M no ano.'
    },
    datasetMini: {
      name: 'Métricas do Funil de Vendas',
      columns: ['etapa', 'visitantes', 'conversao_etapa', 'dropoff', 'alerta'],
      rows: [
        { etapa: 'Home / Landing', visitantes: 10000, conversao_etapa: '100%', dropoff: '0%', alerta: 'Normal' },
        { etapa: 'Cadastro', visitantes: 3800, conversao_etapa: '38.0%', dropoff: '62.0%', alerta: 'Atenção' },
        { etapa: 'Carrinho', visitantes: 1900, conversao_etapa: '50.0%', dropoff: '50.0%', alerta: 'Normal' },
        { etapa: 'Checkout', visitantes: 720, conversao_etapa: '37.9%', dropoff: '62.1%', alerta: '🚨 Gargalo Crítico' },
        { etapa: 'Compra Concluída', visitantes: 480, conversao_etapa: '66.7%', dropoff: '33.3%', alerta: 'Normal' },
      ]
    },
    parameters: [
      { id: 'friccao_cadastro', label: 'Fricção no Cadastro', type: 'slider', min: 30, max: 80, step: 5, defaultValue: 60, unit: '%', description: 'Taxa de abandono na criação de conta' },
      { id: 'abandono_carrinho', label: 'Abandono de Carrinho', type: 'slider', min: 20, max: 70, step: 5, defaultValue: 50, unit: '%', description: 'Usuários que desistem antes do frete' }
    ]
  },

  // 20. AUDITORIA DE QUALIDADE & COMPLETUDE DE DADOS
  {
    id: 'auditoria-qualidade-dados',
    pillarId: 'anomalias',
    pillarName: 'AUDITORIA & ANOMALIAS',
    title: 'AUDITORIA DE DADOS & COMPLETUDE',
    headerColor: 'bg-rose-100 text-rose-900 border-rose-200',
    accentColor: 'rose',
    shortDesc: 'Mapeia nulos, completude de colunas, cardinalidade e sanidade antes de treinar modelos.',
    metricsSummary: 'Completude Geral: 91.4%',
    cardChartType: 'data-quality-bars',
    codeSnippet: `# Profiling & Auditoria de Qualidade de Dados
import pandas as pd
import numpy as np

df_crm = pd.DataFrame({
    'nome': ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda'],
    'email': ['a@x.com', 'b@x.com', None, 'd@x.com', None, 'f@x.com'],
    'telefone': ['9999-1111', None, None, '9999-4444', None, None],
    'renda': [4500, np.nan, 8200, 3900, 11000, 5200],
    'idade': [28, 34, 19, -5, 42, 31]  # -5 é erro de integridade
})

# Matriz de Saúde dos Dados
audit = pd.DataFrame({
    'total_linhas': len(df_crm),
    'valores_nulos': df_crm.isna().sum(),
    'pct_nulos': (df_crm.isna().sum() / len(df_crm)) * 100,
    'cardinalidade_unica': df_crm.nunique(),
    'tipo_dado': df_crm.dtypes
})

print("Auditoria de Qualidade das Colunas:\n", audit)`,
    article: {
      title: 'Data Quality: Lixo Entra, Lixo Sai (GIGO)',
      subtitle: 'Por que 80% do trabalho do cientista de dados é limpar o dataset.',
      bodyText: 'Antes de aplicar algoritmos sofisticados, é obrigatório validar se os campos essenciais estão preenchidos e coerentes. Modelos alimentados com 40% de dados nulos ou idades negativas tomam decisões desastrosas.',
      keyPoints: [
        'Estratégias de Imputação: preencher pela média, mediana ou criar flag booleana de ausência.',
        'Regras de Integridade: validar limites físicos (ex: idade entre 0 e 120 anos).',
        'Economiza semanas de retrabalho antes de subir bases para produção.'
      ],
      realWorldCase: 'Uma seguradora evitou pagar R$ 600 mil em sinistros indevidos descobrindo que 12% dos cadastros tinham o campo de "veículo com sinistro prévio" nulo e não verificado.'
    },
    datasetMini: {
      name: 'Relatório de Sanidade de Atributos',
      columns: ['coluna', 'preenchimento', 'nulos_count', 'acao_sugerida'],
      rows: [
        { coluna: 'nome', preenchimento: '100%', nulos_count: 0, acao_sugerida: '✅ Pronto para uso' },
        { coluna: 'email', preenchimento: '66.7%', nulos_count: 2, acao_sugerida: '⚠️ Exigir validação no app' },
        { coluna: 'telefone', preenchimento: '33.3%', nulos_count: 4, acao_sugerida: '🔴 Campo crítico ausente' },
        { coluna: 'renda', preenchimento: '83.3%', nulos_count: 1, acao_sugerida: '🟡 Imputar pela mediana' },
      ]
    },
    parameters: [
      { id: 'tolerancia_nulos', label: 'Tolerância Máxima de Nulos', type: 'slider', min: 5, max: 40, step: 5, defaultValue: 20, unit: '%', description: 'Colunas com mais nulos que isso são descartadas' },
      { id: 'estrategia_imputacao', label: 'Estratégia de Tratamento', type: 'select', defaultValue: 'mediana', options: [{ label: 'Preencher com Mediana', value: 'mediana' }, { label: 'Descartar Linhas Incompletas', value: 'drop' }, { label: 'Flag Booleana', value: 'flag' }], description: 'Método para lidar com lacunas' }
    ]
  },

  // 21. MATRIZ DE CORRELAÇÃO MULTIVARIADA (HEATMAP)
  {
    id: 'correlacao-heatmap',
    pillarId: 'correlacao',
    pillarName: 'CORRELAÇÃO & RELAÇÕES',
    title: 'HEATMAP DE CORRELAÇÃO MULTIVARIADA',
    headerColor: 'bg-violet-100 text-violet-900 border-violet-200',
    accentColor: 'indigo',
    shortDesc: 'Mapeia a matriz de correlação cruzada entre 5+ variáveis contínuas com escala de calor.',
    metricsSummary: 'Matriz 5x5 | Pearson R',
    cardChartType: 'correlation-heatmap',
    codeSnippet: `# Matriz Cruzada de Correlação & Heatmap
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.DataFrame({
    'investimento_mkt': [10, 15, 20, 25, 30, 35],
    'cliques_site': [120, 180, 240, 310, 390, 480],
    'vendas_unidades': [45, 62, 85, 110, 135, 170],
    'reclamacoes_sac': [8, 12, 11, 15, 14, 18],
    'desconto_medio': [5.0, 5.5, 4.8, 6.2, 5.9, 7.1]
})

# Matriz de Correlação
corr_matrix = df.corr(method='pearson')

# Visualização com mapa de calor
plt.figure(figsize=(7, 5))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', vmin=-1, vmax=1, fmt='.2f')
plt.title("Matriz de Correlação Multivariada")
print(corr_matrix.round(2))`,
    article: {
      title: 'Heatmaps de Correlação: Visão Panorâmica do Negócio',
      subtitle: 'Detectando multicolinearidade e relacionamentos invisíveis na operação.',
      bodyText: 'Analisar variáveis isoladas duas a duas consome muito tempo. A matriz de correlação em heatmap resume instantaneamente centenas de pares em uma única grade visual com gradiente de cor azul (inversa) a vermelho (direta).',
      keyPoints: [
        'Multicolinearidade: variáveis com r > 0.90 medem a mesma coisa e devem ser resumidas.',
        'Correlações negativas: revelam trade-offs (ex: aumentar desconto diminui margem).',
        'Fundamental na fase inicial de Análise Exploratória de Dados (EDA).'
      ],
      realWorldCase: 'Uma rede hoteleira descobriu correlação de r = 0.88 entre o tempo de espera no check-in e avaliações negativas na internet, criando um totem de autoatendimento que zerou as filas.'
    },
    datasetMini: {
      name: 'Correlações do E-commerce',
      columns: ['variavel_x', 'variavel_y', 'coef_pearson', 'forca_relacao'],
      rows: [
        { variavel_x: 'Mkt Ads', variavel_y: 'Vendas', coef_pearson: '+0.96', forca_relacao: '🔥 Fortíssima Direta' },
        { variavel_x: 'Cliques', variavel_y: 'Vendas', coef_pearson: '+0.92', forca_relacao: '🔥 Muito Forte' },
        { variavel_x: 'Desconto', variavel_y: 'Margem', coef_pearson: '-0.74', forca_relacao: '❄️ Inversa Forte' },
        { variavel_x: 'Reclamações', variavel_y: 'Mkt Ads', coef_pearson: '+0.21', forca_relacao: '⚪ Quase Nula' },
      ]
    },
    parameters: [
      { id: 'limiar_destaque', label: 'Corte de Destaque (|r|)', type: 'slider', min: 0.4, max: 0.9, step: 0.05, defaultValue: 0.7, unit: '', description: 'Realça apenas correlações fortes' },
      { id: 'paleta_calor', label: 'Esquema de Cores', type: 'select', defaultValue: 'coolwarm', options: [{ label: 'Azul e Vermelho (Divergente)', value: 'coolwarm' }, { label: 'Verde e Roxo', value: 'viridis' }], description: 'Contraste cromático' }
    ]
  },

  // 22. MARKET BASKET ANALYSIS (ALGORITMO APRIORI)
  {
    id: 'analise-cesta-compras',
    pillarId: 'correlacao',
    pillarName: 'CORRELAÇÃO & RELAÇÕES',
    title: 'ANÁLISE DE CESTA (APRIORI & LIFT)',
    headerColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    accentColor: 'emerald',
    shortDesc: 'Descobre regras de associação entre produtos comprados juntos (Suporte, Confiança e Lift).',
    metricsSummary: 'Lift = 3.2x | Pão ➔ Manteiga',
    cardChartType: 'market-basket',
    codeSnippet: `# Regras de Associação e Análise de Cesta de Compras
import pandas as pd
from itertools import combinations

# Transações de compras no supermercado
pedidos = [
    ['Pão', 'Manteiga', 'Café'],
    ['Pão', 'Manteiga'],
    ['Cerveja', 'Amendoim'],
    ['Pão', 'Café', 'Leite'],
    ['Cerveja', 'Amendoim', 'Carvão'],
    ['Pão', 'Manteiga', 'Café', 'Leite']
]

# Regra: Se comprou Pão -> Compra Manteiga?
# Suporte: Frequência conjunta / Total de pedidos
# Confiança: Compras conjuntas / Compras de Pão
# Lift: Confiança / Probabilidade aleatória de Manteiga
print("Análise de Cesta: Identificação de Cross-Selling com Lift > 1.0")`,
    article: {
      title: 'Market Basket: A Famosa Associação de Fraldas e Cerveja',
      subtitle: 'Como sugerir o próximo item exato na página de checkout.',
      bodyText: 'O algoritmo Apriori vasculha milhões de notas fiscais para achar produtos que aparecem juntos com frequência muito maior que o mero acaso. O indicador Lift mede o ganho de probabilidade dessa recomendação.',
      keyPoints: [
        'Suporte: percentual de carrinhos que contêm a combinação (relevância de volume).',
        'Confiança: probabilidade de levar o produto B dado que já colocou o A no carrinho.',
        'Lift > 1.0: associação positiva real (Lift = 3.0 significa 3x mais chance de compra conjunta).'
      ],
      realWorldCase: 'Uma rede de farmácias colocou protetor solar ao lado de hidratantes labiais no verão e teve alta de 35% nas vendas combinadas de balcão.'
    },
    datasetMini: {
      name: 'Regras de Associação Descobertas',
      columns: ['item_base', 'item_sugerido', 'suporte', 'confianca', 'lift'],
      rows: [
        { item_base: 'Café Moído', item_sugerido: 'Filtro de Papel', suporte: '14.2%', confianca: '82%', lift: '4.1x' },
        { item_base: 'Pão de Forma', item_sugerido: 'Manteiga', suporte: '22.0%', confianca: '75%', lift: '2.8x' },
        { item_base: 'Vinho Tinto', item_sugerido: 'Queijo Brie', suporte: '8.5%', confianca: '64%', lift: '3.5x' },
        { item_base: 'Smartphone', item_sugerido: 'Película Protetora', suporte: '31.0%', confianca: '88%', lift: '5.2x' },
      ]
    },
    parameters: [
      { id: 'suporte_minimo', label: 'Suporte Mínimo', type: 'slider', min: 5, max: 30, step: 5, defaultValue: 10, unit: '%', description: 'Filtra combinações que aparecem raramente' },
      { id: 'lift_minimo', label: 'Corte de Lift Mínimo', type: 'slider', min: 1.2, max: 4.0, step: 0.2, defaultValue: 2.0, unit: 'x', description: 'Garante que a associação é genuinamente forte' }
    ]
  },

  // 23. CURVA ROC & AUC (ÁREA SOB A CURVA)
  {
    id: 'curva-roc-auc',
    pillarId: 'classificacao',
    pillarName: 'MODELAGEM & DIAGNÓSTICO',
    title: 'CURVA ROC & AUC (DISCRIMINAÇÃO)',
    headerColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    accentColor: 'indigo',
    shortDesc: 'Avalia a capacidade de separação do classificador cruzando Taxa de Verdadeiros vs Falsos Positivos.',
    metricsSummary: 'AUC = 0.89 | Excelente',
    cardChartType: 'roc-curve',
    codeSnippet: `# Curva ROC e Métrica AUC com Scikit-Learn
import numpy as np
from sklearn.metrics import roc_curve, roc_auc_score

# Rótulos reais e probabilidades estimadas pelo modelo
y_true = np.array([0, 0, 1, 0, 1, 1, 0, 1, 1, 1])
y_scores = np.array([0.1, 0.2, 0.4, 0.35, 0.8, 0.7, 0.3, 0.9, 0.85, 0.95])

# Cálculo da curva ROC e AUC
fpr, tpr, thresholds = roc_curve(y_true, y_scores)
auc = roc_auc_score(y_true, y_scores)

print(f"Área sob a Curva (AUC): {auc:.3f}")
print("Classificação: Excelente capacidade de discriminação")`,
    article: {
      title: 'ROC e AUC: A Métrica Suprema de Classificação',
      subtitle: 'Como comparar dois modelos sem depender de um threshold arbitrário de 50%.',
      bodyText: 'A acurácia tradicional depende de onde você posiciona o corte de decisão. A curva ROC (Receiver Operating Characteristic) testa todos os possíveis pontos de corte de 0 a 1 e mede a área total (AUC).',
      keyPoints: [
        'AUC = 0.50: modelo inútil equivalente a jogar uma moeda para cima.',
        'AUC entre 0.80 e 0.90: excelente capacidade preditiva em condições reais.',
        'Permite à diretoria de risco escolher o ponto ideal entre perder vendas ou barrar fraudes.'
      ],
      realWorldCase: 'Um antifraude trocou seu modelo baseado em árvores simples por um Gradient Boosting com AUC de 0.92, reduzindo revisões manuais em 42%.'
    },
    datasetMini: {
      name: 'Trade-off da Curva ROC',
      columns: ['ponto_corte', 'taxa_verdadeiro_positivo', 'taxa_falso_positivo', 'especificidade'],
      rows: [
        { ponto_corte: '0.20 (Agressivo)', taxa_verdadeiro_positivo: '98%', taxa_falso_positivo: '32%', especificidade: '68%' },
        { ponto_corte: '0.50 (Equilibrado)', taxa_verdadeiro_positivo: '89%', taxa_falso_positivo: '11%', especificidade: '89%' },
        { ponto_corte: '0.80 (Conservador)', taxa_verdadeiro_positivo: '62%', taxa_falso_positivo: '2%', especificidade: '98%' },
      ]
    },
    parameters: [
      { id: 'auc_calibrada', label: 'Poder do Modelo (AUC)', type: 'slider', min: 0.6, max: 0.98, step: 0.02, defaultValue: 0.89, unit: '', description: 'Área sob a curva do classificador' },
      { id: 'threshold_operacional', label: 'Corte Operacional', type: 'slider', min: 0.2, max: 0.8, step: 0.05, defaultValue: 0.5, unit: '', description: 'Ponto fixado na esteira de produção' }
    ]
  },

  // 24. SIMULAÇÃO DE MONTE CARLO & ANÁLISE DE RISCO
  {
    id: 'simulacao-monte-carlo',
    pillarId: 'preditiva',
    pillarName: 'ANÁLISE PREDITIVA',
    title: 'SIMULAÇÃO DE MONTE CARLO (RISCO)',
    headerColor: 'bg-purple-100 text-purple-900 border-purple-200',
    accentColor: 'indigo',
    shortDesc: 'Gera 10.000 cenários aleatórios para calcular Value at Risk (VaR) e probabilidade de prejuízo.',
    metricsSummary: '10k Iterações | VaR 95%: R$ 38k',
    cardChartType: 'monte-carlo',
    codeSnippet: `# Simulação de Monte Carlo para Projeção Financeira
import numpy as np
import pandas as pd

# Simulação de Faturamento com incerteza na demanda e nos custos
np.random.seed(42)
N_CENARIOS = 10000

# Distribuições com variabilidade esperada
demanda_unidades = np.random.normal(loc=1200, scale=180, size=N_CENARIOS)
preco_medio = np.random.uniform(low=85, high=110, size=N_CENARIOS)
custo_variavel = np.random.normal(loc=48, scale=6, size=N_CENARIOS)
custo_fixo = 45000

lucro_simulado = (demanda_unidades * (preco_medio - custo_variavel)) - custo_fixo

# Métricas de Risco (VaR 95% e probabilidade de prejuízo)
prob_prejuizo = (lucro_simulado < 0).mean() * 100
var_95 = np.percentile(lucro_simulado, 5)

print(f"Lucro Esperado Médio: R$ {lucro_simulado.mean():,.2f}")
print(f"Pior Cenário (5% Pior / VaR 95%): R$ {var_95:,.2f}")
print(f"Probabilidade de Prejuízo: {prob_prejuizo:.2f}%")`,
    article: {
      title: 'Monte Carlo: Tomando Decisões Quando o Futuro é Incerto',
      subtitle: 'Por que trabalhar com uma única meta estática é perigoso para o conselho.',
      bodyText: 'Planilhas financeiras tradicionais costumam projetar um único cenário ideal. O método de Monte Carlo simula milhares de futuros paralelos combinando incertezas de vendas, custos e taxas de câmbio para quantificar o risco real de insolvência.',
      keyPoints: [
        'Value at Risk (VaR): quanto a empresa pode perder no pior cenário de 5% de probabilidade.',
        'Muda a conversa executiva de "vamos faturar X" para "temos 88% de certeza de superar X".',
        'Imprescindível em valuation de startups, fusões (M&A) e tesouraria corporativa.'
      ],
      realWorldCase: 'Uma mineradora avaliou o risco de construir uma nova planta e descobriu que havia 22% de risco de retorno negativo caso o dólar caísse abaixo de R$ 4,90, realizando hedge cambial prévio.'
    },
    datasetMini: {
      name: 'Distribuição dos 10.000 Cenários',
      columns: ['percentil', 'cenario', 'lucro_projetado', 'probabilidade'],
      rows: [
        { percentil: 'P5 (Pessimista)', cenario: 'Cenário Severo (VaR 95%)', lucro_projetado: '-R$ 12.400', probabilidade: '5%' },
        { percentil: 'P25', cenario: 'Cenário Conservador', lucro_projetado: '+R$ 18.200', probabilidade: '25%' },
        { percentil: 'P50 (Mediana)', cenario: 'Cenário Mais Provável', lucro_projetado: '+R$ 34.500', probabilidade: '50%' },
        { percentil: 'P90 (Otimista)', cenario: 'Cenário Expansivo', lucro_projetado: '+R$ 58.900', probabilidade: '10%' },
      ]
    },
    parameters: [
      { id: 'volatilidade_mercado', label: 'Volatilidade do Mercado', type: 'slider', min: 10, max: 40, step: 5, defaultValue: 20, unit: '%', description: 'Dispersão de incerteza em torno da média' },
      { id: 'confianca_var', label: 'Nível de Risco VaR', type: 'select', defaultValue: '95', options: [{ label: '90% (P10)', value: '90' }, { label: '95% (P5 Padrão)', value: '95' }, { label: '99% (P1 Crítico)', value: '99' }], description: 'Percentil de tolerância à ruína' }
    ]
  }
];
