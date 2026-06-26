import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id?: string;
}

export function Section({ className, children, id, ...props }: SectionProps) {
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
