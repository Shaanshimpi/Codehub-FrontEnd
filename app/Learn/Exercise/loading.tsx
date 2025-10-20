export default function ExerciseLoading() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Intro Section Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            {/* Icon Skeleton */}
            <div className="mx-auto mb-6 h-16 w-16 animate-pulse rounded-2xl bg-slate-700/50" />

            {/* Title Skeleton */}
            <div className="mx-auto mb-4 h-12 w-2/3 animate-pulse rounded-lg bg-slate-700/50 sm:h-16" />

            {/* Subtitle Skeleton */}
            <div className="mx-auto mb-8 h-6 w-1/2 animate-pulse rounded-lg bg-slate-700/50" />

            {/* Description Skeleton */}
            <div className="mx-auto space-y-3">
              <div className="mx-auto h-4 w-5/6 animate-pulse rounded bg-slate-700/50" />
              <div className="mx-auto h-4 w-4/6 animate-pulse rounded bg-slate-700/50" />
              <div className="mx-auto h-4 w-3/6 animate-pulse rounded bg-slate-700/50" />
            </div>

            {/* Button Skeleton */}
            <div className="mx-auto mt-8 h-12 w-48 animate-pulse rounded-lg bg-slate-700/50" />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-0 top-0 h-64 w-64 animate-pulse rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 animate-pulse rounded-full bg-green-500/5 blur-3xl" />
      </div>

      {/* Language Grid Skeleton */}
      <div className="bg-slate-900 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="mb-4 h-8 w-80 animate-pulse rounded-lg bg-slate-700/50" />
            <div className="h-4 w-96 animate-pulse rounded bg-slate-700/50" />
          </div>

          {/* Language Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-800 p-6 transition-all"
              >
                {/* Header with Icon */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-14 w-14 animate-pulse rounded-xl bg-gradient-to-br from-slate-600 to-slate-700" />
                  <div className="h-8 w-8 animate-pulse rounded-full bg-slate-700/50" />
                </div>

                {/* Title Skeleton */}
                <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-slate-700/50" />

                {/* Description Skeleton */}
                <div className="mb-4 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-slate-700/50" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-slate-700/50" />
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-pulse rounded bg-slate-700/50" />
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-700/50" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-pulse rounded bg-slate-700/50" />
                    <div className="h-4 w-12 animate-pulse rounded bg-slate-700/50" />
                  </div>
                </div>

                {/* Progress Bar Skeleton */}
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-700/50" />
                    <div className="h-3 w-12 animate-pulse rounded bg-slate-700/50" />
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                    <div className="h-full w-1/3 animate-pulse bg-slate-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
