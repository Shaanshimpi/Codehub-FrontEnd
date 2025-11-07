"use client"

import React, { useMemo, useState } from "react"
import { useUser } from "@/app/(payload)/_providers/UserProvider"
import LoginModal from "@/app/Learn/components/LoginModal"
import { Code, Lock, Target, Trophy, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface ExerciseCardProps {
  exercise: any
  index?: number
  href?: string
  tutorialTitle?: string
}

const getDifficultyConfig = (level: number) => {
  switch (level) {
    case 1:
      return {
        label: "Beginner",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: Target,
      }
    case 2:
      return {
        label: "Intermediate",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: Zap,
      }
    case 3:
      return {
        label: "Advanced",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        icon: Trophy,
      }
    default:
      return {
        label: "Beginner",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: Target,
      }
  }
}

const stripHtml = (value: string) =>
  value
    ?.replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim() || "Exercise"

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  href,
  tutorialTitle,
}) => {
  const pathname = usePathname()
  const { user } = useUser()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const targetHref = useMemo(() => {
    if (href) return href
    return `${pathname}/${exercise.slug}`
  }, [exercise.slug, href, pathname])

  const difficulty = getDifficultyConfig(exercise.difficultyLevel || 1)
  const DifficultyIcon = difficulty.icon
  const isLocked = Boolean(exercise.isLocked) && !user

  const handleClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (!isLocked) return
    e?.preventDefault()
    setShowLoginModal(true)
  }

  const displayIndex = index ?? exercise.index ?? 1

  const cardBody = (
    <div
      className={`relative flex h-full flex-col rounded-xl border-2 border-transparent bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-600/10 dark:bg-slate-800 dark:hover:border-blue-400 dark:hover:shadow-blue-400/10 ${isLocked ? "opacity-75" : ""}`}
    >
      {isLocked && (
        <div className="absolute right-3 top-3 z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold text-white ${
            isLocked
              ? "bg-gradient-to-r from-amber-500 to-amber-600"
              : "bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-600"
          }`}
        >
          {displayIndex}
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${difficulty.color}`}
        >
          <DifficultyIcon className="h-3 w-3" />
          {difficulty.label}
        </div>
      </div>

      <div className="flex-1">
        {tutorialTitle && (
          <span className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
            {tutorialTitle}
          </span>
        )}
        <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
          {stripHtml(exercise.title)}
        </h3>

        {exercise.tags && exercise.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {exercise.tags.slice(0, 3).map((tag: any, tagIndex: number) => (
              <span
                key={typeof tag === "string" ? `${tag}-${tagIndex}` : tag.id}
                className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {typeof tag === "string" ? tag : tag.tag}
              </span>
            ))}
            {exercise.tags.length > 3 && (
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                +{exercise.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center">
            <Code className="mr-1 h-4 w-4" />
            <span>{isLocked ? "Premium" : "Exercise"}</span>
          </div>
        </div>

        <div
          className={`transition-colors ${
            isLocked
              ? "text-amber-600 dark:text-amber-400"
              : "text-blue-600 group-hover:text-blue-800 dark:text-blue-400 dark:group-hover:text-blue-300"
          }`}
        >
          {isLocked ? (
            <Lock className="h-5 w-5" />
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {isLocked ? (
        <div
          onClick={handleClick}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleClick(e)
          }
          className="group block cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label={`Unlock ${stripHtml(exercise.title)} exercise`}
        >
          {cardBody}
        </div>
      ) : (
        <Link href={targetHref} className="group block">
          {cardBody}
        </Link>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        featureType="exercise"
      />
    </>
  )
}

export default ExerciseCard
