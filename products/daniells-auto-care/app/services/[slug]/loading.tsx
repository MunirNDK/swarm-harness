/**
 * loading.tsx — Service detail skeleton
 * Prevents CLS during navigation to /services/[slug].
 * Matches the dark surface layout: header band + hero-height block + content rows.
 */
export default function Loading() {
  return (
    <div className="animate-pulse" aria-hidden="true" aria-label="Loading…">
      {/* Breadcrumb band */}
      <div className="h-10 bg-surface-dark border-b border-border" />

      {/* Hero */}
      <div className="h-[50vh] bg-surface-dark" />

      {/* Content rows */}
      <div className="bg-bg py-16 px-4 space-y-6 max-w-4xl mx-auto">
        <div className="h-4 bg-surface rounded w-24" />
        <div className="h-8 bg-surface rounded w-3/4" />
        <div className="h-4 bg-surface rounded w-full" />
        <div className="h-4 bg-surface rounded w-5/6" />
        <div className="h-4 bg-surface rounded w-4/5" />
      </div>
    </div>
  );
}
