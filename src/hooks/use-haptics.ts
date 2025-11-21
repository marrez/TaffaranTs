import { useCallback } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

/**
 * useHaptics abstracts platform haptic feedback.
 * On web it silently no-ops; on iOS/Android it triggers light impact.
 */
export const useHaptics = () => {
  const isNative = Capacitor.isNativePlatform();

  const impactLight = useCallback(async () => {
    if (!isNative) return; // web fallback
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      // swallow errors – haptics non-critical
    }
  }, [isNative]);

  const impactMedium = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {}
  }, [isNative]);

  const impactHeavy = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch {}
  }, [isNative]);

  return { impactLight, impactMedium, impactHeavy };
};

export default useHaptics;
