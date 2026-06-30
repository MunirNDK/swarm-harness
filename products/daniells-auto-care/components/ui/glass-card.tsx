import { cn } from '@/lib/utils';
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export function GlassCard({
  children,
  className,
  glow = false,
  hover = false,
  as: Tag = 'div',
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        'glass-card p-6 sm:p-8',
        glow && 'red-glow',
        hover && 'transition-transform duration-300 hover:scale-[1.02]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}