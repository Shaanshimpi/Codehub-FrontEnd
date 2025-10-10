// Exercise navigation hook with proper state management
"use client"

import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"

// Exercise navigation hook with proper state management

interface Exercise {
  slug: string
  index: number
  title: string
  id: string
}

interface Tutorial {
  slug: string
  exercises: Exercise[]
}

interface UseExerciseNavigationProps {
  tutorial: Tutorial
  currentExercise: Exercise
  langSlug: string
  tutSlug: string
}

interface NavigationState {
  canNavigatePrev: boolean
  canNavigateNext: boolean
  prevExercise: Exercise | null
  nextExercise: Exercise | null
  currentIndex: number
  totalExercises: number
}

export const useExerciseNavigation = ({
  tutorial,
  currentExercise,
  langSlug,
  tutSlug,
}: UseExerciseNavigationProps) => {
  const router = useRouter()

  // Calculate navigation state
  const navigationState: NavigationState = useMemo(() => {
    if (!tutorial?.exercises || !Array.isArray(tutorial.exercises)) {
      return {
        canNavigatePrev: false,
        canNavigateNext: false,
        prevExercise: null,
        nextExercise: null,
        currentIndex: 0,
        totalExercises: 0,
      }
    }

    const exercises = tutorial.exercises
    const currentIndex = exercises.findIndex(
      (ex) => ex.slug === currentExercise.slug
    )

    if (currentIndex === -1) {
      return {
        canNavigatePrev: false,
        canNavigateNext: false,
        prevExercise: null,
        nextExercise: null,
        currentIndex: 0,
        totalExercises: exercises.length,
      }
    }

    const prevExercise = currentIndex > 0 ? exercises[currentIndex - 1] : null
    const nextExercise =
      currentIndex < exercises.length - 1 ? exercises[currentIndex + 1] : null

    return {
      canNavigatePrev: prevExercise !== null,
      canNavigateNext: nextExercise !== null,
      prevExercise,
      nextExercise,
      currentIndex: currentIndex + 1, // 1-based for display
      totalExercises: exercises.length,
    }
  }, [tutorial?.exercises, currentExercise.slug])

  // Navigation functions
  const navigateToPrevious = useCallback(() => {
    if (navigationState.canNavigatePrev && navigationState.prevExercise) {
      const url = `/Learn/Exercise/${langSlug}/${tutSlug}/${navigationState.prevExercise.slug}`
      router.push(url)
    }
  }, [
    navigationState.canNavigatePrev,
    navigationState.prevExercise,
    langSlug,
    tutSlug,
    router,
  ])

  const navigateToNext = useCallback(() => {
    if (navigationState.canNavigateNext && navigationState.nextExercise) {
      const url = `/Learn/Exercise/${langSlug}/${tutSlug}/${navigationState.nextExercise.slug}`
      router.push(url)
    }
  }, [
    navigationState.canNavigateNext,
    navigationState.nextExercise,
    langSlug,
    tutSlug,
    router,
  ])

  const navigateToExercise = useCallback(
    (exerciseSlug: string) => {
      const url = `/Learn/Exercise/${langSlug}/${tutSlug}/${exerciseSlug}`
      router.push(url)
    },
    [langSlug, tutSlug, router]
  )

  // Keyboard navigation
  const handleKeyboardNavigation = useCallback(
    (event: KeyboardEvent) => {
      // Only handle navigation if no input is focused
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.getAttribute("contenteditable") === "true"
      ) {
        return
      }

      if (event.altKey || event.metaKey) {
        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault()
            navigateToPrevious()
            break
          case "ArrowRight":
            event.preventDefault()
            navigateToNext()
            break
        }
      }
    },
    [navigateToPrevious, navigateToNext]
  )

  return {
    ...navigationState,
    navigateToPrevious,
    navigateToNext,
    navigateToExercise,
    handleKeyboardNavigation,
  }
}
