"use client"

import React, { useMemo, useState } from "react"
import { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import DifficultyFilter from "./DifficultyFilter"
import ExercisesGrid from "./ExercisesGrid"

interface ExercisesWithFilterProps {
  exercises: any[]
  tutorial: Tutorial
  language: Language
}

const ExercisesWithFilter: React.FC<ExercisesWithFilterProps> = ({
  exercises,
  tutorial,
  language,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
    null
  )

  const filteredExercises = useMemo(() => {
    if (selectedDifficulty === null) {
      return exercises
    }
    return exercises.filter(
      (exercise) => exercise.difficultyLevel === selectedDifficulty
    )
  }, [exercises, selectedDifficulty])

  const handleFilterChange = (difficulty: number | null) => {
    setSelectedDifficulty(difficulty)
  }

  return (
    <div>
      <DifficultyFilter onFilterChange={handleFilterChange} />

      {filteredExercises.length > 0 ? (
        <ExercisesGrid
          exercises={filteredExercises}
          tutorial={tutorial}
          language={language}
        />
      ) : (
        <div className="rounded-lg bg-slate-100 p-8 text-center dark:bg-slate-800">
          <p className="text-lg text-slate-600 dark:text-slate-300">
            No exercises found for the selected difficulty level.
          </p>
        </div>
      )}
    </div>
  )
}

export default ExercisesWithFilter
