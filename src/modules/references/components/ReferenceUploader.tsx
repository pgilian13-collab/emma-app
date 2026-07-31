import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiImage } from 'react-icons/fi';
import {
  CATEGORY_META,
  REFERENCE_CATEGORIES,
  type ReferenceCategory,
} from '@modules/references/types';
import { cn } from '@utils/cn';

interface ReferenceUploaderProps {
  onFiles: (files: FileList | File[], category: ReferenceCategory) => Promise<number>;
  loading: boolean;
  defaultCategory: ReferenceCategory;
  language: 'es' | 'en';
}

export function ReferenceUploader({
  onFiles,
  loading,
  defaultCategory,
  language,
}: ReferenceUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [category, setCategory] = useState<ReferenceCategory>(defaultCategory);
  const es = language === 'es';

  const handleFiles = async (list: FileList | null | File[]) => {
    if (!list) return;
    const files = Array.from(list instanceof FileList ? list : list);
    if (files.length === 0) return;
    await onFiles(files, category);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="panel-card flex flex-col gap-3 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40">
        {es ? 'Agregar referencias' : 'Add references'}
      </h3>

      <motion.div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
        animate={{ borderColor: dragging ? '#8B5CF6' : 'rgba(255,255,255,0.1)' }}
        className="rounded-2xl border-2 border-dashed bg-panel/50 px-5 py-6 text-center transition"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => void handleFiles(event.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
            <FiUpload size={20} />
          </div>
          <p className="text-sm font-semibold text-white">
            {es ? 'Arrastra imágenes aquí' : 'Drop images here'}
          </p>
          <p className="text-xs text-white/50">
            {es ? 'o usa el botón para seleccionarlas' : 'or use the button to pick them'}
          </p>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="focus-ring mt-2 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-panel px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-panelLight hover:text-white disabled:opacity-50"
          >
            <FiImage size={14} />
            {es ? 'Seleccionar archivos' : 'Choose files'}
          </button>
        </div>
      </motion.div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
          {es ? 'Categoría por defecto' : 'Default category'}
        </p>
        <div className="flex flex-wrap gap-2">
          {REFERENCE_CATEGORIES.map((key) => {
            const meta = CATEGORY_META[key];
            const active = category === key;
            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={cn(
                  'focus-ring inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs transition',
                  active
                    ? 'bg-gradient-to-r text-white shadow-glow ' + meta.accent
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

      {loading ? (
        <p className="text-xs text-primary-light">
          {es ? 'Procesando imágenes…' : 'Processing images…'}
        </p>
      ) : null}
    </div>
  );
}