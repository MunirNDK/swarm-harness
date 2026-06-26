import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  slug: string;
  name: string;
  icon: string;
  short: string;
  className?: string;
}

export function ServiceCard({
  slug,
  name,
  icon,
  short,
  className,
}: ServiceCardProps) {
  // Dynamically get the icon component from lucide-react
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[icon];

  return (
    <Link href={`/services/${slug}`} className={cn("block group", className)}>
      <GlassCard className="p-6 h-full transition-transform duration-300 group-hover:scale-[1.02]">
        <div className="flex flex-col h-full">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-dac-red/10 text-dac-red">
            {IconComponent && <IconComponent className="h-6 w-6" />}
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
          <p className="text-sm text-dac-muted flex-grow">{short}</p>
          <span className="mt-4 inline-flex items-center text-sm font-medium text-dac-red group-hover:underline">
            Learn more
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </GlassCard>
    </Link>
  );
}
