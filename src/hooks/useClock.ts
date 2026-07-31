import { useEffect } from 'react';
import { useUiStore } from '@store/uiStore';

export function useClock(intervalMs = 1000): Date {
  const now = useUiStore((state) => state.now);
  const setNow = useUiStore((state) => state.setNow);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, setNow]);

  return now;
}
