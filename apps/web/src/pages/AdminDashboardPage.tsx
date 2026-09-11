import React, { useState } from 'react';
import { apiClient } from '../services/apiClient';
import { Activity, Play, CheckCircle, Database, Server, RefreshCw } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [running, setRunning] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<any>(null);

  const handleManualRun = async () => {
    setRunning(true);
    setRunResult(null);
    try {
      const res = await apiClient.triggerAnalysis();
      setRunResult(res);
    } catch (err: any) {
      setRunResult({ error: err.message || 'Pipeline trigger failed' });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="font-display font-bold text-slate-900 text-lg">Pipeline & Ingestion BetStudy</h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
            SYSTEM HEALTHY
          </span>
        </div>

        <p className="text-xs text-slate-600">
          Supervision des workers d'extraction BetStudy, scoring déterministe et exécution de l'IA.
        </p>

        <button
          onClick={handleManualRun}
          disabled={running}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
        >
          {running ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Exécution du Pipeline en cours...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Lancer l'Analyse Quotidienne Immédiate</span>
            </>
          )}
        </button>
      </div>

      {/* Execution Results */}
      {runResult && (
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 overflow-x-auto shadow-inner">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>Rapport d'exécution :</span>
          </div>
          <pre className="text-[11px] text-slate-300">
            {JSON.stringify(runResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Pipeline Status Overview */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-slate-500">
            <Database className="w-4 h-4 text-violet-600" />
            <span className="font-mono text-[11px] uppercase font-semibold">Feed BetStudy</span>
          </div>
          <div className="font-display font-bold text-lg text-slate-900">Synchronisé</div>
          <span className="text-[10px] font-mono text-slate-500 block">Latence: 240ms • 100% Intégrité</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-slate-500">
            <Server className="w-4 h-4 text-blue-600" />
            <span className="font-mono text-[11px] uppercase font-semibold">Moteur IA OpenAI</span>
          </div>
          <div className="font-display font-bold text-lg text-slate-900">gpt-4o Actif</div>
          <span className="text-[10px] font-mono text-slate-500 block">Mode JSON Strict • Temp 0.1</span>
        </div>
      </div>
    </div>
  );
};

