import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface Props {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<Props> = ({ onLoginSuccess }) => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (accessCode.trim() === 'M@jorix90') {
        try {
          localStorage.setItem('gnonsky_auth_token', 'AUTH_VALID_MAJORIX90');
          localStorage.setItem('gnonsky_logged_in', 'true');
          localStorage.setItem('betpulse_auth_token', 'AUTH_VALID_MAJORIX90');
        } catch (e) {
          console.error(e);
        }
        onLoginSuccess();
      } else {
        setError('Code d\'accès incorrect. Veuillez vérifier votre clé d\'autorisation.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-blue-100/60 blur-2xl pointer-events-none"></div>

        {/* Header & Brand */}
        <div className="flex flex-col items-center text-center space-y-3 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Gnonsky Bet AI</h1>
              <span className="px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 font-mono text-[10px] font-semibold border border-violet-200">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Accès restreint aux prédictions & combinés certifiés
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider">
              Code d'accès sécurisé
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Entrez votre code..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !accessCode}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="font-mono text-xs">Vérification de l'autorisation...</span>
            ) : (
              <>
                <span>Déverrouiller l'accès</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Algorithme Gnonsky Bet AI • BetStudy Feed</span>
        </div>
      </div>
    </div>
  );
};

