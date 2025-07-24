"use client"

import React from "react"
import { BookOpen, Code, Loader2, Target } from "lucide-react"

interface ExerciseLoadingProps {
  variant?: "page" | "list" | "exercise" | "card"
  message?: string
}

const ExerciseLoading: React.FC<ExerciseLoadingProps> = ({
  variant = "exercise",
  message = "Loading...",
}) => {
  // Full page loading (for main exercise page)
  if (variant === "exercise") {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        {/* Header Skeleton */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-800 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="mb-4 flex items-center space-x-2">
              <div className="h-4 w-12 animate-pulse rounded bg-white/20" />
              <div className="h-4 w-4 animate-pulse rounded bg-white/20" />
              <div className="h-4 w-20 animate-pulse rounded bg-white/20" />
              <div className="h-4 w-4 animate-pulse rounded bg-white/20" />
              <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-2 h-8 w-96 animate-pulse rounded bg-white/20" />
                <div className="flex items-center gap-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
                  <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
                  <div className="h-4 w-20 animate-pulse rounded bg-white/20" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-20 animate-pulse rounded-lg bg-white/20" />
                <div className="h-9 w-16 animate-pulse rounded-lg bg-white/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Skeleton */}
        <div className="border-b border-slate-200 bg-white py-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-2 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>

        {/* View Switcher Skeleton */}
        <div className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center justify-center py-4">
              <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <div className="h-9 w-32 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
                <div className="ml-1 h-9 w-40 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex min-h-[calc(100vh-250px)]">
          {/* Left Panel */}
          <div className="w-1/2 border-r border-slate-200 bg-sky-50 p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="space-y-6">
              <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-6 w-14 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-1/2 bg-slate-900">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-6 w-32 animate-pulse rounded bg-slate-700" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 animate-pulse rounded bg-slate-700" />
                  <div className="h-8 w-8 animate-pulse rounded bg-slate-700" />
                </div>
              </div>
              <div className="h-64 w-full animate-pulse rounded-lg bg-slate-800" />
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg font-medium text-slate-900 dark:text-white">
                Loading Exercise...
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // List loading (for exercises/tutorials grid)
  if (variant === "list") {
    return (
      <div className="min-h-screen bg-slate-900 dark:bg-slate-950">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-[10vh] text-white dark:from-slate-800 dark:to-slate-900">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 h-6 w-32 animate-pulse rounded bg-white/20" />
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 animate-pulse rounded-xl bg-white/20" />
              <div>
                <div className="mb-2 h-12 w-64 animate-pulse rounded bg-white/20" />
                <div className="h-6 w-96 animate-pulse rounded bg-white/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8">
            <div className="mb-4 h-8 w-48 animate-pulse rounded bg-slate-700" />
            <div className="h-6 w-96 animate-pulse rounded bg-slate-700" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border-2 border-transparent bg-sky-50 p-6 dark:bg-slate-800"
              >
                <div className="mb-4 flex items-center space-x-3">
                  <div className="h-12 w-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1">
                    <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="fixed bottom-6 right-6">
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-lg dark:bg-slate-800">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {message}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Card loading (for individual items)
  if (variant === "card") {
    return (
      <div className="rounded-lg border-2 border-transparent bg-sky-50 p-6 dark:bg-slate-800">
        <div className="animate-pulse">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1">
                <div className="mb-2 h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
            <div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="mb-4 space-y-2">
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default page loading
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 dark:bg-slate-950">
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-slate-700 dark:border-slate-600" />
            <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
          </div>
        </div>

        <div className="mb-2 flex items-center justify-center gap-2">
          <Code className="h-5 w-5 text-blue-600" />
          <span className="text-xl font-semibold text-white">
            CodeHub India
          </span>
        </div>

        <p className="text-slate-400">{message}</p>

        {/* Animated dots */}
        <div className="mt-4 flex items-center justify-center space-x-1">
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        {/* Feature icons */}
        <div className="mt-8 flex items-center justify-center gap-6 text-slate-600">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg bg-slate-800 p-3">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-xs">Tutorials</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg bg-slate-800 p-3">
              <Code className="h-6 w-6" />
            </div>
            <span className="text-xs">Exercises</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg bg-slate-800 p-3">
              <Target className="h-6 w-6" />
            </div>
            <span className="text-xs">Practice</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExerciseLoading
