import React, { useState } from 'react';
import { MiniDataset } from '../types/data-library';
import { Table, ArrowRight, Eye, RefreshCw, Layers } from 'lucide-react';

interface Props {
  dataset: MiniDataset;
  processedRows: Record<string, any>[];
}

export const MiniatureDatasetViewer: React.FC<Props> = ({ dataset, processedRows }) => {
  const [viewMode, setViewMode] = useState<'processed' | 'raw'>('processed');
  const [searchTerm, setSearchTerm] = useState('');

  const rowsToDisplay = viewMode === 'processed' ? processedRows : dataset.rawRows;

  // Determine dynamic columns based on displayed rows
  const activeKeys = rowsToDisplay.length > 0
    ? Object.keys(rowsToDisplay[0]).filter(k => !k.startsWith('_'))
    : dataset.columns.map(c => c.key);

  const filteredRows = rowsToDisplay.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      {/* Header bar */}
      <div className="bg-slate-950/90 px-4 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Table className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">{dataset.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                {rowsToDisplay.length} linhas × {activeKeys.length} colunas
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{dataset.description}</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('raw')}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              viewMode === 'raw'
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Original (Raw)
          </button>
          <div className="w-3 text-slate-600 flex justify-center">
            <ArrowRight className="w-3 h-3" />
          </div>
          <button
            onClick={() => setViewMode('processed')}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all flex items-center gap-1 ${
              viewMode === 'processed'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Processado</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Filter / Search mini bar */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/50 flex items-center justify-between text-xs">
        <input
          type="text"
          placeholder="Buscar no dataframe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-teal-500/50 w-48"
        />
        <span className="text-[11px] font-mono text-slate-400">
          DataFrame em memória: Pandas Cython Vector Engine
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto overflow-y-auto max-h-72 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800/80 sticky top-0 z-10 font-mono">
              <th className="py-2 px-3 text-[11px] text-slate-500 w-10">#</th>
              {activeKeys.map((colKey) => {
                const meta = dataset.columns.find(c => c.key === colKey);
                const colType = meta?.type || (typeof rowsToDisplay[0]?.[colKey] === 'number' ? 'float64' : 'object');
                return (
                  <th key={colKey} className="py-2 px-3 text-[11px] font-medium whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-200 font-semibold">{meta?.label || colKey}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800/80 text-slate-400 font-mono">
                        {colType}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 font-mono text-[11px]">
            {filteredRows.map((row, rowIdx) => {
              const isAlert = row._isAlert;
              return (
                <tr
                  key={rowIdx}
                  className={`transition-colors ${
                    isAlert
                      ? 'bg-rose-950/20 text-rose-200 hover:bg-rose-950/30'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="py-2 px-3 text-slate-500 text-[10px] select-none">{rowIdx}</td>
                  {activeKeys.map((colKey) => {
                    const val = row[colKey];
                    const isAlertCol = colKey.includes('anomalia') || colKey.includes('outlier') || colKey.includes('risco');
                    return (
                      <td key={colKey} className="py-2 px-3 whitespace-nowrap">
                        {val === null || val === undefined ? (
                          <span className="text-amber-400/80 italic font-semibold">NaN</span>
                        ) : typeof val === 'number' ? (
                          <span className="text-cyan-300">
                            {Number.isInteger(val) ? val : val.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                          </span>
                        ) : (
                          <span className={isAlertCol ? 'font-semibold text-rose-300' : 'text-slate-300'}>
                            {String(val)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="bg-slate-950/80 px-4 py-2 border-t border-slate-800/70 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Indexação nativa 0-based do Pandas</span>
        </span>
        <span className="font-mono text-slate-500">dtypes verificados</span>
      </div>
    </div>
  );
};
