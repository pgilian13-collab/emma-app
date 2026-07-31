import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@store/settingsStore';
import { useIdeas } from '../hooks/useIdeas';
import { IdeaGenerator } from './IdeaGenerator';
import { IdeaForm } from './IdeaForm';
import { IdeaList } from './IdeaList';
import { FiTrash2, FiClock, FiHeart, FiUser } from 'react-icons/fi';
import { cn } from '@utils/cn';
import type { Idea, IdeaCategory } from '../types';

type Tab = 'history' | 'favorites' | 'custom';

export function IdeasWorkspace() {
  const language = useSettingsStore((s) => s.language);
  const es = language === 'es';
  const ideas = useIdeas();

  const [tab, setTab] = useState<Tab>('history');
  const [latestIdea, setLatestIdea] = useState<Idea | null>(null);

  const handleGenerate = (category: IdeaCategory | 'all'): Idea => {
    const idea = ideas.generate(category);
    setLatestIdea(idea);
    return idea;
  };

  const handleClearHistory = () => {
    if (window.confirm(es ? '¿Limpiar el historial?' : 'Clear history?')) {
      ideas.clearHistory();
    }
  };

  const handleClearAll = () => {
    if (window.confirm(es ? '¿Borrar TODAS las ideas?' : 'Delete ALL ideas?')) {
      ideas.clearAll();
      setLatestIdea(null);
    }
  };

  const list =
    tab === 'history' ? ideas.history : tab === 'favorites' ? ideas.favorites : ideas.custom;

  const emptyByTab: Record<Tab, string> = {
    history: es
      ? 'Aún no has generado ideas. Pulsa "Generar idea nueva".'
      : 'No ideas generated yet. Tap "Generate new idea".',
    favorites: es
      ? 'Toca el corazón en cualquier idea para guardarla aquí.'
      : 'Tap the heart on any idea to save it here.',
    custom: es
      ? 'Agrega tus propias ideas usando el botón de abajo.'
      : 'Add your own ideas using the button below.',
  };

  const tabs: { value: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { value: 'history', label: es ? 'Historial' : 'History', icon: <FiClock size={14} />, count: ideas.history.length },
    { value: 'favorites', label: es ? 'Favoritas' : 'Favorites', icon: <FiHeart size={14} />, count: ideas.favorites.length },
    { value: 'custom', label: es ? 'Propias' : 'Custom', icon: <FiUser size={14} />, count: ideas.custom.length },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
          {es ? 'Inspiración al instante' : 'Instant inspiration'}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-white">
          {es ? 'Generador de ideas' : 'Idea generator'}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-white/60">
          {es
            ? 'Combina sujeto, acción y contexto para obtener combinaciones nuevas. Guarda tus favoritas o agrega las tuyas.'
            : 'Mix subject, action and context to get fresh combinations. Save favorites or add your own.'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        <div className="flex flex-col gap-4">
          <IdeaGenerator onGenerate={handleGenerate} latestIdea={latestIdea} language={language} />

          <div className="panel-card p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              {es ? 'Agregar idea' : 'Add idea'}
            </p>
            <p className="mt-1 text-xs text-white/50">
              {es
                ? 'Tus ideas se guardan localmente.'
                : 'Your ideas are stored locally.'}
            </p>
            <div className="mt-3">
              <IdeaForm onAdd={(text, category) => ideas.addCustom(text, category)} language={language} />
            </div>
          </div>

          <div className="panel-card p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              {es ? 'Zona peligrosa' : 'Danger zone'}
            </p>
            <p className="mt-1 text-xs text-white/50">
              {es
                ? 'Borra el historial o todas las ideas almacenadas.'
                : 'Clear history or all stored ideas.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={handleClearHistory}
                disabled={ideas.history.length === 0}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-panel px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-panelLight disabled:opacity-40"
              >
                <FiClock size={12} />
                {es ? 'Limpiar historial' : 'Clear history'}
              </button>
              <button
                onClick={handleClearAll}
                disabled={ideas.ideas.length === 0}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-40"
              >
                <FiTrash2 size={12} />
                {es ? 'Borrar todo' : 'Erase all'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="panel-card flex items-center gap-1 p-1">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  'focus-ring flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
                  tab === t.value
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/10 text-white shadow-glow'
                    : 'text-white/60 hover:text-white',
                )}
              >
                {t.icon}
                {t.label}
                <span
                  className={cn(
                    'rounded-full px-1.5 text-[10px] font-bold',
                    tab === t.value ? 'bg-white/15 text-white' : 'bg-white/5 text-white/50',
                  )}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          <IdeaList
            ideas={list}
            onToggleFavorite={(id) => ideas.toggleFavorite(id)}
            onRemove={(id) => {
              ideas.remove(id);
              if (latestIdea?.id === id) setLatestIdea(null);
            }}
            onUpdate={(id, text) => ideas.update(id, { text })}
            highlightId={latestIdea?.id}
            emptyMessage={emptyByTab[tab]}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}