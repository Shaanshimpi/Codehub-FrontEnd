"use client"

import React, { useMemo, useState } from "react"
import { Language } from "@/app/Learn/types/TutorialTypes"
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Filter,
  Loader2,
  Lock,
  Plus,
  Search,
  Trash2,
  Unlock,
  X,
} from "lucide-react"
import { Tutorial, useTutorials } from "../hooks/useTutorials"

interface TutorialListProps {
  languages: Language[]
  onEdit: (tutorial: Tutorial) => void
  onCreate: () => void
}

type SortField = "title" | "difficulty" | "createdAt" | "updatedAt" | "index"
type SortOrder = "asc" | "desc"

const TutorialList: React.FC<TutorialListProps> = ({
  languages,
  onEdit,
  onCreate,
}) => {
  // State management
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("index")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [selectedTutorials, setSelectedTutorials] = useState<Set<string>>(
    new Set()
  )
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  // Build sort string for API
  const sortString = useMemo(() => {
    return `${sortOrder === "desc" ? "-" : ""}${sortField}`
  }, [sortField, sortOrder])

  // Fetch tutorials with current filters
  const {
    tutorials,
    loading,
    error,
    totalDocs,
    refetch,
    deleteTutorial,
    bulkDelete,
    bulkUpdate,
  } = useTutorials({
    programmingLanguage:
      selectedLanguage === "all" ? undefined : selectedLanguage,
    search: searchQuery || undefined,
    sort: sortString,
    limit: 50, // Show more tutorials per page for admin
  })

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  // Handle tutorial selection
  const handleSelectTutorial = (tutorialId: string) => {
    const newSelected = new Set(selectedTutorials)
    if (newSelected.has(tutorialId)) {
      newSelected.delete(tutorialId)
    } else {
      newSelected.add(tutorialId)
    }
    setSelectedTutorials(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedTutorials.size === tutorials.length) {
      setSelectedTutorials(new Set())
    } else {
      setSelectedTutorials(new Set(tutorials.map((t) => t.id)))
    }
  }

  // Handle individual actions
  const handleDelete = async (tutorial: Tutorial) => {
    if (confirm(`Are you sure you want to delete "${tutorial.title}"?`)) {
      try {
        await deleteTutorial(tutorial.id)
      } catch (err) {
        alert("Failed to delete tutorial")
      }
    }
  }

  // Handle bulk actions
  const handleBulkDelete = async () => {
    if (selectedTutorials.size === 0) return

    if (
      confirm(
        `Are you sure you want to delete ${selectedTutorials.size} tutorial(s)?`
      )
    ) {
      setBulkActionLoading(true)
      try {
        await bulkDelete(Array.from(selectedTutorials))
        setSelectedTutorials(new Set())
        setShowBulkActions(false)
      } catch (err) {
        alert("Failed to delete tutorials")
      } finally {
        setBulkActionLoading(false)
      }
    }
  }

  const handleBulkLockToggle = async (locked: boolean) => {
    if (selectedTutorials.size === 0) return

    setBulkActionLoading(true)
    try {
      await bulkUpdate(Array.from(selectedTutorials), { isLocked: locked })
      setSelectedTutorials(new Set())
      setShowBulkActions(false)
    } catch (err) {
      alert("Failed to update tutorials")
    } finally {
      setBulkActionLoading(false)
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "1":
        return "Beginner"
      case "2":
        return "Intermediate"
      case "3":
        return "Advanced"
      default:
        return "Unknown"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "1":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "2":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "3":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-slate-600 dark:text-slate-400">
          Loading tutorials...
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <p className="text-red-800 dark:text-red-200">Error: {error}</p>
        <button
          onClick={refetch}
          className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Tutorials ({totalDocs})
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage programming tutorials and lessons
          </p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create Tutorial
        </button>
      </div>

      {/* Language Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedLanguage("all")}
            className={`border-b-2 px-1 py-2 text-sm font-medium ${
              selectedLanguage === "all"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            All Languages
          </button>
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => setSelectedLanguage(language.id.toString())}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                selectedLanguage === language.id.toString()
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              {language.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-slate-900 placeholder-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
          />
        </div>

        {selectedTutorials.size > 0 && (
          <button
            onClick={() => setShowBulkActions(!showBulkActions)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Filter className="h-4 w-4" />
            Bulk Actions ({selectedTutorials.size})
          </button>
        )}
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && selectedTutorials.size > 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-3 text-sm font-medium text-slate-900 dark:text-white">
            Bulk Actions ({selectedTutorials.size} selected)
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkLockToggle(true)}
              disabled={bulkActionLoading}
              className="flex items-center gap-2 rounded-lg bg-yellow-600 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              Lock Selected
            </button>
            <button
              onClick={() => handleBulkLockToggle(false)}
              disabled={bulkActionLoading}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              <Unlock className="h-4 w-4" />
              Unlock Selected
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkActionLoading}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </button>
            <button
              onClick={() => setShowBulkActions(false)}
              disabled={bulkActionLoading}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tutorial Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      tutorials.length > 0 &&
                      selectedTutorials.size === tutorials.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                  />
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400"
                  onClick={() => handleSort("index")}
                >
                  <div className="flex items-center gap-1">
                    Order
                    <SortIcon field="index" />
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-1">
                    Title
                    <SortIcon field="title" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Language
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400"
                  onClick={() => handleSort("difficulty")}
                >
                  <div className="flex items-center gap-1">
                    Difficulty
                    <SortIcon field="difficulty" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Lessons
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400"
                  onClick={() => handleSort("updatedAt")}
                >
                  <div className="flex items-center gap-1">
                    Updated
                    <SortIcon field="updatedAt" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
              {tutorials.map((tutorial) => (
                <tr
                  key={tutorial.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTutorials.has(tutorial.id)}
                      onChange={() => handleSelectTutorial(tutorial.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    {tutorial.index}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {tutorial.title}
                      </div>
                      <div className="max-w-xs truncate text-sm text-slate-500 dark:text-slate-400">
                        {tutorial.description}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {tutorial.programmingLanguage.title}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}
                    >
                      {getDifficultyLabel(tutorial.difficulty)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900 dark:text-white">
                    {tutorial.lessons?.length || 0} lessons
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {tutorial.isLocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        <Lock className="h-3 w-3" />
                        Locked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <Unlock className="h-3 w-3" />
                        Open
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(tutorial.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(tutorial)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tutorial)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {tutorials.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            {searchQuery || selectedLanguage !== "all"
              ? "No tutorials found matching your filters."
              : "No tutorials created yet."}
          </p>
          <button
            onClick={onCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create Your First Tutorial
          </button>
        </div>
      )}
    </div>
  )
}

export default TutorialList
