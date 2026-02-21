// Hook pour activer le débogage avec Ctrl+Shift+D
import { useEffect, useState } from 'react';

export function useDebugPanel() {
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+D pour activer/désactiver
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowDebug(prev => !prev);
        console.log('🐛 Panneau de débogage', !showDebug ? 'activé' : 'désactivé');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDebug]);

  return showDebug;
}
