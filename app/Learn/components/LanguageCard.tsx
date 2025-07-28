"use client"

import React, { useState } from "react"
import { BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Language } from "../types/TutorialTypes"

interface LanguageCardProps {
  language: Language
}

const LanguageCard = ({ language }: LanguageCardProps) => {
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
      <div className="cursor-pointer rounded-xl border-2 border-transparent bg-sky-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/20 dark:bg-slate-800 dark:hover:border-blue-400 dark:hover:shadow-blue-400/20">
        <div className="flex flex-col items-center space-y-4 text-center">
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

          <div>
            <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
              {language.title}
            </h3>
            {language.description && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                {language.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-2">
            {language.category && (
              <span className="inline-block rounded-full bg-blue-600 px-2 py-1 text-xs text-white dark:bg-blue-500">
                {language.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <BookOpen className="h-3 w-3" />
              Tutorials
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default LanguageCard
