const VIEWED_SOLUTIONS_KEY = "viewedSolutions"

export interface ViewedSolutions {
  [exerciseSlug: string]: boolean
}

export function hasViewedSolution(exerciseSlug: string): boolean {
  try {
    const viewedSolutions = localStorage.getItem(VIEWED_SOLUTIONS_KEY)
    if (!viewedSolutions) return false

    const parsed: ViewedSolutions = JSON.parse(viewedSolutions)
    return Boolean(parsed[exerciseSlug])
  } catch (error) {
    console.error("Error checking viewed solution:", error)
    return false
  }
}

export function markSolutionViewed(exerciseSlug: string): void {
  try {
    const existing = localStorage.getItem(VIEWED_SOLUTIONS_KEY)
    const viewedSolutions: ViewedSolutions = existing
      ? JSON.parse(existing)
      : {}

    viewedSolutions[exerciseSlug] = true
    localStorage.setItem(VIEWED_SOLUTIONS_KEY, JSON.stringify(viewedSolutions))
  } catch (error) {
    console.error("Error marking solution as viewed:", error)
  }
}

export function getViewedSolutions(): ViewedSolutions {
  try {
    const viewedSolutions = localStorage.getItem(VIEWED_SOLUTIONS_KEY)
    return viewedSolutions ? JSON.parse(viewedSolutions) : {}
  } catch (error) {
    console.error("Error getting viewed solutions:", error)
    return {}
  }
}
