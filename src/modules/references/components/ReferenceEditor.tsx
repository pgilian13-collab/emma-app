import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave } from 'react-icons/fi';
import { Button } from '@components/ui/Button';
import { CategoryBadge } from './CategoryBadge';
import {
  CATEGORY_META,
  REFERENCE_CATEGORIES,
  type Reference,
  type ReferenceCategory,
} from '@modules/references/types';
import { cn } from '@utils/cn';

interface ReferenceEditorProps {
  reference: Reference | null;
  onClose: () => void;
  onSave: (id: string, patch: { name: string; category: ReferenceCategory }) => Promise<void>;
  language: 'es' | 'en';
}

export function ReferenceEditor({ reference, onClose, onSave, language }: ReferenceEditorProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ReferenceCategory>('otros');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (reference) {
      setName(reference.name);
      setCategory(reference.category);
    }
  }, [reference]);

  useEffect(() => {
    if (!reference) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reference, onClose]);

  const handleSubmit = async () => {
    if (!reference) return;
    setSaving(true);
    try {
      await onSave(reference.id, {
        name: name.trim() || reference.name,
        category,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const es = language === 'es';

  return (
    <AnimatePresence>
      {reference ? (
        <motion.div
          key="editor-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            className="panel-card w-full max-w-md p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-light">
                  {es ? 'Editar referencia' : 'Edit reference'}
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">
                  {es ? 'Detalles' : 'Details'}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label={es ? 'Cerrar' : 'Close'}
                className="focus-ring rounded-lg p-1.5 text-white/50 hover:bg-white/5 hover:text-white"
              >
                <FiX size={18} />
              </button>
            </div>

            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-white/50">
                {es ? 'Nombre' : 'Name'}
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-panel px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                autoFocus
              />
            </label>

            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/50">
                {es ? 'Categoría' : 'Category'}
              </span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {REFERENCE_CATEGORIES.map((key) => {
                  const meta = CATEGORY_META[key];
                  const active = category === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setCategory(key)}
                      className={cn(
                        'focus-ring flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition',
                        active
                          ? 'border-primary bg-primary/15 text-white shadow-glow'
                          : 'border-white/10 bg-panel text-white/70 hover:bg-panelLight',
                      )}
                    >
                      <span aria-hidden>{meta.emoji}</span>
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
              <CategoryBadge category={category} size="md" />
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  {es ? 'Cancelar' : 'Cancel'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<FiSave size={14} />}
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {es ? 'Guardar' : 'Save'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}