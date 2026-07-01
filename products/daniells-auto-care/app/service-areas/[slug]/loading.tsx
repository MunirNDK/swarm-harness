/**
 * loading.tsx — Service-area detail skeleton
 * Prevents CLS during navigation to /service-areas/[slug].
 */
export default function Loading() {
  return (
    <div className="animate-pulse" aria-hidden="true" aria-label="Loading…">
      {/* Breadcrumb band */}
      <div className="h-10 bg-surface-dark border-b border-border" />

      {/* Hero */}
      <div className="h-[40vh] bg-surface-dark" />

      {/* Content */}
      <div className="bg-surface py-16 px-4 space-y-5 max-w-4xl mx-auto">
        <div className="h-4 bg-surface2 rounded w-20" />
        <div className="h-7 bg-surface2 rounded w-2/3" />
        <div className="h-4 bg-surface2 rounded w-full" />
        <div className="h-4 bg-surface2 rounded w-11/12" />
      </div>

      {/* Card row */}
      <div className="bg-bg py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-surface" />
          ))}
        </div>
      </div>
    </div>
  );
}
