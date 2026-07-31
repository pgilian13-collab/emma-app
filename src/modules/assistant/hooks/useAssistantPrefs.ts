import { useEffect, useState } from 'react';
import { readPreferences, writePreferences } from '@modules/assistant/services/preferencesService';

export interface UseAssistantPrefs {
  showControls: boolean;
  showGrid: boolean;
  setShowControls: (value: boolean) => void;
  setShowGrid: (value: boolean) => void;
}

export function useAssistantPrefs(): UseAssistantPrefs {
  const [showControls, setShowControls] = useState<boolean>(() => readPreferences().showControls);
  const [showGrid, setShowGrid] = useState<boolean>(() => readPreferences().showGrid);

  useEffect(() => {
    const stored = readPreferences();
    writePreferences({ ...stored, showControls, showGrid });
  }, [showControls, showGrid]);

  return { showControls, showGrid, setShowControls, setShowGrid };
}