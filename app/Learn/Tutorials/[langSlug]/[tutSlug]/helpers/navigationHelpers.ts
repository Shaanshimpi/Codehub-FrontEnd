/**
 * Helper functions for tutorial navigation logic
 */
import type { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"

/**
 * Get navigation URLs for tutorial breadcrumbs
 */
export const getNavigationUrls = (langSlug: string, tutSlug: string) => {
  return {
    home: "/",
    tutorials: "/Learn/Tutorials",
    language: `/Learn/Tutorials/${langSlug}`,
    current: `/Learn/Tutorials/${langSlug}/${tutSlug}`,
  }
}

/**
 * Find previous and next tutorials in a series
 */
export const findAdjacentTutorials = async (
  currentTutorial: Tutorial,
  language: Language
): Promise<{ previous: Tutorial | null; next: Tutorial | null }> => {
  // This would typically fetch from API or database
  // For now, return null as placeholders
  return {
    previous: null,
    next: null,
  }
}

/**
 * Check if user can navigate to a specific lesson
 */
export const canNavigateToLesson = (
  targetLessonIndex: number,
  currentProgress: { completedLessons: any[]; currentLessonIndex: number },
  requireSequential: boolean = false
): boolean => {
  if (!requireSequential) {
    return true
  }

  // Allow navigation to current lesson or any completed lesson
  if (targetLessonIndex <= currentProgress.currentLessonIndex) {
    return true
  }

  // Allow navigation to next lesson if current is completed
  const currentLessonCompleted = currentProgress.completedLessons.some(
    (lesson) =>
      lesson.lessonId === currentProgress.currentLessonIndex.toString()
  )

  return (
    targetLessonIndex === currentProgress.currentLessonIndex + 1 &&
    currentLessonCompleted
  )
}

/**
 * Get next available lesson index
 */
export const getNextAvailableLesson = (
  currentIndex: number,
  totalLessons: number,
  completedLessons: string[]
): number => {
  // Find the next uncompleted lesson
  for (let i = currentIndex + 1; i < totalLessons; i++) {
    if (!completedLessons.includes(i.toString())) {
      return i
    }
  }

  // If all subsequent lessons are completed, return the last lesson
  return Math.min(currentIndex + 1, totalLessons - 1)
}

/**
 * Calculate lesson progress weight for overall progress
 */
export const calculateLessonWeight = (lessonType: string): number => {
  const weights: { [key: string]: number } = {
    concept: 1.0,
    mcq: 1.2,
    codeblock_rearranging: 1.5,
    fill_in_blanks: 1.3,
  }
  return weights[lessonType] || 1.0
}

/**
 * Get recommended next action for user
 */
export const getRecommendedAction = (
  progress: {
    progressPercentage: number
    completedCount: number
    averageScore: number
  },
  totalLessons: number
): { action: string; message: string; buttonText: string } => {
  if (progress.progressPercentage === 0) {
    return {
      action: "start",
      message: "Ready to begin your learning journey?",
      buttonText: "Start First Lesson",
    }
  }

  if (progress.progressPercentage < 100) {
    return {
      action: "continue",
      message: `You're ${progress.progressPercentage}% done. Keep going!`,
      buttonText: "Continue Learning",
    }
  }

  if (progress.averageScore < 80) {
    return {
      action: "review",
      message: "Consider reviewing lessons where you scored below 80%",
      buttonText: "Review Lessons",
    }
  }

  return {
    action: "complete",
    message: "Congratulations! You've mastered this tutorial.",
    buttonText: "Explore More Tutorials",
  }
}
