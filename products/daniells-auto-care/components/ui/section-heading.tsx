import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  gradient?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = false,
  className,
  gradient = true,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-12 sm:mb-16',
        centered && 'text-center',
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <p className="text-dac-red font-heading text-sm sm:text-base font-semibold tracking-widest uppercase mb-3">
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal>
        <h2
          className={cn(
            'font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight',
            gradient && 'text-gradient',
            !gradient && 'text-dac-white',
          )}
        >
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal>
          <p className="mt-4 text-dac-muted text-base sm:text-lg max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}