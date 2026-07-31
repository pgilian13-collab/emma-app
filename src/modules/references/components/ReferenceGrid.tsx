import { AnimatePresence } from 'framer-motion';
import { ReferenceCard } from './ReferenceCard';
import type { Reference } from '@modules/references/types';
import type { AppLanguage } from '@app-types/index';

interface ReferenceGridProps {
  references: Reference[];
  onToggleFavorite: (id: string) => void;
  onEdit: (reference: Reference) => void;
  onRemove: (id: string) => void;
  onPreview: (reference: Reference) => void;
  language: AppLanguage;
}

export function ReferenceGrid({
  references,
  onToggleFavorite,
  onEdit,
  onRemove,
  onPreview,
  language,
}: ReferenceGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {references.map((reference) => (
          <ReferenceCard
            key={reference.id}
            reference={reference}
            onToggleFavorite={onToggleFavorite}
            onEdit={onEdit}
            onRemove={onRemove}
            onPreview={onPreview}
            language={language}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}