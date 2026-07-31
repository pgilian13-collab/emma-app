import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiHeart, FiTrash2, FiEdit3, FiZap, FiUser } from 'react-icons/fi';
import { CATEGORY_META, type Idea } from '@modules/ideas/types';
import { cn } from '@utils/cn';

interface IdeaCardProps {
  idea: Idea;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate?: (id: string, text: string) => void;
  language: 'es' | 'en';
  highlight?: boolean;
}

export function IdeaCard({
  idea,
  onToggleFavorite,
  onRemove,
  onUpdate,
  language,
  highlight,
}: IdeaCardProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(idea.text);

  const meta = CATEGORY_META[idea.category];
  const es = language === 'es';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(idea.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = idea.text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleSaveEdit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== idea.text && onUpdate) {
      onUpdate(idea.id, trimmed);
    }
    setEditing(false);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'panel-card group relative flex flex-col gap-3 p-5',
        highlight && 'ring-1 ring-primary/40 shadow-glow',
        idea.favorite && 'border-primary/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-sm',
            meta.accent,
          )}
        >
          <span aria-hidden>{meta.emoji}</span>
          {meta.label}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/40">
          {idea.source === 'generated' ? <FiZap size={10} /> : <FiUser size={10} />}
          {idea.source === 'generated' ? (es ? 'Auto' : 'Auto') : (es ? 'Propia' : 'Custom')}
        </span>
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              handleSaveEdit();
            }
            if (event.key === 'Escape') {
              setEditing(false);
              setDraft(idea.text);
            }
          }}
          rows={3}
          autoFocus
          className="w-full resize-none rounded-xl border border-white/10 bg-panel px-3 py-2 text-base text-white focus:border-primary focus:outline-none"
        />
      ) : (
        <p className="text-base leading-relaxed text-white sm:text-lg">
          "{idea.text}"
        </p>
      )}

      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <span className="text-[11px] text-white/40">
          {new Date(idea.createdAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
            day: '2-digit',
            month: 'short',
          })}
        </span>
        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  setDraft(idea.text);
                }}
                className="focus-ring rounded-lg px-2 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white"
              >
                {es ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveEdit}
                className="focus-ring rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-white hover:brightness-110"
              >
                {es ? 'Guardar' : 'Save'}
              </button>
            </>
          ) : (
            <>
              <IconAction
                onClick={handleCopy}
                label={es ? 'Copiar' : 'Copy'}
                active={copied}
                activeColor="text-emerald-300"
              >
                {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
              </IconAction>
              <IconAction
                onClick={() => onToggleFavorite(idea.id)}
                label={es ? 'Favorito' : 'Favorite'}
                active={idea.favorite}
                activeColor="text-pink-400"
              >
                <FiHeart size={14} />
              </IconAction>
              {onUpdate && idea.source === 'custom' ? (
                <IconAction
                  onClick={() => setEditing(true)}
                  label={es ? 'Editar' : 'Edit'}
                >
                  <FiEdit3 size={14} />
                </IconAction>
              ) : null}
              <IconAction
                onClick={() => onRemove(idea.id)}
                label={es ? 'Eliminar' : 'Remove'}
                danger
              >
                <FiTrash2 size={14} />
              </IconAction>
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
}

interface IconActionProps {
  onClick: () => void;
  label: string;
  active?: boolean;
  activeColor?: string;
  danger?: boolean;
  children: React.ReactNode;
}

function IconAction({ onClick, label, active, activeColor, danger, children }: IconActionProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'focus-ring flex h-8 w-8 items-center justify-center rounded-lg transition',
        active
          ? activeColor ?? 'text-white'
          : danger
            ? 'text-white/40 hover:bg-red-500/15 hover:text-red-300'
            : 'text-white/50 hover:bg-white/10 hover:text-white',
      )}
    >
      {children}
    </button>
  );
}