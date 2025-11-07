"use client"

import React, { useCallback, useMemo, useState } from "react"
import ExerciseCard from "@/app/Learn/Exercise/components/ExerciseCard"
import { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import { usePathname } from "next/navigation"

type TutorialWithExercises = Tutorial & {
  exercises?: any[]
}

interface LanguageExercisesExplorerProps {
  language: Language
  tutorials: TutorialWithExercises[]
  initialTutorialSlug?: string | null
}

interface ExerciseEntry {
  exercise: any
  tutorial: TutorialWithExercises
  orderIndex: number
}

const LanguageExercisesExplorer: React.FC<LanguageExercisesExplorerProps> = ({
  language,
  tutorials,
  initialTutorialSlug,
}) => {
  const pathname = usePathname()
  const [selectedTutorialSlug, setSelectedTutorialSlug] = useState<
    string | null
  >(initialTutorialSlug ?? null)

  const tutorialsWithExercises = useMemo(
    () => tutorials.filter((tutorial) => (tutorial.exercises?.length ?? 0) > 0),
    [tutorials]
  )

  const tutorialLookup = useMemo(() => {
    return tutorialsWithExercises.reduce<Record<string, TutorialWithExercises>>(
      (acc, tutorial) => {
        acc[tutorial.slug] = tutorial
        return acc
      },
      {}
    )
  }, [tutorialsWithExercises])

  const basePath = useMemo(() => {
    if (language?.slug) {
      return `/Learn/Exercise/${language.slug}`
    }
    const segments = pathname.split("/").filter(Boolean)
    const exerciseIndex = segments.indexOf("Exercise")
    if (exerciseIndex === -1) {
      return pathname
    }
    return `/${segments.slice(0, exerciseIndex + 2).join("/")}`
  }, [language?.slug, pathname])

  const exerciseEntries = useMemo<ExerciseEntry[]>(() => {
    return tutorialsWithExercises.flatMap((tutorial) => {
      return (tutorial.exercises ?? []).map((exercise: any, index: number) => ({
        exercise,
        tutorial,
        orderIndex: exercise.index ?? index + 1,
      }))
    })
  }, [tutorialsWithExercises])

  const sortedEntries = useMemo(() => {
    return [...exerciseEntries].sort((a, b) => {
      const tutorialIndexA = a.tutorial.index ?? Number.MAX_SAFE_INTEGER
      const tutorialIndexB = b.tutorial.index ?? Number.MAX_SAFE_INTEGER

      if (tutorialIndexA !== tutorialIndexB) {
        return tutorialIndexA - tutorialIndexB
      }

      return a.orderIndex - b.orderIndex
    })
  }, [exerciseEntries])

  const filteredEntries = useMemo(() => {
    if (!selectedTutorialSlug) {
      return sortedEntries
    }

    return sortedEntries.filter(
      (entry) => entry.tutorial.slug === selectedTutorialSlug
    )
  }, [selectedTutorialSlug, sortedEntries])

  const totalExerciseCount = sortedEntries.length
  const activeTutorial = selectedTutorialSlug
    ? (tutorialLookup[selectedTutorialSlug] ?? null)
    : null

  const handleTutorialSelect = useCallback(
    (slug: string | null) => {
      if (slug === selectedTutorialSlug) {
        return
      }

      setSelectedTutorialSlug(slug)

      if (typeof window === "undefined") {
        return
      }

      const nextPath = slug ? `${basePath}/${slug}` : basePath

      if (window.location.pathname !== nextPath) {
        window.history.replaceState(null, "", nextPath)
      }
    },
    [basePath, selectedTutorialSlug]
  )

  if (tutorialsWithExercises.length === 0) {
    return (
      <div className="rounded-lg bg-sky-50 p-8 text-center dark:bg-slate-800">
        <p className="text-lg text-slate-600 dark:text-slate-300">
          No exercises are available for {language.title} yet. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>
            Showing {filteredEntries.length} of {totalExerciseCount} exercises
            {activeTutorial
              ? ` from ${activeTutorial.title}`
              : " across all tutorials"}
          </span>
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => handleTutorialSelect(null)}
            className={`mx-1 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
              !selectedTutorialSlug
                ? "border-blue-500 bg-blue-600 text-white shadow"
                : "border-slate-600 bg-slate-800 text-slate-200 hover:border-blue-500/60 hover:text-white"
            }`}
            aria-pressed={!selectedTutorialSlug}
          >
            All Exercises
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {totalExerciseCount}
            </span>
          </button>

          {tutorialsWithExercises.map((tutorial) => {
            const isActive = selectedTutorialSlug === tutorial.slug

            return (
              <button
                key={tutorial.id}
                type="button"
                onClick={() => handleTutorialSelect(tutorial.slug)}
                className={`mx-1 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-blue-500 bg-blue-600 text-white shadow"
                    : "border-slate-600 bg-slate-800 text-slate-200 hover:border-blue-500/60 hover:text-white"
                }`}
                aria-pressed={isActive}
              >
                <span>{tutorial.title}</span>
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {tutorial.exercises?.length ?? 0}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {filteredEntries.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map(({ exercise, tutorial }, index) => (
            <ExerciseCard
              key={`${tutorial.slug}-${exercise.id ?? exercise.slug ?? index}`}
              exercise={exercise}
              index={index + 1}
              href={`${basePath}/${tutorial.slug}/${exercise.slug}`}
              tutorialTitle={!selectedTutorialSlug ? tutorial.title : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-slate-100 p-8 text-center dark:bg-slate-800">
          <p className="text-lg text-slate-600 dark:text-slate-300">
            No exercises match the selected tutorial filter.
          </p>
        </div>
      )}
    </div>
  )
}

export default LanguageExercisesExplorer
