// Unified Mobile Tab Switcher with enhanced touch targets and accessibility
"use client"

import React, { useEffect, useState } from "react"
import { Badge } from "@/app/Learn/Exercise/design/UnifiedComponents"
import { ChevronDown, Sparkles } from "lucide-react"

// Unified Mobile Tab Switcher with enhanced touch targets and accessibility

// Unified Mobile Tab Switcher with enhanced touch targets and accessibility

interface MobileTab {
  id: string
  label: string
  icon: React.ReactNode
  badge?: string | number
  description?: string
  disabled?: boolean
}

interface UnifiedMobileTabSwitcherProps {
  tabs: MobileTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
  showDescription?: boolean
}

const UnifiedMobileTabSwitcher: React.FC<UnifiedMobileTabSwitcherProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  showDescription = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [touchStartY, setTouchStartY] = useState(0)

  const activeTabData = tabs.find((tab) => tab.id === activeTab)

  // Handle swipe gestures for tab switching
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY
    const diff = touchStartY - touchEndY

    // Swipe up to open tab selector
    if (diff > 50 && !isExpanded) {
      setIsExpanded(true)
    }
    // Swipe down to close tab selector
    else if (diff < -50 && isExpanded) {
      setIsExpanded(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      const target = e.target as HTMLElement
      // Don't close if clicking inside the dropdown
      if (target.closest("[data-tab-dropdown]")) {
        return
      }
      if (isExpanded) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      // Use capture phase to ensure we can prevent default if needed
      document.addEventListener("mousedown", handleClickOutside, true)
      document.addEventListener("touchstart", handleClickOutside, true)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
      document.removeEventListener("touchstart", handleClickOutside, true)
    }
  }, [isExpanded])

  // Enhanced keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setIsExpanded(!isExpanded)
    } else if (e.key === "Escape") {
      setIsExpanded(false)
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault()
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
      const nextIndex =
        e.key === "ArrowRight"
          ? (currentIndex + 1) % tabs.length
          : (currentIndex - 1 + tabs.length) % tabs.length

      const nextTab = tabs[nextIndex]
      if (nextTab && !nextTab.disabled) {
        onTabChange(nextTab.id)
      }
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Mobile Tab Selector Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsExpanded(!isExpanded)
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        className="relative w-full overflow-hidden"
        aria-expanded={isExpanded}
        aria-haspopup="true"
        aria-label={`Current tab: ${activeTabData?.label}. Tap to switch tabs.`}
        type="button"
      >
        {/* Enhanced background with gradient */}
        <div className="via-primary-50/30 dark:via-primary-950/30 absolute inset-0 bg-gradient-to-r from-white to-white dark:from-neutral-900 dark:to-neutral-900" />

        {/* Glass morphism overlay */}
        <div className="border-primary-200/50 dark:border-primary-700/30 relative rounded-xl border-2 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-neutral-900/80">
          <div className="p-4">
            <div className="flex items-center justify-between">
              {/* Active tab info */}
              <div className="flex flex-1 items-center gap-3">
                {/* Tab icon with enhanced styling */}
                <div className="from-primary-500 to-primary-600 rounded-lg bg-gradient-to-br p-2 text-white shadow-lg">
                  {activeTabData?.icon}
                </div>

                {/* Tab label and description */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="from-primary-700 to-primary-800 dark:from-primary-300 dark:to-primary-400 bg-gradient-to-r bg-clip-text text-lg font-semibold text-transparent">
                      {activeTabData?.label}
                    </span>
                    {activeTabData?.badge && (
                      <Badge
                        variant="primary"
                        size="sm"
                        className="animate-pulse"
                      >
                        {activeTabData.badge}
                      </Badge>
                    )}
                  </div>
                  {showDescription && activeTabData?.description && (
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {activeTabData.description}
                    </p>
                  )}
                </div>

                {/* Expand indicator with animation */}
                <div
                  className={`rounded-lg p-2 transition-transform duration-300 ${
                    isExpanded
                      ? "bg-primary-100 dark:bg-primary-900/30 rotate-180"
                      : "bg-neutral-100 dark:bg-neutral-800"
                  }`}
                >
                  <ChevronDown className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </div>
              </div>
            </div>

            {/* Swipe hint */}
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span>Swipe up to switch tabs</span>
              <Sparkles className="h-3 w-3 animate-pulse" />
            </div>
          </div>
        </div>
      </button>

      {/* Enhanced Tab Dropdown */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
            aria-label="Close tab selector"
          />
          {/* Tab Dropdown - Fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 z-50" data-tab-dropdown>
            {/* Tab options */}
            <div className="overflow-hidden rounded-t-xl border-t border-neutral-200/70 bg-white/95 shadow-xl backdrop-blur-md dark:border-neutral-700/70 dark:bg-neutral-900/95">
              {tabs.map((tab, index) => {
                const isActive = tab.id === activeTab
                const isDisabled = tab.disabled

                return (
                  <button
                    key={tab.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!isDisabled) {
                        onTabChange(tab.id)
                        setIsExpanded(false)
                      }
                    }}
                    disabled={isDisabled}
                    className={`relative w-full overflow-hidden text-left transition-all duration-200 ${
                      isActive
                        ? "from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-900/20 bg-gradient-to-r"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    } ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${index === 0 ? "rounded-t-xl" : ""} ${index === tabs.length - 1 ? "rounded-b-xl" : ""} `}
                    aria-pressed={isActive}
                    aria-disabled={isDisabled}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="from-primary-500 to-primary-600 absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b" />
                    )}

                    <div className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        {/* Tab icon */}
                        <div
                          className={`rounded-lg p-2 transition-all duration-200 ${
                            isActive
                              ? "from-primary-500 to-primary-600 scale-110 bg-gradient-to-br text-white shadow-lg"
                              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                          }`}
                        >
                          {tab.icon}
                        </div>

                        {/* Tab info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold transition-colors duration-200 ${
                                isActive
                                  ? "text-primary-700 dark:text-primary-300"
                                  : "text-neutral-700 dark:text-neutral-300"
                              }`}
                            >
                              {tab.label}
                            </span>
                            {tab.badge && (
                              <Badge
                                variant={isActive ? "primary" : "neutral"}
                                size="sm"
                                className={isActive ? "animate-pulse" : ""}
                              >
                                {tab.badge}
                              </Badge>
                            )}
                          </div>
                          {tab.description && (
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                              {tab.description}
                            </p>
                          )}
                        </div>

                        {/* Active checkmark */}
                        {isActive && (
                          <div className="bg-primary-500 h-2 w-2 animate-pulse rounded-full" />
                        )}
                      </div>
                    </div>

                    {/* Separator */}
                    {index < tabs.length - 1 && (
                      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-neutral-700" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite">
        {isExpanded
          ? "Tab selector opened"
          : `Current tab: ${activeTabData?.label}`}
      </div>
    </div>
  )
}

export default UnifiedMobileTabSwitcher
