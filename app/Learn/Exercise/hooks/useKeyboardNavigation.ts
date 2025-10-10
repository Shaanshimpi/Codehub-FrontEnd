// React hook for enhanced keyboard navigation
"use client"

import { useCallback, useEffect, useRef } from "react"
import {
  ArrowKeyNavigation,
  FocusTrap,
  KeyboardShortcuts,
  LiveRegion,
  focusUtils,
} from "@/app/Learn/Exercise/utils/keyboardNavigation"

// React hook for enhanced keyboard navigation

interface UseKeyboardNavigationOptions {
  enableFocusTrap?: boolean
  enableArrowKeys?: boolean
  arrowKeyOrientation?: "horizontal" | "vertical" | "grid"
  shortcuts?: Record<string, () => void>
  skipLinks?: Array<{ text: string; targetId: string }>
}

export const useKeyboardNavigation = (
  options: UseKeyboardNavigationOptions = {}
) => {
  const containerRef = useRef<HTMLElement>(null)
  const focusTrapRef = useRef<FocusTrap | null>(null)
  const arrowNavRef = useRef<ArrowKeyNavigation | null>(null)
  const shortcutsRef = useRef<KeyboardShortcuts | null>(null)
  const liveRegionRef = useRef<LiveRegion | null>(null)

  // Initialize live region for announcements
  useEffect(() => {
    liveRegionRef.current = new LiveRegion()

    return () => {
      liveRegionRef.current?.destroy()
    }
  }, [])

  // Setup focus trap
  useEffect(() => {
    if (!options.enableFocusTrap || !containerRef.current) return

    focusTrapRef.current = new FocusTrap(containerRef.current)
    focusTrapRef.current.activate()

    return () => {
      focusTrapRef.current?.deactivate()
    }
  }, [options.enableFocusTrap])

  // Setup arrow key navigation
  useEffect(() => {
    if (!options.enableArrowKeys || !containerRef.current) return

    arrowNavRef.current = new ArrowKeyNavigation(
      containerRef.current,
      options.arrowKeyOrientation || "vertical"
    )
    arrowNavRef.current.activate()

    return () => {
      arrowNavRef.current?.deactivate()
    }
  }, [options.enableArrowKeys, options.arrowKeyOrientation])

  // Setup keyboard shortcuts
  useEffect(() => {
    if (!options.shortcuts) return

    shortcutsRef.current = new KeyboardShortcuts()

    Object.entries(options.shortcuts).forEach(([shortcut, handler]) => {
      shortcutsRef.current?.add(shortcut, handler)
    })

    shortcutsRef.current.activate()

    return () => {
      shortcutsRef.current?.deactivate()
      shortcutsRef.current?.clear()
    }
  }, [options.shortcuts])

  // Setup skip links
  useEffect(() => {
    if (!options.skipLinks) return

    const skipLinkElements = options.skipLinks.map(({ text, targetId }) => {
      return {
        element: document.querySelector(
          `a[href="#${targetId}"]`
        ) as HTMLElement,
        created: false,
      }
    })

    // Create skip links that don't exist
    options.skipLinks.forEach(({ text, targetId }, index) => {
      if (!skipLinkElements[index].element) {
        const skipLink = document.createElement("a")
        skipLink.href = `#${targetId}`
        skipLink.textContent = text
        skipLink.className = `
          absolute left-[-9999px] top-auto w-[1px] h-[1px] overflow-hidden
          focus:left-6 focus:top-6 focus:w-auto focus:h-auto focus:overflow-auto
          focus:z-50 focus:p-2 focus:bg-primary-600 focus:text-white focus:rounded-md
          focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          transition-all duration-200
        `

        document.body.prepend(skipLink)
        skipLinkElements[index] = { element: skipLink, created: true }

        // Handle click to focus target
        skipLink.addEventListener("click", (event) => {
          event.preventDefault()
          const target = document.getElementById(targetId)
          if (target) {
            target.setAttribute("tabindex", "-1")
            target.focus()
            target.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        })
      }
    })

    return () => {
      skipLinkElements.forEach(({ element, created }) => {
        if (created && element?.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
    }
  }, [options.skipLinks])

  // Utility functions
  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      liveRegionRef.current?.announce(message, priority)
    },
    []
  )

  const focusFirst = useCallback(() => {
    if (containerRef.current) {
      return focusUtils.focusFirst(containerRef.current)
    }
    return false
  }, [])

  const focusLast = useCallback(() => {
    if (containerRef.current) {
      return focusUtils.focusLast(containerRef.current)
    }
    return false
  }, [])

  const saveFocus = useCallback(() => {
    return focusUtils.saveFocus()
  }, [])

  return {
    containerRef,
    announce,
    focusFirst,
    focusLast,
    saveFocus,
  }
}

// Specific hook for exercise navigation
export const useExerciseKeyboardNavigation = () => {
  return useKeyboardNavigation({
    enableArrowKeys: true,
    arrowKeyOrientation: "vertical",
    shortcuts: {
      "ctrl+k": () => {
        // Quick search/command palette
        const searchInput = document.querySelector(
          'input[type="search"]'
        ) as HTMLInputElement
        searchInput?.focus()
      },
      "alt+left": () => {
        // Previous exercise (handled by ExerciseHeader)
        const prevButton = document.querySelector(
          '[data-nav="prev"]'
        ) as HTMLButtonElement
        prevButton?.click()
      },
      "alt+right": () => {
        // Next exercise (handled by ExerciseHeader)
        const nextButton = document.querySelector(
          '[data-nav="next"]'
        ) as HTMLButtonElement
        nextButton?.click()
      },
      "ctrl+enter": () => {
        // Run code
        const runButton = document.querySelector(
          '[data-action="run"]'
        ) as HTMLButtonElement
        runButton?.click()
      },
      "ctrl+shift+f": () => {
        // Format code
        const formatButton = document.querySelector(
          '[data-action="format"]'
        ) as HTMLButtonElement
        formatButton?.click()
      },
      "ctrl+1": () => {
        // Switch to problem view
        const problemTab = document.querySelector(
          '[data-view="problem"]'
        ) as HTMLButtonElement
        problemTab?.click()
      },
      "ctrl+2": () => {
        // Switch to solution view
        const solutionTab = document.querySelector(
          '[data-view="solution"]'
        ) as HTMLButtonElement
        solutionTab?.click()
      },
      escape: () => {
        // Close any open modals/dropdowns
        const modal = document.querySelector('[role="dialog"]') as HTMLElement
        if (modal) {
          const closeButton = modal.querySelector(
            '[data-action="close"]'
          ) as HTMLButtonElement
          closeButton?.click()
        }
      },
    },
    skipLinks: [
      { text: "Skip to main content", targetId: "main-content" },
      { text: "Skip to code editor", targetId: "code-editor" },
      { text: "Skip to problem statement", targetId: "problem-statement" },
      { text: "Skip to navigation", targetId: "exercise-navigation" },
    ],
  })
}

// Hook for modal/dropdown focus management
export const useModalKeyboardNavigation = (isOpen: boolean) => {
  return useKeyboardNavigation({
    enableFocusTrap: isOpen,
    shortcuts: {
      escape: () => {
        const closeButton = document.querySelector(
          "[data-modal-close]"
        ) as HTMLButtonElement
        closeButton?.click()
      },
    },
  })
}

// Hook for code editor enhancements
export const useCodeEditorKeyboardNavigation = () => {
  return useKeyboardNavigation({
    shortcuts: {
      "ctrl+/": () => {
        // Toggle comment (handled by Monaco)
        const editor = document.querySelector(".monaco-editor") as HTMLElement
        if (editor) {
          // Monaco handles this internally, just announce it
          const announcer = new LiveRegion()
          announcer.announce("Comment toggled")
          setTimeout(() => announcer.destroy(), 1000)
        }
      },
      f11: () => {
        // Toggle fullscreen
        const fullscreenButton = document.querySelector(
          '[data-action="fullscreen"]'
        ) as HTMLButtonElement
        fullscreenButton?.click()
      },
    },
  })
}
