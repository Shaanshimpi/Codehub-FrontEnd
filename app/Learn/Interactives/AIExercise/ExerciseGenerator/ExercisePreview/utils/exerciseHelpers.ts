import type { ExerciseAIData } from "@/app/Learn/types/TutorialTypes"

export const getLocalizedContent = (
  exerciseData: ExerciseAIData,
  language: string
) => {
  switch (language) {
    case "hi":
      return {
        title: exerciseData.title_hi,
        hints: exerciseData.hints_hi,
        explanation: exerciseData.explanation_hi,
      }
    case "mr":
      return {
        title: exerciseData.title_mr,
        hints: exerciseData.hints_mr,
        explanation: exerciseData.explanation_mr,
      }
    default:
      return {
        title: exerciseData.title_en,
        hints: exerciseData.hints_en,
        explanation: exerciseData.explanation_en,
      }
  }
}

export const getDifficultyLabel = (difficulty: number) => {
  switch (difficulty) {
    case 1:
      return "Beginner"
    case 2:
      return "Intermediate"
    case 3:
      return "Advanced"
    default:
      return "Unknown"
  }
}
