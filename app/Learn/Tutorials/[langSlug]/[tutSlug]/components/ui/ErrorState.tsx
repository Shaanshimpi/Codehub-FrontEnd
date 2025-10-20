"use client"

import React from "react"
import { Button } from "./Button"
import { Icon } from "./Icon"

interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error | null
  onRetry?: () => void
  onGoBack?: () => void
  variant?: "error" | "warning" | "info"
  showDetails?: boolean
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We encountered an error while loading this content.",
  error,
  onRetry,
  onGoBack,
  variant = "error",
  showDetails = false,
}) => {
  const [showErrorDetails, setShowErrorDetails] = React.useState(false)

  const getVariantStyles = () => {
    switch (variant) {
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-700",
          icon: "text-red-600 dark:text-red-400",
          iconName: "x" as const,
        }
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-700",
          icon: "text-yellow-600 dark:text-yellow-400",
          iconName: "alert" as const,
        }
      case "info":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-700",
          icon: "text-blue-600 dark:text-blue-400",
          iconName: "info" as const,
        }
      default:
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-700",
          icon: "text-red-600 dark:text-red-400",
          iconName: "x" as const,
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div
      className={`rounded-lg border ${styles.border} ${styles.bg} p-6`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${styles.bg} ${styles.icon}`}
          aria-hidden="true"
        >
          <Icon name={styles.iconName} size="lg" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {message}
          </p>

          {/* Error Details (collapsible) */}
          {error && showDetails && (
            <div className="mb-4">
              <button
                onClick={() => setShowErrorDetails(!showErrorDetails)}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                aria-expanded={showErrorDetails}
                aria-controls="error-details"
              >
                {showErrorDetails ? "Hide" : "Show"} technical details
              </button>
              {showErrorDetails && (
                <div
                  id="error-details"
                  className="mt-2 rounded bg-gray-100 p-3 dark:bg-gray-800"
                >
                  <pre className="overflow-x-auto text-xs text-gray-700 dark:text-gray-300">
                    {error.message}
                    {error.stack && `\n\n${error.stack}`}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {onRetry && (
              <Button
                variant="primary"
                size="sm"
                onClick={onRetry}
                icon={<Icon name="refresh" size="sm" />}
                className="min-h-[44px]"
              >
                Try Again
              </Button>
            )}
            {onGoBack && (
              <Button
                variant="outline"
                size="sm"
                onClick={onGoBack}
                icon={<Icon name="chevronLeft" size="sm" />}
                className="min-h-[44px]"
              >
                Go Back
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Specific error states
export const TutorialNotFoundError: React.FC<{ onGoBack?: () => void }> = ({
  onGoBack,
}) => {
  return (
    <ErrorState
      title="Tutorial Not Found"
      message="The tutorial you're looking for doesn't exist or has been removed."
      variant="warning"
      onGoBack={onGoBack}
    />
  )
}

export const NetworkError: React.FC<{ onRetry?: () => void }> = ({
  onRetry,
}) => {
  return (
    <ErrorState
      title="Connection Error"
      message="Unable to load content. Please check your internet connection and try again."
      variant="warning"
      onRetry={onRetry}
    />
  )
}

export const PermissionError: React.FC<{ onGoBack?: () => void }> = ({
  onGoBack,
}) => {
  return (
    <ErrorState
      title="Access Denied"
      message="You don't have permission to view this content. Please log in or contact support."
      variant="error"
      onGoBack={onGoBack}
    />
  )
}

export default ErrorState
