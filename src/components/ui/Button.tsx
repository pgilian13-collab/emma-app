import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-primary to-secondary text-white shadow-glow hover:brightness-110 active:brightness-95',
  secondary: 'bg-secondary text-white hover:bg-secondary-hover active:brightness-95',
  ghost: 'bg-transparent text-white hover:bg-white/5',
  outline: 'border border-white/10 bg-panel text-white hover:bg-panelLight',
  danger: 'bg-red-500/90 text-white hover:bg-red-500',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-5 text-base rounded-2xl gap-2',
  icon: 'h-10 w-10 rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus-ring disabled:opacity-50 disabled:pointer-events-none',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
    </button>
  );
}
