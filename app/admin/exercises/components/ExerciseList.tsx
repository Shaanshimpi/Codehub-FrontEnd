/* eslint-disable jsx-a11y/label-has-associated-control, no-console */
"use client"

import React, { useEffect, useState } from "react"
import { deleteExercise, deleteMultipleExercises } from "@/lib/deleteData"
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
import { DIFFICULTY_LEVELS } from "../constants"
import { ExerciseFilters } from "../hooks/useExerciseFilters"
import { AdminExercise } from "../types"
import EditExerciseModal from "./EditExerciseModal"
import ExercisePreview from "./ExercisePreview"

/* eslint-disable jsx-a11y/label-has-associated-control, no-console */

interface ExerciseListProps {
  filters: ExerciseFilters
  refreshTrigger?: number
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  filters,
  refreshTrigger,
}) => {
  const [exercises, setExercises] = useState<AdminExercise[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedExercises, setSelectedExercises] = useState<number[]>([])
  const [previewExercise, setPreviewExercise] = useState<AdminExercise | null>(
    null
  )
  const [editingExercise, setEditingExercise] = useState<AdminExercise | null>(
    null
  )
  const [deleteConfirm, setDeleteConfirm] = useState<{
    exercise: AdminExercise | null
    isMultiple: boolean
  }>({ exercise: null, isMultiple: false })
  const [deleting, setDeleting] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

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
        setExercises([])
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [refreshTrigger])

  const filteredExercises = exercises.filter((exercise) => {
    const title = exercise.title_en?.toLowerCase() || ""
    const language = exercise.programmingLanguage?.title?.toLowerCase() || ""
    const tutorial = exercise.tutorial?.title?.toLowerCase() || ""
    const search = filters.searchTerm.toLowerCase()

    // Search filter
    const matchesSearch =
      title.includes(search) ||
      language.includes(search) ||
      tutorial.includes(search)

    // Language filter
    const matchesLanguage =
      filters.selectedLanguage === null ||
      exercise.programmingLanguage?.id === filters.selectedLanguage

    // Tutorial filter
    const matchesTutorial =
      filters.selectedTutorial === null ||
      exercise.tutorial?.id === filters.selectedTutorial

    // Difficulty filter
    const matchesDifficulty =
      filters.difficultyLevel === null ||
      exercise.difficultyLevel === filters.difficultyLevel

    // Status filter
    const matchesStatus =
      filters.statusFilter === null ||
      (filters.statusFilter === "free" && !exercise.isLocked) ||
      (filters.statusFilter === "premium" && exercise.isLocked)

    return (
      matchesSearch &&
      matchesLanguage &&
      matchesTutorial &&
      matchesDifficulty &&
      matchesStatus
    )
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
  }, [filters])

  const getDifficultyDisplay = (level: number) => {
    const difficulty = DIFFICULTY_LEVELS.find((d) => d.value === level)
    return (
      difficulty || { label: "Unknown", color: "bg-slate-100 text-slate-800" }
    )
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

  const handlePreviewExercise = (exercise: AdminExercise) => {
    setPreviewExercise(exercise)
  }

  const handleClosePreview = () => {
    setPreviewExercise(null)
  }

  const handleEditExercise = (exercise: AdminExercise) => {
    setEditingExercise(exercise)
  }

  const handleCloseEdit = () => {
    setEditingExercise(null)
  }

  const handleSaveEdit = async (updatedExercise: any) => {
    try {
      console.log("Saving updated exercise:", updatedExercise)

      // Update local state
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === updatedExercise.id ? { ...ex, ...updatedExercise } : ex
        )
      )

      handleCloseEdit()
    } catch (error) {
      console.error("Error updating exercise:", error)
    }
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      if (deleteConfirm.isMultiple) {
        // Delete multiple exercises
        console.log("Deleting exercises:", selectedExercises)

        const results = await deleteMultipleExercises(selectedExercises)

        // Update local state - remove only successfully deleted exercises
        setExercises((prev) =>
          prev.filter((ex) => !results.successful.includes(ex.id))
        )
        setSelectedExercises([])

        if (results.failed.length > 0) {
          const failedCount = results.failed.length
          const successCount = results.successful.length
          alert(
            `⚠️ Partial success: ${successCount} exercise(s) deleted, ${failedCount} failed. Check console for details.`
          )
        } else {
          // Show success message
          console.log(
            `✅ Successfully deleted ${results.successful.length} exercises`
          )
        }
      } else if (deleteConfirm.exercise) {
        // Delete single exercise
        console.log("Deleting exercise:", deleteConfirm.exercise.id)

        await deleteExercise(deleteConfirm.exercise.id)

        // Update local state
        setExercises((prev) =>
          prev.filter((ex) => ex.id !== deleteConfirm.exercise!.id)
        )

        console.log(`✅ Deleted exercise: ${deleteConfirm.exercise.title_en}`)
      }
    } catch (error) {
      console.error("❌ Error deleting exercise(s):", error)
      alert(
        `❌ Failed to delete exercise(s). ${error instanceof Error ? error.message : "Unknown error occurred"}`
      )
    } finally {
      setDeleting(false)
      setDeleteConfirm({ exercise: null, isMultiple: false })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ exercise: null, isMultiple: false })
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading exercises...
          </p>
        </div>
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto mb-3 h-12 w-12 text-slate-400" />
          <h3 className="mb-1 text-sm font-medium text-slate-900 dark:text-white">
            No exercises yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create your first exercise to get started.
          </p>
        </div>
      </div>
    )
  }

  if (filteredExercises.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-slate-400" />
          <h3 className="mb-1 text-sm font-medium text-slate-900 dark:text-white">
            No exercises match your filters
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, filteredExercises.length)} of{" "}
          {filteredExercises.length} exercises
        </p>

        {selectedExercises.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {selectedExercises.length} selected
            </span>
            <button
              onClick={() =>
                setDeleteConfirm({ exercise: null, isMultiple: true })
              }
              className="flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
            >
              <Trash2 className="h-3 w-3" />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Exercise Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    paginatedExercises.length > 0 &&
                    selectedExercises.length === paginatedExercises.length
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Difficulty
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Language
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tutorial
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Created
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
            {paginatedExercises.map((exercise) => {
              const difficulty = getDifficultyDisplay(exercise.difficultyLevel)

              return (
                <tr
                  key={exercise.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedExercises.includes(exercise.id)}
                      onChange={() => handleSelectExercise(exercise.id)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Code className="mr-2 h-4 w-4 text-slate-400" />
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {exercise.title_en}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          /{exercise.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${difficulty.color}`}
                    >
                      {difficulty.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-900 dark:text-white">
                      {exercise.programmingLanguage?.title}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-900 dark:text-white">
                      {exercise.tutorial?.title}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {exercise.isLocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                        <Lock className="h-3 w-3" />
                        Premium
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <Unlock className="h-3 w-3" />
                        Free
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(exercise.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handlePreviewExercise(exercise)}
                        className="rounded p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditExercise(exercise)}
                        className="rounded p-1 text-slate-400 hover:text-green-600 dark:hover:text-green-400"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({ exercise, isMultiple: false })
                        }
                        className="rounded p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-slate-600"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-slate-600"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewExercise && (
        <ExercisePreview
          exerciseData={previewExercise}
          onClose={handleClosePreview}
          onSave={() => {}}
          onEdit={() => {
            handleClosePreview()
            handleEditExercise(previewExercise)
          }}
          isLoading={false}
        />
      )}

      {/* Edit Modal */}
      {editingExercise && (
        <EditExerciseModal
          exercise={editingExercise}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {(deleteConfirm.exercise || deleteConfirm.isMultiple) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {deleteConfirm.isMultiple
                    ? "Delete Exercises"
                    : "Delete Exercise"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
              {deleteConfirm.isMultiple
                ? `Are you sure you want to delete ${selectedExercises.length} selected exercise${selectedExercises.length === 1 ? "" : "s"}?`
                : `Are you sure you want to delete "${deleteConfirm.exercise?.title_en}"?`}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    {deleteConfirm.isMultiple
                      ? `Delete ${selectedExercises.length}`
                      : "Delete"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExerciseList
