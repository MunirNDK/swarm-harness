import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function GlassCard({
  className,
  children,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl",
        glow && "before:absolute before:inset-0 before:-z-10 before:bg-[#E80505]/10 before:blur-3xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
