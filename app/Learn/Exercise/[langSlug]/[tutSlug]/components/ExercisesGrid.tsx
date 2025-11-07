"use client"

import React from "react"
import ExerciseCard from "@/app/Learn/Exercise/components/ExerciseCard"

interface ExercisesGridProps {
  exercises: any[]
}

const ExercisesGrid: React.FC<ExercisesGridProps> = ({ exercises }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {exercises.map((exercise, index) => (
        <ExerciseCard key={exercise.id} exercise={exercise} index={index + 1} />
      ))}
    </div>
  )
}

export default ExercisesGrid
