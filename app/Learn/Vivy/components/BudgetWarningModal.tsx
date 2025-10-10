import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { AlertTriangle, Clock, X } from "lucide-react"
import { dollarsToCredits, formatCredits } from "../utils/budget"

interface BudgetInfo {
  current: number
  limit: number
  remaining: number
  percentUsed: number
  resetTime: string
}

interface BudgetWarningModalProps {
  isOpen: boolean
  onClose: () => void
  budget: BudgetInfo
}

export function BudgetWarningModal({
  isOpen,
  onClose,
  budget,
}: BudgetWarningModalProps) {
  const { current, limit, remaining, percentUsed, resetTime } = budget

  // Convert dollars to credits for display
  const currentCredits = dollarsToCredits(current)
  const limitCredits = dollarsToCredits(limit)
  const remainingCredits = dollarsToCredits(remaining)

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  // Determine severity level
  const getSeverity = () => {
    if (percentUsed >= 95) return "critical"
    if (percentUsed >= 90) return "high"
    return "warning"
  }

  const severity = getSeverity()

  const severityConfig = {
    critical: {
      icon: "🚨",
      title: "Critical Budget Alert",
      bg: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-500",
      bgLight: "bg-red-50 dark:bg-red-900/20",
    },
    high: {
      icon: "⚠️",
      title: "Budget Alert",
      bg: "bg-orange-500",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-500",
      bgLight: "bg-orange-50 dark:bg-orange-900/20",
    },
    warning: {
      icon: "💡",
      title: "Budget Warning",
      bg: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-500",
      bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
    },
  }

  const config = severityConfig[severity]

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-md rounded-2xl border-2 bg-white shadow-2xl dark:bg-slate-900"
          style={{ borderColor: config.border }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div
            className={cn(
              "flex items-center gap-3 rounded-t-2xl border-b p-6",
              config.bgLight
            )}
          >
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-2xl",
                config.bg,
                "text-white"
              )}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {config.icon} {config.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You&apos;re approaching your daily limit
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 p-6">
            {/* Budget Stats */}
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
                <div className="mb-2 flex items-baseline justify-between">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Current Spend
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {formatCredits(currentCredits)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      credits
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Daily Limit
                    </div>
                    <div className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
                      {formatCredits(limitCredits)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      credits
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className={cn("text-sm font-semibold", config.text)}>
                      {percentUsed.toFixed(1)}% used
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {formatCredits(remainingCredits)} credits left
                    </span>
                  </div>
                  <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        config.bg
                      )}
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div
                className={cn("rounded-lg border-l-4 p-4", config.bgLight)}
                style={{ borderLeftColor: config.border }}
              >
                {severity === "critical" ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>
                      You&apos;ve used {percentUsed.toFixed(1)}% of your daily
                      budget!
                    </strong>{" "}
                    Consider using free models or waiting for the reset.
                  </p>
                ) : severity === "high" ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>High usage detected.</strong> You have{" "}
                    {formatCredits(remainingCredits)} credits remaining. Use
                    paid models sparingly.
                  </p>
                ) : (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Heads up!</strong> You&apos;ve used{" "}
                    {percentUsed.toFixed(1)}% of your budget. Keep an eye on
                    usage.
                  </p>
                )}
              </div>

              {/* Reset Time */}
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span>Budget resets in: {resetTime}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg bg-slate-200 px-4 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
