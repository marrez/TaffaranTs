import { useEffect } from 'react';
import { GameState } from '@/types/game';
import { saveGameState, loadGameState } from '@/lib/persistence';

/**
 * Hook to auto-persist game state and restore on mount
 */
export const usePersistence = (
  gameState: GameState,
  onRestore?: (state: GameState) => void
) => {
  // Load saved state on mount
  useEffect(() => {
    const restore = async () => {
      const savedState = await loadGameState();
      if (savedState && onRestore) {
        onRestore(savedState);
      }
    };
    restore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save on state changes
  useEffect(() => {
    // Debounce saves to avoid excessive writes
    const timer = setTimeout(() => {
      saveGameState(gameState);
    }, 500);
    return () => clearTimeout(timer);
  }, [gameState]);

  return null;
};

export default usePersistence;
