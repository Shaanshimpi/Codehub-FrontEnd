// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseLayout.tsx
"use client"

import React, { useCallback, useEffect, useState } from "react"
import ExerciseHeader from "./ExerciseHeader"
import ProblemView from "./ExerciseViews/ProblemView"
import SolutionView from "./ExerciseViews/SolutionView"
import ProgressBar from "./Shared/ProgressBar"
import ViewSwitcher from "./Shared/ViewSwitcher"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseLayout.tsx

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

type ViewType = "problem" | "solution"

// Persistent state interface
interface PersistentCodeState {
  userCode: string
  isBoilerplateLoaded: boolean
}

const ExerciseLayout: React.FC<ExerciseLayoutProps> = ({
  exercise,
  language,
  tutorial,
  params,
}) => {
  const [currentView, setCurrentView] = useState<ViewType>("problem")
  const [progress, setProgress] = useState(0) // 0-100 progress percentage

  // Persistent state that survives view switches
  const [persistentCodeState, setPersistentCodeState] =
    useState<PersistentCodeState>({
      userCode: "",
      isBoilerplateLoaded: false,
    })

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const exerciseKey = `exercise_${exercise.id || exercise.slug}_state`
    const savedState = localStorage.getItem(exerciseKey)
    const savedProgress = localStorage.getItem(
      `exercise_${exercise.id || exercise.slug}_progress`
    )

    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        setPersistentCodeState(parsedState)
      } catch (error) {
        console.error("Failed to parse saved state:", error)
      }
    }

    if (savedProgress) {
      setProgress(parseInt(savedProgress, 10))
    }
  }, [exercise.id, exercise.slug])

  // Save state changes to localStorage
  const updatePersistentState = useCallback(
    (newState: Partial<PersistentCodeState>) => {
      setPersistentCodeState((prev) => {
        const updated = { ...prev, ...newState }
        const exerciseKey = `exercise_${exercise.id || exercise.slug}_state`
        localStorage.setItem(exerciseKey, JSON.stringify(updated))
        return updated
      })
    },
    [exercise.id, exercise.slug]
  )

  // Handle progress updates with localStorage persistence
  const handleProgressUpdate = useCallback(
    (newProgress: number) => {
      setProgress(newProgress)
      const progressKey = `exercise_${exercise.id || exercise.slug}_progress`
      localStorage.setItem(progressKey, newProgress.toString())
    },
    [exercise.id, exercise.slug]
  )

  const handleViewChange = useCallback(
    (view: ViewType) => {
      setCurrentView(view)

      // Update progress when switching to solution view
      if (view === "solution" && progress < 50) {
        handleProgressUpdate(50)
      }
    },
    [progress, handleProgressUpdate]
  )

  const handleCompleteExercise = useCallback(() => {
    handleProgressUpdate(100)
    // Here you would typically save completion status to backend
    // Exercise completed
  }, [handleProgressUpdate])

  return (
    <div className="min-h-screen bg-white pt-14 dark:bg-slate-900">
      {/* Header container - normal flow */}
      <ExerciseHeader
        exercise={exercise}
        language={language}
        tutorial={tutorial}
        params={params}
      />

      <ViewSwitcher currentView={currentView} onViewChange={handleViewChange} />

      <ProgressBar progress={progress} currentView={currentView} />

      {/* Main content area */}
      <div>
        {currentView === "problem" && (
          <ProblemView
            exercise={exercise}
            language={language}
            onProgressUpdate={handleProgressUpdate}
            onComplete={handleCompleteExercise}
            persistentState={persistentCodeState}
            onStateUpdate={updatePersistentState}
          />
        )}

        {currentView === "solution" && (
          <SolutionView
            exercise={exercise}
            language={language}
            onComplete={handleCompleteExercise}
          />
        )}
      </div>
    </div>
  )
}

export default ExerciseLayout
