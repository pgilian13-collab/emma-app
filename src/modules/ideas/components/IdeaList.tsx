import { AnimatePresence } from 'framer-motion';
import { IdeaCard } from './IdeaCard';
import type { Idea } from '@modules/ideas/types';

interface IdeaListProps {
  ideas: Idea[];
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  highlightId?: string | null;
  emptyMessage: string;
  language: 'es' | 'en';
}

export function IdeaList({
  ideas,
  onToggleFavorite,
  onRemove,
  onUpdate,
  highlightId,
  emptyMessage,
  language,
}: IdeaListProps) {
  if (ideas.length === 0) {
    return (
      <div className="panel-card flex items-center justify-center p-8 text-center">
        <p className="text-sm text-white/50">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onToggleFavorite={onToggleFavorite}
            onRemove={onRemove}
            onUpdate={onUpdate}
            highlight={highlightId === idea.id}
            language={language}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}