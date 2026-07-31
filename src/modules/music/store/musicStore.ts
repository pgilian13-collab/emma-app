import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RepeatMode, Track } from '@modules/music/types';

interface MusicState {
  queue: Track[];
  currentTrackId: string | null;
  shuffle: boolean;
  repeat: RepeatMode;
  volume: number;
  muted: boolean;

  setQueue: (tracks: Track[]) => void;
  addTracks: (tracks: Track[]) => void;
  removeTrack: (id: string) => void;
  clearQueue: () => void;

  playTrack: (id: string) => void;
  setCurrentTrack: (id: string | null) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;

  reorder: (from: number, to: number) => void;
}

const DEFAULTS = {
  queue: [] as Track[],
  currentTrackId: null as string | null,
  shuffle: false,
  repeat: 'off' as RepeatMode,
  volume: 0.8,
  muted: false,
};

export const useMusicStore = create<MusicState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setQueue: (tracks) => set({ queue: tracks }),
      addTracks: (tracks) =>
        set((state) => {
          const seen = new Set(state.queue.map((t) => t.id));
          const unique = tracks.filter((t) => !seen.has(t.id));
          return { queue: [...state.queue, ...unique] };
        }),
      removeTrack: (id) =>
        set((state) => ({
          queue: state.queue.filter((t) => t.id !== id),
          currentTrackId: state.currentTrackId === id ? null : state.currentTrackId,
        })),
      clearQueue: () => set({ queue: [], currentTrackId: null }),

      playTrack: (id) => set({ currentTrackId: id }),
      setCurrentTrack: (id) => set({ currentTrackId: id }),
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      cycleRepeat: () =>
        set((state) => {
          const order: RepeatMode[] = ['off', 'all', 'one'];
          const next = order[(order.indexOf(state.repeat) + 1) % order.length]!;
          return { repeat: next };
        }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setMuted: (muted) => set({ muted }),

      reorder: (from, to) =>
        set((state) => {
          if (from === to || from < 0 || to < 0) return state;
          const queue = [...state.queue];
          if (from >= queue.length || to >= queue.length) return state;
          const [moved] = queue.splice(from, 1);
          if (moved) queue.splice(to, 0, moved);
          return { queue };
        }),
    }),
    {
      name: 'emma-music',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        queue: state.queue,
        currentTrackId: state.currentTrackId,
        shuffle: state.shuffle,
        repeat: state.repeat,
        volume: state.volume,
        muted: state.muted,
      }),
    },
  ),
);

export function nextIndex(state: MusicState): number | null {
  const { queue, currentTrackId, repeat } = state;
  if (queue.length === 0) return null;
  const idx = queue.findIndex((t) => t.id === currentTrackId);
  if (idx === -1) return 0;

  if (state.shuffle) {
    if (queue.length === 1) return 0;
    let next = Math.floor(Math.random() * queue.length);
    if (next === idx) next = (next + 1) % queue.length;
    return next;
  }

  if (idx + 1 < queue.length) return idx + 1;
  return repeat === 'all' ? 0 : null;
}

export function previousIndex(state: MusicState): number | null {
  const { queue, currentTrackId } = state;
  if (queue.length === 0) return null;
  const idx = queue.findIndex((t) => t.id === currentTrackId);
  if (idx <= 0) return 0;
  return idx - 1;
}