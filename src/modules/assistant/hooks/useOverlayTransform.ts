import { useCallback, useEffect, useState } from 'react';
import type { OverlayTransform } from '@modules/assistant/types';
import {
  readPreferences,
  writePreferences,
  type StoredPreferences,
} from '@modules/assistant/services/preferencesService';

const DEFAULT_TRANSFORM: OverlayTransform = {
  left: 0,
  top: 0,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  opacity: 0.55,
};

export interface UseOverlayTransformOptions {
  lastImageName: string | null;
}

export function useOverlayTransform({ lastImageName }: UseOverlayTransformOptions) {
  const [prefs, setPrefs] = useState<StoredPreferences>(() => readPreferences());
  const [transform, setTransform] = useState<OverlayTransform>(
    () => readPreferences().lastTransform ?? DEFAULT_TRANSFORM,
  );
  const [locked, setLocked] = useState<boolean>(() => readPreferences().locked);

  useEffect(() => {
    const stored = readPreferences();
    if (
      stored.lastImageName &&
      stored.lastImageName === lastImageName &&
      stored.lastTransform
    ) {
      setTransform(stored.lastTransform);
    } else if (lastImageName && !stored.lastImageName) {
      setTransform(DEFAULT_TRANSFORM);
    }
  }, [lastImageName]);

  useEffect(() => {
    const next: StoredPreferences = {
      ...prefs,
      lastTransform: transform,
      lastImageName,
      locked,
    };
    writePreferences(next);
    setPrefs(next);
  }, [transform, locked, lastImageName, prefs]);

  const update = useCallback((patch: Partial<OverlayTransform>) => {
    setTransform((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setTransform(DEFAULT_TRANSFORM);
  }, []);

  const clear = useCallback(() => {
    setTransform(DEFAULT_TRANSFORM);
    setLocked(false);
  }, []);

  const toggleLock = useCallback(() => {
    setLocked((prev) => !prev);
  }, []);

  return {
    transform,
    locked,
    update,
    reset,
    clear,
    toggleLock,
    defaults: DEFAULT_TRANSFORM,
  };
}