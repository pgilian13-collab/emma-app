import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  now: Date;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setNow: (date: Date) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  now: new Date(),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setNow: (date) => set({ now: date }),
}));
