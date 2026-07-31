import { useMemo, useState } from 'react';
import {
  DEFAULT_FILTER,
  type Reference,
  type ReferenceCategory,
  type ReferenceFilter,
} from '@modules/references/types';

export interface UseReferenceFilters {
  filter: ReferenceFilter;
  setSearch: (search: string) => void;
  setCategory: (category: ReferenceCategory | 'all') => void;
  setOnlyFavorites: (onlyFavorites: boolean) => void;
  toggleOnlyFavorites: () => void;
  reset: () => void;
  filtered: Reference[];
  countByCategory: Record<ReferenceCategory, number>;
  totalCount: number;
  favoriteCount: number;
}

export function useReferenceFilters(references: Reference[]): UseReferenceFilters {
  const [filter, setFilter] = useState<ReferenceFilter>(DEFAULT_FILTER);

  const setSearch = (search: string) => setFilter((prev) => ({ ...prev, search }));
  const setCategory = (category: ReferenceCategory | 'all') =>
    setFilter((prev) => ({ ...prev, category }));
  const setOnlyFavorites = (onlyFavorites: boolean) =>
    setFilter((prev) => ({ ...prev, onlyFavorites }));
  const toggleOnlyFavorites = () =>
    setFilter((prev) => ({ ...prev, onlyFavorites: !prev.onlyFavorites }));
  const reset = () => setFilter(DEFAULT_FILTER);

  const filtered = useMemo(() => {
    const search = filter.search.trim().toLowerCase();
    return references.filter((reference) => {
      if (filter.onlyFavorites && !reference.favorite) return false;
      if (filter.category !== 'all' && reference.category !== filter.category) return false;
      if (search) {
        const inName = reference.name.toLowerCase().includes(search);
        const inTags = reference.tags.some((tag) => tag.toLowerCase().includes(search));
        if (!inName && !inTags) return false;
      }
      return true;
    });
  }, [references, filter]);

  const countByCategory = useMemo(() => {
    const counts = {
      anime: 0,
      paisajes: 0,
      anatomia: 0,
      manos: 0,
      ojos: 0,
      cabello: 0,
      poses: 0,
      animales: 0,
      objetos: 0,
      otros: 0,
    } as Record<ReferenceCategory, number>;
    for (const reference of references) counts[reference.category]++;
    return counts;
  }, [references]);

  const totalCount = references.length;
  const favoriteCount = references.filter((r) => r.favorite).length;

  return {
    filter,
    setSearch,
    setCategory,
    setOnlyFavorites,
    toggleOnlyFavorites,
    reset,
    filtered,
    countByCategory,
    totalCount,
    favoriteCount,
  };
}