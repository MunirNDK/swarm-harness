import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import Link from 'next/link';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-heading font-semibold text-sm sm:text-base transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dac-red whitespace-nowrap min-h-[44px] cursor-pointer select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-dac-red text-white hover:bg-dac-red-light active:bg-dac-red-med shadow-lg shadow-dac-red/25',
        secondary:
          'glass text-dac-white hover:bg-white/10 active:bg-white/5',
        ghost:
          'text-dac-white hover:bg-white/5 active:bg-white/10',
      },
      size: {
        default: 'px-6 py-2.5',
        sm: 'px-4 py-2 text-sm',
        lg: 'px-8 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
}

export function Button({
  className,
  variant,
  size,
  asChild,
  href,
  children,
  ...props
}: ButtonProps) {
  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:');
    if (isExternal) {
      return (
        <a
          href={href}
          className={cn(buttonVariants({ variant, size }), className)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant, size }), className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}