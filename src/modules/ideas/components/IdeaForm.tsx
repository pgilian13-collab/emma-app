import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/ui/Button';
import { FiPlus, FiX, FiSave } from 'react-icons/fi';
import { CATEGORY_META, IDEA_CATEGORIES, type IdeaCategory } from '@modules/ideas/types';
import { cn } from '@utils/cn';

interface IdeaFormProps {
  onAdd: (text: string, category: IdeaCategory) => void;
  language: 'es' | 'en';
}

export function IdeaForm({ onAdd, language }: IdeaFormProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('personajes');
  const es = language === 'es';

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, category);
    setText('');
    setCategory('personajes');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="focus-ring flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-panel/40 px-5 py-4 text-sm font-semibold text-white/70 transition hover:border-primary/40 hover:bg-panel/60 hover:text-white"
      >
        <FiPlus size={16} />
        {es ? 'Agregar idea propia' : 'Add your own idea'}
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
        className="panel-card flex flex-col gap-3 p-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40">
            {es ? 'Nueva idea' : 'New idea'}
          </h3>
          <button
            onClick={() => setOpen(false)}
            aria-label={es ? 'Cerrar' : 'Close'}
            className="focus-ring rounded-lg p-1 text-white/50 hover:bg-white/5 hover:text-white"
          >
            <FiX size={14} />
          </button>
        </div>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={es ? 'Escribe tu idea aquí…' : 'Write your idea here…'}
          rows={3}
          autoFocus
          className="w-full resize-none rounded-xl border border-white/10 bg-panel px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none"
        />

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
            {es ? 'Categoría' : 'Category'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {IDEA_CATEGORIES.map((key) => {
              const meta = CATEGORY_META[key];
              const active = category === key;
              return (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={cn(
                    'focus-ring inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs transition',
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

        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            {es ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<FiSave size={14} />}
            onClick={handleSubmit}
            disabled={!text.trim()}
          >
            {es ? 'Guardar' : 'Save'}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}