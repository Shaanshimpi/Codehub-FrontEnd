// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseLayout.tsx
"use client"

import React, { useState } from "react"
import ExerciseHeader from "./ExerciseHeader"
import ProblemView from "./ExerciseViews/ProblemView"
import SolutionView from "./ExerciseViews/SolutionView"
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

const ExerciseLayout: React.FC<ExerciseLayoutProps> = ({
  exercise,
  language,
  tutorial,
  params,
}) => {
  const [currentView, setCurrentView] = useState<ViewType>("problem")
  const [progress, setProgress] = useState(0) // 0-100 progress percentage

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)

    // Update progress when switching to solution view
    if (view === "solution" && progress < 50) {
      setProgress(50)
    }
  }

  const handleCompleteExercise = () => {
    setProgress(100)
    // Here you would typically save progress to backend/localStorage
  }

  return (
    <div className="min-h-screen bg-white pt-12 dark:bg-slate-900">
      {/* Header with breadcrumbs and navigation */}
      <ExerciseHeader
        exercise={exercise}
        language={language}
        tutorial={tutorial}
        params={params}
      />

      {/* View switcher */}
      <ViewSwitcher currentView={currentView} onViewChange={handleViewChange} />

      {/* Main content area */}
      <div className="relative">
        {currentView === "problem" && (
          <ProblemView
            exercise={exercise}
            language={language}
            onProgressUpdate={setProgress}
            onComplete={handleCompleteExercise}
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
