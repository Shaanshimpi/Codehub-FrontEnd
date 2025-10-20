export default function ExerciseTutorialLoading() {
  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950">
      {/* Tutorial Header Skeleton */}
      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2">
            <div className="h-4 w-16 animate-pulse rounded bg-slate-700" />
            <div className="h-4 w-4 animate-pulse rounded bg-slate-700" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-700" />
            <div className="h-4 w-4 animate-pulse rounded bg-slate-700" />
            <div className="h-4 w-32 animate-pulse rounded bg-slate-700" />
          </div>

          {/* Header Content */}
          <div className="flex items-start gap-6">
            {/* Icon */}
            <div className="hidden h-16 w-16 animate-pulse rounded-xl bg-slate-700 md:block" />

            {/* Text Content */}
            <div className="flex-1">
              <div className="mb-3 h-8 w-3/4 animate-pulse rounded-lg bg-slate-700 sm:h-10" />
              <div className="mb-4 h-5 w-2/3 animate-pulse rounded bg-slate-700" />

              {/* Stats */}
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-pulse rounded bg-slate-700" />
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-700" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Page Title Section */}
        <div className="mb-8">
          <div className="mb-4 h-8 w-96 animate-pulse rounded-lg bg-slate-700" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-slate-700" />
        </div>

        {/* Filters Section */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="h-12 w-full animate-pulse rounded-lg bg-slate-800 md:max-w-md" />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3">
            <div className="h-12 w-32 animate-pulse rounded-lg bg-slate-800" />
            <div className="h-12 w-28 animate-pulse rounded-lg bg-slate-800" />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/50 p-4">
          <div className="flex items-center gap-6">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-700" />
            <div className="h-5 w-28 animate-pulse rounded bg-slate-700" />
          </div>
          <div className="h-5 w-24 animate-pulse rounded bg-slate-700" />
        </div>

        {/* Exercise Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-800 p-6 transition-all hover:border-slate-600"
            >
              {/* Header with Index and Difficulty */}
              <div className="mb-4 flex items-center justify-between">
                <div className="h-10 w-10 animate-pulse rounded-lg bg-gradient-to-br from-slate-600 to-slate-700" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-700" />
              </div>

              {/* Title */}
              <div className="mb-3 h-6 w-full animate-pulse rounded bg-slate-700" />

              {/* Description */}
              <div className="mb-4 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-slate-700" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-700" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-slate-700" />
              </div>

              {/* Tags */}
              <div className="mb-4 flex flex-wrap gap-2">
                <div className="h-6 w-16 animate-pulse rounded-full bg-slate-700" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-700" />
                <div className="h-6 w-14 animate-pulse rounded-full bg-slate-700" />
              </div>

              {/* Stats Footer */}
              <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 animate-pulse rounded bg-slate-700" />
                    <div className="h-4 w-12 animate-pulse rounded bg-slate-700" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 animate-pulse rounded bg-slate-700" />
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-700" />
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute right-4 top-4">
                <div className="h-8 w-8 animate-pulse rounded-full bg-slate-700" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-8 flex items-center justify-between">
          <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-800" />
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 w-10 animate-pulse rounded-lg bg-slate-800"
              />
            ))}
          </div>
          <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-800" />
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="border-t border-slate-800 bg-slate-900/50 px-6 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-4 h-7 w-64 animate-pulse rounded-lg bg-slate-700" />
          <div className="mx-auto mb-6 h-5 w-96 animate-pulse rounded bg-slate-700" />
          <div className="mx-auto h-12 w-48 animate-pulse rounded-lg bg-slate-700" />
        </div>
      </div>
    </div>
  )
}
