import { cn } from '@/lib/utils';
import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function Section({ children, className, id, as: Tag = 'section' }: SectionProps) {
  return (
    <Tag id={id} className={cn('py-16 sm:py-20 lg:py-24', className)}>
      {children}
    </Tag>
  );
}