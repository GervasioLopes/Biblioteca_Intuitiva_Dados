import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  RefreshCw, 
  Database, 
  Table, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  FileCode, 
  ShieldCheck, 
  Layers, 
  FileText,
  RotateCcw
} from 'lucide-react';
import { VisualAlgorithm } from '../data/simple-algorithms';
import { getDynamicDatasetRows, getDynamicPythonCode } from '../utils/dynamicCodeEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeAlgorithm: VisualAlgorithm;
  currentParams?: Record<string, any>;
  allAlgorithms?: VisualAlgorithm[];
  onSelectAlgorithm?: (algo: VisualAlgorithm) => void;
  initialPrompt?: string;
}

export const GeminiAssistantDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  activeAlgorithm,
  currentParams = {},
  allAlgorithms = [],
  onSelectAlgorithm,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; timestamp: string }>>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSchemaPreviewOpen, setIsSchemaPreviewOpen] = useState(false);

  // Compute live dataset rows reflecting user sliders
  const dynamicRows = useMemo(() => {
    return getDynamicDatasetRows(activeAlgorithm, currentParams);
  }, [activeAlgorithm, currentParams]);

  // Compute live python code reflecting user sliders
  const dynamicPythonCode = useMemo(() => {
    return getDynamicPythonCode(activeAlgorithm, currentParams);
  }, [activeAlgorithm, currentParams]);

  // Infer data types for the active model's columns
  const columnTypeDictionary = useMemo(() => {
    const cols = activeAlgorithm.datasetMini?.columns || [];
    return cols.map((col) => {
      let inferred = 'FLOAT / NUMERIC';
      let tag = 'Métrica';

      if (col === 'mes' || col === 'dia' || col === 'periodo' || col === 'semana') {
        inferred = 'INTEGER (Chave Temporal)';
        tag = 'Dimensão Temporal';
      } else if (col.includes('id') || col === 'cliente' || col === 'item' || col === 'transacao' || col === 'cluster' || col === 'etapa') {
        inferred = 'VARCHAR / INTEGER';
        tag = 'Identificador / Chave';
      } else if (col.includes('data') || col.includes('hora')) {
        inferred = 'TIMESTAMP WITH TIME ZONE';
        tag = 'Timestamp';
      } else if (col.includes('is_') || col.includes('alerta') || col.includes('flag')) {
        inferred = 'BOOLEAN (True/False)';
        tag = 'Status / Flag';
      } else if (col.includes('score') || col.includes('taxa') || col.includes('prob') || col.includes('z_score') || col.includes('lift')) {
        inferred = 'FLOAT (Derivada)';
        tag = 'Indicador Derivado';
      }
      return { col, inferred, tag };
    });
  }, [activeAlgorithm]);

  // Reset or initialize welcome message when active algorithm changes
  useEffect(() => {
    if (messages.length === 0 || messages[0].text.includes('modelo **')) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const paramDetails = Object.entries(currentParams)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');

      setMessages([
        {
          role: 'assistant',
          timestamp: now,
          text: `Olá! Estou conectado em tempo real ao modelo de dados **${activeAlgorithm.title}** (\`${activeAlgorithm.datasetMini.name}\`).\n\n- **Colunas ativas (${activeAlgorithm.datasetMini.columns.length}):** ${activeAlgorithm.datasetMini.columns.map(c => `\`${c}\``).join(', ')}\n- **Parâmetros atuais nos sliders:** ${paramDetails ? `\`${paramDetails}\`` : 'Padrão'}\n- **Amostra:** ${dynamicRows.length} registros computados dinamicamente.\n\nVocê pode me perguntar sobre a **estrutura do esquema**, **tipos ideais de dados**, **geração de DDL SQL**, **como modelar em Star Schema** ou **como os parâmetros atuais afetam as colunas**!`,
        },
      ]);
    }
  }, [activeAlgorithm.id]);

  // Handle pre-filled initialPrompt if passed
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string, mode?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() && !mode) return;

    const userMsg = textToSend || (mode === 'schema' ? 'Explicar esquema e tipos do modelo de dados' : 'Análise do modelo');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { role: 'user', text: userMsg, timestamp: now }]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          algorithmTitle: activeAlgorithm.title,
          pillarName: activeAlgorithm.pillarName,
          dataModel: {
            name: activeAlgorithm.datasetMini.name,
            columns: activeAlgorithm.datasetMini.columns,
            sampleRows: dynamicRows.slice(0, 10),
            parameters: currentParams,
            metricsSummary: activeAlgorithm.metricsSummary,
            shortDesc: activeAlgorithm.shortDesc,
            realWorldCase: activeAlgorithm.article.realWorldCase,
          },
          codeSnippet: dynamicPythonCode,
          mode,
        }),
      });

      const data = await res.json();
      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.response, timestamp: responseTime }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `⚠️ Erro ao consultar o modelo Gemini: ${data.error || 'Erro inesperado'}.`,
            timestamp: responseTime,
          },
        ]);
      }
    } catch (err: any) {
      const errorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `⚠️ Não foi possível conectar ao servidor backend: ${err.message}`,
          timestamp: errorTime,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        role: 'assistant',
        timestamp: now,
        text: `Conversa reiniciada. O modelo ativo é **${activeAlgorithm.title}**. O que gostaria de analisar no modelo de dados ou código?`,
      },
    ]);
  };

  // Simple Markdown renderer with support for tables, code blocks, bullet points and bolding
  const renderFormattedContent = (content: string) => {
    // Split by code blocks
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Text before the code block
      if (match.index > lastIndex) {
        segments.push(renderTextAndTables(content.substring(lastIndex, match.index)));
      }

      const lang = match[1] || 'code';
      const code = match[2];
      const blockId = `code-${match.index}`;

      segments.push(
        <div key={blockId} className="my-2.5 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 font-mono text-xs">
          <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800">
            <span className="font-semibold text-sky-400 uppercase tracking-wider">{lang}</span>
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              title="Copiar código"
            >
              <Copy className="w-3 h-3" />
              <span>Copiar</span>
            </button>
          </div>
          <pre className="p-3 overflow-x-auto text-emerald-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800 whitespace-pre">
            {code}
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      segments.push(renderTextAndTables(content.substring(lastIndex)));
    }

    return segments;
  };

  // Helper to render Markdown tables, headers, and bullet lists
  const renderTextAndTables = (textBlock: string) => {
    const lines = textBlock.split('\n');
    const elements: React.ReactNode[] = [];
    let tableRows: string[] = [];
    let inTable = false;

    const flushTable = (key: string) => {
      if (tableRows.length > 0) {
        const headerLine = tableRows[0];
        const isAligned = tableRows[1]?.includes('---');
        const contentRows = isAligned ? tableRows.slice(2) : tableRows.slice(1);

        const headers = headerLine
          .split('|')
          .map((c) => c.trim())
          .filter((c) => c.length > 0);

        elements.push(
          <div key={key} className="my-2 overflow-x-auto border border-slate-700 rounded-lg bg-slate-950/60 shadow-xs">
            <table className="w-full text-left text-[11px] font-sans border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-700 text-sky-300 font-bold">
                  {headers.map((h, i) => (
                    <th key={i} className="py-1.5 px-2.5 font-mono">{h.replace(/[*`]/g, '')}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {contentRows.map((r, rIdx) => {
                  const cells = r
                    .split('|')
                    .map((c) => c.trim())
                    .filter((c) => c.length > 0);
                  return (
                    <tr key={rIdx} className="hover:bg-slate-900/40">
                      {cells.map((c, cIdx) => (
                        <td key={cIdx} className="py-1.5 px-2.5 text-slate-300">
                          {c.startsWith('`') && c.endsWith('`') ? (
                            <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300 font-mono text-[10px]">
                              {c.replace(/`/g, '')}
                            </code>
                          ) : c.startsWith('**') && c.endsWith('**') ? (
                            <strong className="text-white">{c.replace(/\*\*/g, '')}</strong>
                          ) : (
                            c
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        tableRows.push(trimmed);
        return;
      } else if (inTable) {
        flushTable(`table-${idx}`);
      }

      if (trimmed.startsWith('### ')) {
        elements.push(
          <h4 key={idx} className="text-sm font-bold text-white mt-3 mb-1.5 flex items-center gap-1.5">
            {trimmed.replace('### ', '')}
          </h4>
        );
      } else if (trimmed.startsWith('#### ')) {
        elements.push(
          <h5 key={idx} className="text-xs font-bold text-sky-300 mt-2 mb-1">
            {trimmed.replace('#### ', '')}
          </h5>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.replace(/^[-*]\s+/, '');
        elements.push(
          <div key={idx} className="flex items-start gap-1.5 my-1 pl-1">
            <span className="text-sky-400 font-bold">•</span>
            <span className="text-slate-300">
              {formatInlineBoldAndCode(itemText)}
            </span>
          </div>
        );
      } else if (trimmed === '---') {
        elements.push(<hr key={idx} className="my-2 border-slate-800" />);
      } else if (trimmed.length > 0) {
        elements.push(
          <p key={idx} className="my-1.5 text-slate-300">
            {formatInlineBoldAndCode(trimmed)}
          </p>
        );
      }
    });

    if (inTable) {
      flushTable('table-end');
    }

    return elements;
  };

  const formatInlineBoldAndCode = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={pIdx} className="px-1 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#090e17] border-l border-slate-800 shadow-2xl flex flex-col animate-slideIn text-left">
      {/* 1. Header with Model Selector & Live Status Indicator */}
      <div className="p-3.5 bg-[#0e1626] border-b border-slate-800 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight">Assistente IA de Dados</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Consulta em tempo real de modelos, esquemas, SQL e Pandas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearChat}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Limpar histórico da conversa"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fechar assistente"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Model Switcher Dropdown inside Drawer */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
          <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Modelo Ativo:
          </span>

          {allAlgorithms.length > 0 && onSelectAlgorithm ? (
            <div className="relative flex-1">
              <select
                value={activeAlgorithm.id}
                onChange={(e) => {
                  const found = allAlgorithms.find((a) => a.id === e.target.value);
                  if (found) onSelectAlgorithm(found);
                }}
                className="w-full appearance-none bg-slate-900 border border-slate-700 text-sky-200 text-xs font-mono font-medium rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {allAlgorithms.map((algo) => (
                  <option key={algo.id} value={algo.id}>
                    {algo.title} ({algo.datasetMini.name})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ) : (
            <span className="text-xs font-bold text-sky-300 font-mono truncate">
              {activeAlgorithm.title} ({activeAlgorithm.datasetMini.name})
            </span>
          )}
        </div>
      </div>

      {/* 2. Interactive "Modelo de Dados & Esquema em Tempo Real" Collapsible Inspector */}
      <div className="bg-[#0b121e] border-b border-slate-800 px-3.5 py-2">
        <button
          onClick={() => setIsSchemaPreviewOpen(!isSchemaPreviewOpen)}
          className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Table className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold text-[11px] font-mono">
              Esquema em Tempo Real: <strong className="text-cyan-300">{activeAlgorithm.datasetMini.name}</strong> ({activeAlgorithm.datasetMini.columns.length} colunas, {dynamicRows.length} linhas)
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            <span>{isSchemaPreviewOpen ? 'Ocultar' : 'Inspecionar'}</span>
            {isSchemaPreviewOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {isSchemaPreviewOpen && (
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-2 text-xs">
            {/* Columns and Types pills */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block">
                Colunas & Tipos Inferidos:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {columnTypeDictionary.map(({ col, inferred, tag }) => (
                  <div
                    key={col}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-[10px] font-mono flex items-center gap-1.5"
                    title={`${col} -> ${inferred} (${tag})`}
                  >
                    <span className="text-cyan-300 font-bold">{col}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">{inferred.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current reactive sliders parameters */}
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center justify-between flex-wrap gap-1">
              <span className="flex items-center gap-1 text-sky-400 font-semibold">
                <Sliders className="w-3 h-3" />
                Parâmetros Atuais:
              </span>
              <span className="text-amber-300">
                {Object.entries(currentParams).map(([k, v]) => `${k}=${v}`).join(', ') || 'Valores padrão'}
              </span>
            </div>

            {/* Mini data sample preview table */}
            <div className="overflow-x-auto max-h-32 border border-slate-800 rounded bg-[#070b12] scrollbar-thin scrollbar-thumb-slate-800">
              <table className="w-full text-left font-mono text-[10px] text-slate-300">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    {activeAlgorithm.datasetMini.columns.map((c) => (
                      <th key={c} className="p-1.5 font-bold">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {dynamicRows.slice(0, 5).map((r, i) => (
                    <tr key={i} className="hover:bg-slate-900/30">
                      {activeAlgorithm.datasetMini.columns.map((c) => (
                        <td key={c} className="p-1.5 text-slate-300">{String(r[c] ?? '-')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3. Quick Action Chips tailored to Data Models */}
      <div className="p-2.5 bg-[#0a0f19] border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
        <button
          onClick={() => handleSend('Explique em detalhes o esquema deste modelo de dados, o que cada coluna representa e seus tipos ideais.', 'schema')}
          disabled={isLoading}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-sky-600/30 text-slate-300 hover:text-sky-300 border border-slate-700/80 transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-medium"
        >
          <Table className="w-3 h-3 text-sky-400" />
          <span>Esquema & Dicionário</span>
        </button>

        <button
          onClick={() => handleSend('Gere o script SQL CREATE TABLE completo (PostgreSQL e Snowflake) com chaves primárias, constraints e índices para este modelo de dados.')}
          disabled={isLoading}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 border border-slate-700/80 transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-medium"
        >
          <FileCode className="w-3 h-3 text-emerald-400" />
          <span>Gerar SQL DDL</span>
        </button>

        <button
          onClick={() => handleSend(`Como os parâmetros atuais (${Object.entries(currentParams).map(([k, v]) => `${k}=${v}`).join(', ')}) alteram as colunas, registros e saídas analíticas deste dataset?`)}
          disabled={isLoading}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-600/30 text-slate-300 hover:text-amber-300 border border-slate-700/80 transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-medium"
        >
          <Sliders className="w-3 h-3 text-amber-400" />
          <span>Impacto dos Parâmetros</span>
        </button>

        <button
          onClick={() => handleSend('Como modelar esse caso em um Data Warehouse (Star Schema)? Quais seriam a Tabela Fato e as Tabelas Dimensões?')}
          disabled={isLoading}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-600/30 text-slate-300 hover:text-purple-300 border border-slate-700/80 transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-medium"
        >
          <Layers className="w-3 h-3 text-purple-400" />
          <span>Modelagem Star Schema</span>
        </button>

        <button
          onClick={() => handleSend('Quais regras de qualidade de dados (data contracts / testes dbt) e validações de integridade são fundamentais para este dataset?')}
          disabled={isLoading}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-600/30 text-slate-300 hover:text-rose-300 border border-slate-700/80 transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-medium"
        >
          <ShieldCheck className="w-3 h-3 text-rose-400" />
          <span>Qualidade & Regras</span>
        </button>
      </div>

      {/* 4. Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 text-xs">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`relative max-w-[90%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-xs'
                  : 'bg-[#0f172a] border border-slate-800 text-slate-200 rounded-tl-xs'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                <span>{msg.role === 'user' ? 'Você' : 'Gemini 3.8 Flash'}</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Formatted body */}
              <div className="font-sans text-xs">
                {renderFormattedContent(msg.text)}
              </div>

              {msg.role === 'assistant' && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono text-slate-500">
                    {activeAlgorithm.title} · {activeAlgorithm.datasetMini.name}
                  </span>
                  <button
                    onClick={() => handleCopyMessage(msg.text, i)}
                    className="hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedIndex === i ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar resposta</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center text-slate-400 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800 w-fit">
            <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-slate-200">Consultando Gemini 3.8 Flash...</span>
              <span className="text-[11px] text-slate-400 font-mono">
                Analisando modelo {activeAlgorithm.datasetMini.name} com {dynamicRows.length} linhas
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Input Area */}
      <div className="p-3 bg-[#0a0f19] border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Pergunte sobre colunas, SQL, chaves ou parâmetros do modelo ${activeAlgorithm.datasetMini.name}...`}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-900/90 border border-slate-700 text-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-sky-500 placeholder:text-slate-500 font-sans"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="p-2.5 bg-sky-600 hover:bg-sky-500 active:scale-95 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-md"
            title="Enviar pergunta"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1 font-mono">
          <span>💡 Dica: Peça scripts SQL, validações dbt ou análises das colunas calculadas.</span>
          <span className="text-sky-400">Contexto reativo ativado</span>
        </div>
      </div>
    </div>
  );
};
