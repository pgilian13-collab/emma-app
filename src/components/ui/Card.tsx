import type { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  interactive?: boolean;
  accent?: 'primary' | 'secondary' | 'gradient' | 'none';
  icon?: ReactNode;
  delay?: number;
}

const ACCENT_BORDER: Record<NonNullable<CardProps['accent']>, string> = {
  primary: 'before:bg-primary',
  secondary: 'before:bg-secondary',
  gradient: 'before:bg-gradient-to-r before:from-primary before:to-secondary',
  none: '',
};

export function Card({
  interactive,
  accent = 'none',
  icon,
  className,
  children,
  delay = 0,
  ...rest
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      whileHover={interactive ? { y: -2 } : undefined}
      className={cn(
        'panel-card relative overflow-hidden p-5',
        interactive && 'cursor-pointer transition-shadow hover:shadow-glow',
        accent !== 'none' && 'before:absolute before:left-0 before:top-0 before:h-full before:w-1',
        accent !== 'none' && ACCENT_BORDER[accent],
        className,
      )}
      {...rest}
    >
      {icon ? <div className="mb-3 text-primary">{icon}</div> : null}
      {children}
    </motion.div>
  );
}
