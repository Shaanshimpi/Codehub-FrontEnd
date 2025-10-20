"use client"

import React, { useState } from "react"
import type { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import { useTheme } from "@/app/contexts/theme-context"
import { getNavigationUrls, getRecommendedAction } from "../helpers"
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation"
// Import spacing system
import "../styles/spacing.css"
import { formatDifficultyWithIcon, formatLessonType } from "../utils"
// Temporarily disabled - Local storage features
// import BookmarkNotesPanel from "./BookmarkNotesPanel"
import MermaidRenderer from "./MermaidRenderer"
import CodeRearrangeLesson from "./lessons/CodeRearrangeLesson"
import ConceptLesson from "./lessons/ConceptLesson"
import FillBlanksLesson from "./lessons/FillBlanksLesson"
import MCQLesson from "./lessons/MCQLesson"
// Import new maintainable structure
import {
  Badge,
  Breadcrumb,
  Button,
  Icon,
  LessonCard,
  Modal,
  StatCard,
} from "./ui"

interface TutorialPageContainerProps {
  tutorial: Tutorial
  language: Language
  langSlug: string
  tutSlug: string
}

const TutorialPageContainer: React.FC<TutorialPageContainerProps> = ({
  tutorial,
  language,
  langSlug,
  tutSlug,
}) => {
  const [showReference, setShowReference] = useState(true)
  // Temporarily disabled - Local storage features
  // const [showBookmarkPanel, setShowBookmarkPanel] = useState(false)
  const [showLessonInfo, setShowLessonInfo] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeReferenceTab, setActiveReferenceTab] = useState("introduction")
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)

  // URL fragment support for bookmarking
  React.useEffect(() => {
    const hash = window.location.hash.slice(1)
    const validTabs = [
      "introduction",
      "keypoints",
      "examples",
      "syntax",
      "mistakes",
    ]
    if (validTabs.includes(hash)) {
      setActiveReferenceTab(hash)
    }
  }, [])

  // Listen for header mobile menu events to prevent conflicts
  React.useEffect(() => {
    const handleCloseTutorialMobileMenu = () => {
      setIsMobileMenuOpen(false)
    }

    window.addEventListener(
      "closeTutorialMobileMenu",
      handleCloseTutorialMobileMenu
    )

    return () => {
      window.removeEventListener(
        "closeTutorialMobileMenu",
        handleCloseTutorialMobileMenu
      )
    }
  }, [])

  const handleTabChange = (tabId: string) => {
    setActiveReferenceTab(tabId)
    // Update URL fragment for bookmarking
    window.history.replaceState(null, "", `#${tabId}`)

    // Scroll to tab content area
    setTimeout(() => {
      const tabContentElement = document.getElementById("tab-content-area")
      if (tabContentElement) {
        const yOffset = -80 // Offset for fixed header
        const y =
          tabContentElement.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset
        window.scrollTo({ top: y, behavior: "smooth" })
      }
    }, 100) // Small delay to ensure content is rendered
  }

  // Simple lesson navigation without progress tracking
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const currentLesson = tutorial.lessons?.[currentLessonIndex]
  const { theme } = useTheme()

  // Scroll to top whenever lesson index changes
  React.useEffect(() => {
    if (!showReference) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [currentLessonIndex, showReference])

  // Helper function to check if mermaid code is valid and not empty
  const hasValidMermaidCode = (mermaidCode: any): boolean => {
    if (!mermaidCode) return false

    let code = ""
    if (Array.isArray(mermaidCode)) {
      // Check if array is empty
      if (mermaidCode.length === 0) return false

      code =
        typeof mermaidCode[0] === "string"
          ? mermaidCode[0]
          : mermaidCode[0]?.code || ""
    } else if (typeof mermaidCode === "string") {
      code = mermaidCode
    } else {
      code = mermaidCode?.code || ""
    }

    return code.trim().length > 0
  }

  // Enhanced calculations using new helpers
  const navigationUrls = getNavigationUrls(langSlug, tutSlug)
  const difficultyInfo = formatDifficultyWithIcon(tutorial.difficulty)
  const recommendedAction = getRecommendedAction(
    { completedCount: 0, progressPercentage: 0, averageScore: 0 },
    tutorial.lessons?.length || 0
  )

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const newIndex = currentLessonIndex - 1
      setCurrentLessonIndex(newIndex)
    }
  }

  const handleNextLesson = () => {
    if (currentLessonIndex < (tutorial.lessons?.length || 0) - 1) {
      const newIndex = currentLessonIndex + 1
      setCurrentLessonIndex(newIndex)
    }
  }

  const handleLessonSelect = (lessonIndex: number) => {
    setCurrentLessonIndex(lessonIndex)
  }

  const handleStartLessons = () => {
    setShowReference(false)
    // Start from beginning
    setCurrentLessonIndex(0)
  }

  const handleBackToReference = () => {
    setShowReference(true)
    // Scroll to top when going back to reference
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    // Close any header mobile menu by dispatching a custom event
    window.dispatchEvent(new CustomEvent("closeHeaderMobileMenu"))
  }

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  // Enhanced keyboard shortcuts for tabs
  const handleTabKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleTabChange(tabId)
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault()
      const tabs = [
        "introduction",
        "keypoints",
        "examples",
        "syntax",
        "mistakes",
      ]
      const currentIndex = tabs.indexOf(activeReferenceTab)
      const newIndex =
        e.key === "ArrowLeft"
          ? (currentIndex - 1 + tabs.length) % tabs.length
          : (currentIndex + 1) % tabs.length
      handleTabChange(tabs[newIndex])
    }
  }

  // Keyboard navigation
  useKeyboardNavigation({
    onPreviousLesson: handlePreviousLesson,
    onNextLesson: handleNextLesson,
    onToggleBookmark: () => {},
    onOpenNotes: () => {}, // Temporarily disabled - Local storage
    onBackToReference: handleBackToReference,
    isLessonMode: !showReference,
    canGoNext: currentLessonIndex < (tutorial.lessons?.length || 0) - 1,
    canGoPrevious: currentLessonIndex > 0,
  })

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900" role="main">
      {/* Mobile Menu Overlay - Higher z-index to prevent conflicts */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black bg-opacity-50 lg:hidden"
          onClick={handleCloseMobileMenu}
          aria-hidden="true"
        />
      )}
      {/* Enhanced Breadcrumb */}
      <nav
        className="border-b border-gray-200 bg-white pt-16 dark:border-gray-700 dark:bg-gray-800"
        aria-label="Breadcrumb navigation"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Breadcrumb
              items={[
                {
                  label: "Home",
                  href: navigationUrls.home,
                  icon: <Icon name="home" size="sm" />,
                },
                {
                  label: "Tutorials",
                  href: navigationUrls.tutorials,
                  icon: <Icon name="computer" size="md" />,
                },
                {
                  label: language.title,
                  href: navigationUrls.language,
                  icon: <Icon name="book" size="md" />,
                },
                {
                  label: tutorial.title,
                  current: true,
                },
              ]}
            />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-2 py-3 sm:px-4 sm:py-6 lg:px-8">
        <div
          className="flex flex-col gap-3 sm:gap-6 lg:flex-row"
          role="presentation"
        >
          {/* Mobile Sidebar Toggle - Floating Action Button */}
          <button
            onClick={handleToggleSidebar}
            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl lg:hidden"
            aria-label="Toggle navigation sidebar"
          >
            <Icon name={isSidebarOpen ? "x" : "menu"} size="md" />
          </button>

          {/* Enhanced Mobile Header */}
          <div className="lg:hidden">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={handleMobileMenuToggle}
                className="flex min-h-[60px] w-full touch-manipulation items-center justify-between p-4 transition-shadow hover:shadow-md"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Icon name="book" className="flex-shrink-0 text-blue-600" />
                  <div className="min-w-0 flex-1">
                    <div
                      className="max-w-[200px] truncate font-medium text-gray-900 dark:text-white sm:max-w-[300px]"
                      title={tutorial.title}
                    >
                      {tutorial.title}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        {showReference
                          ? "Reference"
                          : `Lesson ${currentLessonIndex + 1}/${tutorial.lessons?.length || 0}`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    name={isMobileMenuOpen ? "x" : "menu"}
                    className="text-gray-500"
                    size="sm"
                  />
                </div>
              </button>

              {/* Mobile Menu Panel - Fixed at bottom */}
              {isMobileMenuOpen && (
                <>
                  {/* Backdrop */}
                  <button
                    type="button"
                    className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close mobile menu"
                  />
                  {/* Menu Panel */}
                  <div
                    id="mobile-menu"
                    className="fixed bottom-0 left-0 right-0 z-[70] border-t border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    role="menu"
                    aria-labelledby="mobile-menu-button"
                  >
                    {showReference ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          <StatCard
                            title="Lessons"
                            value={tutorial.lessons?.length || 0}
                            icon={<Icon name="book" />}
                            color="blue"
                            onClick={() => {
                              handleCloseMobileMenu()
                            }}
                          />
                          <StatCard
                            title="Difficulty"
                            value={difficultyInfo.label}
                            subtitle="Recommended level"
                            icon={<span>{difficultyInfo.icon}</span>}
                            color="purple"
                          />
                          <StatCard
                            title="Language"
                            value={language.title}
                            icon={<Icon name="code" />}
                            color="green"
                          />
                        </div>
                        <Button
                          variant="primary"
                          size="lg"
                          fullWidth
                          onClick={() => {
                            handleStartLessons()
                            handleCloseMobileMenu()
                          }}
                          icon={<Icon name="chevronRight" size="sm" />}
                        >
                          Start Learning
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Mobile Lesson Navigation - Enhanced */}
                        <div className="space-y-3">
                          {/* Progress Indicator */}
                          <div className="flex items-center justify-center">
                            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 dark:bg-gray-700">
                              <Icon
                                name="book"
                                className="text-blue-600"
                                size="sm"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Lesson {currentLessonIndex + 1} of{" "}
                                {tutorial.lessons?.length || 0}
                              </span>
                            </div>
                          </div>

                          {/* Navigation Buttons */}
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handlePreviousLesson()
                                handleCloseMobileMenu()
                              }}
                              disabled={currentLessonIndex === 0}
                              icon={<Icon name="chevronLeft" size="sm" />}
                              className="min-h-[48px] flex-1 touch-manipulation text-sm font-medium"
                            >
                              <span className="hidden sm:inline">
                                Previous Lesson
                              </span>
                              <span className="sm:hidden">Previous</span>
                            </Button>

                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                handleNextLesson()
                                handleCloseMobileMenu()
                              }}
                              disabled={
                                currentLessonIndex >=
                                (tutorial.lessons?.length || 0) - 1
                              }
                              icon={<Icon name="chevronRight" size="sm" />}
                              iconPosition="right"
                              className="min-h-[48px] flex-1 touch-manipulation text-sm font-medium"
                            >
                              <span className="hidden sm:inline">
                                Next Lesson
                              </span>
                              <span className="sm:hidden">Next</span>
                            </Button>
                          </div>
                        </div>

                        {/* Quick Actions - Mobile Optimized */}
                        {/* Temporarily hidden - Local storage features
                        <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleCloseMobileMenu()
                          }}
                          icon={<Icon name="bookmark" size="sm" />}
                            className="min-h-[44px] touch-manipulation"
                        >
                            <span className="text-sm font-medium">
                          Bookmark
                            </span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowBookmarkPanel(true)
                            handleCloseMobileMenu()
                          }}
                          icon={<Icon name="notes" size="sm" />}
                            className="min-h-[44px] touch-manipulation"
                        >
                            <span className="text-sm font-medium">Notes</span>
                        </Button>
                      </div>
                        */}

                        <Button
                          variant="ghost"
                          size="sm"
                          fullWidth
                          onClick={() => {
                            handleBackToReference()
                            handleCloseMobileMenu()
                          }}
                          icon={<Icon name="home" size="sm" />}
                          className="min-h-[44px] touch-manipulation"
                        >
                          <span className="text-sm font-medium">
                            Back to Overview
                          </span>
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Slide-out Sidebar */}
          {isSidebarOpen && (
            <>
              {/* Backdrop */}
              <button
                type="button"
                className="fixed inset-0 z-[45] bg-black/40 backdrop-blur-sm lg:hidden"
                onClick={handleCloseSidebar}
                aria-label="Close sidebar"
              />
              {/* Sidebar Panel */}
              <aside
                className="fixed bottom-0 right-0 top-0 z-50 w-80 transform overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-gray-800 lg:hidden"
                role="navigation"
                aria-label="Tutorial navigation sidebar"
              >
                {/* Sidebar Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Navigation
                  </h2>
                  <button
                    onClick={handleCloseSidebar}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Close navigation"
                  >
                    <Icon name="x" size="sm" />
                  </button>
                </div>

                {/* Sidebar Content */}
                <div className="p-4">
                  {/* Tutorial Info */}
                  <div className="mb-6">
                    <div className="mb-3 flex items-start gap-3">
                      <Icon name="book" className="mt-0.5 text-blue-600" />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                          {tutorial.title}
                        </h3>
                      </div>
                    </div>

                    {showReference ? (
                      <div className="grid grid-cols-1 gap-3">
                        <StatCard
                          title="Lessons"
                          value={tutorial.lessons?.length || 0}
                          icon={<Icon name="book" />}
                          color="blue"
                          onClick={() => {}}
                        />
                        <StatCard
                          title="Difficulty"
                          value={difficultyInfo.label}
                          subtitle="Recommended level"
                          icon={<span>{difficultyInfo.icon}</span>}
                          color="purple"
                        />
                        <StatCard
                          title="Language"
                          value={language.title}
                          icon={<Icon name="code" />}
                          color="green"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {tutorial.lessons?.length || 0} lessons available
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {!showReference && (
                    /* Lesson List */
                    <div className="mb-6">
                      <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                        Lessons
                      </h4>
                      <div className="space-y-2">
                        {tutorial.lessons?.map((lesson, index) => {
                          return (
                            <LessonCard
                              key={lesson.id || index}
                              lesson={lesson}
                              index={index}
                              isActive={index === currentLessonIndex}
                              isCompleted={false}
                              onClick={() => {
                                handleLessonSelect(index)
                                handleCloseSidebar()
                              }}
                              showPreview={false}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {showReference && (
                    /* Reference Mode Overview */
                    <div className="mb-6">
                      <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                        What You&apos;ll Learn:
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        {tutorial.lessons?.slice(0, 5).map((lesson, index) => (
                          <div
                            key={lesson.id || index}
                            className="flex items-start gap-2"
                          >
                            <span className="mt-1 text-xs text-blue-500">
                              •
                            </span>
                            <span>{lesson.title}</span>
                          </div>
                        ))}
                        {(tutorial.lessons?.length || 0) > 5 && (
                          <div className="flex items-start gap-2 text-xs">
                            <span className="mt-1 text-blue-500">•</span>
                            <span>
                              And {(tutorial.lessons?.length || 0) - 5} more
                              lessons...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </>
          )}

          {/* Desktop Sidebar */}
          <aside
            className="hidden w-80 flex-shrink-0 lg:block"
            aria-label="Tutorial information sidebar"
          >
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              {/* Enhanced Tutorial Header */}
              <div className="mb-6">
                <div className="mb-3 flex items-start gap-3">
                  <Icon name="book" className="mt-0.5 text-blue-600" />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {tutorial.title}
                    </h2>
                  </div>
                </div>

                {showReference ? (
                  <div className="grid grid-cols-1 gap-3">
                    <StatCard
                      title="Lessons"
                      value={tutorial.lessons?.length || 0}
                      icon={<Icon name="book" />}
                      color="blue"
                      onClick={() => {}}
                    />
                    <StatCard
                      title="Difficulty"
                      value={difficultyInfo.label}
                      subtitle="Recommended level"
                      icon={<span>{difficultyInfo.icon}</span>}
                      color="purple"
                    />
                    <StatCard
                      title="Language"
                      value={language.title}
                      icon={<Icon name="code" />}
                      color="green"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {tutorial.lessons?.length || 0} lessons available
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {!showReference && (
                /* Enhanced Lesson List */
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                    Lessons
                  </h3>
                  <div className="space-y-2">
                    {tutorial.lessons?.map((lesson, index) => {
                      return (
                        <LessonCard
                          key={lesson.id || index}
                          lesson={lesson}
                          index={index}
                          isActive={index === currentLessonIndex}
                          isCompleted={false}
                          onClick={() => handleLessonSelect(index)}
                          showPreview={false}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              {showReference && (
                /* Reference Mode - Show tutorial overview */
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                    What You&apos;ll Learn:
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {tutorial.lessons?.slice(0, 5).map((lesson, index) => (
                      <div
                        key={lesson.id || index}
                        className="flex items-start gap-2"
                      >
                        <span className="mt-1 text-xs text-blue-500">•</span>
                        <span>{lesson.title}</span>
                      </div>
                    ))}
                    {(tutorial.lessons?.length || 0) > 5 && (
                      <div className="flex items-start gap-2 text-xs">
                        <span className="mt-1 text-blue-500">•</span>
                        <span>
                          And {(tutorial.lessons?.length || 0) - 5} more
                          lessons...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1" aria-label="Tutorial content">
            <article className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              {showReference ? (
                /* Reference Content - Optimized Layout */
                <div className="p-3 sm:p-6 lg:p-8">
                  <div className="mb-4 sm:mb-6 lg:mb-8">
                    <h1 className="mb-4 flex flex-col gap-2 text-xl font-bold text-gray-900 dark:text-white sm:flex-row sm:items-center sm:gap-3 sm:text-2xl lg:text-3xl">
                      <Icon name="book" className="text-blue-500" size="md" />
                      <span>{tutorial.title}</span>
                    </h1>

                    {tutorial.description && (
                      <p className="mb-4 text-base text-gray-600 dark:text-gray-300 sm:mb-6 sm:text-lg">
                        {tutorial.description}
                      </p>
                    )}

                    {/* Tutorial Stats - Optimized */}
                    <div className="mb-4 flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:mb-8 lg:gap-6">
                      <div className="flex items-center gap-2">
                        <Icon name="book" className="text-blue-500" size="md" />
                        <span>{tutorial.lessons?.length || 0} Lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          name="star"
                          className="text-yellow-500"
                          size="sm"
                        />
                        <span>Difficulty: {tutorial.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          name="code"
                          className="text-green-500"
                          size="sm"
                        />
                        <span>{language.title}</span>
                      </div>
                    </div>

                    {/* Learn Interactively Button - Optimized */}
                    <div className="mb-4 sm:mb-6 lg:mb-8">
                      <Button
                        onClick={handleStartLessons}
                        variant="primary"
                        size="lg"
                        icon={<Icon name="star" size="sm" />}
                        className="min-h-[56px] transform touch-manipulation bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                        fullWidth
                      >
                        <span className="text-base font-semibold">
                          Learn Interactively
                        </span>
                      </Button>
                      <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
                        {recommendedAction.message}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Multi-Window Reference Interface */}
                  {tutorial.reference ? (
                    <div className="-mx-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:-mx-6 lg:-mx-8">
                      {/* Enhanced Tab Navigation - Mobile Optimized */}
                      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-800 dark:via-blue-900/20 dark:to-indigo-900/20">
                        <div className="scrollbar-hidden flex overflow-x-auto px-2 sm:px-0">
                          {(() => {
                            const tabs = [
                              {
                                id: "introduction",
                                label: "Introduction",
                                icon: "book",
                                color: "blue",
                                available: !!tutorial.reference.introduction,
                              },
                              {
                                id: "keypoints",
                                label: "Key Points",
                                icon: "star",
                                color: "yellow",
                                available:
                                  tutorial.reference.key_points?.length > 0,
                              },
                              {
                                id: "examples",
                                label: "Code Examples",
                                icon: "code",
                                color: "green",
                                available:
                                  tutorial.reference.examples?.length > 0,
                              },
                              {
                                id: "syntax",
                                label: "Syntax Guide",
                                icon: "puzzle",
                                color: "purple",
                                available: !!tutorial.reference.syntax_guide,
                              },
                              {
                                id: "mistakes",
                                label: "Common Issues",
                                icon: "x",
                                color: "red",
                                available:
                                  tutorial.reference.common_mistakes?.length >
                                  0,
                              },
                            ].filter((tab) => tab.available)

                            return tabs.map((tab) => (
                              <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                                role="tab"
                                aria-selected={activeReferenceTab === tab.id}
                                className={`group relative min-h-[72px] flex-shrink-0 touch-manipulation px-3 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:min-h-[48px] ${
                                  activeReferenceTab === tab.id
                                    ? `border-b-3 border-${tab.color}-500 bg-white text-${tab.color}-700 scale-105 transform shadow-md dark:bg-gray-700 dark:text-${tab.color}-400`
                                    : "border-b-3 hover:scale-102 border-transparent text-gray-600 hover:bg-white/70 hover:text-gray-900 hover:shadow-sm dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200"
                                }`}
                                style={{
                                  minWidth: "100px",
                                }}
                              >
                                <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-2">
                                  <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors sm:h-6 sm:w-6 ${
                                      activeReferenceTab === tab.id
                                        ? `bg-${tab.color}-100 text-${tab.color}-600 dark:bg-${tab.color}-900/30 dark:text-${tab.color}-400`
                                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-gray-600 dark:group-hover:text-gray-300"
                                    }`}
                                  >
                                    <Icon name={tab.icon} size="sm" />
                                  </div>
                                  <span className="max-w-[88px] truncate text-center text-xs font-medium sm:max-w-none sm:text-sm">
                                    {tab.label}
                                  </span>
                                </div>
                                {/* Active tab indicator */}
                                {activeReferenceTab === tab.id && (
                                  <div
                                    className={`absolute -bottom-0.5 left-1/2 h-1 w-12 rounded-t-full bg-${tab.color}-500 -translate-x-1/2 transform transition-all duration-300`}
                                  />
                                )}
                              </button>
                            ))
                          })()}
                        </div>
                      </div>

                      {/* Tab Content - Optimized Layout */}
                      <div
                        id="tab-content-area"
                        className="min-h-[400px] p-3 sm:min-h-[500px] sm:p-6 lg:p-8"
                        role="tabpanel"
                        aria-labelledby={`${activeReferenceTab}-tab`}
                      >
                        {/* Introduction Tab */}
                        {activeReferenceTab === "introduction" && (
                          <div className="space-y-6">
                            {tutorial.reference.introduction && (
                              <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 dark:border-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20 sm:p-6 lg:p-8">
                                <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg">
                                    <Icon name="book" size="md" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                                      Introduction
                                    </h3>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">
                                      Learn the fundamentals
                                    </p>
                                  </div>
                                </div>

                                <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                                  <p className="text-base leading-relaxed sm:text-lg">
                                    {tutorial.reference.introduction}
                                  </p>
                                </div>

                                {/* Tutorial Overview Stats - Optimized */}
                                <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4 lg:mt-8">
                                  <div className="rounded-lg border border-blue-200 bg-white/80 p-4 dark:border-blue-700 dark:bg-gray-800/80">
                                    <div className="flex items-center gap-3">
                                      <Icon
                                        name="book"
                                        className="text-blue-500"
                                        size="sm"
                                      />
                                      <div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                          {tutorial.lessons?.length || 0}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                          Interactive Lessons
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="rounded-lg border border-green-200 bg-white/80 p-4 dark:border-green-700 dark:bg-gray-800/80">
                                    <div className="flex items-center gap-3">
                                      <Icon
                                        name="code"
                                        className="text-green-500"
                                        size="sm"
                                      />
                                      <div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                          {tutorial.reference.examples
                                            ?.length || 0}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                          Code Examples
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="rounded-lg border border-purple-200 bg-white/80 p-4 dark:border-purple-700 dark:bg-gray-800/80">
                                    <div className="flex items-center gap-3">
                                      <Icon
                                        name="star"
                                        className="text-purple-500"
                                        size="sm"
                                      />
                                      <div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                                          {difficultyInfo.label}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                          Difficulty Level
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Key Points Tab */}
                        {activeReferenceTab === "keypoints" && (
                          <div className="space-y-6">
                            <div className="mb-8 flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-white shadow-lg">
                                <Icon name="star" size="md" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                  Key Learning Points
                                </h3>
                                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                  Essential concepts to master
                                </p>
                              </div>
                            </div>

                            {tutorial.reference.key_points &&
                            tutorial.reference.key_points.length > 0 ? (
                              <div className="grid gap-4 lg:grid-cols-2">
                                {tutorial.reference.key_points.map(
                                  (point, index) => (
                                    <div
                                      key={index}
                                      className="group rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-yellow-700 dark:from-yellow-900/20 dark:to-orange-900/20"
                                    >
                                      <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 text-lg font-bold text-white shadow-sm">
                                          {index + 1}
                                        </div>
                                        <div className="flex-1">
                                          <p className="leading-relaxed text-gray-800 dark:text-gray-200">
                                            {typeof point === "string"
                                              ? point
                                              : point.point}
                                          </p>
                                          {typeof point === "object" &&
                                            hasValidMermaidCode(
                                              point.mermaid_code
                                            ) && (
                                              <div className="mt-4">
                                                <MermaidRenderer
                                                  code={
                                                    Array.isArray(
                                                      point.mermaid_code
                                                    )
                                                      ? typeof point
                                                          .mermaid_code[0] ===
                                                        "string"
                                                        ? point.mermaid_code[0]
                                                        : point.mermaid_code[0]
                                                            ?.code || ""
                                                      : typeof point.mermaid_code ===
                                                          "string"
                                                        ? point.mermaid_code
                                                        : point.mermaid_code
                                                            ?.code || ""
                                                  }
                                                  theme={theme}
                                                />
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <div className="py-12 text-center">
                                <Icon
                                  name="star"
                                  className="mx-auto mb-4 text-yellow-400"
                                  size="lg"
                                />
                                <p className="text-gray-500 dark:text-gray-400">
                                  No key points available for this tutorial.
                                </p>
                              </div>
                            )}
                            {/* Empty state visual nudge */}
                            {(!tutorial.reference.key_points ||
                              tutorial.reference.key_points.length === 0) && (
                              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-200">
                                No key points available yet. Check back soon.
                              </div>
                            )}
                          </div>
                        )}

                        {/* Examples Tab - Enhanced Multi-Window Interface */}
                        {activeReferenceTab === "examples" && (
                          <div className="space-y-6">
                            <div className="mb-8 flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white shadow-lg">
                                <Icon name="code" size="md" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                  Interactive Code Examples
                                </h3>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                  Practice with real working code
                                </p>
                              </div>
                            </div>

                            {tutorial.reference.examples &&
                            tutorial.reference.examples.length > 0 ? (
                              <div className="space-y-6">
                                {/* Example Navigation */}
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="info" size="sm">
                                      Example {currentExampleIndex + 1} of{" "}
                                      {tutorial.reference.examples.length}
                                    </Badge>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      Use arrows to navigate
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setCurrentExampleIndex(
                                          Math.max(0, currentExampleIndex - 1)
                                        )
                                      }
                                      disabled={currentExampleIndex === 0}
                                      icon={
                                        <Icon name="chevronLeft" size="sm" />
                                      }
                                    >
                                      Previous
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setCurrentExampleIndex(
                                          Math.min(
                                            tutorial.reference.examples.length -
                                              1,
                                            currentExampleIndex + 1
                                          )
                                        )
                                      }
                                      disabled={
                                        currentExampleIndex >=
                                        tutorial.reference.examples.length - 1
                                      }
                                      icon={
                                        <Icon name="chevronRight" size="sm" />
                                      }
                                      iconPosition="right"
                                    >
                                      Next
                                    </Button>
                                  </div>
                                </div>

                                {/* Current Example */}
                                {(() => {
                                  const example =
                                    tutorial.reference.examples[
                                      currentExampleIndex
                                    ]
                                  if (!example) return null

                                  return (
                                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                                      {/* Enhanced Example Header */}
                                      <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 via-blue-50 to-indigo-50 px-4 py-6 dark:border-gray-700 dark:from-green-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 sm:px-6">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                              Example {currentExampleIndex + 1}:{" "}
                                              {example.title}
                                            </h4>
                                            {example.description && (
                                              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                                {example.description}
                                              </p>
                                            )}
                                          </div>
                                          <Badge
                                            variant="info"
                                            size="sm"
                                            className="ml-4 flex-shrink-0"
                                          >
                                            Interactive
                                          </Badge>
                                        </div>
                                      </div>

                                      <div className="p-4 sm:p-6 lg:p-8">
                                        {/* Responsive Layout - Stack on mobile, side-by-side on larger screens */}
                                        <div className="space-y-6 lg:space-y-8">
                                          {/* Code Section */}
                                          <div className="space-y-4">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                              <h5 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                                                <Icon
                                                  name="code"
                                                  className="text-green-500"
                                                  size="sm"
                                                />
                                                Source Code
                                              </h5>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  navigator.clipboard.writeText(
                                                    example.code
                                                  )
                                                }
                                                icon={
                                                  <Icon
                                                    name="bookmark"
                                                    size="sm"
                                                  />
                                                }
                                                className="w-fit"
                                              >
                                                Copy Code
                                              </Button>
                                            </div>
                                            <div className="rounded-xl bg-gray-900 p-4 shadow-inner sm:p-6">
                                              <pre className="overflow-x-auto text-sm leading-relaxed text-gray-100 sm:text-base">
                                                <code>{example.code}</code>
                                              </pre>
                                            </div>
                                          </div>

                                          {/* Diagram Section */}
                                          {hasValidMermaidCode(
                                            example.mermaid_code
                                          ) && (
                                            <div className="space-y-4">
                                              <h5 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                                                <Icon
                                                  name="puzzle"
                                                  className="text-purple-500"
                                                  size="sm"
                                                />
                                                Visual Flow
                                              </h5>
                                              <div className="rounded-xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
                                                <MermaidRenderer
                                                  code={
                                                    Array.isArray(
                                                      example.mermaid_code
                                                    )
                                                      ? typeof example
                                                          .mermaid_code[0] ===
                                                        "string"
                                                        ? example
                                                            .mermaid_code[0]
                                                        : example
                                                            .mermaid_code[0]
                                                            ?.code || ""
                                                      : typeof example.mermaid_code ===
                                                          "string"
                                                        ? example.mermaid_code
                                                        : example.mermaid_code
                                                            ?.code || ""
                                                  }
                                                  theme={theme}
                                                />
                                              </div>
                                            </div>
                                          )}

                                          {/* Output and Explanation Grid */}
                                          <div className="grid gap-6 lg:grid-cols-2">
                                            {/* Output Section */}
                                            {example.output && (
                                              <div className="space-y-4">
                                                <h5 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                                                  <Icon
                                                    name="chevronRight"
                                                    className="text-blue-500"
                                                    size="sm"
                                                  />
                                                  Expected Output
                                                </h5>
                                                <div className="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm dark:border-green-800 dark:bg-green-900/20 sm:p-6">
                                                  <pre className="overflow-x-auto text-sm leading-relaxed text-green-800 dark:text-green-200 sm:text-base">
                                                    <code>
                                                      {example.output}
                                                    </code>
                                                  </pre>
                                                </div>
                                              </div>
                                            )}

                                            {/* Explanation Section */}
                                            {example.explanation && (
                                              <div className="space-y-4">
                                                <h5 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                                                  <Icon
                                                    name="star"
                                                    className="text-blue-500"
                                                    size="sm"
                                                  />
                                                  Explanation
                                                </h5>
                                                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-800 dark:bg-blue-900/20 sm:p-6">
                                                  <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200 sm:text-base">
                                                    {example.explanation}
                                                  </p>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })()}

                                {/* Enhanced Example Indicators */}
                                <div className="flex justify-center space-x-3">
                                  {tutorial.reference.examples.map(
                                    (_, index) => (
                                      <button
                                        key={index}
                                        onClick={() =>
                                          setCurrentExampleIndex(index)
                                        }
                                        className={`h-3 w-12 rounded-full transition-all duration-300 ${
                                          index === currentExampleIndex
                                            ? "scale-110 bg-gradient-to-r from-blue-500 to-green-500 shadow-lg"
                                            : "bg-gray-300 hover:scale-105 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                                        }`}
                                        aria-label={`Go to example ${index + 1}`}
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="py-12 text-center">
                                <Icon
                                  name="code"
                                  className="mx-auto mb-4 text-gray-400"
                                  size="lg"
                                />
                                <p className="text-gray-500 dark:text-gray-400">
                                  No code examples available for this tutorial.
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Syntax Guide Tab */}
                        {activeReferenceTab === "syntax" && (
                          <div className="space-y-6">
                            <div className="mb-8 flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 text-white shadow-lg">
                                <Icon name="puzzle" size="md" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                  Syntax Guide & Reference
                                </h3>
                                <p className="text-sm text-purple-600 dark:text-purple-400">
                                  Quick reference and best practices
                                </p>
                              </div>
                            </div>

                            {tutorial.reference.syntax_guide ? (
                              <div className="space-y-6">
                                {/* Basic Syntax Section */}
                                {tutorial.reference.syntax_guide
                                  .basic_syntax && (
                                  <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 dark:border-purple-700 dark:from-purple-900/20 dark:to-indigo-900/20">
                                    <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-purple-900 dark:text-purple-100">
                                      <Icon
                                        name="code"
                                        className="text-purple-500"
                                        size="sm"
                                      />
                                      Basic Syntax
                                    </h4>
                                    <div className="rounded-lg bg-gray-900 p-6 shadow-inner">
                                      <pre className="overflow-x-auto text-sm text-gray-100">
                                        <code>
                                          {
                                            tutorial.reference.syntax_guide
                                              .basic_syntax
                                          }
                                        </code>
                                      </pre>
                                    </div>
                                    {hasValidMermaidCode(
                                      tutorial.reference.syntax_guide
                                        .mermaid_code
                                    ) && (
                                      <div className="mt-6">
                                        <h5 className="mb-3 text-sm font-medium text-purple-900 dark:text-purple-100">
                                          Visual Structure:
                                        </h5>
                                        <MermaidRenderer
                                          code={
                                            Array.isArray(
                                              tutorial.reference.syntax_guide
                                                .mermaid_code
                                            )
                                              ? typeof tutorial.reference
                                                  .syntax_guide
                                                  .mermaid_code[0] === "string"
                                                ? tutorial.reference
                                                    .syntax_guide
                                                    .mermaid_code[0]
                                                : tutorial.reference
                                                    .syntax_guide
                                                    .mermaid_code[0]?.code || ""
                                              : typeof tutorial.reference
                                                    .syntax_guide
                                                    .mermaid_code === "string"
                                                ? tutorial.reference
                                                    .syntax_guide.mermaid_code
                                                : tutorial.reference
                                                    .syntax_guide.mermaid_code
                                                    ?.code || ""
                                          }
                                          theme={theme}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Parameters Section */}
                                {tutorial.reference.syntax_guide.parameters &&
                                  tutorial.reference.syntax_guide.parameters
                                    .length > 0 && (
                                    <div className="rounded-xl border border-purple-200 bg-white p-6 dark:border-purple-700 dark:bg-gray-800">
                                      <h4 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                        <Icon
                                          name="book"
                                          className="text-purple-500"
                                          size="sm"
                                        />
                                        Parameters Reference
                                      </h4>
                                      <div className="space-y-4">
                                        {tutorial.reference.syntax_guide.parameters.map(
                                          (param, index) => (
                                            <div
                                              key={index}
                                              className="flex flex-col gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-700 dark:bg-purple-900/20 lg:flex-row lg:items-center lg:gap-4"
                                            >
                                              <div className="flex items-center gap-3">
                                                <Badge
                                                  variant="info"
                                                  size="sm"
                                                  className="font-mono"
                                                >
                                                  {param.name}
                                                </Badge>
                                                {param.required && (
                                                  <Badge
                                                    variant="warning"
                                                    size="sm"
                                                  >
                                                    Required
                                                  </Badge>
                                                )}
                                              </div>
                                              <div className="flex-1">
                                                <p className="text-sm text-purple-800 dark:text-purple-200">
                                                  {param.description}
                                                </p>
                                                {param.type && (
                                                  <p className="mt-1 text-xs text-purple-600 dark:text-purple-400">
                                                    Type: {param.type}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Quick Reference Cards */}
                                <div className="grid gap-4 lg:grid-cols-2">
                                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                                    <h5 className="mb-4 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-100">
                                      <Icon
                                        name="star"
                                        className="text-blue-500"
                                        size="sm"
                                      />
                                      Quick Tips
                                    </h5>
                                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                      <li className="flex items-start gap-2">
                                        <span className="mt-1 text-blue-500">
                                          •
                                        </span>
                                        Practice with small examples first
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="mt-1 text-blue-500">
                                          •
                                        </span>
                                        Test your understanding with variations
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="mt-1 text-blue-500">
                                          •
                                        </span>
                                        Review the examples before coding
                                      </li>
                                    </ul>
                                  </div>

                                  <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
                                    <h5 className="mb-4 flex items-center gap-2 font-semibold text-green-900 dark:text-green-100">
                                      <Icon
                                        name="check"
                                        className="text-green-500"
                                        size="sm"
                                      />
                                      Best Practices
                                    </h5>
                                    <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                                      <li className="flex items-start gap-2">
                                        <span className="mt-1 text-green-500">
                                          •
                                        </span>
                                        Write clean, readable code
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="mt-1 text-green-500">
                                          •
                                        </span>
                                        Use meaningful variable names
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="mt-1 text-green-500">
                                          •
                                        </span>
                                        Comment complex logic
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="py-12 text-center">
                                <Icon
                                  name="puzzle"
                                  className="mx-auto mb-4 text-purple-400"
                                  size="lg"
                                />
                                <p className="text-gray-500 dark:text-gray-400">
                                  No syntax guide available for this tutorial.
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Common Mistakes Tab */}
                        {activeReferenceTab === "mistakes" && (
                          <div className="space-y-4">
                            <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:gap-3 lg:mb-8">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg sm:h-12 sm:w-12">
                                <Icon name="x" size="md" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                                  Common Mistakes & Solutions
                                </h3>
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  Learn from typical pitfalls
                                </p>
                              </div>
                            </div>

                            {tutorial.reference.common_mistakes &&
                            tutorial.reference.common_mistakes.length > 0 ? (
                              <div className="space-y-4 sm:space-y-6">
                                {tutorial.reference.common_mistakes.map(
                                  (mistake, index) => (
                                    <div
                                      key={index}
                                      className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-3 shadow-sm dark:border-red-700 dark:from-red-900/20 dark:to-orange-900/20 sm:p-6"
                                    >
                                      <div className="mb-4 flex items-start gap-3 sm:mb-6 sm:gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white shadow-sm sm:h-12 sm:w-12">
                                          <span className="text-base font-bold sm:text-lg">
                                            {index + 1}
                                          </span>
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="mb-2 text-base font-semibold text-red-900 dark:text-red-100 sm:mb-3 sm:text-lg">
                                            {typeof mistake === "string"
                                              ? mistake
                                              : mistake.mistake}
                                          </h4>

                                          {typeof mistake === "object" &&
                                            mistake.why_wrong && (
                                              <div className="mb-3 rounded-lg border border-red-300 bg-red-100 p-3 dark:border-red-700 dark:bg-red-900/30 sm:mb-4 sm:p-4">
                                                <h5 className="mb-1 flex items-center gap-2 text-xs font-semibold text-red-900 dark:text-red-100 sm:mb-2 sm:text-sm">
                                                  <Icon
                                                    name="x"
                                                    className="text-red-500"
                                                    size="sm"
                                                  />
                                                  Why it&apos;s problematic:
                                                </h5>
                                                <p className="text-xs leading-relaxed text-red-800 dark:text-red-200 sm:text-sm">
                                                  {mistake.why_wrong}
                                                </p>
                                              </div>
                                            )}

                                          {typeof mistake === "object" &&
                                            mistake.correct_approach && (
                                              <div className="rounded-lg border border-green-300 bg-green-100 p-4 dark:border-green-700 dark:bg-green-900/30">
                                                <h5 className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-900 dark:text-green-100">
                                                  <Icon
                                                    name="check"
                                                    className="text-green-500"
                                                    size="sm"
                                                  />
                                                  Correct approach:
                                                </h5>
                                                <p className="text-sm leading-relaxed text-green-800 dark:text-green-200">
                                                  {mistake.correct_approach}
                                                </p>
                                              </div>
                                            )}

                                          {typeof mistake === "object" &&
                                            hasValidMermaidCode(
                                              mistake.mermaid_code
                                            ) && (
                                              <div className="mt-4">
                                                <h5 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                  Visual Explanation:
                                                </h5>
                                                <MermaidRenderer
                                                  code={
                                                    Array.isArray(
                                                      mistake.mermaid_code
                                                    )
                                                      ? typeof mistake
                                                          .mermaid_code[0] ===
                                                        "string"
                                                        ? mistake
                                                            .mermaid_code[0]
                                                        : mistake
                                                            .mermaid_code[0]
                                                            ?.code || ""
                                                      : typeof mistake.mermaid_code ===
                                                          "string"
                                                        ? mistake.mermaid_code
                                                        : mistake.mermaid_code
                                                            ?.code || ""
                                                  }
                                                  theme={theme}
                                                />
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <div className="py-12 text-center">
                                <Icon
                                  name="check"
                                  className="mx-auto mb-4 text-green-500"
                                  size="lg"
                                />
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">
                                    No common mistakes documented for this
                                    tutorial.
                                  </p>
                                  <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                                    This means it&apos;s well-structured or new
                                    content!
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Enhanced Troubleshooting Tips */}
                            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                              <h4 className="mb-6 flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                                <Icon
                                  name="star"
                                  className="text-blue-500"
                                  size="sm"
                                />
                                General Troubleshooting Guide
                              </h4>
                              <div className="grid gap-6 lg:grid-cols-2">
                                <div className="space-y-4">
                                  <h5 className="flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
                                    <Icon
                                      name="search"
                                      className="text-blue-500"
                                      size="sm"
                                    />
                                    Debug Strategy:
                                  </h5>
                                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                    <li className="flex items-start gap-2">
                                      <span className="mt-1 text-blue-500">
                                        •
                                      </span>
                                      Check console for error messages
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="mt-1 text-blue-500">
                                        •
                                      </span>
                                      Verify syntax step by step
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="mt-1 text-blue-500">
                                        •
                                      </span>
                                      Test with simpler examples first
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="mt-1 text-blue-500">
                                        •
                                      </span>
                                      Use debugger tools when available
                                    </li>
                                  </ul>
                                </div>
                                <div className="space-y-4">
                                  <h5 className="flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
                                    <Icon
                                      name="book"
                                      className="text-blue-500"
                                      size="sm"
                                    />
                                    Getting Help:
                                  </h5>
                                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                    <li className="flex items-start gap-2">
                                      <span className="mt-1 text-blue-500">
                                        •
                                      </span>
                                      Review the examples above
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="mt-1 text-blue-500">
                                        •
                                      </span>
                                      Use the interactive lessons
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="mt-1 text-blue-500">
                                        •
                                      </span>
                                      Check official documentation
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="mt-1 text-blue-500">
                                        •
                                      </span>
                                      Practice with variations
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Tab Navigation Buttons */}
                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
                          {(() => {
                            const tabs = [
                              "introduction",
                              "keypoints",
                              "examples",
                              "syntax",
                              "mistakes",
                            ]
                            const currentIndex =
                              tabs.indexOf(activeReferenceTab)
                            const isFirst = currentIndex === 0
                            const isLast = currentIndex === tabs.length - 1
                            const nextTab = tabs[currentIndex + 1]
                            const prevTab = tabs[currentIndex - 1]

                            const getTabLabel = (tabId: string) => {
                              const tabMap = {
                                introduction: "Introduction",
                                keypoints: "Key Points",
                                examples: "Code Examples",
                                syntax: "Syntax Guide",
                                mistakes: "Common Issues",
                              }
                              return (
                                tabMap[tabId as keyof typeof tabMap] || tabId
                              )
                            }

                            return (
                              <>
                                {/* Previous Tab Button */}
                                {!isFirst ? (
                                  <Button
                                    variant="outline"
                                    size="md"
                                    onClick={() => handleTabChange(prevTab)}
                                    icon={<Icon name="chevronLeft" size="sm" />}
                                    className="flex-shrink-0"
                                  >
                                    <span className="hidden sm:inline">
                                      Previous:{" "}
                                    </span>
                                    {getTabLabel(prevTab)}
                                  </Button>
                                ) : (
                                  <div /> // Spacer
                                )}

                                {/* Next Tab Button */}
                                {!isLast ? (
                                  <Button
                                    variant="primary"
                                    size="md"
                                    onClick={() => handleTabChange(nextTab)}
                                    icon={
                                      <Icon name="chevronRight" size="sm" />
                                    }
                                    className="flex-shrink-0"
                                  >
                                    <span className="hidden sm:inline">
                                      Next:{" "}
                                    </span>
                                    {getTabLabel(nextTab)}
                                  </Button>
                                ) : (
                                  <Button
                                    variant="primary"
                                    size="md"
                                    onClick={handleStartLessons}
                                    icon={<Icon name="star" size="sm" />}
                                    className="flex-shrink-0"
                                  >
                                    <span className="hidden sm:inline">
                                      Ready?{" "}
                                    </span>
                                    Start Learning
                                  </Button>
                                )}
                              </>
                            )
                          })()}
                        </div>

                        {/* Huge Learn Interactively Button */}
                        <div className="mt-12 rounded-b-lg border-t-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 pb-6 pt-8 dark:border-blue-800 dark:from-blue-900/20 dark:to-purple-900/20">
                          <div className="text-center">
                            <div className="mb-4 flex justify-center">
                              <div className="rounded-full bg-blue-100 p-3 shadow-lg dark:bg-blue-900/30">
                                <Icon
                                  name="star"
                                  className="text-blue-600 dark:text-blue-400"
                                  size="lg"
                                />
                              </div>
                            </div>
                            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                              Ready to Start Learning?
                            </h3>
                            <p className="mb-8 text-gray-600 dark:text-gray-400">
                              {recommendedAction.message}
                            </p>
                            <Button
                              onClick={handleStartLessons}
                              variant="primary"
                              size="xl"
                              icon={<Icon name="star" size="md" />}
                              className="hover:shadow-3xl min-h-[4rem] transform bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 sm:px-12 sm:text-xl"
                              fullWidth
                            >
                              Learn Interactively
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="mb-4 text-gray-500 dark:text-gray-400">
                        No reference content available for this tutorial.
                      </p>
                      {/* Huge Learn Interactively Button for No Content */}
                      <div className="mt-8">
                        <Button
                          onClick={handleStartLessons}
                          variant="primary"
                          size="xl"
                          icon={<Icon name="star" size="md" />}
                          className="hover:shadow-3xl min-h-[4rem] transform bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 sm:px-12 sm:text-xl"
                          fullWidth
                        >
                          Learn Interactively
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Lesson Content */
                <div>
                  <div className="p-4 sm:p-6 lg:p-8">
                    {currentLesson ? (
                      <div>
                        <div className="mb-6 flex items-center justify-between">
                          <div>
                            <h1 className="mb-2 flex items-start gap-2 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                              {currentLesson.type === "concept" && (
                                <Icon
                                  name="book"
                                  className="mt-1 text-blue-500"
                                  size="sm"
                                />
                              )}
                              {currentLesson.type === "mcq" && (
                                <Icon
                                  name="quiz"
                                  className="mt-1 text-green-500"
                                  size="sm"
                                />
                              )}
                              {currentLesson.type ===
                                "codeblock_rearranging" && (
                                <Icon
                                  name="puzzle"
                                  className="mt-1 text-purple-500"
                                  size="sm"
                                />
                              )}
                              {currentLesson.type === "fill_in_blanks" && (
                                <Icon
                                  name="edit"
                                  className="mt-1 text-orange-500"
                                  size="sm"
                                />
                              )}
                              <span className="leading-tight">
                                Lesson {currentLessonIndex + 1}:{" "}
                                {currentLesson.title}
                              </span>
                            </h1>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBackToReference}
                            icon={<Icon name="chevronLeft" size="sm" />}
                            className="hidden sm:flex"
                          >
                            Back to Reference
                          </Button>
                        </div>

                        {/* Learning Objectives */}
                        {currentLesson.learningObjectives &&
                          currentLesson.learningObjectives.length > 0 && (
                            <div className="mb-4">
                              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                <Icon
                                  name="quiz"
                                  className="text-blue-500"
                                  size="sm"
                                />
                                Learning Objectives:
                              </h3>
                              <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                {currentLesson.learningObjectives.map(
                                  (obj, index) => (
                                    <li key={index}>
                                      {typeof obj === "string"
                                        ? obj
                                        : obj.objective}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* Lesson Content */}
                        <div className="mb-6">
                          {currentLesson.type === "concept" &&
                            currentLesson.conceptData && (
                              <ConceptLesson
                                data={currentLesson.conceptData}
                                lessonTitle={currentLesson.title}
                              />
                            )}

                          {currentLesson.type === "mcq" &&
                            currentLesson.mcqData && (
                              <MCQLesson
                                data={currentLesson.mcqData}
                                lessonTitle={currentLesson.title}
                              />
                            )}

                          {currentLesson.type === "codeblock_rearranging" &&
                            currentLesson.codeRearrangeData && (
                              <CodeRearrangeLesson
                                data={currentLesson.codeRearrangeData}
                                lessonTitle={currentLesson.title}
                              />
                            )}

                          {currentLesson.type === "fill_in_blanks" &&
                            currentLesson.fibData && (
                              <FillBlanksLesson
                                data={currentLesson.fibData}
                                lessonTitle={currentLesson.title}
                              />
                            )}

                          {/* Fallback for unknown lesson types */}
                          {![
                            "concept",
                            "mcq",
                            "codeblock_rearranging",
                            "fill_in_blanks",
                          ].includes(currentLesson.type) && (
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
                              <div className="flex items-start gap-3">
                                <span className="text-lg text-yellow-500">
                                  ⚠️
                                </span>
                                <div>
                                  <h3 className="mb-2 font-medium text-yellow-900 dark:text-yellow-100">
                                    Unknown Lesson Type
                                  </h3>
                                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    This lesson type &quot;{currentLesson.type}
                                    &quot; is not yet supported. Please contact
                                    support if you believe this is an error.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                          No lesson content available
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Navigation Controls */}
                  <div className="border-t border-gray-200 p-4 dark:border-gray-700 sm:p-6">
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={handlePreviousLesson}
                        disabled={currentLessonIndex === 0}
                        icon={<Icon name="chevronLeft" size="sm" />}
                        className="w-full sm:w-auto"
                        aria-label="Go to previous lesson"
                      >
                        Previous Lesson
                      </Button>

                      <Badge
                        variant="info"
                        size="md"
                        className="order-first sm:order-none"
                      >
                        {currentLessonIndex + 1} of{" "}
                        {tutorial.lessons?.length || 0}
                      </Badge>

                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleNextLesson}
                        disabled={
                          currentLessonIndex >=
                          (tutorial.lessons?.length || 0) - 1
                        }
                        icon={<Icon name="chevronRight" size="sm" />}
                        className="w-full sm:w-auto"
                        aria-label="Go to next lesson"
                      >
                        Next Lesson
                      </Button>
                    </div>

                    {/* Mobile Quick Actions */}
                    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700 lg:hidden">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={handleBackToReference}
                        icon={<Icon name="home" size="sm" />}
                        fullWidth
                        className="min-h-[44px] touch-manipulation text-sm font-medium"
                      >
                        Back to Reference
                      </Button>
                      {/* Temporarily hidden - Local storage features
                      <Button icon={<Icon name="bookmark" />}>Bookmark</Button>
                      <Button icon={<Icon name="notes" />}>Notes</Button>
                      */}
                    </div>
                  </div>
                </div>
              )}
            </article>
          </section>
        </div>
      </div>

      {/* Bookmark & Notes Panel - Temporarily hidden */}
      {/* {showBookmarkPanel && (
        <BookmarkNotesPanel
          tutorialId={tutorial.id.toString()}
          tutorialTitle={tutorial.title}
          onClose={() => setShowBookmarkPanel(false)}
        />
      )} */}

      {/* Lesson Info Modal */}
      {showLessonInfo && (
        <Modal
          isOpen={!!showLessonInfo}
          onClose={() => setShowLessonInfo(null)}
          title="Lesson Information"
          size="md"
        >
          <div className="space-y-4">
            {showLessonInfo &&
              tutorial.lessons &&
              (() => {
                const lesson =
                  tutorial.lessons.find((l) => l.id === showLessonInfo) ||
                  tutorial.lessons.find((l) => l.type === showLessonInfo)

                if (!lesson) return <p>Lesson not found</p>

                const typeInfo = formatLessonType(lesson.type)

                return (
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <Icon
                        name={
                          lesson.type === "concept"
                            ? "book"
                            : lesson.type === "mcq"
                              ? "quiz"
                              : lesson.type === "codeblock_rearranging"
                                ? "puzzle"
                                : "edit"
                        }
                        className={typeInfo.color}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {lesson.title}
                        </h3>
                        <p className={`text-sm ${typeInfo.color}`}>
                          {typeInfo.label}
                        </p>
                      </div>
                    </div>

                    {lesson.learningObjectives && (
                      <div>
                        <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                          Learning Objectives
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {lesson.learningObjectives.map((obj, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Icon
                                name="check"
                                size="sm"
                                className="mt-0.5 text-green-600"
                              />
                              {typeof obj === "string" ? obj : obj.objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })()}
          </div>
        </Modal>
      )}
    </main>
  )
}

export default TutorialPageContainer
