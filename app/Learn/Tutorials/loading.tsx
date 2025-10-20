export default function TutorialsLoading() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Intro Section Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            {/* Icon Skeleton */}
            <div className="mx-auto mb-6 h-16 w-16 animate-pulse rounded-2xl bg-slate-700/50" />

            {/* Title Skeleton */}
            <div className="mx-auto mb-4 h-12 w-3/4 animate-pulse rounded-lg bg-slate-700/50 sm:h-16" />

            {/* Subtitle Skeleton */}
            <div className="mx-auto mb-8 h-6 w-2/3 animate-pulse rounded-lg bg-slate-700/50" />

            {/* Description Skeleton */}
            <div className="mx-auto space-y-3">
              <div className="mx-auto h-4 w-5/6 animate-pulse rounded bg-slate-700/50" />
              <div className="mx-auto h-4 w-4/6 animate-pulse rounded bg-slate-700/50" />
            </div>

            {/* CTA Buttons Skeleton */}
            <div className="mx-auto mt-8 flex justify-center gap-4">
              <div className="h-12 w-40 animate-pulse rounded-lg bg-slate-700/50" />
              <div className="h-12 w-40 animate-pulse rounded-lg bg-slate-700/50" />
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute left-10 top-20 h-48 w-48 animate-pulse rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-48 w-48 animate-pulse rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      {/* Features/Stats Section Skeleton (optional) */}
      <div className="border-y border-slate-800 bg-slate-900/50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-3 h-12 w-12 animate-pulse rounded-lg bg-slate-700/50" />
                <div className="mx-auto mb-2 h-8 w-24 animate-pulse rounded bg-slate-700/50" />
                <div className="mx-auto h-4 w-32 animate-pulse rounded bg-slate-700/50" />
              </div>
            ))}
          </div>
        </div>
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
                {/* Corner Badge Skeleton */}
                <div className="absolute right-4 top-4 h-6 w-16 animate-pulse rounded-full bg-slate-700/50" />

                {/* Icon Skeleton */}
                <div className="mb-4 h-16 w-16 animate-pulse rounded-xl bg-gradient-to-br from-slate-600 to-slate-700" />

                {/* Title Skeleton */}
                <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-slate-700/50" />

                {/* Description Skeleton */}
                <div className="mb-4 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-slate-700/50" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-slate-700/50" />
                  <div className="h-3 w-4/6 animate-pulse rounded bg-slate-700/50" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 border-t border-slate-700 pt-4">
                  <div>
                    <div className="mb-1 h-3 w-16 animate-pulse rounded bg-slate-700/50" />
                    <div className="h-5 w-12 animate-pulse rounded bg-slate-700/50" />
                  </div>
                  <div>
                    <div className="mb-1 h-3 w-16 animate-pulse rounded bg-slate-700/50" />
                    <div className="h-5 w-12 animate-pulse rounded bg-slate-700/50" />
                  </div>
                </div>

                {/* Button Skeleton */}
                <div className="mt-4 h-10 w-full animate-pulse rounded-lg bg-slate-700/50" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="bg-slate-900 px-6 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-4 h-8 w-64 animate-pulse rounded-lg bg-slate-700/50" />
          <div className="mx-auto mb-6 h-4 w-96 animate-pulse rounded bg-slate-700/50" />
          <div className="mx-auto h-12 w-48 animate-pulse rounded-lg bg-slate-700/50" />
        </div>
      </div>
    </div>
  )
}
