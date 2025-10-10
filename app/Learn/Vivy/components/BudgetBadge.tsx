import { useState } from "react"
import { cn } from "@/lib/utils"
import { Wallet } from "lucide-react"
import { dollarsToCredits, formatCredits } from "../utils/budget"

interface BudgetInfo {
  current: number
  limit: number
  remaining: number
  percentUsed: number
  resetTime: string
}

interface BudgetBadgeProps {
  budget: BudgetInfo
  onOpenDetails?: () => void
  className?: string
}

export function BudgetBadge({
  budget,
  onOpenDetails,
  className,
}: BudgetBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { current, limit, remaining, percentUsed } = budget

  // Convert dollars to credits for display
  const currentCredits = dollarsToCredits(current)
  const limitCredits = dollarsToCredits(limit)
  const remainingCredits = dollarsToCredits(remaining)

  // Determine color based on percentage
  const getColorClasses = () => {
    if (percentUsed >= 95) {
      return {
        bg: "bg-red-500",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-500/50",
        bgLight: "bg-red-50 dark:bg-red-900/20",
        icon: "text-red-600 dark:text-red-400",
      }
    } else if (percentUsed >= 80) {
      return {
        bg: "bg-orange-500",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-500/50",
        bgLight: "bg-orange-50 dark:bg-orange-900/20",
        icon: "text-orange-600 dark:text-orange-400",
      }
    } else if (percentUsed >= 50) {
      return {
        bg: "bg-yellow-500",
        text: "text-yellow-600 dark:text-yellow-400",
        border: "border-yellow-500/50",
        bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
        icon: "text-yellow-600 dark:text-yellow-400",
      }
    } else {
      return {
        bg: "bg-green-500",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-500/50",
        bgLight: "bg-green-50 dark:bg-green-900/20",
        icon: "text-green-600 dark:text-green-400",
      }
    }
  }

  const colors = getColorClasses()

  return (
    <button
      onClick={onOpenDetails}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition-all duration-200 hover:shadow-md",
        colors.border,
        colors.bgLight,
        "cursor-pointer",
        className
      )}
    >
      {/* Icon */}
      <Wallet className={cn("h-3.5 w-3.5", colors.icon)} />

      {/* Budget text */}
      <div className="flex items-baseline gap-1">
        <span className={cn("font-semibold", colors.text)}>
          {formatCredits(remainingCredits)}
        </span>
        <span className="text-slate-500 dark:text-slate-400">credits left</span>
      </div>

      {/* Mini progress indicator */}
      <div className="flex h-1.5 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            colors.bg
          )}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      {/* Hover tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
          <div className="flex flex-col gap-0.5">
            <div className="font-semibold">Daily Budget</div>
            <div className="text-slate-300 dark:text-slate-600">
              {formatCredits(currentCredits)} / {formatCredits(limitCredits)}{" "}
              credits ({percentUsed.toFixed(1)}%)
            </div>
            <div className="text-slate-400 dark:text-slate-500">
              Click for details
            </div>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-100" />
        </div>
      )}
    </button>
  )
}
