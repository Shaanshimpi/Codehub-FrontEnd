// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseLayout.tsx
"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useUser } from "@/app/(payload)/_providers/UserProvider"
import {
  hasViewedSolution,
  markSolutionViewed,
} from "@/app/Learn/Exercise/utils/localStorage"
import { ArrowRight, Lock, Maximize2, Minimize2, User } from "lucide-react"
import Link from "next/link"
import ExerciseHeader from "./ExerciseHeader"
import ProblemView from "./ExerciseViews/ProblemView"
import SolutionView from "./ExerciseViews/SolutionView"
// import ProgressBar from "./Shared/ProgressBar"
import SolutionConfirmModal from "./Shared/SolutionConfirmModal"
import ViewSwitcher from "./Shared/ViewSwitcher"

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
  const { user, isLoading } = useUser()
  const [currentView, setCurrentView] = useState<ViewType>("problem")
  const [progress, setProgress] = useState(0) // 0-100 progress percentage
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [panelWidth, setPanelWidth] = useState(50) // Panel width percentage (50% default)
  const [showSolutionModal, setShowSolutionModal] = useState(false)

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
    // Exercise completed
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

        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
              <Lock className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            </div>

            <h1 className="mb-4 text-3xl font-bold text-white">
              Premium Exercise
            </h1>
            <p className="mb-8 text-lg text-slate-300">
              This exercise is part of our premium content. Sign in to unlock
              advanced coding challenges and comprehensive learning materials.
            </p>

            <div className="mb-8 space-y-3">
              <div className="flex items-center gap-3 text-left text-slate-300">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                <span>Access to premium exercises</span>
              </div>
              <div className="flex items-center gap-3 text-left text-slate-300">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                <span>Detailed step-by-step solutions</span>
              </div>
              <div className="flex items-center gap-3 text-left text-slate-300">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                <span>Advanced coding challenges</span>
              </div>
              <div className="flex items-center gap-3 text-left text-slate-300">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                <span>Progress tracking</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
              >
                <User className="h-5 w-5" />
                Sign In to Continue
                <ArrowRight className="h-5 w-5" />
              </Link>

              <div className="text-center">
                <span className="text-sm text-slate-400">
                  Don&apos;t have an account?{" "}
                </span>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-blue-400 hover:text-blue-300"
                >
                  Sign up here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
          {/* <ProgressBar progress={progress} currentView={currentView} /> */}
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

      {/* Solution confirmation modal */}
      <SolutionConfirmModal
        isOpen={showSolutionModal}
        onConfirm={handleSolutionConfirm}
        onCancel={handleSolutionCancel}
      />
    </div>
  )
}

export default ExerciseLayout
