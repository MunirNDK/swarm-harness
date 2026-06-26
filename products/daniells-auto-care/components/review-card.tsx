import { GlassCard } from "@/components/ui/glass-card";
import { StarRating } from "@/components/ui/star-rating";

interface ReviewCardProps {
  name: string;
  when: string;
  stars: number;
  quote: string;
}

export function ReviewCard({ name, when, stars, quote }: ReviewCardProps) {
  return (
    <GlassCard className="p-6 flex flex-col h-full">
      <StarRating count={stars} className="mb-4" />
      <blockquote className="text-dac-muted text-sm leading-relaxed flex-grow mb-4">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="flex items-center justify-between">
        <span className="text-white font-medium text-sm">{name}</span>
        <span className="text-dac-faint text-xs">{when}</span>
      </div>
    </GlassCard>
  );
}
