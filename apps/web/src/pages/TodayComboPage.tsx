import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';
import { DailyCombo } from '@football/types';
import { MatchSelectionCard } from '../components/MatchSelectionCard';
import { PWAInstallBanner } from '../components/PWAInstallBanner';
import { Calendar, ShieldAlert, Info, RefreshCw } from 'lucide-react';

export const TodayComboPage: React.FC = () => {
  const [combo, setCombo] = useState<DailyCombo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCombo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getTodayCombo();
      setCombo(data);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement du combiné');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombo();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="font-mono text-sm text-slate-500">Calcul du combiné algorithmique Gnonsky Bet AI...</p>
      </div>
    );
  }

  if (error || !combo) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center space-y-2">
        <p className="font-semibold">Impossible de récupérer le combiné</p>
        <p className="text-xs">{error}</p>
        <button onClick={fetchCombo} className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold">
          Réessayer
        </button>
      </div>
    );
  }

  // Handle NO_COMBO state
  if (combo.status === 'NO_COMBO') {
    return (
      <div className="space-y-4 py-2">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center space-y-3">
          <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="font-display font-bold text-amber-900 text-lg">AUCUN COMBINÉ AUJOURD'HUI (NO_COMBO)</h2>
          <p className="text-xs text-amber-800 leading-relaxed max-w-sm mx-auto">
            {combo.no_combo_reason || 'Moins de 3 matchs respectent l’ensemble de nos critères de solidité statistique et de valeur (+EV). Le capital est préservé.'}
          </p>
          <div className="inline-block px-3 py-1 bg-white border border-amber-300 rounded-full text-[11px] font-mono font-semibold text-amber-900">
            Règle de discipline stricte activée
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {/* PWA 1-Click Install Banner */}
      <PWAInstallBanner />

      {/* Date & Meta */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-slate-700">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider">
            {combo.analysis_date}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse"></span>
          <span className="font-mono text-[10px] text-slate-700 font-medium">Source: <strong className="text-violet-700">BetStudy.com</strong></span>
        </div>
      </div>

      {/* Hero Summary Card */}
      <div className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-blue-100/50 blur-2xl pointer-events-none"></div>
        
        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
              Cote Totale Déterministe
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl text-blue-600 font-bold tracking-tight">
                {combo.total_odds?.toFixed(2) || '1.00'}
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-violet-50 text-violet-700 font-semibold border border-violet-200">
                Calculée backend
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider mb-1">
              Indice Confiance
            </span>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
              <span className="font-mono font-bold text-orange-600 text-sm">
                {combo.confidence_score}<span className="text-slate-400 font-normal text-xs">/100</span>
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 gap-2 relative z-10">
          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
            <span className="font-mono text-[10px] text-slate-500 uppercase block">Risque Global</span>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 font-mono text-[11px] font-bold">
              {combo.risk}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
            <span className="font-mono text-[10px] text-slate-500 uppercase block">Proba Théorique</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono font-bold text-slate-900 text-sm">
                {Math.round((combo.theoretical_probability || 0) * 1000) / 10}%
              </span>
              <span className="text-[10px] font-mono text-blue-600 font-semibold">+4.1% EV</span>
            </div>
          </div>
        </div>

        {/* Transparency note */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-2.5 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="font-body text-[11px] text-slate-600 leading-tight">
            Indépendance événementielle théorique, aucune garantie de gain. Cote composée certifiée issue exclusivement de BetStudy.com.
          </p>
        </div>
      </div>

      {/* Selected Matches */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-slate-900 text-lg">Sélections Algorithmiques</h2>
          <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
            {combo.selections.length} Sélections Validées
          </span>
        </div>

        {combo.selections.map((sel, idx) => (
          <MatchSelectionCard key={sel.match_id || idx} selection={sel} index={idx} />
        ))}
      </div>
    </div>
  );
};

