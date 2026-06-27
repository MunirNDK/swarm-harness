import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  align?: "center" | "left";
  centered?: boolean;
  center?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align,
  centered,
  center,
  className,
}: SectionHeadingProps) {
  const isCentered = centered ?? center;
  const resolvedAlign = align ?? (isCentered === false ? "left" : "center");
  return (
    <div
      className={cn(
        "max-w-3xl",
        resolvedAlign === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-dac-red">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl",
          "bg-gradient-to-r from-white via-white to-dac-red bg-clip-text text-transparent"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-dac-muted">{subtitle}</p>
      )}
    </div>
  );
}
