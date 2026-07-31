import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { getReference } from '@modules/references/services/referenceStorage';
import { CategoryBadge } from './CategoryBadge';
import type { Reference } from '@modules/references/types';

interface ReferencePreviewProps {
  reference: Reference | null;
  onClose: () => void;
  language: 'es' | 'en';
}

export function ReferencePreview({ reference, onClose, language }: ReferencePreviewProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setUrl(null);
      return;
    }
    let active = true;
    let createdUrl: string | null = null;
    getReference(reference.id).then((entry) => {
      if (!entry || !active) return;
      createdUrl = URL.createObjectURL(entry.blob);
      setUrl(createdUrl);
    });
    return () => {
      active = false;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [reference]);

  useEffect(() => {
    if (!reference) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reference, onClose]);

  return (
    <AnimatePresence>
      {reference ? (
        <motion.div
          key="preview-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="panel-card relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden p-0"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <CategoryBadge category={reference.category} />
                <p className="truncate text-sm font-semibold text-white">{reference.name}</p>
              </div>
              <button
                onClick={onClose}
                aria-label={language === 'es' ? 'Cerrar' : 'Close'}
                className="focus-ring rounded-lg p-1.5 text-white/60 hover:bg-white/5 hover:text-white"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center overflow-auto bg-black/40 p-4">
              {url ? (
                <img
                  src={url}
                  alt={reference.name}
                  className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
                />
              ) : (
                <div className="text-white/40">…</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}