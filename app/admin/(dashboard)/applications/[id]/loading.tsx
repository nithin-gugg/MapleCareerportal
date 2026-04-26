/**
 * loading.tsx — Automatic route-level loading UI for the Application Detail Page.
 * Next.js renders this instantly while the server component fetches the application.
 */

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-zinc-900 rounded animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

export default function ApplicationDetailLoading() {
  return (
    <div className="py-12 space-y-12 min-h-screen bg-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back link + Header */}
      <div className="space-y-6">
        <SkeletonBlock className="h-3 w-28" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex gap-3">
              <SkeletonBlock className="h-6 w-20 rounded-full" />
              <SkeletonBlock className="h-6 w-16 rounded-full opacity-60" />
            </div>
            <SkeletonBlock className="h-14 w-72" />
            <div className="flex gap-6">
              <SkeletonBlock className="h-4 w-40" />
              <SkeletonBlock className="h-4 w-32" />
            </div>
          </div>
          {/* Action buttons skeleton */}
          <div className="flex gap-4">
            <SkeletonBlock className="h-12 w-40" />
            <SkeletonBlock className="h-12 w-24" />
          </div>
        </div>
      </div>

      {/* Pipeline bar */}
      <SkeletonBlock className="h-20 w-full rounded-2xl" />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-10">
          {/* AI Card */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-none overflow-hidden">
            <div className="p-8 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SkeletonBlock className="w-10 h-10" />
                <div className="space-y-2">
                  <SkeletonBlock className="h-5 w-48" />
                  <SkeletonBlock className="h-3 w-32 opacity-60" />
                </div>
              </div>
              <SkeletonBlock className="h-12 w-20" />
            </div>
            <div className="p-8 space-y-4">
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-5/6" />
              <SkeletonBlock className="h-3 w-4/5" />
              <SkeletonBlock className="h-12 w-full mt-4" />
            </div>
          </div>

          {/* Interviews skeleton */}
          <div className="space-y-6">
            <SkeletonBlock className="h-7 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-900 p-6 space-y-4">
                  <SkeletonBlock className="h-3 w-24" />
                  <SkeletonBlock className="h-10 w-full" />
                  <SkeletonBlock className="h-12 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-6">
            <SkeletonBlock className="h-3 w-28" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <SkeletonBlock className="h-5 w-5 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <SkeletonBlock className="h-2.5 w-16" />
                    <SkeletonBlock className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
