"use client"

import React, { useState } from "react"
import type { ExerciseAIData } from "@/app/Learn/types/TutorialTypes"
import { submitExercise } from "@/lib/submitData"
import ExerciseForm from "./ExerciseForm"
import ExercisePreview from "./ExercisePreview/ExercisePreview"
import ExerciseSubmit from "./ExerciseSubmit"

const ExerciseAIGenerator = () => {
  const [step, setStep] = useState(1)
  const [exerciseData, setExerciseData] = useState<ExerciseAIData | null>(null)
  const [formData, setFormData] = useState<any>(null)

  const handleGenerate = (data: ExerciseAIData, formValues: any) => {
    setExerciseData(data)
    setFormData(formValues)
    setStep(2)
  }

  const handleSubmit = async (submissionData: any) => {
    if (!exerciseData) return

    try {
      // Add your submission logic here
      await submitExercise({
        ...exerciseData,
        ...submissionData,
      })
      // Exercise submitted successfully

      // Reset to step 1 after successful submission
      setStep(1)
      setExerciseData(null)
      setFormData(null)

      alert("Exercise submitted successfully!")
    } catch {
      // Error submitting exercise
      alert("Error submitting exercise. Please try again.")
    }
  }

  return (
    <div className="bg-slate-900 p-4 dark:bg-slate-950 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        {step === 1 && <ExerciseForm onGenerate={handleGenerate} />}
        {step === 2 && exerciseData && (
          <ExercisePreview
            exerciseData={exerciseData}
            formData={formData}
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <ExerciseSubmit
            exerciseData={exerciseData}
            formData={formData}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  )
}

export default ExerciseAIGenerator
