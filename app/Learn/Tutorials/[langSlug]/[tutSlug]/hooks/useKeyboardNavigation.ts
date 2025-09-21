"use client"

import { useEffect } from "react"

interface KeyboardNavigationOptions {
  onPreviousLesson: () => void
  onNextLesson: () => void
  onToggleBookmark: () => void
  onOpenNotes: () => void
  onBackToReference: () => void
  isLessonMode: boolean
  canGoNext: boolean
  canGoPrevious: boolean
}

export const useKeyboardNavigation = ({
  onPreviousLesson,
  onNextLesson,
  onToggleBookmark,
  onOpenNotes,
  onBackToReference,
  isLessonMode,
  canGoNext,
  canGoPrevious,
}: KeyboardNavigationOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in form elements
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target instanceof HTMLElement &&
          event.target.contentEditable === "true")
      ) {
        return
      }

      // Handle keyboard shortcuts
      switch (event.key) {
        case "ArrowLeft":
          if (isLessonMode && canGoPrevious) {
            event.preventDefault()
            onPreviousLesson()
          }
          break

        case "ArrowRight":
          if (isLessonMode && canGoNext) {
            event.preventDefault()
            onNextLesson()
          }
          break

        case "b":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            onToggleBookmark()
          }
          break

        case "n":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            onOpenNotes()
          }
          break

        case "r":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            onBackToReference()
          }
          break

        case "Escape":
          if (isLessonMode) {
            event.preventDefault()
            onBackToReference()
          }
          break

        case "?":
          event.preventDefault()
          // Show keyboard shortcuts help
          showKeyboardShortcutsHelp()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    onPreviousLesson,
    onNextLesson,
    onToggleBookmark,
    onOpenNotes,
    onBackToReference,
    isLessonMode,
    canGoNext,
    canGoPrevious,
  ])

  const showKeyboardShortcutsHelp = () => {
    const shortcuts = [
      { key: "← →", description: "Navigate between lessons" },
      { key: "Ctrl+B", description: "Toggle bookmark" },
      { key: "Ctrl+N", description: "Open notes panel" },
      { key: "Ctrl+R", description: "Back to reference" },
      { key: "Esc", description: "Back to reference" },
      { key: "?", description: "Show this help" },
    ]

    const helpText = shortcuts
      .map((shortcut) => `${shortcut.key}: ${shortcut.description}`)
      .join("\n")

    alert(`Keyboard Shortcuts:\n\n${helpText}`)
  }

  return {
    showKeyboardShortcutsHelp,
  }
}
