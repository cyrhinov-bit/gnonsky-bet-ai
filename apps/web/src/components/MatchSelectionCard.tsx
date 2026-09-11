import React from 'react';
import { ComboSelection } from '@football/types';
import { Trophy, Cpu } from 'lucide-react';

interface Props {
  selection: ComboSelection;
  index: number;
}

export const MatchSelectionCard: React.FC<Props> = ({ selection, index }) => {
  const isOver = selection.market === 'OVER_2_5';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3 transition-all hover:border-slate-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <Trophy className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-mono text-[11px] text-blue-700 font-semibold uppercase tracking-wider truncate">
            {selection.competition}
          </span>
        </div>
        <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
          Sélection #{index + 1}
        </span>
      </div>

      <div className="flex justify-between items-center py-1">
        <div className="flex flex-col min-w-0 pr-2">
          <span className="font-display text-base text-slate-900 font-bold truncate">{selection.home_team}</span>
          <span className="font-display text-base text-slate-600 font-medium truncate">{selection.away_team}</span>
        </div>
        <div className="text-right shrink-0">
          <span className="font-mono text-[10px] text-violet-600 block font-medium">BetStudy</span>
          <span className="font-display text-2xl text-blue-600 font-bold tracking-tight">
            {selection.odds.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded text-xs font-mono font-bold tracking-wider border ${
              isOver
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-orange-50 text-orange-700 border-orange-200'
            }`}
          >
            {isOver ? 'OVER 2.5 BUTS' : 'LES 2 ÉQUIPES MARQUENT (BTTS)'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
          <Cpu className="w-3.5 h-3.5 text-violet-600" />
          <span>Prob: <strong className="text-slate-900">{Math.round(selection.estimated_probability * 100)}%</strong></span>
        </div>
      </div>
    </div>
  );
};

