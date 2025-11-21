import { Preferences } from '@capacitor/preferences';
import { GameState } from '@/types/game';

const GAME_STATE_KEY = 'taffaran_game_state';

/**
 * Save game state to persistent storage
 */
export const saveGameState = async (state: GameState): Promise<void> => {
  try {
    await Preferences.set({
      key: GAME_STATE_KEY,
      value: JSON.stringify(state),
    });
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

/**
 * Load game state from persistent storage
 */
export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const { value } = await Preferences.get({ key: GAME_STATE_KEY });
    if (!value) return null;
    return JSON.parse(value) as GameState;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

/**
 * Clear saved game state
 */
export const clearGameState = async (): Promise<void> => {
  try {
    await Preferences.remove({ key: GAME_STATE_KEY });
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};
