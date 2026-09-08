import React from 'react';
import { cn } from '../../lib/cn';

type BadgeVariant = 'emerald' | 'cyan' | 'amber' | 'purple' | 'zinc';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  pulse?: boolean;
}

const variantMap: Record<BadgeVariant, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  zinc: 'bg-zinc-800 text-zinc-400 border-zinc-700',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'zinc', className, pulse }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono-code font-semibold border',
        variantMap[variant],
        pulse && 'animate-pulse',
        className
      )}
    >
      {children}
    </span>
  );
};
