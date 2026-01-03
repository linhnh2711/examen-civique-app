import React from 'react';
import { Download, X } from 'lucide-react';

const InstallPrompt = ({ onInstall, onClose }) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  return (
    <div className="fixed bottom-20 left-20 right-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-2xl z-50 animate-slideUp">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Download className="w-6 h-6 flex-shrink-0" />
          <div>
            <div className="font-bold text-lg">Installer l'application</div>
            <div className="text-sm text-white/90 mt-1">
              {isIOS ? (
                <>
                  Sur Safari: Appuyez sur <span className="font-bold">Partager</span> 
                  {' '}puis <span className="font-bold">"Sur l'écran d'accueil"</span>
                </>
              ) : (
                "Accédez à l'app hors ligne et sur votre écran d'accueil"
              )}
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors ml-2 flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {!isIOS && (
        <button
          onClick={onInstall}
          className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
        >
          Installer maintenant
        </button>
      )}
    </div>
  );
};

export default InstallPrompt;