"use client"

import React from "react"
import { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import { ArrowLeft, BookOpen, Target } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface TutorialHeaderProps {
  tutorial: Tutorial
  language: Language
}

const TutorialHeader: React.FC<TutorialHeaderProps> = ({
  tutorial,
  language,
}) => {
  const pathname = usePathname()

  const getParentPath = () => {
    // Navigate back to language exercises page
    const pathSegments = pathname.split("/").filter(Boolean)
    pathSegments.pop() // Remove tutSlug
    return "/" + pathSegments.join("/")
  }

  const parentPath = getParentPath()

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-[8vh] text-white dark:from-slate-800 dark:to-slate-900 dark:text-gray-100">
      <div className="mx-auto max-w-6xl">
        <Link
          href={parentPath}
          className="mb-6 inline-flex items-center text-sky-100 transition-colors hover:text-white dark:text-sky-200 dark:hover:text-gray-50"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to {language.title} Exercises
        </Link>

        <div className="flex items-center space-x-6">
          {language.logo && (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white p-3 dark:bg-slate-700">
              <Image
                src={language.logo}
                alt={`${language.title} logo`}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          )}

          <div className="flex-1">
            <div className="mb-2 flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-sky-200" />
              <span className="text-lg font-medium text-sky-200">
                {language.title}
              </span>
              <span className="text-sky-300">|</span>
              <Target className="h-6 w-6 text-sky-200" />
              <span className="text-lg font-medium text-sky-200">
                Exercise Mode
              </span>
            </div>
            <h1 className="mb-2 text-4xl font-bold dark:text-gray-100">
              {tutorial.title}
            </h1>
            <p className="text-xl text-sky-100 dark:text-sky-200">
              Practice coding with hands-on exercises for this tutorial
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialHeader
