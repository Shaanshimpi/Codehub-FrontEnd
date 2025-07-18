// app/Learn/Interactives/AIExercise/ExerciseGenerator/ExerciseFormatter.tsx
"use client"

import React from "react"
import type { ExerciseAIData } from "@/app/Learn/types/TutorialTypes"
import {
  formatCode,
  formatExplanation,
  formatHints,
  formatVisualElements,
} from "./ExercisePreview/utils/exerciseFormatter"

// app/Learn/Interactives/AIExercise/ExerciseGenerator/ExerciseFormatter.tsx

interface ExerciseFormatterProps {
  exerciseData: ExerciseAIData
  language: string
  locale: "en" | "hi" | "mr"
}

export const ExerciseFormatter: React.FC<ExerciseFormatterProps> = ({
  exerciseData,
  language,
  locale = "en",
}) => {
  // Get localized content
  const getLocalizedContent = () => {
    switch (locale) {
      case "hi":
        return {
          hints: exerciseData.hints_hi,
          explanation: exerciseData.explanation_hi,
        }
      case "mr":
        return {
          hints: exerciseData.hints_mr,
          explanation: exerciseData.explanation_mr,
        }
      default:
        return {
          hints: exerciseData.hints_en,
          explanation: exerciseData.explanation_en,
        }
    }
  }

  const content = getLocalizedContent()

  // Format all content
  const formattedContent = {
    code: formatCode(exerciseData.code, language),
    hints: formatHints(content.hints),
    explanation: formatExplanation(content.explanation),
    visualElements: formatVisualElements(exerciseData.visual_elements),
  }

  return formattedContent
}

// Export a hook for easy usage
export const useExerciseFormatter = (
  exerciseData: ExerciseAIData | null,
  language: string,
  locale: "en" | "hi" | "mr" = "en"
) => {
  const [formattedContent, setFormattedContent] = React.useState<any>(null)

  React.useEffect(() => {
    if (exerciseData) {
      const formatter = ExerciseFormatter({
        exerciseData,
        language,
        locale,
      })
      setFormattedContent(formatter)
    }
  }, [exerciseData, language, locale])

  return formattedContent
}
