import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Idea, IdeaCategory, IdeaSource } from '@modules/ideas/types';

interface IdeasState {
  ideas: Idea[];
  historyIds: string[];

  generateIdea: (idea: Idea) => void;
  addCustomIdea: (idea: Idea) => void;
  removeIdea: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateIdea: (id: string, patch: Partial<Pick<Idea, 'text' | 'category'>>) => void;
  clearHistory: () => void;
  clearAll: () => void;
}

export const useIdeasStore = create<IdeasState>()(
  persist(
    (set) => ({
      ideas: [],
      historyIds: [],

      generateIdea: (idea) =>
        set((state) => {
          if (state.ideas.some((existing) => existing.id === idea.id)) {
            return state;
          }
          return {
            ideas: [idea, ...state.ideas],
            historyIds: [idea.id, ...state.historyIds].slice(0, 50),
          };
        }),

      addCustomIdea: (idea) =>
        set((state) => {
          if (state.ideas.some((existing) => existing.id === idea.id)) {
            return state;
          }
          return {
            ideas: [idea, ...state.ideas],
            historyIds: state.historyIds,
          };
        }),

      removeIdea: (id) =>
        set((state) => ({
          ideas: state.ideas.filter((i) => i.id !== id),
          historyIds: state.historyIds.filter((hid) => hid !== id),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          ideas: state.ideas.map((i) =>
            i.id === id ? { ...i, favorite: !i.favorite } : i,
          ),
        })),

      updateIdea: (id, patch) =>
        set((state) => ({
          ideas: state.ideas.map((i) =>
            i.id === id ? { ...i, ...patch } : i,
          ),
        })),

      clearHistory: () =>
        set((state) => ({
          historyIds: [],
          ideas: state.ideas.filter((i) => i.favorite || i.source === 'custom'),
        })),

      clearAll: () => set({ ideas: [], historyIds: [] }),
    }),
    {
      name: 'emma-ideas',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        ideas: state.ideas,
        historyIds: state.historyIds,
      }),
    },
  ),
);

export function makeIdeaId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `idea-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function makeIdea(params: {
  text: string;
  category: IdeaCategory;
  source: IdeaSource;
}): Idea {
  return {
    id: makeIdeaId(),
    text: params.text,
    category: params.category,
    source: params.source,
    favorite: false,
    createdAt: Date.now(),
    usageCount: 0,
  };
}