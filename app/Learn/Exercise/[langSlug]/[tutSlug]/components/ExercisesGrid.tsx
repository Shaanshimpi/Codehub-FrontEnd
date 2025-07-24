"use client"

import React from "react"
import { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import ExerciseCard from "./ExerciseCard"

interface ExercisesGridProps {
  exercises: any[]
  tutorial: Tutorial
  language: Language
}

const ExercisesGrid: React.FC<ExercisesGridProps> = ({
  exercises,
  tutorial,
  language,
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          index={index + 1}
          tutorial={tutorial}
          language={language}
        />
      ))}
    </div>
  )
}

export default ExercisesGrid
