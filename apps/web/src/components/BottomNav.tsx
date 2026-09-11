import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, History, LayoutDashboard } from 'lucide-react';

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="max-w-lg mx-auto px-6 h-16 flex items-center justify-around">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Flame className="w-5 h-5" />
          <span className="text-[11px] font-mono">Combiné</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <History className="w-5 h-5" />
          <span className="text-[11px] font-mono">Historique</span>
        </NavLink>

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[11px] font-mono">Pipeline Admin</span>
        </NavLink>
      </div>
    </nav>
  );
};

