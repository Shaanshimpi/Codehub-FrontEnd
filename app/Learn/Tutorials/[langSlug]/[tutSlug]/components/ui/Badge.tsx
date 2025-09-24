/**
 * Reusable badge component for displaying status, scores, difficulty etc.
 */

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "error" | "info"
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onClick?: () => void
  className?: string
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  interactive = false,
  onClick,
  className = "",
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full"

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  }

  const variantClasses = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    error: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  }

  const interactiveClasses =
    interactive || onClick
      ? "cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      : ""

  const allClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${interactiveClasses} ${className}`

  if (onClick) {
    return (
      <button className={allClasses} onClick={onClick} type="button">
        {children}
      </button>
    )
  }

  return <span className={allClasses}>{children}</span>
}

export default Badge
