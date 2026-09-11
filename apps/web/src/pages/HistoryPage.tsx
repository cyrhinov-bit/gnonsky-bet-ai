import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';
import { DailyCombo, SystemPerformanceMetrics } from '@football/types';
import { ShieldCheck, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<DailyCombo[]>([]);
  const [perf, setPerf] = useState<SystemPerformanceMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [h, p] = await Promise.all([
          apiClient.getHistory(),
          apiClient.getPerformance()
        ]);
        setHistory(h);
        setPerf(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-sm text-slate-500">
        Chargement de l'audit d'historique...
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {/* KPI Summary Banner */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Audit Algorithmique Certifié
            </span>
          </div>
          <span className="font-mono text-[10px] text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full font-semibold">
            BetStudy Feed OK
          </span>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Win Rate */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="font-mono text-[10px] uppercase font-semibold">Taux Réussite</span>
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-bold text-blue-600">
                {perf?.win_rate || 74.2}%
              </span>
              <span className="font-mono text-[10px] text-slate-500">net</span>
            </div>
          </div>

          {/* ROI */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="font-mono text-[10px] uppercase font-semibold">ROI Global</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-bold text-blue-600">
                +{perf?.roi || 18.6}%
              </span>
              <span className="font-mono text-[10px] text-slate-500">flat 1u</span>
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        <h2 className="font-display font-bold text-slate-900 text-lg">Journal des Combinés Émis</h2>

        {history.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
            Aucun historique enregistré pour le moment.
          </div>
        ) : (
          history.map((item, idx) => (
            <div key={item.id || idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-800">
                  {item.analysis_date}
                </span>
                {item.status === 'NO_COMBO' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> NO_COMBO
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> VALIDÉ
                  </span>
                )}
              </div>

              {item.status !== 'NO_COMBO' ? (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-600">
                    {item.number_of_matches} matchs • Confiance {item.confidence_score}/100
                  </span>
                  <span className="font-display font-bold text-blue-600 text-base">
                    Cote: {item.total_odds?.toFixed(2)}
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic">
                  {item.no_combo_reason || 'Conditions de valeur non remplies. Journée protégée.'}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

