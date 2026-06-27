import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  count: number;
  max?: number;
  size?: number;
  className?: string;
}

export function StarRating({
  count,
  max = 5,
  size = 20,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i < count
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-dac-faint"
          )}
        />
      ))}
    </div>
  );
}
