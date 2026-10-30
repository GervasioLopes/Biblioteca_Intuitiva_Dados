import React from 'react';
import { Menu, Settings, User, Bell, Sparkles, LayoutGrid, HelpCircle } from 'lucide-react';

interface Props {
  onOpenAI: () => void;
  onOpenArchitecture: () => void;
}

export const SimpleHeader: React.FC<Props> = ({ onOpenAI, onOpenArchitecture }) => {
  return (
    <header className="w-full bg-[#1b2533] text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Left icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenArchitecture}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Menu & Arquitetura"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenArchitecture}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Configurações & Blueprint"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenArchitecture}
            className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors cursor-pointer hidden sm:block"
            title="Grade de Módulos"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        {/* Center Title in all caps */}
        <div className="text-center select-none">
          <h1 className="text-sm sm:text-base font-bold tracking-wider text-slate-100 font-sans uppercase">
            BIBLIOTECA INTUITIVA DE DADOS
          </h1>
          <span className="text-[10px] text-cyan-400 font-mono tracking-tight hidden sm:block">
            LIVRO DE CONSULTA INTERATIVO · PYTHON & PANDAS
          </span>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded text-xs font-semibold shadow transition-all cursor-pointer"
            title="Assistente de Dados Gemini"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Assistente IA</span>
          </button>

          <button
            onClick={onOpenArchitecture}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer hidden sm:block"
            title="Documentação e Blueprint"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <div className="w-7 h-7 rounded-full bg-cyan-700/80 border border-cyan-400/40 flex items-center justify-center text-white text-xs font-bold shadow-inner">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
