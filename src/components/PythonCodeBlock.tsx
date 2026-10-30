import React, { useState } from 'react';
import { Copy, Check, Play, Terminal, Sliders, RotateCcw } from 'lucide-react';
import { InteractiveParameter } from '../types/data-library';

interface Props {
  code: string;
  parameters: InteractiveParameter[];
  paramValues: Record<string, any>;
  onParamChange: (paramId: string, val: any) => void;
  onResetParams: () => void;
  onSimulateRun: () => void;
  isRunning: boolean;
}

export const PythonCodeBlock: React.FC<Props> = ({
  code,
  parameters,
  paramValues,
  onParamChange,
  onResetParams,
  onSimulateRun,
  isRunning,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Syntax highlighting parser
  const renderHighlightedCode = (source: string) => {
    return source.split('\n').map((line, lineIndex) => {
      // Simple token styling
      let content: React.ReactNode = line;

      if (line.trim().startsWith('#')) {
        content = <span className="text-slate-500 italic">{line}</span>;
      } else {
        const parts = line.split(/(\b(?:import|from|as|def|return|if|elif|else|for|in|lambda|True|False|None)\b|"[^"]*"|'[^']*'|\b\d+\.?\d*\b|\b(?:pd|np|df|mean|std|sum|median|quantile|polyfit|qcut|apply|fillna|dropna|isnull|print)\b)/g);
        content = parts.map((part, pIdx) => {
          if (/^(import|from|as|def|return|if|elif|else|for|in|lambda)$/.test(part)) {
            return <span key={pIdx} className="text-purple-400 font-semibold">{part}</span>;
          }
          if (/^(True|False|None)$/.test(part)) {
            return <span key={pIdx} className="text-amber-400 font-semibold">{part}</span>;
          }
          if (/^(".*"|'.*')$/.test(part)) {
            return <span key={pIdx} className="text-emerald-300">{part}</span>;
          }
          if (/^\d+\.?\d*$/.test(part)) {
            return <span key={pIdx} className="text-amber-300">{part}</span>;
          }
          if (/^(pd|np|df)$/.test(part)) {
            return <span key={pIdx} className="text-cyan-400 font-semibold">{part}</span>;
          }
          if (/^(mean|std|sum|median|quantile|polyfit|qcut|apply|fillna|dropna|isnull|print)$/.test(part)) {
            return <span key={pIdx} className="text-blue-400">{part}</span>;
          }
          return <span key={pIdx} className="text-slate-300">{part}</span>;
        });
      }

      return (
        <div key={lineIndex} className="table-row hover:bg-slate-900/60 transition-colors">
          <span className="table-cell text-right pr-4 text-slate-600 select-none text-[11px] font-mono w-8">
            {lineIndex + 1}
          </span>
          <span className="table-cell whitespace-pre font-mono text-[12px]">{content}</span>
        </div>
      );
    });
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xl">
      {/* Code Header Bar */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono font-medium text-slate-300">analise_pandas.py</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            Python 3.12 · Pandas 2.2
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSimulateRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-medium rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50"
            title="Executar pipeline do Pandas"
          >
            <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
            <span>{isRunning ? 'Executando...' : 'Executar Sandbox'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-lg border border-slate-700 transition-all cursor-pointer"
            title="Copiar código Python"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Text Area */}
      <div className="p-3 overflow-x-auto overflow-y-auto max-h-80 bg-slate-950 font-mono text-xs leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
        <div className="table w-full">{renderHighlightedCode(code)}</div>
      </div>

      {/* Live Interactive Parameters Bar */}
      {parameters && parameters.length > 0 && (
        <div className="bg-slate-900/90 border-t border-slate-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Parâmetros Interativos da Análise</span>
            </div>
            <button
              onClick={onResetParams}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Resetar</span>
            </button>
          </div>

          <div className="space-y-3">
            {parameters.map((param) => {
              const currentVal = paramValues[param.id] ?? param.defaultValue;

              return (
                <div key={param.id} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">{param.label}</span>
                    <span className="font-mono text-cyan-300 font-semibold text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {currentVal} {param.unit || ''}
                    </span>
                  </div>

                  {param.type === 'slider' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={currentVal}
                        onChange={(e) => onParamChange(param.id, parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  )}

                  {param.type === 'select' && param.options && (
                    <select
                      value={currentVal}
                      onChange={(e) => onParamChange(param.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
                    >
                      {param.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  <p className="text-[11px] text-slate-400 mt-1">{param.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
