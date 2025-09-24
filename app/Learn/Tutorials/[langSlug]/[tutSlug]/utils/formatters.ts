/**
 * Utility functions for formatting data in tutorials
 */

/**
 * Format time in milliseconds to human readable format
 */
export const formatTime = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  return `${minutes}m`
}

/**
 * Format difficulty number to human readable label
 */
export const formatDifficulty = (difficulty: number): string => {
  const difficultyMap: { [key: number]: string } = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
  }
  return difficultyMap[difficulty] || "Unknown"
}

/**
 * Format difficulty with icon
 */
export const formatDifficultyWithIcon = (
  difficulty: number
): { label: string; icon: string; color: string } => {
  const difficultyConfig: {
    [key: number]: { label: string; icon: string; color: string }
  } = {
    1: { label: "Beginner", icon: "🟢", color: "text-green-600" },
    2: { label: "Intermediate", icon: "🟡", color: "text-yellow-600" },
    3: { label: "Advanced", icon: "🔴", color: "text-red-600" },
  }
  return (
    difficultyConfig[difficulty] || {
      label: "Unknown",
      icon: "⚪",
      color: "text-gray-600",
    }
  )
}

/**
 * Format lesson type to display info
 */
export const formatLessonType = (
  type: string
): { label: string; icon: string; color: string } => {
  const typeConfig: {
    [key: string]: { label: string; icon: string; color: string }
  } = {
    concept: { label: "Concept", icon: "📖", color: "text-blue-600" },
    mcq: { label: "Quiz", icon: "🎯", color: "text-purple-600" },
    codeblock_rearranging: {
      label: "Code Rearrange",
      icon: "🧩",
      color: "text-green-600",
    },
    fill_in_blanks: {
      label: "Fill Blanks",
      icon: "✏️",
      color: "text-orange-600",
    },
  }
  return (
    typeConfig[type] || { label: "Unknown", icon: "❓", color: "text-gray-600" }
  )
}

/**
 * Calculate estimated time to complete tutorial
 */
export const calculateEstimatedTime = (
  totalLessons: number,
  completedLessons: number,
  averageTimePerLesson: number = 5 // minutes
): string => {
  const remainingLessons = totalLessons - completedLessons
  const estimatedMinutes = remainingLessons * averageTimePerLesson
  return formatTime(estimatedMinutes * 60000)
}

/**
 * Get progress status message
 */
export const getProgressMessage = (
  progressPercentage: number
): { message: string; color: string } => {
  if (progressPercentage === 0) {
    return { message: "Ready to start!", color: "text-blue-600" }
  } else if (progressPercentage < 25) {
    return { message: "Just getting started", color: "text-blue-600" }
  } else if (progressPercentage < 50) {
    return { message: "Making progress", color: "text-yellow-600" }
  } else if (progressPercentage < 75) {
    return { message: "Halfway there!", color: "text-orange-600" }
  } else if (progressPercentage < 100) {
    return { message: "Almost done!", color: "text-green-600" }
  } else {
    return { message: "Completed!", color: "text-green-700" }
  }
}

/**
 * Format score with grade
 */
export const formatScoreWithGrade = (
  score: number
): { score: number; grade: string; color: string } => {
  let grade = "F"
  let color = "text-red-600"

  if (score >= 90) {
    grade = "A"
    color = "text-green-600"
  } else if (score >= 80) {
    grade = "B"
    color = "text-green-500"
  } else if (score >= 70) {
    grade = "C"
    color = "text-yellow-600"
  } else if (score >= 60) {
    grade = "D"
    color = "text-orange-600"
  }

  return { score, grade, color }
}
