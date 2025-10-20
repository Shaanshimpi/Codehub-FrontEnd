export default function LearnLoading() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Intro Section Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            {/* Title Skeleton */}
            <div className="mx-auto mb-4 h-12 w-3/4 animate-pulse rounded-lg bg-slate-700/50 sm:h-16" />

            {/* Subtitle Skeleton */}
            <div className="mx-auto mb-8 h-6 w-2/3 animate-pulse rounded-lg bg-slate-700/50" />

            {/* Description Skeleton */}
            <div className="mx-auto space-y-3">
              <div className="mx-auto h-4 w-5/6 animate-pulse rounded bg-slate-700/50" />
              <div className="mx-auto h-4 w-4/6 animate-pulse rounded bg-slate-700/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Learning Paths Section Skeleton */}
      <div className="bg-slate-900 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 h-8 w-64 animate-pulse rounded-lg bg-slate-700/50" />
            <div className="mx-auto h-4 w-96 animate-pulse rounded bg-slate-700/50" />
          </div>

          {/* Path Cards Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-700 bg-slate-800 p-6"
              >
                <div className="mb-4 h-12 w-12 animate-pulse rounded-lg bg-slate-700/50" />
                <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-slate-700/50" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-slate-700/50" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-slate-700/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Language Grid Skeleton */}
      <div className="bg-slate-900 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="mb-4 h-8 w-64 animate-pulse rounded-lg bg-slate-700/50" />
            <div className="h-4 w-96 animate-pulse rounded bg-slate-700/50" />
          </div>

          {/* Language Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="group rounded-xl border border-slate-700 bg-slate-800 p-6 transition-all"
              >
                {/* Icon Skeleton */}
                <div className="mb-4 h-16 w-16 animate-pulse rounded-lg bg-slate-700/50" />

                {/* Title Skeleton */}
                <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-slate-700/50" />

                {/* Description Skeleton */}
                <div className="mb-4 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-slate-700/50" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-slate-700/50" />
                </div>

                {/* Stats Skeleton */}
                <div className="flex items-center gap-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-700/50" />
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-700/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
