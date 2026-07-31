import { useCallback, useEffect, useState } from 'react';
import {
  listReferences,
  saveReferences,
  saveReference,
  deleteReference as dbDeleteReference,
  clearReferences as dbClearReferences,
  getReference as dbGetReference,
} from '@modules/references/services/referenceStorage';
import { processImage, makeReferenceId } from '@modules/references/services/imageProcessing';
import { getBlobUrlCache } from '@modules/references/services/blobUrlCache';
import { useReferencesStore } from '@modules/references/store/referencesStore';
import type { Reference, ReferenceCategory } from '@modules/references/types';

export interface UseReferences {
  references: Reference[];
  hydrated: boolean;
  loading: boolean;
  addFiles: (files: FileList | File[], category?: ReferenceCategory) => Promise<number>;
  removeReference: (id: string) => Promise<void>;
  updateReference: (id: string, patch: Partial<Reference>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  setCategory: (id: string, category: ReferenceCategory) => Promise<void>;
  clearAll: () => Promise<void>;
}

interface StoredEntry {
  meta: Reference;
  blob: Blob;
  thumbnail: Blob;
}

export function useReferences(): UseReferences {
  const references = useReferencesStore((s) => s.references);
  const hydrated = useReferencesStore((s) => s.hydrated);
  const hydrate = useReferencesStore((s) => s.hydrate);
  const addReferences = useReferencesStore((s) => s.addReferences);
  const storeRemove = useReferencesStore((s) => s.removeReference);
  const storeUpdate = useReferencesStore((s) => s.updateReference);
  const storeToggleFavorite = useReferencesStore((s) => s.toggleFavorite);
  const storeSetCategory = useReferencesStore((s) => s.setCategory);
  const storeClearAll = useReferencesStore((s) => s.clearAll);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated) return;
    let cancelled = false;
    listReferences()
      .then((stored) => {
        if (cancelled) return;
        const cache = getBlobUrlCache();
        for (const entry of stored) {
          cache.set(entry.meta.id, entry.thumbnail);
        }
        hydrate(stored.map((entry) => entry.meta));
      })
      .catch(() => {
        if (!cancelled) hydrate([]);
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, hydrate]);

  useEffect(() => {
    return () => {
      getBlobUrlCache().clear();
    };
  }, []);

  const persistEntry = useCallback(
    async (id: string, mutator: (entry: StoredEntry) => StoredEntry) => {
      const stored = await dbGetReference(id);
      if (!stored) return;
      await saveReference(mutator(stored));
    },
    [],
  );

  const addFiles = useCallback(
    async (files: FileList | File[], category: ReferenceCategory = 'otros') => {
      setLoading(true);
      try {
        const list = Array.from(files);
        const entries: StoredEntry[] = [];

        for (const file of list) {
          const processed = await processImage(file);
          if (!processed) continue;
          const id = makeReferenceId();
          const now = Date.now();
          const baseName = file.name.replace(/\.[^.]+$/, '');
          const meta: Reference = {
            id,
            name: baseName || 'Sin título',
            category,
            favorite: false,
            tags: [],
            width: processed.width,
            height: processed.height,
            mimeType: file.type || 'image/*',
            size: file.size,
            createdAt: now,
            updatedAt: now,
          };
          entries.push({ meta, blob: processed.blob, thumbnail: processed.thumbnail });
        }

        if (entries.length === 0) return 0;

        const cache = getBlobUrlCache();
        for (const entry of entries) {
          cache.set(entry.meta.id, entry.thumbnail);
        }
        addReferences(entries.map((e) => e.meta));
        await saveReferences(entries);
        return entries.length;
      } finally {
        setLoading(false);
      }
    },
    [addReferences],
  );

  const removeReference = useCallback(
    async (id: string) => {
      getBlobUrlCache().revoke(id);
      storeRemove(id);
      await dbDeleteReference(id);
    },
    [storeRemove],
  );

  const updateReference = useCallback(
    async (id: string, patch: Partial<Reference>) => {
      storeUpdate(id, patch);
      await persistEntry(id, (entry) => ({
        ...entry,
        meta: { ...entry.meta, ...patch, updatedAt: Date.now() },
      }));
    },
    [storeUpdate, persistEntry],
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      const current = useReferencesStore.getState().references.find((r) => r.id === id);
      if (!current) return;
      const next = !current.favorite;
      storeToggleFavorite(id);
      await persistEntry(id, (entry) => ({
        ...entry,
        meta: { ...entry.meta, favorite: next, updatedAt: Date.now() },
      }));
    },
    [storeToggleFavorite, persistEntry],
  );

  const setCategory = useCallback(
    async (id: string, category: ReferenceCategory) => {
      storeSetCategory(id, category);
      await persistEntry(id, (entry) => ({
        ...entry,
        meta: { ...entry.meta, category, updatedAt: Date.now() },
      }));
    },
    [storeSetCategory, persistEntry],
  );

  const clearAll = useCallback(async () => {
    getBlobUrlCache().clear();
    storeClearAll();
    await dbClearReferences();
  }, [storeClearAll]);

  return {
    references,
    hydrated,
    loading,
    addFiles,
    removeReference,
    updateReference,
    toggleFavorite,
    setCategory,
    clearAll,
  };
}