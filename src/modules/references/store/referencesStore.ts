import { create } from 'zustand';
import type { Reference, ReferenceCategory } from '@modules/references/types';

interface ReferencesState {
  references: Reference[];
  hydrated: boolean;

  hydrate: (references: Reference[]) => void;
  addReferences: (references: Reference[]) => void;
  removeReference: (id: string) => void;
  updateReference: (id: string, patch: Partial<Reference>) => void;
  toggleFavorite: (id: string) => void;
  setCategory: (id: string, category: ReferenceCategory) => void;
  clearAll: () => void;
}

export const useReferencesStore = create<ReferencesState>((set) => ({
  references: [],
  hydrated: false,

  hydrate: (references) => set({ references, hydrated: true }),
  addReferences: (newRefs) =>
    set((state) => {
      const seen = new Set(state.references.map((r) => r.id));
      const unique = newRefs.filter((r) => !seen.has(r.id));
      return { references: [...state.references, ...unique] };
    }),
  removeReference: (id) =>
    set((state) => ({ references: state.references.filter((r) => r.id !== id) })),
  updateReference: (id, patch) =>
    set((state) => ({
      references: state.references.map((r) =>
        r.id === id ? { ...r, ...patch, updatedAt: Date.now() } : r,
      ),
    })),
  toggleFavorite: (id) =>
    set((state) => ({
      references: state.references.map((r) =>
        r.id === id
          ? { ...r, favorite: !r.favorite, updatedAt: Date.now() }
          : r,
      ),
    })),
  setCategory: (id, category) =>
    set((state) => ({
      references: state.references.map((r) =>
        r.id === id ? { ...r, category, updatedAt: Date.now() } : r,
      ),
    })),
  clearAll: () => set({ references: [] }),
}));

export function findReference(state: ReferencesState, id: string): Reference | undefined {
  return state.references.find((r) => r.id === id);
}