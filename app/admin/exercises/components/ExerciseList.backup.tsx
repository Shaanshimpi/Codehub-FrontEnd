/* eslint-disable jsx-a11y/label-has-associated-control, no-console */
"use client"

import React, { useEffect, useState } from "react"
import { getAllExercises } from "@/lib/getData"
import {
  AlertTriangle,
  BookOpen,
  Code,
  Edit,
  Eye,
  Lock,
  Trash2,
  Unlock,
} from "lucide-react"
import EditExerciseModal from "./EditExerciseModal"
import ExercisePreview from "./ExercisePreview"

/* eslint-disable jsx-a11y/label-has-associated-control, no-console */

/* eslint-disable jsx-a11y/label-has-associated-control, no-console */

interface Exercise {
  id: number
  title_en: string
  slug: string
  difficultyLevel: number
  programmingLanguage: { id: number; title: string; slug: string }
  tutorial: { id: number; title: string; slug: string }
  isLocked: boolean
  createdAt: string
  updatedAt: string
}

interface ExerciseListProps {
  searchTerm: string
  refreshTrigger?: number // Optional prop to trigger refresh
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  searchTerm,
  refreshTrigger,
}) => {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedExercises, setSelectedExercises] = useState<number[]>([])
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    exercise: Exercise | null
    isMultiple: boolean
  }>({ exercise: null, isMultiple: false })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Filter state
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  // Load exercises from database
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        console.log("🔄 Fetching exercises...")
        const exercisesData = await getAllExercises()
        console.log("✅ Exercises fetched:", exercisesData)
        setExercises(exercisesData || [])
      } catch (error) {
        console.error("❌ Error loading exercises:", error)
        // Set empty array on error instead of keeping loading state
        setExercises([])
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [refreshTrigger]) // Re-fetch when refreshTrigger changes

  const filteredExercises = exercises.filter((exercise) => {
    const title = exercise.title_en?.toLowerCase() || ""
    const language = exercise.programmingLanguage?.title?.toLowerCase() || ""
    const tutorial = exercise.tutorial?.title?.toLowerCase() || ""
    const search = searchTerm.toLowerCase()

    // Search filter
    const matchesSearch =
      title.includes(search) ||
      language.includes(search) ||
      tutorial.includes(search)

    // Difficulty filter
    const matchesDifficulty =
      difficultyFilter === null || exercise.difficultyLevel === difficultyFilter

    // Status filter
    const matchesStatus =
      statusFilter === null ||
      (statusFilter === "free" && !exercise.isLocked) ||
      (statusFilter === "premium" && exercise.isLocked)

    return matchesSearch && matchesDifficulty && matchesStatus
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredExercises.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedExercises = filteredExercises.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, difficultyFilter, statusFilter])

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1:
        return {
          label: "Beginner",
          color:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        }
      case 2:
        return {
          label: "Intermediate",
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        }
      case 3:
        return {
          label: "Advanced",
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        }
      default:
        return {
          label: "Unknown",
          color:
            "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSelectExercise = (id: number) => {
    setSelectedExercises((prev) =>
      prev.includes(id)
        ? prev.filter((exerciseId) => exerciseId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedExercises.length === paginatedExercises.length) {
      setSelectedExercises([])
    } else {
      setSelectedExercises(paginatedExercises.map((exercise) => exercise.id))
    }
  }

  const handlePreviewExercise = (exercise: Exercise) => {
    setPreviewExercise(exercise)
  }

  const handleClosePreview = () => {
    setPreviewExercise(null)
  }

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise)
  }

  const handleCloseEdit = () => {
    setEditingExercise(null)
  }

  const handleSaveEdit = async (updatedExercise: any) => {
    try {
      // TODO: Implement API call to update exercise
      console.log("Saving updated exercise:", updatedExercise)

      // Update local state
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === updatedExercise.id ? { ...ex, ...updatedExercise } : ex
        )
      )

      setEditingExercise(null)
    } catch (error) {
      console.error("Error saving exercise:", error)
    }
  }

  const handleDeleteExercise = (exercise: Exercise) => {
    setDeleteConfirm({ exercise, isMultiple: false })
  }

  const handleBulkDelete = () => {
    setDeleteConfirm({ exercise: null, isMultiple: true })
  }

  const confirmDelete = async () => {
    try {
      if (deleteConfirm.isMultiple) {
        // TODO: Implement bulk delete API call
        console.log("Bulk deleting exercises:", selectedExercises)
        setExercises((prev) =>
          prev.filter((ex) => !selectedExercises.includes(ex.id))
        )
        setSelectedExercises([])
      } else if (deleteConfirm.exercise) {
        // TODO: Implement single delete API call
        console.log("Deleting exercise:", deleteConfirm.exercise.id)
        setExercises((prev) =>
          prev.filter((ex) => ex.id !== deleteConfirm.exercise?.id)
        )
      }
      setDeleteConfirm({ exercise: null, isMultiple: false })
    } catch (error) {
      console.error("Error deleting exercise:", error)
    }
  }

  const handleBulkEdit = () => {
    // TODO: Implement bulk edit functionality
    console.log("Bulk editing exercises:", selectedExercises)
    alert("Bulk edit functionality will be implemented soon!")
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-3 rounded-md border border-slate-200 p-3 dark:border-slate-700"
            >
              <div className="h-3 w-3 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-2 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Difficulty:
          </label>
          <select
            value={difficultyFilter || ""}
            onChange={(e) =>
              setDifficultyFilter(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="">All</option>
            <option value="1">Beginner</option>
            <option value="2">Intermediate</option>
            <option value="3">Advanced</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Status:
          </label>
          <select
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="">All</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div className="ml-auto text-xs text-slate-500 dark:text-slate-400">
          {filteredExercises.length} of {exercises.length} exercises
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedExercises.length > 0 && (
        <div className="mb-3 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
              {selectedExercises.length} exercise
              {selectedExercises.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleBulkEdit}
                className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
              >
                Bulk Edit
              </button>
              <button
                onClick={handleBulkDelete}
                className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercises Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="px-3 py-2 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedExercises.length === paginatedExercises.length &&
                    paginatedExercises.length > 0
                  }
                  onChange={handleSelectAll}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                Exercise
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                Language
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                Tutorial
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                Difficulty
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                Created
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedExercises.map((exercise) => {
              const difficulty = getDifficultyLabel(exercise.difficultyLevel)

              return (
                <tr
                  key={exercise.id}
                  className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                >
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={selectedExercises.includes(exercise.id)}
                      onChange={() => handleSelectExercise(exercise.id)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>

                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                        <Code className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {exercise.title_en || "Untitled Exercise"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {exercise.slug || "no-slug"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-2.5">
                    <span className="text-sm text-slate-900 dark:text-white">
                      {exercise.programmingLanguage?.title ||
                        "Unknown Language"}
                    </span>
                  </td>

                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3 w-3 text-slate-400" />
                      <span className="text-sm text-slate-900 dark:text-white">
                        {exercise.tutorial?.title || "Unknown Tutorial"}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${difficulty.color}`}
                    >
                      {difficulty.label}
                    </span>
                  </td>

                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      {exercise.isLocked ? (
                        <>
                          <Lock className="h-3 w-3 text-amber-500" />
                          <span className="text-xs text-amber-600 dark:text-amber-400">
                            Premium
                          </span>
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Free
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400">
                    {exercise.createdAt
                      ? formatDate(exercise.createdAt)
                      : "Unknown"}
                  </td>

                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePreviewExercise(exercise)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Preview Exercise"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleEditExercise(exercise)}
                        className="p-1.5 text-slate-400 hover:text-green-600 dark:hover:text-green-400"
                        title="Edit Exercise"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExercise(exercise)}
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                        title="Delete Exercise"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {paginatedExercises.length === 0 && !loading && (
          <div className="py-8 text-center">
            <Code className="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-600" />
            <h3 className="mb-1 text-base font-medium text-slate-900 dark:text-white">
              {filteredExercises.length === 0
                ? searchTerm || difficultyFilter || statusFilter
                  ? "No exercises found"
                  : "No exercises yet"
                : "No exercises on this page"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filteredExercises.length === 0
                ? searchTerm || difficultyFilter || statusFilter
                  ? "Try adjusting your filters"
                  : "Create your first exercise to get started"
                : "Try a different page"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, filteredExercises.length)} of{" "}
            {filteredExercises.length} exercises
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`rounded-md px-2 py-1 text-xs ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Exercise Preview Modal */}
      {previewExercise && (
        <ExercisePreview
          exerciseData={{
            ...previewExercise,
            programmingLanguageTitle:
              previewExercise.programmingLanguage?.title || "Unknown Language",
            tutorialTitle:
              previewExercise.tutorial?.title || "Unknown Tutorial",
          }}
          onClose={handleClosePreview}
        />
      )}

      {/* Edit Exercise Modal */}
      {editingExercise && (
        <EditExerciseModal
          exercise={editingExercise}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.exercise ||
        (deleteConfirm.isMultiple && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-slate-800">
              <div className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {deleteConfirm.isMultiple
                        ? "Delete Selected Exercises"
                        : "Delete Exercise"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {deleteConfirm.isMultiple
                        ? `Are you sure you want to delete ${selectedExercises.length} selected exercises?`
                        : `Are you sure you want to delete "${deleteConfirm.exercise?.title_en}"?`}
                    </p>
                  </div>
                </div>

                <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
                  This action cannot be undone.
                </p>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() =>
                      setDeleteConfirm({ exercise: null, isMultiple: false })
                    }
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  >
                    Delete {deleteConfirm.isMultiple ? "Selected" : "Exercise"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default ExerciseList
