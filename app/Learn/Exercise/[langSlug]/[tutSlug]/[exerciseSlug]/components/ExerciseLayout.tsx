// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseLayout.tsx
"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Maximize2, Minimize2 } from "lucide-react"
import ExerciseHeader from "./ExerciseHeader"
import ProblemView from "./ExerciseViews/ProblemView"
import SolutionView from "./ExerciseViews/SolutionView"
import ProgressBar from "./Shared/ProgressBar"
import ViewSwitcher from "./Shared/ViewSwitcher"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseLayout.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseLayout.tsx

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
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [panelWidth, setPanelWidth] = useState(50) // Panel width percentage (50% default)

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

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  // Handle panel resize
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidth = panelWidth

      const handleMouseMove = (e: MouseEvent) => {
        const containerWidth = window.innerWidth
        const deltaX = e.clientX - startX
        const deltaPercent = (deltaX / containerWidth) * 100
        const newWidth = Math.min(Math.max(startWidth + deltaPercent, 20), 80)
        setPanelWidth(newWidth)
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [panelWidth]
  )

  return (
    <div
      className={`min-h-screen bg-white dark:bg-slate-900 ${isFullscreen ? "fixed inset-0 z-50" : "pt-14"}`}
    >
      {/* Header container - hidden in fullscreen */}
      {!isFullscreen && (
        <>
          <ExerciseHeader
            exercise={exercise}
            language={language}
            tutorial={tutorial}
            params={params}
          />
          <ViewSwitcher
            currentView={currentView}
            onViewChange={handleViewChange}
          />
          <ProgressBar progress={progress} currentView={currentView} />
        </>
      )}

      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className={`fixed right-4 z-50 rounded-lg bg-blue-600 p-2 text-white shadow-lg transition-all hover:bg-blue-700 ${
          isFullscreen ? "top-4" : "bottom-4 lg:bottom-auto lg:top-20"
        }`}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="h-5 w-5" />
        ) : (
          <Maximize2 className="h-5 w-5" />
        )}
      </button>

      {/* Main content area */}
      <div className={isFullscreen ? "h-screen" : ""}>
        {currentView === "problem" && (
          <ProblemView
            exercise={exercise}
            language={language}
            onProgressUpdate={handleProgressUpdate}
            onComplete={handleCompleteExercise}
            persistentState={persistentCodeState}
            onStateUpdate={updatePersistentState}
            isFullscreen={isFullscreen}
            panelWidth={panelWidth}
            onPanelResize={handleMouseDown}
          />
        )}

        {currentView === "solution" && (
          <SolutionView
            exercise={exercise}
            language={language}
            onComplete={handleCompleteExercise}
            isFullscreen={isFullscreen}
            panelWidth={panelWidth}
            onPanelResize={handleMouseDown}
          />
        )}
      </div>
    </div>
  )
}

export default ExerciseLayout
