import React, { useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Do not show if already in standalone app mode or user dismissed
  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await installApp();
      if (!installed) {
        setModalOpen(true);
      }
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
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
              title="Masquer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <PWAInstallModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isIOS={isIOS}
        hasNativePrompt={isInstallable}
        onNativeInstall={installApp}
      />
    </>
  );
};
