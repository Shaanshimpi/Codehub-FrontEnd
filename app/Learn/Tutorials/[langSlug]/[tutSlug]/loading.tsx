export default function TutorialPageLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        {/* Desktop Sidebar Skeleton */}
        <aside className="hidden w-80 flex-shrink-0 lg:block">
          <div className="sticky top-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Tutorial Header */}
            <div className="mb-6">
              <div className="mb-3 flex items-start gap-3">
                <div className="mt-0.5 h-6 w-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1">
                  <div className="mb-2 h-6 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                    <div className="h-5 w-5 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                  </div>
                  <div className="h-6 w-12 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                </div>
              ))}
            </div>

            {/* Lessons List */}
            <div>
              <div className="mb-3 h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1">
          {/* Mobile Menu Button */}
          <div className="mb-4 lg:hidden">
            <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Content Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Lesson Header */}
            <div className="mb-6 border-b border-gray-200 pb-6 dark:border-gray-700">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-6 w-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="mb-4 h-8 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-4">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            {/* Lesson Content */}
            <div className="space-y-6">
              {/* Text blocks */}
              {[1, 2, 3].map((block) => (
                <div key={block} className="space-y-3">
                  <div className="h-5 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              ))}

              {/* Code Block Skeleton */}
              <div className="overflow-hidden rounded-lg border border-gray-300 bg-gray-900 p-4 dark:border-gray-600">
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((line) => (
                    <div
                      key={line}
                      className={`h-4 animate-pulse rounded bg-gray-700 ${
                        line === 1 ? "w-3/4" : line === 5 ? "w-2/3" : "w-full"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* More text */}
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
              <div className="h-12 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="h-12 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>

          {/* Reference Section Skeleton */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

            {/* Tab buttons */}
            <div className="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
              {[1, 2, 3, 4].map((tab) => (
                <div
                  key={tab}
                  className="h-10 w-24 animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>

            {/* Tab content */}
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
