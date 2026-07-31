import { useCallback, useState } from 'react';
import { useSettingsStore } from '@store/settingsStore';
import { useReferences } from '../hooks/useReferences';
import { useReferenceFilters } from '../hooks/useReferenceFilters';
import { ReferenceGrid } from './ReferenceGrid';
import { ReferenceFilters } from './ReferenceFilters';
import { ReferenceUploader } from './ReferenceUploader';
import { ReferenceEditor } from './ReferenceEditor';
import { ReferencePreview } from './ReferencePreview';
import { EmptyState } from './EmptyState';
import type { Reference, ReferenceCategory } from '../types';

export function ReferencesWorkspace() {
  const language = useSettingsStore((s) => s.language);
  const es = language === 'es';

  const refs = useReferences();
  const filters = useReferenceFilters(refs.references);

  const [editing, setEditing] = useState<Reference | null>(null);
  const [previewing, setPreviewing] = useState<Reference | null>(null);

  const handleRemove = useCallback(
    async (id: string) => {
      if (!window.confirm(es ? '¿Eliminar esta referencia?' : 'Remove this reference?')) return;
      await refs.removeReference(id);
    },
    [refs, es],
  );

  const handleClearAll = useCallback(async () => {
    if (!window.confirm(es ? '¿Eliminar TODAS las referencias?' : 'Remove ALL references?')) return;
    await refs.clearAll();
  }, [refs, es]);

  const handleEditSave = useCallback(
    async (id: string, patch: { name: string; category: ReferenceCategory }) => {
      await refs.updateReference(id, patch);
    },
    [refs],
  );

  if (!refs.hydrated) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-primary" />
      </div>
    );
  }

  if (refs.references.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <EmptyState language={language} />
        <ReferenceUploader
          onFiles={refs.addFiles}
          loading={refs.loading}
          defaultCategory="otros"
          language={language}
        />
      </div>
    );
  }

  const hasNoResults = filters.filtered.length === 0;
  const hasFilters =
    filters.filter.search !== '' ||
    filters.filter.category !== 'all' ||
    filters.filter.onlyFavorites;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-4">
          <ReferenceUploader
            onFiles={refs.addFiles}
            loading={refs.loading}
            defaultCategory={filters.filter.category !== 'all' ? filters.filter.category : 'otros'}
            language={language}
          />
          <ReferenceFilters
            filter={filters.filter}
            countByCategory={filters.countByCategory}
            totalCount={filters.totalCount}
            favoriteCount={filters.favoriteCount}
            filteredCount={filters.filtered.length}
            setSearch={filters.setSearch}
            setCategory={filters.setCategory}
            toggleOnlyFavorites={filters.toggleOnlyFavorites}
            reset={filters.reset}
            language={language}
          />
          <div className="panel-card p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              {es ? 'Zona peligrosa' : 'Danger zone'}
            </p>
            <p className="mt-1 text-xs text-white/50">
              {es
                ? 'Borra todas las referencias almacenadas localmente.'
                : 'Delete every locally stored reference.'}
            </p>
            <button
              onClick={handleClearAll}
              className="focus-ring mt-3 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/10"
            >
              {es ? 'Borrar todo' : 'Erase all'}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {hasNoResults ? (
            <div className="panel-card flex flex-col items-center gap-3 p-10 text-center">
              <p className="text-sm text-white/60">
                {es
                  ? 'No hay referencias que coincidan con los filtros.'
                  : 'No references match the filters.'}
              </p>
              {hasFilters ? (
                <button
                  onClick={filters.reset}
                  className="focus-ring rounded-lg border border-white/10 bg-panel px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-panelLight"
                >
                  {es ? 'Limpiar filtros' : 'Clear filters'}
                </button>
              ) : null}
            </div>
          ) : (
            <ReferenceGrid
              references={filters.filtered}
              onToggleFavorite={(id) => void refs.toggleFavorite(id)}
              onEdit={(reference) => setEditing(reference)}
              onRemove={(id) => void handleRemove(id)}
              onPreview={(reference) => setPreviewing(reference)}
              language={language}
            />
          )}
        </div>
      </div>

      <ReferenceEditor
        reference={editing}
        onClose={() => setEditing(null)}
        onSave={handleEditSave}
        language={language}
      />
      <ReferencePreview
        reference={previewing}
        onClose={() => setPreviewing(null)}
        language={language}
      />
    </div>
  );
}