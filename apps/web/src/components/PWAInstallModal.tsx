import React from 'react';
import { X, Smartphone, Download, Share, CheckCircle2, MoreVertical, PlusSquare } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  onNativeInstall?: () => void;
  hasNativePrompt: boolean;
}

export const PWAInstallModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isIOS,
  onNativeInstall,
  hasNativePrompt
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl border border-slate-200 space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-base">
              Installer l'application
            </h3>
            <p className="text-xs text-slate-500">Gnonsky Bet AI sur votre appareil</p>
          </div>
        </div>

        {hasNativePrompt ? (
          <div className="space-y-3 pt-1">
            <p className="text-xs text-slate-600 leading-relaxed">
              Installez l'application pour profiter d'un accès instantané hors-navigateur, d'une fluidité maximale et des prédictions en direct.
            </p>
            <button
              onClick={() => {
                if (onNativeInstall) onNativeInstall();
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Confirmer l'installation</span>
            </button>
          </div>
        ) : isIOS ? (
          <div className="space-y-3 pt-1">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-2 text-xs text-slate-700">
              <p className="font-semibold text-blue-900 flex items-center gap-1.5">
                <Share className="w-4 h-4 text-blue-600" />
                Guide d'installation iPhone / iPad (Safari) :
              </p>
              <ol className="list-decimal pl-4 space-y-1.5 text-slate-600">
                <li>
                  Appuyez sur le bouton <strong>Partager</strong> <Share className="w-3.5 h-3.5 inline text-blue-600" /> en bas de Safari.
                </li>
                <li>
                  Faites défiler le menu et sélectionnez <strong className="text-blue-900">« Sur l'écran d'accueil »</strong> <PlusSquare className="w-3.5 h-3.5 inline text-blue-600" />.
                </li>
                <li>
                  Appuyez sur <strong>Ajouter</strong> en haut à droite.
                </li>
              </ol>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold text-xs rounded-xl transition-colors"
            >
              J'ai compris
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <MoreVertical className="w-4 h-4 text-blue-600" />
                Guide d'installation Android & Ordinateur :
              </p>
              <ol className="list-decimal pl-4 space-y-1.5 text-slate-600">
                <li>
                  Ouvrez le menu du navigateur (<strong>trois points ⋮</strong> en haut à droite).
                </li>
                <li>
                  Cliquez sur <strong className="text-blue-900">« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.
                </li>
              </ol>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold text-xs rounded-xl transition-colors"
            >
              Fermer
            </button>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>PWA Certifiée • Aucun téléchargement lourd</span>
        </div>
      </div>
    </div>
  );
};

