import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  /** Optional background treatment hint (kept off the DOM). */
  background?: string;
}

export function Section({ className, children, id, background: _background, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-24", className)}
      {...props}
    >
      {children}
    </section>
  );
}
