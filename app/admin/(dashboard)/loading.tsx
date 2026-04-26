/**
 * loading.tsx — Automatic route-level loading UI for the Admin Dashboard.
 * Next.js renders this instantly while the server component fetches data.
 * Mirrors the actual dashboard layout with skeleton placeholders.
 */

function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-zinc-900 rounded animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-zinc-900">
      <td className="px-6 py-5">
        <div className="flex flex-col gap-2">
          <SkeletonLine className="h-3.5 w-32" />
          <SkeletonLine className="h-2.5 w-24 opacity-60" />
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col items-center gap-2">
          <SkeletonLine className="h-1.5 w-20" />
          <SkeletonLine className="h-3 w-10" />
        </div>
      </td>
      <td className="px-6 py-5">
        <SkeletonLine className="h-5 w-20 rounded-full" />
      </td>
      <td className="px-6 py-5">
        <SkeletonLine className="h-3 w-28" />
      </td>
      <td className="px-6 py-5">
        <SkeletonLine className="h-3 w-20" />
      </td>
      <td className="px-6 py-5 text-right">
        <SkeletonLine className="h-3 w-8 ml-auto" />
      </td>
    </tr>
  );
}

export default function AdminDashboardLoading() {
  return (
    <div className="py-12 space-y-10 min-h-screen bg-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <SkeletonLine className="h-12 w-64" />
          <SkeletonLine className="h-4 w-80 opacity-60" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-2">
              <SkeletonLine className="h-2.5 w-12" />
              <SkeletonLine className="h-6 w-8" />
            </div>
          ))}
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-4 bg-zinc-950 p-4 border border-zinc-900 rounded-xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 min-w-[150px] space-y-2">
            <SkeletonLine className="h-2.5 w-16" />
            <SkeletonLine className="h-9 w-full rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900">
                {["Candidate", "Score", "Status", "Applied For", "Date", ""].map((h) => (
                  <th key={h} className="px-6 py-5">
                    <SkeletonLine className="h-2.5 w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
