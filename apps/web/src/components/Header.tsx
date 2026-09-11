import React from 'react';
import { Sparkles, LogOut } from 'lucide-react';

interface Props {
  onLogout?: () => void;
}

export const Header: React.FC<Props> = ({ onLogout }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="h-16 max-w-lg mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-slate-900 text-lg tracking-tight">Gnonsky Bet AI</span>
              <span className="px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 font-mono text-[10px] font-semibold tracking-wider border border-violet-200">
                v2.4
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="font-mono text-[11px] text-slate-500 font-medium">BetStudy Verified Data</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end">
            <span className="font-mono text-[11px] text-blue-600 font-bold">SYNCHRO LIVE</span>
            <span className="font-mono text-[10px] text-slate-400">100% Cotes</span>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Verrouiller la session"
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
