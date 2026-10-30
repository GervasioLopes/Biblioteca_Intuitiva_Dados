import { VisualAlgorithm } from '../data/simple-algorithms';

export interface ExecutionResult {
  stdout: string;
  executionTimeMs: number;
  memoryUsedKb: number;
  status: 'success' | 'warning' | 'error';
  summaryMetrics: { label: string; value: string; color?: string }[];
}

/**
 * Returns dynamic Python code with current parameter values interpolated
 */
export function getDynamicPythonCode(algorithm: VisualAlgorithm, params: Record<string, any>): string {
  const p = params;
  const id = algorithm.id;

  // 1. ANÁLISE DE TENDÊNCIA
  if (id === 'analise-tendencia') {
    const sens = Number(p['sensibilidade'] ?? 10);
    const horiz = Number(p['horizonte'] ?? 3);
    const slope = (13.2 * (1 + sens / 100)).toFixed(2);
    return `# Regressão Linear com Parâmetros Dinâmicos
import pandas as pd
import numpy as np

# 1. Dataset Histórico de Faturamento (R$ Mil)
df = pd.DataFrame({
    'mes': np.arange(1, 9),
    'vendas_k': [52, 58, 68, 88, 95, 110, 128, 145]
})

# 2. Ajuste OLS Dinâmico (Sensibilidade: +${sens}%)
slope_ajustado = ${slope}  # Taxa marginal calculada
intercepto = 38.4

# 3. Projeção para Horizonte de ${horiz} meses
meses_futuros = np.arange(9, 9 + ${horiz})
projecao = intercepto + slope_ajustado * meses_futuros

for m, val in zip(meses_futuros, projecao):
    print(f"Mês {m}: Projeção = R$ {val:.1f}k")

r2 = np.corrcoef(df['mes'], df['vendas_k'])[0, 1] ** 2
print(f"\\nCoeficiente R² = {r2:.3f} | Crescimento Médio Mensal: +{slope_ajustado}k")`;
  }

  // 2. PREVISÃO DE VENDAS
  if (id === 'previsao-vendas') {
    const cresc = Number(p['crescimento'] ?? 15);
    const sazonal = Number(p['fator_sazonal'] ?? 1.1);
    return `# Média Móvel & Projeção Sazonal
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'mes': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    'demanda': [420, 480, 560, 610, 690, 750]
})

# 1. Média Móvel Centralizada (Janela = 3)
df['media_movel_3m'] = df['demanda'].rolling(window=3).mean()

# 2. Fatores Dinâmicos: Crescimento = ${cresc}% | Sazonalidade = ${sazonal}x
taxa_crescimento = 1 + (${cresc} / 100)
fator_sazonal = ${sazonal}

ultima_demanda = df['demanda'].iloc[-1]
demanda_julho = ultima_demanda * taxa_crescimento * (fator_sazonal / 1.1)
demanda_agosto = demanda_julho * 1.05

print(f"Demanda Histórica Recente: {ultima_demanda} un")
print(f"Projeção Julho: {demanda_julho:.0f} un (+{${cresc}}% com sazonalidade {fator_sazonal}x)")
print(f"Projeção Agosto: {demanda_agosto:.0f} un")`;
  }

  // 3. DETECÇÃO DE ANOMALIAS
  if (id === 'deteccao-anomalias') {
    const limiarZ = Number(p['limiar_z'] ?? 2.0);
    const filtroValor = Number(p['filtro_valor'] ?? 1000);
    return `# Detecção Vetorizada de Anomalias com Z-Score
import pandas as pd
import numpy as np

# 1. Transações Bancárias / Auditoria
df = pd.DataFrame({
    'transacao_id': [101, 102, 103, 104, 105, 106],
    'valor_reais': [120, 115, 140, 1280, 135, 1850]
})

# 2. Cálculo dos Parâmetros Estatísticos
media = df['valor_reais'].mean()
desvio_padrao = df['valor_reais'].std()

# 3. Z-Score Vetorizado
df['z_score'] = (df['valor_reais'] - media) / desvio_padrao

# 4. Filtro com Limiar Z = ${limiarZ} e Valor Mínimo = R$ ${filtroValor}
LIMIAR_Z = ${limiarZ}
df['is_anomalia'] = (df['z_score'].abs() >= LIMIAR_Z) & (df['valor_reais'] >= ${filtroValor})

anomalias = df[df['is_anomalia']]
print(f"Média: R$ {media:.2f} | Desvio: R$ {desvio_padrao:.2f}")
print(f"Total de Anomalias Detectadas (|Z| >= {LIMIAR_Z}): {len(anomalias)}")
print(anomalias[['transacao_id', 'valor_reais', 'z_score']])`;
  }

  // 13. BOXPLOT & TUKEY IQR
  if (id === 'boxplot-tukey') {
    const fator = Number(p['fator_iqr'] ?? 1.5);
    const assimetria = Number(p['corte_assimetria'] ?? 15);
    return `# Boxplot & Detecção por Intervalo Interquartil (IQR)
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'ticket': [120, 140, 150, 165, 180, 195, 210, 225, 240, 260, 290, 850, 920]
})

# 1. Quartis Q1 (25%), Mediana (50%) e Q3 (75%)
q1 = df['ticket'].quantile(0.25)
mediana = df['ticket'].median()
q3 = df['ticket'].quantile(0.75)
iqr = q3 - q1

# 2. Cercas de Tukey com Multiplicador Dinâmico: ${fator}x IQR
fator_tukey = ${fator}
limite_inferior = max(0, q1 - fator_tukey * iqr)
limite_superior = q3 + fator_tukey * iqr

# 3. Identificação de Outliers
outliers = df[(df['ticket'] < limite_inferior) | (df['ticket'] > limite_superior)]

print(f"Q1 (25%): R$ {q1:.1f} | Mediana: R$ {mediana:.1f} | Q3 (75%): R$ {q3:.1f}")
print(f"IQR: R$ {iqr:.1f} | Cerca Superior ({fator_tukey}x): R$ {limite_superior:.1f}")
print(f"Outliers Identificados: {len(outliers)} pedidos acima de R$ {limite_superior:.1f}")`;
  }

  // 14. SEGMENTAÇÃO RFM
  if (id === 'rfm-segmentacao') {
    const recenciaCorte = Number(p['limiar_recencia'] ?? 30);
    const gastoVip = Number(p['gasto_minimo_vip'] ?? 2500);
    return `# Segmentação RFM Dinâmica para CRM
import pandas as pd

df = pd.DataFrame({
    'cliente_id': ['#C-01', '#C-02', '#C-03', '#C-04', '#C-05'],
    'recencia_dias': [2, 4, 45, 180, 210],
    'compras_total': [22, 18, 6, 12, 1],
    'gasto_total_reais': [4900, 3400, 850, 2100, 95]
})

# Regras Dinâmicas de Segmentação
LIMIAR_RECENCIA = ${recenciaCorte}  # Dias máximos para cliente ativo
PISO_GASTO_VIP = ${gastoVip}      # Valor mínimo para cluster VIP

def classificar_cliente(row):
    if row['recencia_dias'] <= LIMIAR_RECENCIA and row['gasto_total_reais'] >= PISO_GASTO_VIP:
        return '🏆 Campeão VIP'
    elif row['recencia_dias'] <= LIMIAR_RECENCIA * 2:
        return '💎 Cliente Fiel'
    elif row['recencia_dias'] > 90 and row['gasto_total_reais'] >= 1000:
        return '⚠️ Em Risco de Churn'
    else:
        return '💤 Hibernando'

df['segmento'] = df.apply(classificar_cliente, axis=1)
print(df[['cliente_id', 'recencia_dias', 'gasto_total_reais', 'segmento']])
print("\\nContagem por Segmento:\\n", df['segmento'].value_counts())`;
  }

  // 15. TESTE A/B
  if (id === 'ab-testing') {
    const amostra = Number(p['tamanho_amostra'] ?? 2500);
    const conf = Number(p['nivel_confianca'] ?? 95);
    return `# Teste de Hipótese Z de Proporções (A/B Test)
import numpy as np
from scipy import stats

visitantes = ${amostra}
# Taxas observadas no teste
conv_A = int(visitantes * 0.084)  # Controle: 8.4%
conv_B = int(visitantes * 0.106)  # Nova Versão: 10.6%

p_A = conv_A / visitantes
p_B = conv_B / visitantes
lift_percentual = ((p_B - p_A) / p_A) * 100

# Cálculo do Teste Z
p_pool = (conv_A + conv_B) / (2 * visitantes)
se = np.sqrt(p_pool * (1 - p_pool) * (2 / visitantes))
z_score = (p_B - p_A) / se
p_valor = 2 * (1 - stats.norm.cdf(abs(z_score)))

nivel_confianca = ${conf} / 100
alfa = 1 - nivel_confianca
significativo = p_valor < alfa

print(f"Amostra por Variante: {visitantes:,} visitantes")
print(f"Taxa A: {p_A*100:.2f}% | Taxa B: {p_B*100:.2f}% | Lift: +{lift_percentual:.1f}%")
print(f"Z-Score: {z_score:.3f} | P-Valor: {p_valor:.4f}")
print(f"Conclusão (Confiança {nivel_confianca*100:.0f}%): {'ESTATISTICAMENTE SIGNIFICATIVO (Adotar B)' if significativo else 'SEM SIGNIFICÂNCIA'}")`;
  }

  // 16. REGRESSÃO LOGÍSTICA
  if (id === 'regressao-logistica') {
    const corte = Number(p['corte_risco'] ?? 40);
    const peso = Number(p['peso_score'] ?? 3);
    return `# Regressão Logística & Limiar de Decisão de Crédito
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression

df = pd.DataFrame({
    'cliente': ['C1', 'C2', 'C3', 'C4', 'C5'],
    'score_credito': [420, 580, 640, 750, 850],
    'renda_k': [2.8, 4.2, 5.0, 7.5, 12.0],
    'inadimplente_historico': [1, 1, 0, 0, 0]
})

# Threshold Operacional Definido: ${corte}%
LIMIAR_CORTE = ${corte} / 100

# Função Sigmóide calibrada com peso k=${peso}
def predizer_probabilidade(score):
    z = (score - 600) / (250 / ${peso})
    return 1 / (1 + np.exp(z))  # Risco de default

df['prob_inadimplencia'] = df['score_credito'].apply(predizer_probabilidade)
df['decisao'] = np.where(df['prob_inadimplencia'] <= LIMIAR_CORTE, '✅ APROVADO', '⛔ RECUSADO')

print(f"Threshold Operacional de Risco: {LIMIAR_CORTE*100:.0f}%")
print(df[['cliente', 'score_credito', 'prob_inadimplencia', 'decisao']])`;
  }

  // 17. ANÁLISE DE SOBREVIVÊNCIA
  if (id === 'analise-sobrevivencia') {
    const desgaste = Number(p['fator_desgaste'] ?? 15);
    const meses = Number(p['horizonte_meses'] ?? 24);
    return `# Estimador de Kaplan-Meier para Retenção de Assinaturas
import pandas as pd
import numpy as np

meses_horizonte = ${meses}
taxa_desgaste_base = ${desgaste} / 100

# Projeção da Função S(t) de Sobrevivência
safra_inicial = 1000
tempos = [1, 3, 6, 12, ${meses}]

sobreviventes = safra_inicial
print(f"Safra Inicial: {safra_inicial} assinantes | Desgaste Inicial: {${desgaste}}%\\n")
print(f"{'Mês':<6} | {'Em Risco':<10} | {'Sobrevivência S(t)':<20} | {'Status'}")
print("-" * 50)

for m in tempos:
    prob_retencao = np.exp(-taxa_desgaste_base * (m ** 0.65))
    ativos = int(safra_inicial * prob_retencao)
    print(f"M{m:<5} | {ativos:<10} | {prob_retencao*100:.1f}%{'':<14} | Ativo")

meia_vida_meses = (-np.log(0.5) / taxa_desgaste_base) ** (1 / 0.65)
print(f"\\nMeia-Vida Estimada (50% da base retida): {meia_vida_meses:.1f} meses")`;
  }

  // 18. SUAVIZAÇÃO EXPONENCIAL
  if (id === 'suavizacao-exponencial') {
    const alpha = Number(p['alpha_peso'] ?? 0.35);
    const beta = Number(p['beta_tendencia'] ?? 0.20);
    return `# Suavização Exponencial Dupla de Holt (Nível + Tendência)
import pandas as pd
import numpy as np

serie_historica = [110, 118, 125, 142, 150, 165, 178, 190, 205, 220, 240, 255]

# Parâmetros Dinâmicos
ALPHA = ${alpha}  # Peso de Nível (Recência)
BETA = ${beta}   # Peso de Tendência (Inércia)

nivel = serie_historica[0]
tendencia = serie_historica[1] - serie_historica[0]

for y in serie_historica:
    ultimo_nivel = nivel
    nivel = ALPHA * y + (1 - ALPHA) * (ultimo_nivel + tendencia)
    tendencia = BETA * (nivel - ultimo_nivel) + (1 - BETA) * tendencia

# Projeção dos Próximos 3 Períodos
previsoes = [nivel + (h + 1) * tendencia for h in range(3)]

print(f"Parâmetros: Alpha = {ALPHA} | Beta = {BETA}")
print(f"Último Nível Estimado: {nivel:.1f} | Tendência por Período: +{tendencia:.2f}")
print("Previsão t+1:", round(previsoes[0], 1))
print("Previsão t+2:", round(previsoes[1], 1))
print("Previsão t+3:", round(previsoes[2], 1))`;
  }

  // 19. FUNIL DE CONVERSÃO
  if (id === 'funil-conversao') {
    const friccao = Number(p['friccao_cadastro'] ?? 60);
    const abandono = Number(p['abandono_carrinho'] ?? 50);
    return `# Análise de Funil de Conversão & Taxas de Drop-off
import pandas as pd

visitas = 10000
friccao_cadastro = ${friccao} / 100
abandono_carrinho = ${abandono} / 100

cadastros = int(visitas * (1 - friccao_cadastro))
carrinhos = int(cadastros * 0.50)
checkouts = int(carrinhos * (1 - abandono_carrinho))
compras = int(checkouts * 0.67)

funil = pd.DataFrame({
    'etapa': ['1. Visitas', '2. Cadastros', '3. Carrinhos', '4. Checkout', '5. Compras'],
    'usuarios': [visitas, cadastros, carrinhos, checkouts, compras]
})

funil['taxa_absoluta'] = (funil['usuarios'] / visitas) * 100
funil['taxa_conversao_passo'] = (funil['usuarios'] / funil['usuarios'].shift(1)).fillna(1.0) * 100
funil['dropoff_pct'] = 100 - funil['taxa_conversao_passo']

print(funil[['etapa', 'usuarios', 'taxa_absoluta', 'dropoff_pct']])
print(f"\\nConversão Geral do Topo ao Fundo: {funil['taxa_absoluta'].iloc[-1]:.2f}%")`;
  }

  // 20. AUDITORIA DE QUALIDADE
  if (id === 'auditoria-qualidade-dados') {
    const tolerancia = Number(p['tolerancia_nulos'] ?? 20);
    const estrategia = String(p['estrategia_imputacao'] ?? 'mediana');
    return `# Profiling de Qualidade e Limpeza de Dados
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'nome': ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo'],
    'email': ['a@x.com', 'b@x.com', None, 'd@x.com', None],
    'telefone': ['9999-1111', None, None, '9999-4444', None],
    'renda': [4500, np.nan, 8200, 3900, 11000]
})

TOLERANCIA_MAX_NULOS = ${tolerancia}  # ${tolerancia}%
ESTRATEGIA = '${estrategia}'

relatorio = pd.DataFrame({
    'total_linhas': len(df),
    'nulos': df.isna().sum(),
    'pct_nulos': (df.isna().sum() / len(df)) * 100
})

relatorio['decisao'] = np.where(
    relatorio['pct_nulos'] > TOLERANCIA_MAX_NULOS,
    '🔴 DESCARTAR COLUNA',
    f'🟡 APLICAR {ESTRATEGIA.upper()}'
)
relatorio.loc[relatorio['nulos'] == 0, 'decisao'] = '✅ APROVADA'

print(f"Critério de Qualidade: Tolerância Máxima = {TOLERANCIA_MAX_NULOS}% de Nulos")
print(relatorio[['nulos', 'pct_nulos', 'decisao']])`;
  }

  // 21. CORRELAÇÃO HEATMAP
  if (id === 'correlacao-heatmap') {
    const limiar = Number(p['limiar_destaque'] ?? 0.7);
    return `# Matriz de Correlação Multivariada de Pearson
import pandas as pd
import numpy as np

# Dataset Multivariado de Vendas e Marketing
df = pd.DataFrame({
    'mkt_ads': [10, 15, 20, 25, 30, 35],
    'cliques': [120, 180, 240, 310, 390, 480],
    'vendas': [45, 62, 85, 110, 135, 170],
    'desconto': [5.0, 5.5, 4.8, 6.2, 5.9, 7.1]
})

matriz_corr = df.corr(method='pearson').round(2)
LIMIAR_CORTE = ${limiar}

print("Matriz de Correlação Completa (Pearson):")
print(matriz_corr)

print(f"\\nPares com Forte Associação (|r| >= {LIMIAR_CORTE}):")
for c1 in df.columns:
    for c2 in df.columns:
        if c1 < c2 and abs(matriz_corr.loc[c1, c2]) >= LIMIAR_CORTE:
            print(f"• {c1} <-> {c2}: r = {matriz_corr.loc[c1, c2]:+.2f}")`;
  }

  // 22. MARKET BASKET (APRIORI)
  if (id === 'analise-cesta-compras') {
    const supMin = Number(p['suporte_minimo'] ?? 10);
    const liftMin = Number(p['lift_minimo'] ?? 2.0);
    return `# Algoritmo Apriori & Regras de Associação Cross-Sell
import pandas as pd

# Transações de Supermercado
regras = pd.DataFrame([
    {'item_A': 'Café Moído', 'item_B': 'Filtro de Papel', 'suporte': 14.2, 'confianca': 82, 'lift': 4.1},
    {'item_A': 'Pão de Forma', 'item_B': 'Manteiga', 'suporte': 22.0, 'confianca': 75, 'lift': 2.8},
    {'item_A': 'Vinho Tinto', 'item_B': 'Queijo Brie', 'suporte': 8.5, 'confianca': 64, 'lift': 3.5},
    {'item_A': 'Smartphone', 'item_B': 'Película Protetora', 'suporte': 31.0, 'confianca': 88, 'lift': 5.2}
])

SUPORTE_MIN = ${supMin}  # ${supMin}%
LIFT_MIN = ${liftMin}     # ${liftMin}x

regras_ativas = regras[(regras['suporte'] >= SUPORTE_MIN) & (regras['lift'] >= LIFT_MIN)]

print(f"Filtros de Associação: Suporte >= {SUPORTE_MIN}% | Lift >= {LIFT_MIN}x")
print(f"Total de Regras de Cross-Selling Válidas: {len(regras_ativas)}\\n")
for _, r in regras_ativas.iterrows():
    print(f"👉 Se comprou [{r['item_A']}] => Recomendar [{r['item_B']}]")
    print(f"   Suporte: {r['suporte']}% | Confiança: {r['confianca']}% | Lift: {r['lift']}x\\n")`;
  }

  // 23. CURVA ROC & AUC
  if (id === 'curva-roc-auc') {
    const auc = Number(p['auc_calibrada'] ?? 0.89);
    const thresh = Number(p['threshold_operacional'] ?? 0.5);
    return `# Análise de Discriminação por Curva ROC & AUC
import numpy as np
from sklearn.metrics import roc_auc_score

AUC_ALVO = ${auc}
CORTE_OPERACIONAL = ${thresh}

# Estimativas de Sensibilidade (TPR) e Taxa de Falsos Positivos (FPR)
tpr = min(0.99, max(0.50, AUC_ALVO + (1 - CORTE_OPERACIONAL) * 0.2))
fpr = max(0.01, min(0.50, (1 - AUC_ALVO) + (1 - CORTE_OPERACIONAL) * 0.15))

print(f"Área sob a Curva ROC (AUC): {AUC_ALVO:.2f} (Excelente poder de discriminação)")
print(f"Threshold Operacional Definido: {CORTE_OPERACIONAL:.2f}")
print(f"• Taxa de Verdadeiros Positivos (Sensibilidade/Recall): {tpr*100:.1f}%")
print(f"• Taxa de Falsos Positivos (FPR): {fpr*100:.1f}%")
print(f"• Especificidade (1 - FPR): {(1 - fpr)*100:.1f}%")`;
  }

  // 24. MONTE CARLO
  if (id === 'simulacao-monte-carlo') {
    const vol = Number(p['volatilidade_mercado'] ?? 20);
    const confVar = Number(p['confianca_var'] ?? 95);
    return `# Simulação de Monte Carlo & Value at Risk (VaR)
import numpy as np

np.random.seed(42)
N_ITERACOES = 10000

# Distribuição Estocástica de Demanda com Volatilidade = ${vol}%
volatilidade = ${vol} / 100
demanda = np.random.normal(loc=1200, scale=1200 * volatilidade, size=N_ITERACOES)
preco = np.random.uniform(low=85, high=110, size=N_ITERACOES)
custo_variavel = 48
custo_fixo = 45000

lucro = (demanda * (preco - custo_variavel)) - custo_fixo

percentil_var = 100 - ${confVar}
var_calculado = np.percentile(lucro, percentil_var)
prob_prejuizo = (lucro < 0).mean() * 100

print(f"Simulação de Monte Carlo com {N_ITERACOES:,} Cenários:")
print(f"• Lucro Médio Esperado: R$ {lucro.mean():,.2f}")
print(f"• Desvio Padrão do Lucro: R$ {lucro.std():,.2f}")
print(f"• Value at Risk (VaR {${confVar}}%): R$ {var_calculado:,.2f}")
print(f"• Probabilidade de Prejuízo Operacional: {prob_prejuizo:.1f}%")`;
  }

  return algorithm.codeSnippet;
}

/**
 * Simulates real execution of the algorithm's Python code and outputs formatted stdout
 */
export function executeAlgorithmPythonSandbox(algorithm: VisualAlgorithm, params: Record<string, any>): ExecutionResult {
  const start = performance.now();
  const id = algorithm.id;
  const p = params;

  let stdout = '';
  const metrics: { label: string; value: string; color?: string }[] = [];

  switch (id) {
    case 'boxplot-tukey': {
      const fator = Number(p['fator_iqr'] ?? 1.5);
      const q1 = 165;
      const med = 210;
      const q3 = 260;
      const iqr = q3 - q1; // 95
      const sup = q3 + fator * iqr;
      const outliers = [850, 920].filter(v => v > sup);

      stdout = `>>> python -u boxplot_tukey.py
[INFO] Carregando Pandas v2.2.1 | Amostra: 13 pedidos
[CÁLCULO DOS QUARTIS]
   Q1 (25%): R$ ${q1}.00
   Mediana (50%): R$ ${med}.00
   Q3 (75%): R$ ${q3}.00
   IQR (Intervalo Interquartil): R$ ${iqr}.00

[CERCAS DE TUKEY COM MULTIPLICADOR ${fator}x]
   Limite Inferior: R$ ${Math.max(0, q1 - fator * iqr).toFixed(2)}
   Limite Superior: R$ ${sup.toFixed(2)}

[RESULTADOS DA AUDITORIA]
   Outliers Identificados: ${outliers.length} ocorrências
${outliers.map((val, idx) => `   [ALERTA #${idx + 1}] Pedido R$ ${val}.00 > Cerca R$ ${sup.toFixed(2)} (Suspeita de inflação de ticket)`).join('\n')}

STATUS: Processamento concluído com sucesso. 0 erros.`;
      metrics.push({ label: 'Cerca Superior', value: `R$ ${sup.toFixed(0)}`, color: 'amber' });
      metrics.push({ label: 'Outliers Detectados', value: `${outliers.length} pedidos`, color: 'rose' });
      break;
    }

    case 'rfm-segmentacao': {
      const recencia = Number(p['limiar_recencia'] ?? 30);
      const pisoVip = Number(p['gasto_minimo_vip'] ?? 2500);

      stdout = `>>> python -u rfm_segmentation.py
[INFO] Executando segmentação RFM em 5.420 clientes cadastrados
[PARÂMETROS DE CORTE CRM]
   Limiar de Recência Ativa: ${recencia} dias sem compra
   Piso de Gasto VIP: R$ ${pisoVip.toLocaleString('pt-BR')}

[DISTRIBUIÇÃO DA BASE]
   🏆 Campeões VIP:      1.280 clientes (23.6%) -> R$ 3,8M faturamento
   💎 Clientes Fiéis:    1.690 clientes (31.2%) -> R$ 1,9M faturamento
   ⚠️ Em Risco de Churn:   980 clientes (18.1%) -> R$ 420k a recuperar
   💤 Hibernando:        1.470 clientes (27.1%) -> Baixa atividade

[AÇÕES AUTOMATIZADAS GERADAS]
   ✓ 1.280 cupons VIP Concierge despachados via WhatsApp
   ✓ 980 alertas de Win-Back enviados para o time comercial`;
      metrics.push({ label: 'Campeões VIP', value: '23.6% da base', color: 'emerald' });
      metrics.push({ label: 'A Recuperar', value: 'R$ 420k', color: 'amber' });
      break;
    }

    case 'ab-testing': {
      const amostra = Number(p['tamanho_amostra'] ?? 2500);
      const conf = Number(p['nivel_confianca'] ?? 95);
      const z = (conf === 99 ? 2.58 : conf === 95 ? 1.96 : 1.64);
      const convA = Math.round(amostra * 0.084);
      const convB = Math.round(amostra * 0.106);
      const lift = 26.2;
      const pVal = 0.014;

      stdout = `>>> python -u ab_test_proportions.py
[INFO] Teste Z de Proporções Bicaudal | SciPy Stats
[AMOSTRAGEM]
   Variante A (Controle): ${amostra.toLocaleString('pt-BR')} visitantes | ${convA} conversões (8.40%)
   Variante B (Novo Layout): ${amostra.toLocaleString('pt-BR')} visitantes | ${convB} conversões (10.60%)

[ESTATÍSTICA DO EXPERIMENTO]
   Lift Observado: +${lift}% de ganho de conversão
   Z-Score: 2.45 (Limiar crítico: ${z.toFixed(2)})
   P-Valor: ${pVal} (α = ${(1 - conf / 100).toFixed(2)})

[PARECER ESTATÍSTICO]
   🏆 Decisão: REJEITA-SE A HIPÓTESE NULA (H0).
   O aumento de receita é estatisticamente significativo com ${conf}% de confiança.
   Recomendação de Engenharia: Subir Variante B para 100% dos usuários.`;
      metrics.push({ label: 'Lift', value: '+26.2%', color: 'emerald' });
      metrics.push({ label: 'p-valor', value: `${pVal} (<0.05)`, color: 'cyan' });
      break;
    }

    case 'regressao-logistica': {
      const corte = Number(p['corte_risco'] ?? 40);
      stdout = `>>> python -u logistic_regression_risk.py
[INFO] Modelo de Probabilidade de Inadimplência (Odds Ratio)
[CALIBRAÇÃO DE CORTE]
   Threshold de Decisão: ${corte}% de probabilidade máxima tolerada

[AUDITORIA DA BASE DE SOLICITANTES]
   Cliente #01 (Score 420 | R$ 2.8k): Risco = 82.4% -> ⛔ RECUSADO
   Cliente #02 (Score 580 | R$ 4.2k): Risco = 44.1% -> ${44.1 <= corte ? '✅ APROVADO' : '⛔ RECUSADO'}
   Cliente #03 (Score 850 | R$ 12.0k): Risco = 4.2%  -> ✅ APROVADO VIP

[MÉTRICAS DO MODELO]
   Odds Ratio do Score: 0.94 (-6% de chance de default a cada +10 pontos no Serasa)
   ROC-AUC: 0.884 | Gini: 0.768`;
      metrics.push({ label: 'Threshold', value: `${corte}%`, color: 'indigo' });
      metrics.push({ label: 'Gini Score', value: '0.768', color: 'emerald' });
      break;
    }

    case 'analise-sobrevivencia': {
      const desgaste = Number(p['fator_desgaste'] ?? 15);
      const meses = Number(p['horizonte_meses'] ?? 24);
      const meiaVida = (8.5 * (15 / desgaste)).toFixed(1);

      stdout = `>>> python -u kaplan_meier_churn.py
[INFO] Estimador de Kaplan-Meier | Safra de Assinantes S(t)
   Fator de Desgaste Inicial: ${desgaste}%
   Janela de Acompanhamento: ${meses} meses

[CURVA DE RETENÇÃO ACUMULADA S(t)]
   Mês 1:  ${(100 - desgaste * 0.9).toFixed(1)}% sobreviventes (Fim do onboarding)
   Mês 3:  ${(80 - desgaste * 0.8).toFixed(1)}% sobreviventes
   Mês 6:  ${(65 - desgaste * 0.7).toFixed(1)}% sobreviventes
   Mês 12: ${(55 - desgaste * 0.6).toFixed(1)}% sobreviventes

[DIAGNÓSTICO DA OPERAÇÃO]
   Meia-Vida da Safra (50% churn): ${meiaVida} meses
   Ponto Crítico de Desistência: Mês 3 (Final do período promocional trimestral)`;
      metrics.push({ label: 'Meia-Vida', value: `${meiaVida} meses`, color: 'rose' });
      metrics.push({ label: 'Retenção M12', value: `${(55 - desgaste * 0.6).toFixed(1)}%`, color: 'emerald' });
      break;
    }

    case 'suavizacao-exponencial': {
      const alpha = Number(p['alpha_peso'] ?? 0.35);
      const beta = Number(p['beta_tendencia'] ?? 0.20);
      const prev1 = (255 + 14.5 * (1 + alpha)).toFixed(1);

      stdout = `>>> python -u holt_winters_forecast.py
[INFO] Suavização Exponencial Dupla de Holt
[PARÂMETROS DE AJUSTE]
   Alpha (Nível de Recência): ${alpha}
   Beta (Tendência e Inércia): ${beta}

[PROJEÇÃO DE DEMANDA MULTI-PERÍODO]
   Histórico Recente: 220 un -> 240 un -> 255 un
   Previsão t+1: ${prev1} un (IC 95%: [${(Number(prev1) - 12).toFixed(1)}, ${(Number(prev1) + 12).toFixed(1)}])
   Previsão t+2: ${(Number(prev1) + 15.2).toFixed(1)} un
   Previsão t+3: ${(Number(prev1) + 31.0).toFixed(1)} un

[INDICADORES DE ERRO]
   MAPE: 3.82% (Excelente precisão de suprimentos)
   RMSE: 4.12 unidades`;
      metrics.push({ label: 'Prev t+1', value: `${prev1} un`, color: 'sky' });
      metrics.push({ label: 'MAPE', value: '3.82%', color: 'emerald' });
      break;
    }

    case 'funil-conversao': {
      const friccao = Number(p['friccao_cadastro'] ?? 60);
      const abandono = Number(p['abandono_carrinho'] ?? 50);
      const cadastros = Math.round(10000 * (1 - friccao / 100));
      const carrinhos = Math.round(cadastros * 0.5);
      const checkouts = Math.round(carrinhos * (1 - abandono / 100));
      const compras = Math.round(checkouts * 0.667);
      const convFinal = ((compras / 10000) * 100).toFixed(2);

      stdout = `>>> python -u conversion_funnel.py
[INFO] Auditoria de Fricção em 10.000 Visitantes Únicos
[ETAPAS DO FUNIL]
   1. Visitantes da Landing: 10.000 (100.0%)
   2. Cadastros Criados:      ${cadastros.toLocaleString('pt-BR')} (${(cadastros/100).toFixed(1)}%) -> Drop-off: ${friccao}%
   3. Adicionou Carrinho:     ${carrinhos.toLocaleString('pt-BR')} (${(carrinhos/100).toFixed(1)}%) -> Drop-off: 50.0%
   4. Checkout Iniciado:        ${checkouts.toLocaleString('pt-BR')} (${(checkouts/100).toFixed(1)}%) -> Drop-off: ${abandono}%
   5. Pedidos Pagos:            ${compras.toLocaleString('pt-BR')} (${convFinal}%) -> Drop-off: 33.3%

[GARGALO IDENTIFICADO]
   🚨 Maior Ponto de Fricção: Checkout (${abandono}% de evasão)
   Potencial de Ganho: +R$ 145.000/mês se o abandono cair para 30%`;
      metrics.push({ label: 'Conversão Final', value: `${convFinal}%`, color: 'teal' });
      metrics.push({ label: 'Vendas', value: `${compras} pedidos`, color: 'emerald' });
      break;
    }

    case 'auditoria-qualidade-dados': {
      const tol = Number(p['tolerancia_nulos'] ?? 20);
      const est = String(p['estrategia_imputacao'] ?? 'mediana');

      stdout = `>>> python -u data_profiling_audit.py
[INFO] Data Quality Health Check | 5 Colunas Auditadas
[CRITÉRIOS]
   Tolerância Máxima de Lacunas: ${tol}%
   Estratégia de Tratamento: ${est.toUpperCase()}

[RELATÓRIO DE SANIDADE]
   • Coluna 'nome':     100.0% preenchido -> ✅ Validada
   • Coluna 'email':     66.7% preenchido (33.3% nulos) -> ${33.3 > tol ? '🔴 DESCARTAR' : '🟡 IMPUTAR'}
   • Coluna 'telefone':  33.3% preenchido (66.7% nulos) -> 🔴 DESCARTAR COLUNA
   • Coluna 'renda':     83.3% preenchido (16.7% nulos) -> 🟡 IMPUTAR PELA ${est.toUpperCase()}

[SCORE GERAL DO DATASET]
   Índice de Qualidade de Dados (DQI): 91.4%
   Aptidão para Treinamento de Modelos: APROVADO COM RESSALVAS`;
      metrics.push({ label: 'Score DQI', value: '91.4%', color: 'emerald' });
      metrics.push({ label: 'Ação Renda', value: est, color: 'amber' });
      break;
    }

    case 'correlacao-heatmap': {
      const limiar = Number(p['limiar_destaque'] ?? 0.7);
      stdout = `>>> python -u correlation_matrix.py
[INFO] Matriz Cruzada de Pearson (4 Variáveis Contínuas)
[COEFICIENTES DE CORRELAÇÃO]
               Mkt Ads   Cliques   Vendas   Desconto
   Mkt Ads       1.00      +0.96    +0.92     -0.42
   Cliques      +0.96      1.00     +0.94     -0.55
   Vendas       +0.92     +0.94      1.00     -0.74
   Desconto     -0.42     -0.55     -0.74      1.00

[DESTAQUES ACIMA DE |r| >= ${limiar}]
   🔥 Mkt Ads <-> Vendas: r = +0.92 (Fortíssima relação direta)
   🔥 Cliques <-> Vendas: r = +0.94 (Gargalo de tráfego confirmado)
   ❄️ Desconto <-> Vendas: r = -0.74 (Trade-off: desvalorização de margem)`;
      metrics.push({ label: 'Pearson Ads-Vendas', value: '+0.92', color: 'indigo' });
      metrics.push({ label: 'Pearson Desconto', value: '-0.74', color: 'rose' });
      break;
    }

    case 'analise-cesta-compras': {
      const sup = Number(p['suporte_minimo'] ?? 10);
      const lift = Number(p['lift_minimo'] ?? 2.0);

      stdout = `>>> python -u apriori_market_basket.py
[INFO] Algoritmo Apriori em 128.400 Transações
   Filtros: Suporte >= ${sup}% | Lift >= ${lift}x

[REGRAS DE ASSOCIAÇÃO ENCONTRADAS]
   1. [Café Moído] => [Filtro de Papel]
      Suporte: 14.2% | Confiança: 82.0% | Lift: 4.1x (🔥 Altíssima Propensão)

   2. [Pão de Forma] => [Manteiga]
      Suporte: 22.0% | Confiança: 75.0% | Lift: 2.8x (Recomendação no Checkout)

   3. [Smartphone] => [Película Protetora]
      Suporte: 31.0% | Confiança: 88.0% | Lift: 5.2x (Cross-sell Padrão Ouro)

[IMPACTO ESTIMADO]
   Aumento de Ticket Médio Estimado: +14.6% em combos sugeridos`;
      metrics.push({ label: 'Top Lift', value: '5.2x', color: 'emerald' });
      metrics.push({ label: 'Confiança Média', value: '81.7%', color: 'cyan' });
      break;
    }

    case 'curva-roc-auc': {
      const auc = Number(p['auc_calibrada'] ?? 0.89);
      const thresh = Number(p['threshold_operacional'] ?? 0.5);

      stdout = `>>> python -u roc_auc_evaluation.py
[INFO] Avaliação de Desempenho do Classificador
[CURVA ROC & ÁREA SOB A CURVA]
   AUC (Area Under Curve): ${auc.toFixed(2)} -> Classificação EXCELENTE
   Gini: ${(2 * auc - 1).toFixed(3)} | Kolmogorov-Smirnov (KS): 0.62

[CORTE OPERACIONAL DEFINIDO: ${thresh.toFixed(2)}]
   Sensibilidade (Recall / TPR): 89.2%
   Falsos Positivos (FPR):       10.8%
   Precisão Operacional:         88.0%
   F1-Score Ponderado:           0.886

PARECER: O classificador possui separabilidade estocástica robusta sem overfitting.`;
      metrics.push({ label: 'AUC', value: `${auc.toFixed(2)}`, color: 'indigo' });
      metrics.push({ label: 'F1-Score', value: '0.886', color: 'emerald' });
      break;
    }

    case 'simulacao-monte-carlo': {
      const vol = Number(p['volatilidade_mercado'] ?? 20);
      const conf = Number(p['confianca_var'] ?? 95);
      const varVal = (38.5 * (vol / 20)).toFixed(1);
      const probPrej = (vol * 0.28).toFixed(1);

      stdout = `>>> python -u monte_carlo_simulation.py
[INFO] Executando 10.000 Simulações Estocásticas Paralelas
[PARÂMETROS DE INCERTEZA]
   Volatilidade de Mercado: ${vol}% de desvio
   Nível de Confiança do VaR: ${conf}%

[ESTATÍSTICAS DA DISTRIBUIÇÃO]
   Lucro Médio Esperado:  R$ 34.500,00
   Mediana (P50):         R$ 33.800,00
   Cenário Otimista (P90): R$ 58.900,00
   Value at Risk (VaR ${conf}%): -R$ ${varVal}.000,00 (Pior cenário a 5%)

[RISCO DE RUÍNA]
   Probabilidade de Fechar no Vermelho: ${probPrej}%
   Conclusão de Tesouraria: Risco aceitável com reserva de contingência de R$ ${varVal}k`;
      metrics.push({ label: `VaR ${conf}%`, value: `R$ ${varVal}k`, color: 'rose' });
      metrics.push({ label: 'Prob. Prejuízo', value: `${probPrej}%`, color: 'amber' });
      break;
    }

    // Default / Original 12 Algorithms
    default: {
      const paramKeys = Object.keys(p);
      const paramStr = paramKeys.map(k => `${k}=${p[k]}`).join(', ');

      stdout = `>>> python -u ${algorithm.id.replace(/-/g, '_')}.py
[INFO] Módulo ${algorithm.title} inicializado em sandbox isolada
[PARÂMETROS VETORIZADOS]
   ${paramStr || 'Parâmetros padrão do sistema'}

[EXECUÇÃO PANDAS / NUMPY]
   ✓ Dataset '${algorithm.datasetMini.name}' processado (${algorithm.datasetMini.rows.length} registros)
   ✓ Operações vetorizadas concluídas com sucesso
   ✓ Métrica Principal: ${algorithm.metricsSummary}

STATUS: 0 erros detectados. Execução concluída.`;
      metrics.push({ label: 'Status', value: 'Sucesso', color: 'emerald' });
      metrics.push({ label: 'Registros', value: `${algorithm.datasetMini.rows.length}`, color: 'sky' });
      break;
    }
  }

  const duration = Math.max(1, Math.round(performance.now() - start + 8));

  return {
    stdout,
    executionTimeMs: duration,
    memoryUsedKb: 1420 + Math.round(Math.random() * 200),
    status: 'success',
    summaryMetrics: metrics
  };
}

/**
 * Returns dynamic dataset rows reacting to parameter changes for ALL 24 algorithms
 */
export function getDynamicDatasetRows(algorithm: VisualAlgorithm, params: Record<string, any>): Record<string, any>[] {
  const id = algorithm.id;
  const p = params;
  const baseRows = algorithm.datasetMini.rows;

  // 1. ANÁLISE DE TENDÊNCIA
  if (id === 'analise-tendencia') {
    const sensibilidade = Number(p['sensibilidade'] ?? 10);
    const horizonte = Number(p['horizonte'] ?? 3);
    const slope = 13.2 * (1 + sensibilidade / 100);
    const extraRows: Record<string, any>[] = [];

    for (let m = 1; m <= horizonte; m++) {
      const monthNum = 8 + m;
      const projectedVal = (145.0 + slope * m).toFixed(1);
      extraRows.push({
        mes: `M${monthNum}* (Prev)`,
        vendas_k: Number(projectedVal),
        tendencia: Number(projectedVal),
        _isProjected: true
      });
    }
    return [...baseRows, ...extraRows];
  }

  // 2. PREVISÃO DE VENDAS
  if (id === 'previsao-vendas') {
    const crescimento = Number(p['crescimento'] ?? 15);
    const fatorSazonal = Number(p['fator_sazonal'] ?? 1.1);
    const growthFactor = (1 + crescimento / 100) * (fatorSazonal / 1.1);

    return baseRows.map(r => {
      if (r.tipo === 'Previsão') {
        const base = r.mes.includes('Jul') ? 780 : 840;
        return {
          ...r,
          volume_unidades: Math.round(base * growthFactor),
          _isProjected: true
        };
      }
      return r;
    });
  }

  // 3. DETECÇÃO DE ANOMALIAS
  if (id === 'deteccao-anomalias') {
    const limiarZ = Number(p['limiar_z'] ?? 2.0);
    return baseRows.map(r => {
      const isAnomaly = Math.abs(r.z_score) >= limiarZ;
      return {
        ...r,
        status: isAnomaly ? `🚨 Anomalia (|Z| ≥ ${limiarZ})` : '✅ Normal',
        _isAlert: isAnomaly
      };
    });
  }

  // 13. BOXPLOT & TUKEY IQR
  if (id === 'boxplot-tukey') {
    const fator = Number(p['fator_iqr'] ?? 1.5);
    const q3 = 260;
    const iqr = 95;
    const cercaSup = q3 + fator * iqr;

    return baseRows.map(r => {
      const ticket = Number(r.ticket_reais);
      const isOutlier = ticket > cercaSup;
      return {
        ...r,
        status_tukey: isOutlier ? `🚨 Outlier (> R$ ${cercaSup.toFixed(0)})` : '✅ Normal',
        _isAlert: isOutlier
      };
    });
  }

  // 14. SEGMENTAÇÃO RFM
  if (id === 'rfm-segmentacao') {
    const recenciaCorte = Number(p['limiar_recencia'] ?? 30);
    const pisoVip = Number(p['gasto_minimo_vip'] ?? 2500);

    return baseRows.map(r => {
      const rec = Number(r.recencia_dias);
      const valStr = String(r.monetario).replace('R$', '').replace('.', '').trim();
      const val = Number(valStr) || 1000;

      let seg = '💤 Hibernando';
      let isVip = false;
      if (rec <= recenciaCorte && val >= pisoVip) {
        seg = '🏆 Campeão VIP';
        isVip = true;
      } else if (rec <= recenciaCorte * 2) {
        seg = '💎 Fiel';
      } else if (rec > 90 && val >= 1000) {
        seg = '⚠️ Em Risco';
      }

      return {
        ...r,
        segmento_crm: seg,
        _isProjected: isVip,
        _isAlert: seg.includes('Risco')
      };
    });
  }

  // 15. TESTE A/B
  if (id === 'ab-testing') {
    const amostra = Number(p['tamanho_amostra'] ?? 2500);
    const convA = Math.round(amostra * 0.084);
    const convB = Math.round(amostra * 0.106);

    return [
      { variante: 'Versão A (Controle)', trafego: amostra, conversoes: convA, taxa_conversao: '8.4%', resultado: 'Base Atual' },
      { variante: 'Versão B (Nova)', trafego: amostra, conversoes: convB, taxa_conversao: '10.6%', resultado: '🏆 Vencedor (+26%)', _isProjected: true },
    ];
  }

  // 16. REGRESSÃO LOGÍSTICA
  if (id === 'regressao-logistica') {
    const corte = Number(p['corte_risco'] ?? 40);

    return baseRows.map(r => {
      const prob = Number(String(r.prob_inadimplencia).replace('%', ''));
      const aprovado = prob <= corte;
      return {
        ...r,
        decisao: aprovado ? '✅ Aprovado' : '⛔ Recusado',
        _isAlert: !aprovado,
        _isProjected: aprovado
      };
    });
  }

  // 17. ANÁLISE DE SOBREVIVÊNCIA
  if (id === 'analise-sobrevivencia') {
    const desgaste = Number(p['fator_desgaste'] ?? 15);
    return baseRows.map((r, idx) => {
      const mult = [0.9, 0.8, 0.7, 0.6][idx] ?? 0.5;
      const pct = (100 - desgaste * mult).toFixed(1);
      return {
        ...r,
        sobrevivencia_pct: `${pct}%`,
        cancelamentos: Math.round(1000 * (1 - Number(pct) / 100))
      };
    });
  }

  // 18. SUAVIZAÇÃO EXPONENCIAL
  if (id === 'suavizacao-exponencial') {
    const alpha = Number(p['alpha_peso'] ?? 0.35);
    const prev = (255 + 14.5 * (1 + alpha)).toFixed(1);

    return baseRows.map(r => {
      if (r.periodo.includes('*')) {
        return {
          ...r,
          previsao_holt: `${prev} (Prev)`,
          _isProjected: true
        };
      }
      return r;
    });
  }

  // 19. FUNIL DE CONVERSÃO
  if (id === 'funil-conversao') {
    const friccao = Number(p['friccao_cadastro'] ?? 60);
    const abandono = Number(p['abandono_carrinho'] ?? 50);
    const cadastros = Math.round(10000 * (1 - friccao / 100));
    const carrinhos = Math.round(cadastros * 0.5);
    const checkouts = Math.round(carrinhos * (1 - abandono / 100));
    const compras = Math.round(checkouts * 0.667);

    return [
      { etapa: 'Home / Landing', visitantes: 10000, conversao_etapa: '100%', dropoff: '0%', alerta: 'Normal' },
      { etapa: 'Cadastro', visitantes: cadastros, conversao_etapa: `${(100 - friccao).toFixed(1)}%`, dropoff: `${friccao}%`, alerta: friccao > 60 ? '🚨 Alto Atrito' : 'Normal', _isAlert: friccao > 60 },
      { etapa: 'Carrinho', visitantes: carrinhos, conversao_etapa: '50.0%', dropoff: '50.0%', alerta: 'Normal' },
      { etapa: 'Checkout', visitantes: checkouts, conversao_etapa: `${(100 - abandono).toFixed(1)}%`, dropoff: `${abandono}%`, alerta: '🚨 Gargalo Crítico', _isAlert: true },
      { etapa: 'Compra Concluída', visitantes: compras, conversao_etapa: '66.7%', dropoff: '33.3%', alerta: 'Normal', _isProjected: true },
    ];
  }

  // 20. AUDITORIA DE QUALIDADE
  if (id === 'auditoria-qualidade-dados') {
    const tol = Number(p['tolerancia_nulos'] ?? 20);
    const est = String(p['estrategia_imputacao'] ?? 'mediana');

    return baseRows.map(r => {
      const pct = Number(String(r.preenchimento).replace('%', ''));
      const nulosPct = 100 - pct;
      let acao = '✅ Pronto para uso';
      let isCrit = false;

      if (nulosPct > tol) {
        acao = `🔴 Descartar coluna (${nulosPct.toFixed(0)}% nulos > ${tol}%)`;
        isCrit = true;
      } else if (nulosPct > 0) {
        acao = `🟡 Imputar com ${est}`;
      }

      return {
        ...r,
        acao_sugerida: acao,
        _isAlert: isCrit
      };
    });
  }

  // 21. CORRELAÇÃO HEATMAP
  if (id === 'correlacao-heatmap') {
    const limiar = Number(p['limiar_destaque'] ?? 0.7);

    return baseRows.map(r => {
      const rVal = Math.abs(Number(r.coef_pearson));
      const isStrong = rVal >= limiar;
      return {
        ...r,
        forca_relacao: isStrong ? `🔥 Destaque Ativo (|r| ≥ ${limiar})` : '⚪ Relação Moderada',
        _isAlert: isStrong && Number(r.coef_pearson) < 0,
        _isProjected: isStrong && Number(r.coef_pearson) > 0
      };
    });
  }

  // 22. MARKET BASKET
  if (id === 'analise-cesta-compras') {
    const liftMin = Number(p['lift_minimo'] ?? 2.0);

    return baseRows.map(r => {
      const lift = Number(String(r.lift).replace('x', ''));
      const atende = lift >= liftMin;
      return {
        ...r,
        _isProjected: atende,
        _isAlert: !atende
      };
    });
  }

  // 23. CURVA ROC & AUC
  if (id === 'curva-roc-auc') {
    const thresh = Number(p['threshold_operacional'] ?? 0.5);

    return baseRows.map(r => {
      const corteVal = parseFloat(r.ponto_corte);
      const isClose = Math.abs(corteVal - thresh) < 0.2;
      return {
        ...r,
        _isProjected: isClose
      };
    });
  }

  // 24. MONTE CARLO
  if (id === 'simulacao-monte-carlo') {
    const vol = Number(p['volatilidade_mercado'] ?? 20);
    const var95 = (12.4 * (vol / 20)).toFixed(1);

    return baseRows.map(r => {
      if (r.percentil.includes('P5')) {
        return {
          ...r,
          lucro_projetado: `-R$ ${var95}k`,
          _isAlert: true
        };
      }
      return r;
    });
  }

  return baseRows;
}
