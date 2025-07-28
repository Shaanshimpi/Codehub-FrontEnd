"use client"

import React, { useCallback, useState } from "react"
import ExerciseHeader from "@/app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseHeader"
import ProblemView from "@/app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/ProblemView"
import SolutionView from "@/app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/SolutionView"
import ProgressBar from "@/app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/ProgressBar"
import ViewSwitcher from "@/app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/ViewSwitcher"
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react"

interface ExercisePreviewProps {
  exerciseData: any
  onClose: () => void
  onSave?: () => void
  onEdit?: () => void
  isLoading?: boolean
}

type ViewType = "problem" | "solution"

interface PersistentCodeState {
  userCode: string
  isBoilerplateLoaded: boolean
}

const ExercisePreview: React.FC<ExercisePreviewProps> = ({
  exerciseData,
  onClose,
  onSave,
  onEdit,
  isLoading = false,
}) => {
  const [currentView, setCurrentView] = useState<ViewType>("problem")
  const [progress, setProgress] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [panelWidth, setPanelWidth] = useState(50)

  // Mock persistent state for preview
  const [persistentCodeState, setPersistentCodeState] =
    useState<PersistentCodeState>({
      userCode: exerciseData.boilerplate_code || "",
      isBoilerplateLoaded: true,
    })

  // Create mock objects that match the expected structure
  const mockLanguage = {
    id: exerciseData.programmingLanguage || 1,
    title: exerciseData.programmingLanguageTitle || "JavaScript",
    slug: "javascript",
  }

  const mockTutorial = {
    id: exerciseData.tutorial || 1,
    title: exerciseData.tutorialTitle || "Introduction to Programming",
    slug: "intro-programming",
  }

  const mockParams = {
    langSlug: mockLanguage.slug,
    tutSlug: mockTutorial.slug,
    exerciseSlug: exerciseData.slug || "preview-exercise",
  }

  // Transform the exercise data to match expected structure
  const transformedExercise = {
    ...exerciseData,
    id: exerciseData.id || "preview",
    programmingLanguage: mockLanguage,
    tutorial: mockTutorial,
    isLocked: exerciseData.isLocked || false,
    // Ensure learning objectives are in the correct format: [{ objective: "text" }]
    learning_objectives:
      exerciseData.learning_objectives?.map((obj: any) => {
        if (typeof obj === "string") {
          return { objective: obj }
        }
        return obj.objective ? obj : { objective: obj.toString() }
      }) || [],
    // Ensure tags are in the correct format: [{ tag: "text" }]
    tags:
      exerciseData.tags?.map((tag: any) => {
        if (typeof tag === "string") {
          return { tag: tag }
        }
        return tag.tag ? tag : { tag: tag.toString() }
      }) || [],
  }

  const handleViewChange = useCallback(
    (view: ViewType) => {
      setCurrentView(view)
      if (view === "solution" && progress < 50) {
        setProgress(50)
      }
    },
    [progress]
  )

  const handleProgressUpdate = useCallback((newProgress: number) => {
    setProgress(newProgress)
  }, [])

  const handleCompleteExercise = useCallback(() => {
    setProgress(100)
  }, [])

  const updatePersistentState = useCallback(
    (newState: Partial<PersistentCodeState>) => {
      setPersistentCodeState((prev) => ({ ...prev, ...newState }))
    },
    []
  )

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

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
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900">
      {/* Transparent Preview Header - Absolutely Positioned */}
      <div className="z-60 absolute left-0 right-0 top-0 flex items-center justify-between bg-slate-800/90 p-4 text-white backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Editor
          </button>
          <div className="h-4 w-px bg-slate-400" />
          <h1 className="text-lg font-semibold">Exercise Preview</h1>
          <span className="rounded-full bg-blue-600 px-2 py-1 text-xs">
            Preview Mode
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-md bg-white/10 px-3 py-1.5 text-sm transition-colors hover:bg-white/20"
            >
              Edit Exercise
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1.5 text-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-white" />
                  Saving...
                </>
              ) : (
                "Save Exercise"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Exercise Content - Full Height */}
      <div className="h-screen bg-white dark:bg-slate-900">
        {/* Header container - hidden in fullscreen */}
        {!isFullscreen && (
          <>
            <ExerciseHeader
              exercise={transformedExercise}
              language={mockLanguage}
              tutorial={mockTutorial}
              params={mockParams}
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
            isFullscreen ? "top-20" : "bottom-4 lg:bottom-auto lg:top-28"
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
        <div className={isFullscreen ? "h-full" : "h-[calc(100%-4rem)] pt-4"}>
          {currentView === "problem" && (
            <ProblemView
              exercise={transformedExercise}
              language={mockLanguage}
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
              exercise={transformedExercise}
              language={mockLanguage}
              onComplete={handleCompleteExercise}
              isFullscreen={isFullscreen}
              panelWidth={panelWidth}
              onPanelResize={handleMouseDown}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ExercisePreview
