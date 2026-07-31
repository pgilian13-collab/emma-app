import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/ui/Button';
import { FiZap, FiShuffle, FiLayers } from 'react-icons/fi';
import { CATEGORY_META, IDEA_CATEGORIES, type IdeaCategory } from '@modules/ideas/types';
import { cn } from '@utils/cn';
import type { Idea } from '@modules/ideas/types';

interface IdeaGeneratorProps {
  onGenerate: (category: IdeaCategory | 'all') => Idea;
  latestIdea: Idea | null;
  language: 'es' | 'en';
}

export function IdeaGenerator({ onGenerate, latestIdea, language }: IdeaGeneratorProps) {
  const [category, setCategory] = useState<IdeaCategory | 'all'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const es = language === 'es';

  const handleGenerate = () => {
    setIsGenerating(true);
    onGenerate(category);
    setTimeout(() => setIsGenerating(false), 250);
  };

  return (
    <div className="panel-card flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40">
            {es ? 'Generador' : 'Generator'}
          </h3>
          <p className="mt-1 text-xs text-white/50">
            {es ? 'Combina sujeto + acción + contexto aleatoriamente.' : 'Mix subject + action + context randomly.'}
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
          <FiZap size={16} />
        </span>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
          {es ? 'Categoría' : 'Category'}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('all')}
            className={cn(
              'focus-ring inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs transition',
              category === 'all'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow'
                : 'bg-panel text-white/60 hover:bg-panelLight',
            )}
          >
            <FiLayers size={12} />
            {es ? 'Todas' : 'All'}
          </button>
          {IDEA_CATEGORIES.map((key) => {
            const meta = CATEGORY_META[key];
            const active = category === key;
            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={cn(
                  'focus-ring inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs transition',
                  active
                    ? `bg-gradient-to-r text-white shadow-glow ${meta.accent}`
                    : 'bg-panel text-white/60 hover:bg-panelLight',
                )}
              >
                <span aria-hidden>{meta.emoji}</span>
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        leftIcon={<FiShuffle size={18} />}
        onClick={handleGenerate}
      >
        {es ? 'Generar idea nueva' : 'Generate new idea'}
      </Button>

      <AnimatePresence mode="wait">
        {latestIdea ? (
          <motion.div
            key={latestIdea.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 p-4"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl" aria-hidden />
            <p className="relative text-sm font-semibold uppercase tracking-widest text-primary-light">
              {es ? 'Última idea' : 'Latest idea'}
            </p>
            <p className="relative mt-2 text-lg font-semibold text-white">
              "{latestIdea.text}"
            </p>
            <motion.div
              key={isGenerating ? 'spinning' : 'idle'}
              animate={isGenerating ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute right-3 top-3 text-primary-light"
            >
              <FiZap size={16} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}