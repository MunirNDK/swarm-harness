/**
 * loading.tsx — Blog post skeleton
 * Prevents CLS during navigation to /blog/[slug].
 */
export default function Loading() {
  return (
    <div className="animate-pulse" aria-hidden="true" aria-label="Loading…">
      {/* Breadcrumb band */}
      <div className="h-10 bg-surface-dark border-b border-border" />

      {/* Article header */}
      <div className="bg-bg py-12 px-4 max-w-4xl mx-auto space-y-6">
        {/* Back link placeholder */}
        <div className="h-6 bg-surface rounded w-24" />

        {/* Featured image */}
        <div className="aspect-[3/1] rounded-lg bg-surface" />

        {/* Category + date */}
        <div className="flex gap-3">
          <div className="h-5 bg-surface rounded-full w-24" />
          <div className="h-5 bg-surface rounded-full w-20" />
        </div>

        {/* Title */}
        <div className="h-9 bg-surface rounded w-3/4" />
        <div className="h-5 bg-surface rounded w-full" />
        <div className="h-5 bg-surface rounded w-5/6" />
      </div>

      {/* Body paragraphs */}
      <div className="bg-surface py-12 px-4 max-w-4xl mx-auto space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-surface2 rounded w-full" />
            <div className="h-4 bg-surface2 rounded w-11/12" />
            <div className="h-4 bg-surface2 rounded w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
