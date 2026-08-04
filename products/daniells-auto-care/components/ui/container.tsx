import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

/**
 * Container — Contract §10
 * max-w-container (80rem) mx-auto with responsive horizontal padding.
 */
export function Container({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-container px-panel md:px-bay',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
