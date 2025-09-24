/**
 * Helper functions for progress tracking and statistics
 */
import type {
  TutorialProgress,
} from "../hooks/useTutorialProgress"

/**
 * Calculate detailed progress statistics
 */
export const calculateProgressStats = (
  progress: TutorialProgress,
  totalLessons: number
) => {
  const completedCount = progress.completedLessons.length
  const progressPercentage = Math.round((completedCount / totalLessons) * 100)

  const scoresWithValues = progress.completedLessons.filter(
    (lesson) => lesson.score !== undefined
  )
  const averageScore =
    scoresWithValues.length > 0
      ? Math.round(
          scoresWithValues.reduce(
            (acc, lesson) => acc + (lesson.score || 0),
            0
          ) / scoresWithValues.length
        )
      : 0

  return {
    completedCount,
    totalLessons,
    progressPercentage,
    averageScore,
    totalTimeSpent: progress.totalTimeSpent,
    isBookmarked: progress.bookmarked,
    hasNotes: progress.notes.length > 0,
    lastAccessed: progress.lastAccessed,
  }
}

/**
 * Get achievements based on progress
 */
export const getAchievements = (
  stats: ReturnType<typeof calculateProgressStats>
) => {
  const achievements = []

  if (stats.progressPercentage >= 100) {
    achievements.push({
      id: "completed",
      title: "Tutorial Master!",
      description: "Completed all lessons",
      icon: "🎉",
      color: "green",
    })
  }

  if (stats.averageScore >= 90) {
    achievements.push({
      id: "excellent",
      title: "Excellence Award",
      description: "Maintained 90%+ average score",
      icon: "⭐",
      color: "yellow",
    })
  } else if (stats.averageScore >= 80) {
    achievements.push({
      id: "proficient",
      title: "Proficiency Badge",
      description: "Maintained 80%+ average score",
      icon: "🏆",
      color: "blue",
    })
  }

  if (stats.totalTimeSpent >= 3600000) {
    // 1 hour
    achievements.push({
      id: "dedicated",
      title: "Dedicated Learner",
      description: "Spent over 1 hour learning",
      icon: "⏰",
      color: "purple",
    })
  }

  if (stats.hasNotes) {
    achievements.push({
      id: "notes",
      title: "Note Taker",
      description: "Kept personal learning notes",
      icon: "📝",
      color: "orange",
    })
  }

  return achievements
}

/**
 * Get learning streak information
 */
export const calculateLearningStreak = (
  progress: TutorialProgress
): {
  currentStreak: number
  longestStreak: number
  lastStudyDate: Date
} => {
  // This would ideally track daily study sessions
  // For now, return basic info based on last accessed
  const lastStudyDate = new Date(progress.lastAccessed)
  const today = new Date()
  const daysDiff = Math.floor(
    (today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  return {
    currentStreak: daysDiff <= 1 ? 1 : 0, // Simplified logic
    longestStreak: 1, // Would need historical data
    lastStudyDate,
  }
}

/**
 * Get performance insights
 */
export const getPerformanceInsights = (
  progress: TutorialProgress,
  totalLessons: number
): Array<{ type: "success" | "warning" | "info"; message: string }> => {
  const insights = []
  const stats = calculateProgressStats(progress, totalLessons)

  if (stats.averageScore < 60 && stats.completedCount > 2) {
    insights.push({
      type: "warning",
      message: "Consider reviewing concepts - scores are below 60%",
    })
  }

  if (stats.progressPercentage > 50 && stats.averageScore > 80) {
    insights.push({
      type: "success",
      message: "Excellent progress! You're mastering this tutorial",
    })
  }

  if (stats.totalTimeSpent > 7200000) {
    // 2 hours
    insights.push({
      type: "info",
      message: "You've spent significant time on this - consider taking breaks",
    })
  }

  const daysSinceLastAccess = Math.floor(
    (Date.now() - stats.lastAccessed) / (1000 * 60 * 60 * 24)
  )
  if (daysSinceLastAccess > 7) {
    insights.push({
      type: "info",
      message: "Welcome back! It's been a while since your last session",
    })
  }

  return insights
}

/**
 * Suggest next actions based on progress
 */
export const suggestNextActions = (
  progress: TutorialProgress,
  totalLessons: number
): Array<{
  action: string
  reason: string
  priority: "high" | "medium" | "low"
}> => {
  const suggestions = []
  const stats = calculateProgressStats(progress, totalLessons)

  if (stats.progressPercentage === 0) {
    suggestions.push({
      action: "Start the first lesson",
      reason: "Begin your learning journey",
      priority: "high" as const,
    })
  } else if (stats.progressPercentage < 100) {
    suggestions.push({
      action: "Continue to next lesson",
      reason: `You're ${stats.progressPercentage}% complete`,
      priority: "high" as const,
    })
  }

  if (stats.averageScore < 70 && stats.completedCount > 1) {
    suggestions.push({
      action: "Review previous lessons",
      reason: "Strengthen understanding of key concepts",
      priority: "medium" as const,
    })
  }

  if (!stats.hasNotes) {
    suggestions.push({
      action: "Take notes on key concepts",
      reason: "Improve retention and create study reference",
      priority: "low" as const,
    })
  }

  if (!stats.isBookmarked && stats.progressPercentage > 25) {
    suggestions.push({
      action: "Bookmark this tutorial",
      reason: "Easy access from your dashboard",
      priority: "low" as const,
    })
  }

  return suggestions
}
