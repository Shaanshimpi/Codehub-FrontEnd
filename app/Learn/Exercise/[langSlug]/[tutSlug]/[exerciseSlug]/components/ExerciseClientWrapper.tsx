// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseClientWrapper.tsx
"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useUser } from "@/app/(payload)/_providers/UserProvider"
import {
  ExerciseContainer,
  FullscreenToggle,
} from "@/app/Learn/Exercise/components/Exercise/ExerciseControls"
import LockedExerciseView from "@/app/Learn/Exercise/components/Exercise/LockedExerciseView"
import { usePanelResize } from "@/app/Learn/Exercise/hooks/usePanelResize"
import { useFullscreen } from "@/app/Learn/Exercise/hooks/useViewState"
import {
  hasViewedSolution,
  markSolutionViewed,
} from "@/app/Learn/Exercise/utils/localStorage"
import ExerciseHeader from "./ExerciseHeader"
import ProblemView from "./ExerciseViews/ProblemView"
import SolutionView from "./ExerciseViews/SolutionView"
import SolutionConfirmModal from "./Shared/SolutionConfirmModal"
import ViewSwitcher from "./Shared/ViewSwitcher"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseClientWrapper.tsx

interface ExerciseClientWrapperProps {
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

const ExerciseClientWrapper: React.FC<ExerciseClientWrapperProps> = ({
  exercise,
  language,
  tutorial,
  params,
}) => {
  const { user, isLoading } = useUser()
  const [currentView, setCurrentView] = useState<ViewType>("problem")
  const [progress, setProgress] = useState(0) // 0-100 progress percentage
  const [showSolutionModal, setShowSolutionModal] = useState(false)

  // Use custom hooks for panel and fullscreen management
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  const { panelWidth, handleMouseDown } = usePanelResize({ initialWidth: 50 })

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
      } catch {
        // Failed to parse saved state, using defaults
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
      if (view === "solution") {
        // Check if user has viewed this solution before
        const exerciseSlug = params.exerciseSlug
        if (!hasViewedSolution(exerciseSlug)) {
          // Show confirmation modal for first-time solution viewing
          setShowSolutionModal(true)
          return
        }
      }

      setCurrentView(view)

      // Update progress when switching to solution view
      if (view === "solution" && progress < 50) {
        handleProgressUpdate(50)
      }
    },
    [progress, handleProgressUpdate, params.exerciseSlug]
  )

  const handleCompleteExercise = useCallback(() => {
    handleProgressUpdate(100)
    // Here you would typically save completion status to backend
  }, [handleProgressUpdate])

  // Handle solution modal confirmation
  const handleSolutionConfirm = useCallback(() => {
    const exerciseSlug = params.exerciseSlug
    markSolutionViewed(exerciseSlug)
    setShowSolutionModal(false)
    setCurrentView("solution")

    // Update progress when switching to solution view
    if (progress < 50) {
      handleProgressUpdate(50)
    }
  }, [params.exerciseSlug, progress, handleProgressUpdate])

  // Handle solution modal cancellation
  const handleSolutionCancel = useCallback(() => {
    setShowSolutionModal(false)
  }, [])

  // Check if exercise is locked and user is not authenticated
  const isExerciseLocked = exercise.isLocked && !user

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center text-white">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show locked exercise page if exercise is locked and user is not authenticated
  if (isExerciseLocked) {
    return (
      <div className="min-h-screen bg-slate-900">
        <ExerciseHeader
          exercise={exercise}
          language={language}
          tutorial={tutorial}
          params={params}
        />
        <LockedExerciseView
          exercise={exercise}
          language={language}
          tutorial={tutorial}
          params={params}
        />
      </div>
    )
  }

  return (
    <ExerciseContainer isFullscreen={isFullscreen}>
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
        </>
      )}

      {/* Fullscreen Toggle Button */}
      <FullscreenToggle
        isFullscreen={isFullscreen}
        onToggle={toggleFullscreen}
      />

      {/* Main content area */}
      {currentView === "problem" ? (
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
      ) : (
        <SolutionView
          exercise={exercise}
          language={language}
          onComplete={handleCompleteExercise}
          isFullscreen={isFullscreen}
          panelWidth={panelWidth}
          onPanelResize={handleMouseDown}
        />
      )}

      {/* Solution confirmation modal */}
      <SolutionConfirmModal
        isOpen={showSolutionModal}
        onConfirm={handleSolutionConfirm}
        onCancel={handleSolutionCancel}
        exerciseTitle={exercise?.title || "this exercise"}
        progressPercentage={progress}
        hasUserCode={!!persistentCodeState.userCode.trim()}
      />
    </ExerciseContainer>
  )
}

export default ExerciseClientWrapper
