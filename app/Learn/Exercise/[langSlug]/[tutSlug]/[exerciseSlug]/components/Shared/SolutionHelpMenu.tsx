// Solution-specific help menu with explanation and clean solution
"use client"

import React, { useEffect, useRef } from "react"
import { MessageSquare, RotateCcw, X } from "lucide-react"

// Solution-specific help menu with explanation and clean solution

// Solution-specific help menu with explanation and clean solution

interface SolutionHelpMenuProps {
  isOpen: boolean
  onClose: () => void
  onShowCodeWithComments: () => void
  onResetToCleanSolution: () => void
}

const SolutionHelpMenu: React.FC<SolutionHelpMenuProps> = ({
  isOpen,
  onClose,
  onShowCodeWithComments,
  onResetToCleanSolution,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

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
        className="help-menu-enter absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:w-72"
        role="menu"
        aria-labelledby="solution-help-menu-title"
        aria-orientation="vertical"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-black">
          <h3
            id="solution-help-menu-title"
            className="text-sm font-bold text-black dark:text-white"
          >
            Need Help?
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900"
            aria-label="Close solution help menu"
          >
            <X className="h-4 w-4 text-black dark:text-white" />
          </button>
        </div>

        {/* Menu Options */}
        <div className="p-2">
          {/* Show Code with Comments */}
          <button
            onClick={() => {
              onShowCodeWithComments()
              onClose()
            }}
            className="focus-ring group flex w-full items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-50 dark:hover:bg-blue-900"
            role="menuitem"
            aria-describedby="code-comments-desc"
          >
            <div className="flex-shrink-0 rounded-lg bg-blue-100 p-2 transition-all group-hover:shadow-lg dark:bg-blue-900">
              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-bold text-black dark:text-white">
                View Code with Instructions
              </div>
              <div
                id="code-comments-desc"
                className="text-xs font-medium text-black dark:text-white"
              >
                See solution code with helpful comments
              </div>
            </div>
          </button>

          {/* Reset to Clean Solution */}
          <button
            onClick={() => {
              onResetToCleanSolution()
              onClose()
            }}
            className="focus-ring group mt-1 flex w-full items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] hover:bg-green-50 dark:hover:bg-green-900"
            role="menuitem"
            aria-describedby="reset-solution-desc"
          >
            <div className="flex-shrink-0 rounded-lg bg-green-100 p-2 transition-all group-hover:shadow-lg dark:bg-green-900">
              <RotateCcw className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-bold text-black dark:text-white">
                Reset to Original Solution code
              </div>
              <div
                id="reset-solution-desc"
                className="text-xs font-medium text-black dark:text-white"
              >
                Restore original clean solution code
              </div>
            </div>
          </button>
        </div>

        {/* Footer hint */}
        <div className="border-t border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-black">
          <p className="text-center text-xs font-medium text-black dark:text-white">
            View instructions or reset to original solution
          </p>
        </div>
      </div>
    </>
  )
}

export default SolutionHelpMenu
