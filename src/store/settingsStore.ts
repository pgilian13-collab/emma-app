import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppSettings, ThemeMode, AppLanguage } from '@app-types/index';

interface SettingsState extends AppSettings {
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: AppLanguage) => void;
  setPrimaryColor: (color: string) => void;
  reset: () => void;
}

const DEFAULTS: AppSettings = {
  theme: 'dark',
  language: 'es',
  primaryColor: '#8B5CF6',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      reset: () => set(DEFAULTS),
    }),
    {
      name: 'emma-settings',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);