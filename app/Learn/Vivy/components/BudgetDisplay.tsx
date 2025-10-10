import { cn } from "@/lib/utils"
import { AlertCircle, Clock, TrendingUp } from "lucide-react"

interface BudgetInfo {
  current: number
  limit: number
  remaining: number
  percentUsed: number
  resetTime: string
}

interface BudgetDisplayProps {
  budget: BudgetInfo
  className?: string
}

export function BudgetDisplay({ budget, className }: BudgetDisplayProps) {
  const { current, limit, remaining, percentUsed, resetTime } = budget

  // Determine color based on percentage
  const getColorClasses = () => {
    if (percentUsed >= 95) {
      return {
        bg: "bg-red-500",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-900/50",
        bgLight: "bg-red-50 dark:bg-red-900/20",
      }
    } else if (percentUsed >= 80) {
      return {
        bg: "bg-orange-500",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-900/50",
        bgLight: "bg-orange-50 dark:bg-orange-900/20",
      }
    } else if (percentUsed >= 50) {
      return {
        bg: "bg-yellow-500",
        text: "text-yellow-600 dark:text-yellow-400",
        border: "border-yellow-200 dark:border-yellow-900/50",
        bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
      }
    } else {
      return {
        bg: "bg-green-500",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-200 dark:border-green-900/50",
        bgLight: "bg-green-50 dark:bg-green-900/20",
      }
    }
  }

  const colors = getColorClasses()

  // Get status message
  const getStatusMessage = () => {
    if (percentUsed >= 95) {
      return "⚠️ Critical - Almost at limit!"
    } else if (percentUsed >= 80) {
      return "⚠️ Warning - Approaching limit"
    } else if (percentUsed >= 50) {
      return "💡 Moderate usage"
    } else {
      return "✅ Healthy budget"
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 shadow-lg transition-all duration-300",
        colors.border,
        colors.bgLight,
        className
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className={cn("h-4 w-4", colors.text)} />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Daily Budget
          </h3>
        </div>
        <span className={cn("text-xs font-medium", colors.text)}>
          {getStatusMessage()}
        </span>
      </div>

      {/* Budget Numbers */}
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            ${current.toFixed(4)}
          </span>
          <span className="mx-2 text-sm text-slate-500 dark:text-slate-400">
            /
          </span>
          <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            ${limit.toFixed(2)}
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Remaining
          </div>
          <div className={cn("text-sm font-semibold", colors.text)}>
            ${remaining.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {percentUsed.toFixed(1)}% used
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              colors.bg
            )}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </div>

      {/* Reset Time */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <Clock className="h-3 w-3" />
          <span>Resets in: {resetTime}</span>
        </div>
        {percentUsed >= 80 && (
          <div className="flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400">
            <AlertCircle className="h-3 w-3" />
            <span>Use carefully</span>
          </div>
        )}
      </div>
    </div>
  )
}
