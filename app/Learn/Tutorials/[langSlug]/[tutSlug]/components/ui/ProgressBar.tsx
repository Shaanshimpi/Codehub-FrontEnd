/**
 * Reusable progress bar component
 */

interface ProgressBarProps {
  progress: number // 0-100
  size?: "sm" | "md" | "lg"
  color?: "blue" | "green" | "purple" | "orange"
  showLabel?: boolean
  animated?: boolean
  className?: string
  onClick?: (clickPosition: number) => void // For interactive progress bars
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = "md",
  color = "blue",
  showLabel = false,
  animated = false,
  className = "",
  onClick,
}) => {
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  }

  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
    orange: "bg-orange-600",
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return

    const rect = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100))
    onClick(percentage)
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`w-full rounded-full bg-gray-200 dark:bg-gray-700 ${sizeClasses[size]} ${
          onClick ? "cursor-pointer" : ""
        }`}
        onClick={handleClick}
        role={onClick ? "slider" : "progressbar"}
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${progress}%`}
      >
        <div
          className={`${sizeClasses[size]} rounded-full ${colorClasses[color]} ${
            animated ? "transition-all duration-300 ease-out" : ""
          }`}
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {Math.round(progress)}% complete
        </div>
      )}
    </div>
  )
}

export default ProgressBar
