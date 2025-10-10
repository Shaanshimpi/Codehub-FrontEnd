// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseLayout.tsx
// Server Component - No 'use client' directive
import React from "react"
import ExerciseClientWrapper from "./ExerciseClientWrapper"

interface ExerciseLayoutProps {
  exercise: any // Exercise object from your data
  language: any // Language object
  tutorial: any // Tutorial object
  params: {
    langSlug: string
    tutSlug: string
    exerciseSlug: string
  }
}

const ExerciseLayout: React.FC<ExerciseLayoutProps> = ({
  exercise,
  language,
  tutorial,
  params,
}) => {
  // Server component - just renders structure and passes data to client wrapper
  return (
    <ExerciseClientWrapper
      exercise={exercise}
      language={language}
      tutorial={tutorial}
      params={params}
    />
  )
}

export default ExerciseLayout
