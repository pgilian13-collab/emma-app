import { FiSearch, FiX, FiHeart } from 'react-icons/fi';
import {
  CATEGORY_META,
  REFERENCE_CATEGORIES,
  type ReferenceCategory,
  type ReferenceFilter,
} from '@modules/references/types';
import { cn } from '@utils/cn';

interface ReferenceFiltersProps {
  filter: ReferenceFilter;
  countByCategory: Record<ReferenceCategory, number>;
  totalCount: number;
  favoriteCount: number;
  filteredCount: number;
  setSearch: (search: string) => void;
  setCategory: (category: ReferenceCategory | 'all') => void;
  toggleOnlyFavorites: () => void;
  reset: () => void;
  language: 'es' | 'en';
}

export function ReferenceFilters({
  filter,
  countByCategory,
  totalCount,
  favoriteCount,
  filteredCount,
  setSearch,
  setCategory,
  toggleOnlyFavorites,
  reset,
  language,
}: ReferenceFiltersProps) {
  const es = language === 'es';
  const hasFilters =
    filter.search !== '' || filter.category !== 'all' || filter.onlyFavorites;

  return (
    <div className="panel-card flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40">
          {es ? 'Filtros' : 'Filters'}
        </h3>
        <span className="text-xs text-white/40">
          {filteredCount} / {totalCount}
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-panel px-3 py-2">
        <FiSearch size={14} className="text-white/40" />
        <input
          value={filter.search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={es ? 'Buscar por nombre…' : 'Search by name…'}
          className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
        {filter.search ? (
          <button
            onClick={() => setSearch('')}
            aria-label={es ? 'Limpiar' : 'Clear'}
            className="focus-ring rounded-md p-0.5 text-white/40 hover:bg-white/5 hover:text-white"
          >
            <FiX size={14} />
          </button>
        ) : null}
      </div>

      <button
        onClick={toggleOnlyFavorites}
        className={cn(
          'focus-ring flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition',
          filter.onlyFavorites
            ? 'border-primary bg-primary/15 text-white'
            : 'border-white/10 bg-panel text-white/70 hover:bg-panelLight',
        )}
      >
        <span className="flex items-center gap-2">
          <FiHeart size={14} />
          {es ? 'Solo favoritos' : 'Only favorites'}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-white/50">
          {favoriteCount}
        </span>
      </button>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
          {es ? 'Categoría' : 'Category'}
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip
            active={filter.category === 'all'}
            onClick={() => setCategory('all')}
            label={es ? 'Todas' : 'All'}
            count={totalCount}
          />
          {REFERENCE_CATEGORIES.map((key) => (
            <Chip
              key={key}
              active={filter.category === key}
              onClick={() => setCategory(key)}
              label={`${CATEGORY_META[key].emoji} ${CATEGORY_META[key].label}`}
              count={countByCategory[key]}
            />
          ))}
        </div>
      </div>

      {hasFilters ? (
        <button
          onClick={reset}
          className="focus-ring self-start rounded-lg px-3 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white"
        >
          {es ? 'Restablecer filtros' : 'Reset filters'}
        </button>
      ) : null}
    </div>
  );
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}

function Chip({ active, onClick, label, count }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'focus-ring inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition',
        active
          ? 'border-primary bg-primary/20 text-white shadow-glow'
          : 'border-white/10 bg-panel text-white/60 hover:bg-panelLight',
      )}
    >
      {label}
      <span
        className={cn(
          'rounded-full px-1.5 text-[10px] font-bold',
          active ? 'bg-white/15 text-white' : 'bg-white/5 text-white/50',
        )}
      >
        {count}
      </span>
    </button>
  );
}