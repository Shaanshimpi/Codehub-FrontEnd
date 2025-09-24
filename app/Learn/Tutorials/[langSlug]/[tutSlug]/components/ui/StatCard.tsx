/**
 * Reusable stat card component for displaying metrics
 */
import React from "react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  color?: "blue" | "green" | "purple" | "yellow" | "red" | "gray"
  trend?: {
    value: number
    isPositive: boolean
  }
  onClick?: () => void
  className?: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
  trend,
  onClick,
  className = "",
}) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
      icon: "text-blue-500",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-400",
      icon: "text-green-500",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-400",
      icon: "text-purple-500",
    },
    yellow: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      text: "text-yellow-600 dark:text-yellow-400",
      icon: "text-yellow-500",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-600 dark:text-red-400",
      icon: "text-red-500",
    },
    gray: {
      bg: "bg-gray-50 dark:bg-gray-800",
      text: "text-gray-600 dark:text-gray-400",
      icon: "text-gray-500",
    },
  }

  const { bg, text, icon: iconColor } = colorClasses[color]

  const baseClasses = `rounded-lg ${bg} p-4 transition-all duration-200`
  const interactiveClasses = onClick
    ? "cursor-pointer hover:shadow-md hover:scale-105"
    : ""

  const CardContent = () => (
    <>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className={`text-2xl font-bold ${text}`}>{value}</div>
          <div
            className={`text-sm ${text.replace("600", "800").replace("400", "200")}`}
          >
            {title}
          </div>
        </div>
        {icon && <div className={`text-xl ${iconColor}`}>{icon}</div>}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 flex items-center justify-between">
          {subtitle && (
            <div
              className={`text-xs ${text.replace("600", "700").replace("400", "300")}`}
            >
              {subtitle}
            </div>
          )}
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs ${
                trend.isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              <span>{trend.isPositive ? "↗" : "↘"}</span>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      )}
    </>
  )

  if (onClick) {
    return (
      <button
        className={`${baseClasses} ${interactiveClasses} ${className} w-full text-left`}
        onClick={onClick}
      >
        <CardContent />
      </button>
    )
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      <CardContent />
    </div>
  )
}

export default StatCard
