"use client"

import React, { useState } from "react"
import { BookOpen, Target } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Language } from "../../types/TutorialTypes"

interface TutorialLanguageCardProps {
  language: Language
}

const TutorialLanguageCard = ({ language }: TutorialLanguageCardProps) => {
  const [imageError, setImageError] = useState(false)
  const pathname = usePathname()

  const handleImageError = () => {
    setImageError(true)
  }

  // Create slug from language name or use existing slug property
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim()
  }

  const slug = language.slug || createSlug(language.title)

  return (
    <Link href={`${pathname}/${slug}`} className="group relative block">
      <div className="cursor-pointer rounded-xl border-2 border-transparent bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/20 dark:bg-slate-800 dark:hover:border-blue-400 dark:hover:shadow-blue-400/20">
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Header with learn indicator */}
          <div className="mb-2 flex w-full items-center justify-between">
            <div className="rounded-full bg-blue-50 p-1.5 dark:bg-slate-700">
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
              Learn
            </span>
          </div>

          {/* Language Logo */}
          <div className="relative flex h-16 w-16 items-center justify-center">
            {!imageError && language.logo ? (
              <Image
                src={language.logo}
                alt={`${language.title} logo`}
                width={64}
                height={64}
                className="object-contain"
                onError={handleImageError}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 dark:from-slate-600 dark:to-slate-700">
                <span className="text-lg font-bold text-white">
                  {language.title?.split(" ")[0] || "?"}
                </span>
              </div>
            )}
          </div>

          {/* Language Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
              {language.title}
            </h3>
            {language.description && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                {language.description}
              </p>
            )}
          </div>

          {/* Footer with tutorial indication */}
          <div className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-50 p-2 dark:bg-slate-700/50">
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Interactive Tutorials
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default TutorialLanguageCard
