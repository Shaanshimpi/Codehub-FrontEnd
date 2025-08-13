"use client"

import React from "react"

const TutorialLoading = () => {
  return (
    <section className="bg-slate-900 px-6 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-12 w-96 animate-pulse rounded bg-slate-700" />
          <div className="mx-auto h-6 w-3/4 animate-pulse rounded bg-slate-700" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl border-2 border-transparent bg-white p-6 shadow-lg dark:bg-slate-800"
            >
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="mb-2 flex w-full items-center justify-between">
                  <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-slate-700" />
                  <div className="h-4 w-12 rounded bg-gray-200 dark:bg-slate-700" />
                </div>

                <div className="h-16 w-16 rounded-lg bg-gray-200 dark:bg-slate-700" />

                <div className="w-full flex-1">
                  <div className="mx-auto mb-2 h-5 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
                  <div className="h-3 w-full rounded bg-gray-200 dark:bg-slate-700" />
                </div>

                <div className="h-8 w-full rounded bg-gray-200 dark:bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TutorialLoading
