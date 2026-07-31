import { CATEGORY_META, type ReferenceCategory } from '@modules/references/types';
import { cn } from '@utils/cn';

interface CategoryBadgeProps {
  category: ReferenceCategory;
  size?: 'sm' | 'md';
  className?: string;
}

export function CategoryBadge({ category, size = 'sm', className }: CategoryBadgeProps) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-gradient-to-r font-semibold uppercase tracking-widest text-white shadow-sm',
        meta.accent,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        className,
      )}
    >
      <span aria-hidden>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}