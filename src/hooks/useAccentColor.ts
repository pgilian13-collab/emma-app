import { useEffect } from 'react';
import { useSettingsStore } from '@store/settingsStore';

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function rgbFromHex(hex: string): string {
  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
}

export function useAccentColor(): void {
  const primaryColor = useSettingsStore((state) => state.primaryColor);

  useEffect(() => {
    const root = document.documentElement;
    if (HEX_COLOR_REGEX.test(primaryColor)) {
      root.style.setProperty('--color-primary', primaryColor);
      root.style.setProperty('--color-primary-rgb', rgbFromHex(primaryColor));
    } else {
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--color-primary-rgb');
    }
  }, [primaryColor]);
}
