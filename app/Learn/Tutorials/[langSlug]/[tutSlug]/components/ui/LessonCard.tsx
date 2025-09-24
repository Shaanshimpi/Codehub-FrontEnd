/**
 * Reusable lesson card component for displaying lesson information
 */
import React from "react"
import { generateContentPreview } from "../../helpers/contentHelpers"
import { formatLessonType } from "../../utils/formatters"
import Badge from "./Badge"
import ProgressBar from "./ProgressBar"

interface LessonCardProps {
  lesson: {
    id: string
    title: string
    type: string
    conceptData?: any
    mcqData?: any
    codeRearrangeData?: any
    fibData?: any
  }
  index: number
  isActive?: boolean
  isCompleted?: boolean
  score?: number
  onClick?: () => void
  showPreview?: boolean
  className?: string
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  index,
  isActive = false,
  isCompleted = false,
  score,
  onClick,
  showPreview = false,
  className = "",
}) => {
  const { label, icon, color } = formatLessonType(lesson.type)

  // Get lesson content for preview
  const lessonContent =
    lesson.conceptData ||
    lesson.mcqData ||
    lesson.codeRearrangeData ||
    lesson.fibData
  const preview =
    showPreview && lessonContent ? generateContentPreview(lessonContent) : null

  const getStatusIcon = () => {
    if (isCompleted) return "✅"
    if (isActive) return "🔵"
    return "⚪"
  }

  const getCardClasses = () => {
    const baseClasses =
      "w-full rounded-lg p-3 text-left transition-all duration-200 border"

    if (isActive) {
      return `${baseClasses} border-blue-300 bg-blue-50 shadow-md dark:border-blue-600 dark:bg-blue-900/20`
    }

    if (isCompleted) {
      return `${baseClasses} border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-700 dark:bg-green-900/10 dark:hover:bg-green-900/20`
    }

    return `${baseClasses} border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750`
  }

  return (
    <button
      className={`${getCardClasses()} ${className}`}
      onClick={onClick}
      disabled={!onClick}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <span className="mt-0.5 text-lg" aria-hidden="true">
          {getStatusIcon()}
        </span>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-1 flex items-start justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate font-medium text-gray-900 dark:text-white">
                {index + 1}. {lesson.title}
              </span>
            </div>

            {/* Score Badge */}
            {score !== undefined && (
              <Badge
                variant={
                  score >= 80 ? "success" : score >= 60 ? "warning" : "error"
                }
                size="sm"
              >
                {score}%
              </Badge>
            )}
          </div>

          {/* Lesson Type and Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-75" aria-hidden="true">
                {icon}
              </span>
              <span className={`text-xs font-medium ${color}`}>{label}</span>
            </div>

            {/* Progress indicator for active lesson */}
            {isActive && !isCompleted && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                In Progress
              </div>
            )}
          </div>

          {/* Content Preview */}
          {preview && (
            <div className="mt-2 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
              {preview}
            </div>
          )}

          {/* Completion Progress Bar (if lesson has sub-questions) */}
          {isActive && lessonContent?.questions && (
            <div className="mt-2">
              <ProgressBar
                progress={0} // This would be calculated based on answered questions
                size="sm"
                color="blue"
                animated
              />
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

export default LessonCard
