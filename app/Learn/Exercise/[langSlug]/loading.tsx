export default function ExerciseLanguageLoading() {
  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-[8vh] dark:from-slate-800 dark:to-slate-900">
        <div className="mx-auto max-w-6xl">
          {/* Back Button Skeleton */}
          <div className="mb-6 h-6 w-40 animate-pulse rounded bg-sky-700/50" />

          {/* Language Header Content */}
          <div className="flex items-center space-x-6">
            {/* Logo Skeleton */}
            <div className="h-20 w-20 animate-pulse rounded-xl bg-white/10" />

            {/* Title & Description */}
            <div className="flex-1">
              {/* Badge Skeleton */}
              <div className="mb-2 flex items-center space-x-3">
                <div className="h-6 w-6 animate-pulse rounded bg-sky-700/50" />
                <div className="h-5 w-32 animate-pulse rounded bg-sky-700/50" />
              </div>

              {/* Title Skeleton */}
              <div className="mb-2 h-12 w-72 animate-pulse rounded-lg bg-white/10" />

              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-6 w-full max-w-2xl animate-pulse rounded bg-sky-700/50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Grid Skeleton */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Section Title Skeleton */}
        <div className="mb-8">
          <div className="mb-4 h-8 w-80 animate-pulse rounded-lg bg-slate-700/50" />
          <div className="h-6 w-96 animate-pulse rounded bg-slate-700/50" />
        </div>

        {/* Tutorial Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-lg"
            >
              {/* Card Header */}
              <div className="border-b border-slate-700 bg-slate-800/50 p-4">
                {/* Title Skeleton */}
                <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-slate-700/50" />

                {/* Description Skeleton */}
                <div className="space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-slate-700/50" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-slate-700/50" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                {/* Stats Row */}
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-pulse rounded bg-slate-700/50" />
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-700/50" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-pulse rounded bg-slate-700/50" />
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-700/50" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="mb-2 flex justify-between">
                    <div className="h-3 w-16 animate-pulse rounded bg-slate-700/50" />
                    <div className="h-3 w-12 animate-pulse rounded bg-slate-700/50" />
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                    <div className="h-full w-1/3 animate-pulse bg-slate-600" />
                  </div>
                </div>

                {/* Exercises Count */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-4 w-4 animate-pulse rounded bg-slate-700/50" />
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-700/50" />
                </div>

                {/* Button Skeleton */}
                <div className="h-10 w-full animate-pulse rounded-lg bg-slate-700/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
