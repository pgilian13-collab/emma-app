import type { ReactNode } from 'react';
import { cn } from '@utils/cn';

export interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      <div>
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-white/60">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
