import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiEdit3, FiTrash2, FiMaximize2 } from 'react-icons/fi';
import { CategoryBadge } from './CategoryBadge';
import { getBlobUrlCache } from '@modules/references/services/blobUrlCache';
import { getReference } from '@modules/references/services/referenceStorage';
import type { Reference } from '@modules/references/types';
import { cn } from '@utils/cn';

interface ReferenceCardProps {
  reference: Reference;
  onToggleFavorite: (id: string) => void;
  onEdit: (reference: Reference) => void;
  onRemove: (id: string) => void;
  onPreview: (reference: Reference) => void;
  language: 'es' | 'en';
}

function formatDate(timestamp: number, language: 'es' | 'en'): string {
  return new Date(timestamp).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function ReferenceCard({
  reference,
  onToggleFavorite,
  onEdit,
  onRemove,
  onPreview,
  language,
}: ReferenceCardProps) {
  const [thumb, setThumb] = useState<string | null>(null);
  const [full, setFull] = useState<string | null>(null);

  useEffect(() => {
    const cached = getBlobUrlCache().get(reference.id);
    if (cached) setThumb(cached);
    return () => {
      // object URL kept in cache; revocation managed by store
    };
  }, [reference.id]);

  const handlePreview = () => {
    if (full) {
      onPreview({ ...reference });
      return;
    }
    getReference(reference.id).then((entry) => {
      if (entry) {
        const url = URL.createObjectURL(entry.blob);
        setFull(url);
        onPreview({ ...reference });
      }
    });
  };

  const es = language === 'es';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
      className={cn(
        'group panel-card relative flex flex-col overflow-hidden p-0',
        reference.favorite && 'ring-1 ring-primary/40',
      )}
    >
      <button
        onClick={handlePreview}
        className="focus-ring relative aspect-[4/3] w-full overflow-hidden bg-panel"
        aria-label={es ? 'Vista previa' : 'Preview'}
      >
        {thumb ? (
          <img
            src={thumb}
            alt={reference.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/30">
            …
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <div className="absolute left-2 top-2">
          <CategoryBadge category={reference.category} />
        </div>
        <div className="absolute right-2 top-2 flex gap-1">
          <IconAction
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(reference.id);
            }}
            active={reference.favorite}
            activeColor="text-pink-400"
            label={es ? 'Favorito' : 'Favorite'}
          >
            <FiHeart size={14} />
          </IconAction>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
            <FiMaximize2 size={16} />
          </span>
        </div>
      </button>

      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">{reference.name}</h3>
            <p className="mt-0.5 text-[11px] text-white/40">
              {formatDate(reference.createdAt, language)} · {reference.width}×{reference.height}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-white/40">
            {es ? 'Guardada' : 'Saved'}
          </span>
          <div className="flex gap-1">
            <IconButton
              onClick={() => onEdit(reference)}
              label={es ? 'Editar' : 'Edit'}
            >
              <FiEdit3 size={13} />
            </IconButton>
            <IconButton
              onClick={() => onRemove(reference.id)}
              label={es ? 'Eliminar' : 'Remove'}
              danger
            >
              <FiTrash2 size={13} />
            </IconButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

interface IconActionProps {
  onClick: (event: React.MouseEvent) => void;
  active?: boolean;
  activeColor?: string;
  label: string;
  children: React.ReactNode;
}

function IconAction({ onClick, active, activeColor, label, children }: IconActionProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'focus-ring flex h-7 w-7 items-center justify-center rounded-full backdrop-blur transition',
        active
          ? `bg-white/15 ${activeColor ?? 'text-white'}`
          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white',
      )}
    >
      {children}
    </button>
  );
}

interface IconButtonProps {
  onClick: () => void;
  label: string;
  danger?: boolean;
  children: React.ReactNode;
}

function IconButton({ onClick, label, danger, children }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'focus-ring flex h-7 w-7 items-center justify-center rounded-lg transition',
        danger
          ? 'text-white/40 hover:bg-red-500/15 hover:text-red-300'
          : 'text-white/50 hover:bg-white/10 hover:text-white',
      )}
    >
      {children}
    </button>
  );
}