"use client"

import React from "react"

interface SkeletonLoaderProps {
  variant?: "text" | "card" | "button" | "avatar" | "custom"
  width?: string
  height?: string
  className?: string
  count?: number
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = "text",
  width,
  height,
  className = "",
  count = 1,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "text":
        return "h-4 rounded"
      case "card":
        return "h-32 rounded-lg"
      case "button":
        return "h-10 rounded-md"
      case "avatar":
        return "h-10 w-10 rounded-full"
      case "custom":
        return ""
      default:
        return "h-4 rounded"
    }
  }

  const skeletonElement = (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${getVariantClasses()} ${className}`}
      style={{
        width: width || (variant === "avatar" ? undefined : "100%"),
        height: height,
      }}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )

  if (count === 1) {
    return skeletonElement
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{skeletonElement}</div>
      ))}
    </div>
  )
}

// Tutorial-specific skeleton loaders
export const TutorialSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" role="status" aria-label="Loading tutorial">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <SkeletonLoader variant="text" height="32px" width="60%" />
        <SkeletonLoader variant="text" height="20px" width="80%" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-3 gap-4">
        <SkeletonLoader variant="card" height="80px" />
        <SkeletonLoader variant="card" height="80px" />
        <SkeletonLoader variant="card" height="80px" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <SkeletonLoader variant="text" count={5} />
      </div>

      <span className="sr-only">Loading tutorial content...</span>
    </div>
  )
}

export const LessonListSkeleton: React.FC<{ count?: number }> = ({
  count = 5,
}) => {
  return (
    <div className="space-y-2" role="status" aria-label="Loading lessons">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
        >
          <SkeletonLoader variant="avatar" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader variant="text" height="16px" width="70%" />
            <SkeletonLoader variant="text" height="12px" width="40%" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading lesson list...</span>
    </div>
  )
}

export const CodeBlockSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
      role="status"
      aria-label="Loading code"
    >
      <SkeletonLoader variant="text" count={8} />
      <span className="sr-only">Loading code example...</span>
    </div>
  )
}

export default SkeletonLoader
