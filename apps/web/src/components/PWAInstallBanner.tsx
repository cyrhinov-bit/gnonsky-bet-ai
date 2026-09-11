import React, { useState } from 'react';
import { Download, Share, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosGuide(!showIosGuide);
    } else {
      await installApp();
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-3.5 shadow-md space-y-2 relative animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-xs tracking-tight truncate">
              Installer l'application Gnonsky Bet AI
            </p>
            <p className="text-[11px] text-blue-100 truncate">
              Accès instantané 1-clic sur votre écran d'accueil
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-white text-blue-700 font-display font-bold text-xs rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Installer</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-blue-200 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIosGuide && (
        <div className="pt-2 mt-2 border-t border-white/20 text-xs space-y-1 text-blue-100 font-sans">
          <p className="font-semibold text-white flex items-center gap-1.5">
            <Share className="w-3.5 h-3.5 text-blue-300" />
            Pour installer sur iPhone / iPad :
          </p>
          <p className="pl-5 text-[11px]">
            1. Touchez l'icône de partage <strong>Partager</strong> en bas de Safari.<br />
            2. Faites défiler et choisissez <strong>« Sur l'écran d'accueil »</strong>.
          </p>
        </div>
      )}
    </div>
  );
};
