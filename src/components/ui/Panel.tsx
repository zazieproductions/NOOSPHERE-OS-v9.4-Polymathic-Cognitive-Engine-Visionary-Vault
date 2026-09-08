import React from 'react';
import { cn } from '../../lib/cn';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'glow-emerald' | 'glow-cyan';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantClasses = {
  default: 'glass-panel',
  subtle: 'glass-panel-subtle',
  'glow-emerald': 'glass-panel glass-glow-emerald',
  'glow-cyan': 'glass-panel glass-glow-cyan',
};

const paddingClasses = {
  none: '',
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-5',
};

export const Panel: React.FC<PanelProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
}) => {
  return (
    <div className={cn(variantClasses[variant], paddingClasses[padding], 'rounded-lg', className)}>
      {children}
    </div>
  );
};
