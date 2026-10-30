import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Setup Gemini AI SDK if API key exists
  const apiKey = process.env.GEMINI_API_KEY || '';
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // API Route: AI Assistant for Data Analysis, Real-Time Data Models & Code Tuning
  app.post('/api/gemini/assist', async (req, res) => {
    try {
      const { 
        prompt, 
        algorithmTitle, 
        pillarName,
        dataModel, 
        codeSnippet, 
        userDatasetDesc, 
        mode 
      } = req.body;

      // Extract details about the real-time data model
      const modelName = dataModel?.name || 'df_dados';
      const columns = Array.isArray(dataModel?.columns) ? dataModel.columns : [];
      const sampleRows = Array.isArray(dataModel?.sampleRows) ? dataModel.sampleRows.slice(0, 10) : [];
      const currentParams = dataModel?.parameters || {};
      const metricsSummary = dataModel?.metricsSummary || '';
      const realWorldCase = dataModel?.realWorldCase || '';
      const shortDesc = dataModel?.shortDesc || '';

      if (!ai) {
        // High quality offline fallback tailored to the requested data model
        let offlineResponse = '';
        const lowerPrompt = (prompt || '').toLowerCase();

        if (lowerPrompt.includes('esquema') || lowerPrompt.includes('dicionário') || lowerPrompt.includes('tipo') || mode === 'schema') {
          offlineResponse = `### 📊 Dicionário e Esquema do Modelo: **${algorithmTitle}** (\`${modelName}\`)

O modelo de dados apresentado está estruturado para a técnica de **${pillarName || 'Análise de Dados'}**. Abaixo está o mapeamento detalhado dos campos e tipos recomendados:

| Coluna | Tipo Python/Pandas | Tipo SQL (PostgreSQL) | Papel no Modelo | Descrição de Negócio |
| :--- | :--- | :--- | :--- | :--- |
${columns.map((c: string) => {
  let pyType = 'float64';
  let sqlType = 'NUMERIC(12,2)';
  let role = 'Métrica / Fato';
  let desc = `Valor numérico associado a ${c}`;

  if (c === 'mes' || c === 'dia' || c === 'data' || c === 'periodo' || c === 'semana') {
    pyType = 'int64 / datetime64';
    sqlType = 'INTEGER / DATE';
    role = 'Dimensão Temporal (PK)';
    desc = 'Identificador cronológico do período analisado.';
  } else if (c.includes('id') || c === 'cliente' || c === 'item' || c === 'transacao' || c === 'cluster' || c === 'etapa') {
    pyType = 'string / int64';
    sqlType = 'VARCHAR(50)';
    role = 'Dimensão / Chave';
    desc = `Entidade de agrupamento (${c}).`;
  } else if (c.includes('taxa') || c.includes('prob') || c.includes('score') || c.includes('z_score') || c.includes('pct') || c.includes('auc') || c.includes('lift')) {
    pyType = 'float64';
    sqlType = 'NUMERIC(8,4)';
    role = 'Indicador Derivado';
    desc = `Métrica analítica calculada em tempo real via algoritmo.`;
  } else if (c.includes('flag') || c.includes('is_') || c.includes('alerta')) {
    pyType = 'bool';
    sqlType = 'BOOLEAN';
    role = 'Atributo de Status';
    desc = 'Sinalização binária (True/False) de evento crítico ou anomalia.';
  }
  return `| \`${c}\` | \`${pyType}\` | \`${sqlType}\` | **${role}** | ${desc} |`;
}).join('\n')}

---

### ⚡ Impacto dos Parâmetros em Tempo Real:
- **Parâmetros Atuais:** ${Object.entries(currentParams).map(([k, v]) => `\`${k}: ${v}\``).join(', ') || 'Padrão'}
- **Métrica Alvo:** ${metricsSummary || 'N/A'}
- **Caso Real:** ${realWorldCase || shortDesc}

*💡 Dica: Para análises preditivas em tempo real com raciocínio multimodal, configure sua chave \`GEMINI_API_KEY\` no painel de segredos.*`;
        } else if (lowerPrompt.includes('sql') || lowerPrompt.includes('ddl') || lowerPrompt.includes('tabela')) {
          offlineResponse = `### 🗄️ Esquema Relacional SQL (DDL) para **${modelName}**

Script DDL compatível com **PostgreSQL**, **DuckDB** e **Snowflake**:

\`\`\`sql
-- Tabela Fato / Entidade Analítica para: ${algorithmTitle}
CREATE TABLE IF NOT EXISTS ${modelName.toLowerCase().replace(/[^a-z0-9_]/g, '_')} (
${columns.map((col: string, idx: number) => {
  let type = 'NUMERIC(12,2)';
  let constraint = 'NOT NULL';
  if (idx === 0) {
    type = 'SERIAL PRIMARY KEY';
    constraint = '';
  } else if (col.includes('data') || col === 'mes' || col === 'periodo') {
    type = 'INTEGER NOT NULL';
  } else if (col.includes('nome') || col.includes('categoria') || col.includes('status') || col.includes('etapa')) {
    type = 'VARCHAR(100) NOT NULL';
  } else if (col.includes('is_') || col.includes('alerta') || col.includes('flag')) {
    type = 'BOOLEAN DEFAULT FALSE';
  }
  return `    ${col.padEnd(20)} ${type} ${constraint}`.trimEnd();
}).join(',\n')},
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices recomendados para consultas analíticas rápidas
CREATE INDEX IF NOT EXISTS idx_${modelName.toLowerCase()}_analitico 
    ON ${modelName.toLowerCase().replace(/[^a-z0-9_]/g, '_')} (${columns[0]});
\`\`\`

#### 📌 Considerações de Modelagem:
1. **Granularidade:** 1 registro por \`${columns[0] || 'linha'}\`.
2. **Particionamento:** Para grandes volumes (milhões de linhas), recomenda-se particionar por período mensal.`;
        } else {
          offlineResponse = `### 🤖 Análise do Modelo de Dados: **${algorithmTitle}**

O modelo em exibição (\`${modelName}\`) possui **${columns.length} colunas** e reflete os seguintes parâmetros em tempo real:

- **Colunas:** ${columns.map((c: string) => `\`${c}\``).join(', ')}
- **Parâmetros Ativos:** ${Object.entries(currentParams).map(([k, v]) => `\`${k}: ${v}\``).join(', ') || 'Padrão'}
- **Contexto Prático:** ${shortDesc}

#### 💡 Principais Características do Modelo:
1. **Vetorização no Pandas:** Operações executadas diretamente sobre as séries numéricas sem loops iterativos.
2. **Reatividade:** Ao alterar os sliders na interface, as colunas derivadas recalculam instantaneamente.
3. **Consistência:** Verifique sempre a ausência de valores nulos (\`df.dropna()\` ou \`df.fillna()\`) antes de alimentar pipelines em produção.`;
        }

        return res.status(200).json({
          success: true,
          response: offlineResponse,
        });
      }

      // Live Gemini AI Request using GoogleGenAI SDK with gemini-3.8-flash
      const systemInstruction = `Você é um Arquiteto de Dados Sênior e Cientista de Dados Líder da "Biblioteca Intuitiva de Dados".
Você é mestre em:
1. Modelagem de dados (Relacional, Dimensional Kimball/Inmon Star Schema, Data Vault, OBT/One Big Table para DuckDB/Snowflake).
2. Dicionários de dados, tipagem, integridade referencial, cardinalidade e granularidade.
3. Engenharia de atributos (Feature Stores) e transformações em Python/Pandas.
4. Análise estatística e interpretação de negócios dos algoritmos analíticos apresentados na tela.

O usuário está interagindo com uma aplicação viva onde ele pode mudar parâmetros (sliders) e visualizar o modelo de dados e tabelas se atualizarem em tempo real.
SEMPRE responda em Português do Brasil de forma clara, técnica, bem estruturada com Markdown (tabelas, listas e blocos de código formatados com syntax highlighting).
Quando perguntado sobre o modelo de dados, analise as colunas reais, a amostra de registros recebida, os parâmetros ativos e indique as melhores práticas de banco de dados e engenharia de dados.`;

      const formattedSampleRows = sampleRows.length > 0
        ? JSON.stringify(sampleRows, null, 2)
        : 'Nenhuma linha disponível';

      const promptContext = `
================ CONTEXTO DO MODELO DE DADOS EM TEMPO REAL ================
- Algoritmo / Técnica: "${algorithmTitle || 'Análise de Dados'}"
- Pilar Analítico: "${pillarName || 'Geral'}"
- Resumo de Métricas: "${metricsSummary}"
- Breve Descrição: "${shortDesc}"
- Caso de Uso Real: "${realWorldCase}"

--- ESQUEMA DO DATASET (${modelName}) ---
- Colunas (${columns.length}): [${columns.join(', ')}]
- Parâmetros Ativos nos Controles: ${JSON.stringify(currentParams)}
- Amostra Real dos Dados Atuais (reativa aos controles):
${formattedSampleRows}

--- CÓDIGO PYTHON GERADO DINAMICAMENTE ---
\`\`\`python
${codeSnippet || '# Sem snippet fornecido'}
\`\`\`
===========================================================================

PERGUNTA OU REQUISIÇÃO DO USUÁRIO:
${prompt || (mode === 'schema' ? 'Explique detalhadamente o modelo de dados, as colunas, tipos ideais e boas práticas.' : 'Explique este modelo de dados.')}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContext,
        config: {
          systemInstruction,
          temperature: 0.65,
        },
      });

      return res.json({
        success: true,
        response: response.text,
      });
    } catch (error: any) {
      console.error('Error generating AI response:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Falha ao processar com Gemini',
      });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!apiKey });
  });

  // Dev server with Vite middleware or Production static files
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
