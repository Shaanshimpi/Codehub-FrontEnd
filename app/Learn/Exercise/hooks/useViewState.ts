// Custom hook for managing exercise view state
import { useCallback, useEffect, useState } from "react"
import type { PersistentCodeState, ViewType } from "../types/ViewTypes"
import { hasViewedSolution, markSolutionViewed } from "../utils/localStorage"

interface UseViewStateProps {
  exerciseSlug: string
  initialView?: ViewType
}

interface UseViewStateReturn {
  currentView: ViewType
  setView: (view: ViewType) => void
  persistentCodeState: PersistentCodeState
  updateCodeState: (state: Partial<PersistentCodeState>) => void
  showSolutionModal: boolean
  setShowSolutionModal: (show: boolean) => void
  handleSolutionConfirm: () => void
  handleSolutionCancel: () => void
}

/**
 * Custom hook for managing exercise view state and transitions
 */
export const useViewState = ({
  exerciseSlug,
  initialView = "problem",
}: UseViewStateProps): UseViewStateReturn => {
  const [currentView, setCurrentView] = useState<ViewType>(initialView)
  const [showSolutionModal, setShowSolutionModal] = useState(false)
  const [persistentCodeState, setPersistentCodeState] =
    useState<PersistentCodeState>({
      userCode: "",
      isBoilerplateLoaded: false,
    })

  // Load saved state from localStorage on mount
  useEffect(() => {
    const stateKey = `exercise_${exerciseSlug}_state`
    try {
      const savedState = localStorage.getItem(stateKey)
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        setPersistentCodeState(parsedState)
      }
    } catch (error) {
      console.error("Failed to load saved state:", error)
    }
  }, [exerciseSlug])

  // Save state changes to localStorage
  const updateCodeState = useCallback(
    (newState: Partial<PersistentCodeState>) => {
      setPersistentCodeState((prev) => {
        const updated = { ...prev, ...newState }
        const stateKey = `exercise_${exerciseSlug}_state`
        try {
          localStorage.setItem(stateKey, JSON.stringify(updated))
        } catch (error) {
          console.error("Failed to save state:", error)
        }
        return updated
      })
    },
    [exerciseSlug]
  )

  // Handle view changes with solution confirmation
  const setView = useCallback(
    (view: ViewType) => {
      if (view === "solution") {
        // Check if user has viewed this solution before
        if (!hasViewedSolution(exerciseSlug)) {
          // Show confirmation modal for first-time solution viewing
          setShowSolutionModal(true)
          return
        }
      }
      setCurrentView(view)
    },
    [exerciseSlug]
  )

  // Handle solution modal confirmation
  const handleSolutionConfirm = useCallback(() => {
    markSolutionViewed(exerciseSlug)
    setShowSolutionModal(false)
    setCurrentView("solution")
  }, [exerciseSlug])

  // Handle solution modal cancellation
  const handleSolutionCancel = useCallback(() => {
    setShowSolutionModal(false)
  }, [])

  return {
    currentView,
    setView,
    persistentCodeState,
    updateCodeState,
    showSolutionModal,
    setShowSolutionModal,
    handleSolutionConfirm,
    handleSolutionCancel,
  }
}

/**
 * Hook for managing panel resize state
 */
export const usePanelResize = (initialWidth: number = 50) => {
  const [panelWidth, setPanelWidth] = useState(initialWidth)

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

  return {
    panelWidth,
    setPanelWidth,
    handleMouseDown,
  }
}

/**
 * Hook for managing fullscreen state
 */
export const useFullscreen = (initialState: boolean = false) => {
  const [isFullscreen, setIsFullscreen] = useState(initialState)

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  const enterFullscreen = useCallback(() => {
    setIsFullscreen(true)
  }, [])

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false)
  }, [])

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
  }
}
