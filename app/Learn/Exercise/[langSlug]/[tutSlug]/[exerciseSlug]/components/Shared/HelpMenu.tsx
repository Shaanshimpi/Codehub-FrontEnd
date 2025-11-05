// Simple help menu with clear options
"use client"

import React, { useEffect, useRef } from "react"
import { BookOpen, Code2, RotateCcw, Sparkles, X } from "lucide-react"

// Simple help menu with clear options

// Simple help menu with clear options

// Simple help menu with clear options

// Simple help menu with clear options

// Simple help menu with clear options

interface HelpMenuProps {
  isOpen: boolean
  onClose: () => void
  onLoadStarter: () => void
  onShowInstructions: () => void
  onReset: () => void
  onOpenAIHelp?: () => void
}

const HelpMenu: React.FC<HelpMenuProps> = ({
  isOpen,
  onClose,
  onLoadStarter,
  onShowInstructions,
  onReset,
  onOpenAIHelp,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuPosition, setMenuPosition] = React.useState<"top" | "bottom">(
    "bottom"
  )
  const [isPositionCalculated, setIsPositionCalculated] = React.useState(false)

  // Calculate menu position based on available space
  useEffect(() => {
    if (isOpen && menuRef.current) {
      setIsPositionCalculated(false)
      const parentElement = menuRef.current.parentElement
      if (parentElement) {
        const rect = parentElement.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const spaceBelow = viewportHeight - rect.bottom
        const spaceAbove = rect.top

        // If less than 350px below and more space above, position above
        if (spaceBelow < 350 && spaceAbove > spaceBelow) {
          setMenuPosition("top")
        } else {
          setMenuPosition("bottom")
        }
        setIsPositionCalculated(true)
      }
    }
  }, [isOpen])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case "Escape":
          onClose()
          break
        case "ArrowDown":
        case "ArrowUp":
          event.preventDefault()
          // Focus management for menu items
          const menuItems =
            menuRef.current?.querySelectorAll('[role="menuitem"]')
          if (menuItems && menuItems.length > 0) {
            const currentIndex = Array.from(menuItems).findIndex(
              (item) => item === document.activeElement
            )
            let nextIndex
            if (event.key === "ArrowDown") {
              nextIndex =
                currentIndex === -1 ? 0 : (currentIndex + 1) % menuItems.length
            } else {
              nextIndex =
                currentIndex === -1
                  ? menuItems.length - 1
                  : (currentIndex - 1 + menuItems.length) % menuItems.length
            }
            (menuItems[nextIndex] as HTMLElement).focus()
          }
          break
        case "Enter":
        case " ":
          event.preventDefault()
          ;(document.activeElement as HTMLElement)?.click()
          break
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  // Auto-focus first menu item when opened
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstMenuItem = menuRef.current.querySelector(
        '[role="menuitem"]'
      ) as HTMLElement
      if (firstMenuItem) {
        firstMenuItem.focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        className="fixed inset-0 z-40"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
        aria-label="Close menu"
      />

      {/* Menu */}
      <div
        ref={menuRef}
        className={`help-menu-enter absolute left-0 z-50 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-opacity duration-150 dark:border-gray-700 dark:bg-gray-900 sm:w-72 ${
          menuPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
        } ${isPositionCalculated ? "opacity-100" : "opacity-0"}`}
        role="menu"
        aria-labelledby="help-menu-title"
        aria-orientation="vertical"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
          <h3
            id="help-menu-title"
            className="text-sm font-semibold text-gray-900 dark:text-white"
          >
            Need Help?
          </h3>
          <button
            onClick={onClose}
            className="rounded p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Close help menu"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Menu Options */}
        <div className="p-2">
          {/* Load Starter Code */}
          <button
            onClick={() => {
              onLoadStarter()
              onClose()
            }}
            className="focus-ring group flex w-full items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-50 dark:hover:bg-blue-900/20"
            role="menuitem"
            aria-describedby="starter-code-desc"
          >
            <div className="flex-shrink-0 rounded-lg bg-blue-100 p-2 transition-colors group-hover:bg-blue-200 dark:bg-blue-900/50 dark:group-hover:bg-blue-900">
              <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Load Starter Code
              </div>
              <div
                id="starter-code-desc"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Get clean code structure to begin
              </div>
            </div>
          </button>

          {/* Show Instructions */}
          <button
            onClick={() => {
              onShowInstructions()
              onClose()
            }}
            className="focus-ring group mt-1 flex w-full items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] hover:bg-green-50 dark:hover:bg-green-900/20"
            role="menuitem"
            aria-describedby="instructions-desc"
          >
            <div className="flex-shrink-0 rounded-lg bg-green-100 p-2 transition-colors group-hover:bg-green-200 dark:bg-green-900/50 dark:group-hover:bg-green-900">
              <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Show Instructions
              </div>
              <div
                id="instructions-desc"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                View step-by-step guidance
              </div>
            </div>
          </button>

          {/* AI Help */}
          {onOpenAIHelp && (
            <button
              onClick={() => {
                onOpenAIHelp()
                onClose()
              }}
              className="focus-ring group mt-1 flex w-full items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] hover:bg-purple-50 dark:hover:bg-purple-900/20"
              role="menuitem"
              aria-describedby="ai-help-desc"
            >
              <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 p-2 transition-colors group-hover:from-purple-200 group-hover:to-indigo-200 dark:from-purple-900/50 dark:to-indigo-900/50 dark:group-hover:from-purple-900 dark:group-hover:to-indigo-900">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  AI Help
                </div>
                <div
                  id="ai-help-desc"
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Get AI-powered assistance
                </div>
              </div>
            </button>
          )}

          {/* Reset & Start Over */}
          <button
            onClick={() => {
              onReset()
              onClose()
            }}
            className="focus-ring group mt-1 flex w-full items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] hover:bg-red-50 dark:hover:bg-red-900/20"
            role="menuitem"
            aria-describedby="reset-desc"
          >
            <div className="flex-shrink-0 rounded-lg bg-red-100 p-2 transition-colors group-hover:bg-red-200 dark:bg-red-900/50 dark:group-hover:bg-red-900">
              <RotateCcw className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Reset & Start Over
              </div>
              <div
                id="reset-desc"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Clear everything and begin fresh
              </div>
            </div>
          </button>
        </div>

        {/* Footer hint */}
        <div className="border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Choose the type of help you need
          </p>
        </div>
      </div>
    </>
  )
}

export default HelpMenu
