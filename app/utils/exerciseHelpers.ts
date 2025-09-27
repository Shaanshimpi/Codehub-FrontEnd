import type { ExerciseAIData } from "@/app/Learn/types/TutorialTypes"

export const getLocalizedContent = (
  exerciseData: ExerciseAIData,
  language: string
) => {
  // Return single language fields (multi-language support removed)
  return {
    title: exerciseData.title,
    hints: exerciseData.hints,
    explanation: exerciseData.explanation,
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
