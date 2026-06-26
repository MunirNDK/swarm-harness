import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dac-red focus-visible:ring-offset-2 focus-visible:ring-offset-dac-black disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-dac-red text-white hover:bg-dac-red-light active:bg-dac-red-med shadow-lg shadow-dac-red/20",
        secondary:
          "bg-white/5 border border-white/10 text-white backdrop-blur-xl hover:bg-white/10 active:bg-white/20",
        ghost:
          "text-white/80 hover:text-white hover:bg-white/5",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-12 px-8 text-lg",
        xl: "h-14 px-10 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  external?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, external, children, ...props }, ref) => {
    if (href) {
      const isExternal = external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
      if (isExternal) {
        return (
          <a
            href={href}
            className={cn(buttonVariants({ variant, size, className }))}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
