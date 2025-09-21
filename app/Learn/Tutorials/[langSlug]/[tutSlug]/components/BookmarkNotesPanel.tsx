"use client"

import React, { useState } from "react"
import { useTutorialProgress } from "../hooks/useTutorialProgress"

interface BookmarkNotesPanelProps {
  tutorialId: string
  tutorialTitle: string
  onClose: () => void
}

const BookmarkNotesPanel: React.FC<BookmarkNotesPanelProps> = ({
  tutorialId,
  tutorialTitle,
  onClose,
}) => {
  const { progress, toggleBookmark, updateNotes, getProgressStats } =
    useTutorialProgress(tutorialId, 1)
  const [localNotes, setLocalNotes] = useState(progress.notes)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const stats = getProgressStats()

  const handleNotesChange = (value: string) => {
    setLocalNotes(value)
    setHasUnsavedChanges(value !== progress.notes)
  }

  const saveNotes = () => {
    updateNotes(localNotes)
    setHasUnsavedChanges(false)
  }

  const discardChanges = () => {
    setLocalNotes(progress.notes)
    setHasUnsavedChanges(false)
  }

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              📚 {tutorialTitle}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Bookmarks & Notes
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
          {/* Progress Stats */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              📊 Progress Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.progressPercentage}%
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  Complete
                </div>
              </div>
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.completedCount}/{stats.totalLessons}
                </div>
                <div className="text-sm text-green-800 dark:text-green-200">
                  Lessons
                </div>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatTime(stats.totalTimeSpent)}
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-200">
                  Time Spent
                </div>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.averageScore || "--"}%
                </div>
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  Avg Score
                </div>
              </div>
            </div>
          </div>

          {/* Bookmark Section */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              🔖 Bookmark
            </h3>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Save this tutorial for later
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bookmarked tutorials appear in your learning dashboard
                </p>
              </div>
              <button
                onClick={toggleBookmark}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  stats.isBookmarked
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                }`}
              >
                {stats.isBookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}
              </button>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              📝 Personal Notes
            </h3>
            <div className="space-y-4">
              <textarea
                value={localNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Write your personal notes about this tutorial here..."
                className="h-32 w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />

              {hasUnsavedChanges && (
                <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/20">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">⚠️</span>
                    <span className="text-sm text-orange-800 dark:text-orange-200">
                      You have unsaved changes
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={discardChanges}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Discard
                    </button>
                    <button
                      onClick={saveNotes}
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {!hasUnsavedChanges && stats.hasNotes && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <span>✅</span>
                  <span>Notes saved</span>
                </div>
              )}
            </div>
          </div>

          {/* Learning Streaks & Achievements */}
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              🏆 Learning Insights
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <span className="text-xl text-blue-500">📅</span>
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Last studied:{" "}
                    {new Date(progress.lastAccessed).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Keep up the momentum!
                  </p>
                </div>
              </div>

              {stats.progressPercentage >= 100 && (
                <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                  <span className="text-xl text-green-500">🎉</span>
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Tutorial Completed!
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Congratulations on finishing this tutorial
                    </p>
                  </div>
                </div>
              )}

              {stats.averageScore >= 80 && stats.averageScore < 100 && (
                <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                  <span className="text-xl text-purple-500">⭐</span>
                  <div>
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      Excellent Performance!
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      You&apos;re scoring above 80% on average
                    </p>
                  </div>
                </div>
              )}

              {stats.totalTimeSpent >= 3600000 && (
                <div className="flex items-center gap-3 rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
                  <span className="text-xl text-orange-500">⏰</span>
                  <div>
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                      Dedicated Learner!
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      You&apos;ve spent over an hour learning
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-700">
          {hasUnsavedChanges && (
            <button
              onClick={saveNotes}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Save Notes
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookmarkNotesPanel
