"use client"

import React from "react"
import { TutorialNavigationProps } from "@/app/Learn/types/TutorialTypes"
import { ArrowLeft, ArrowRight, CornerDownLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const TutorialNavigation: React.FC<TutorialNavigationProps> = ({
  language,
  previousTutorial,
  nextTutorial,
}) => {
  const pathname = usePathname()
  const baseSegment = pathname?.split("/")[1] || "learn"

  return (
    <div className="border-t border-slate-200 pt-8 dark:border-slate-700">
      {/* Back to tutorials list */}
      <div className="mb-8">
        <Link
          href={`/${baseSegment}/${language.slug}`}
          className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <CornerDownLeft className="mr-2 h-4 w-4" />
          Back to {language.title} Tutorials
        </Link>
      </div>

      {/* Previous/Next Navigation */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        {previousTutorial ? (
          <Link
            href={`/${baseSegment}/${language.slug}/${previousTutorial.slug}`}
            className="group flex-1"
          >
            <div className="rounded-lg border border-slate-200 p-4 transition-all hover:border-blue-300 hover:shadow-sm dark:border-slate-700 dark:hover:border-blue-600">
              <div className="mb-2 flex items-center text-sm text-slate-500 dark:text-slate-400">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Tutorial
              </div>
              <div className="font-medium text-slate-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                {previousTutorial.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextTutorial ? (
          <Link
            href={`/${baseSegment}/${language.slug}/${nextTutorial.slug}`}
            className="group flex-1"
          >
            <div className="rounded-lg border border-slate-200 p-4 text-right transition-all hover:border-blue-300 hover:shadow-sm dark:border-slate-700 dark:hover:border-blue-600">
              <div className="mb-2 flex items-center justify-end text-sm text-slate-500 dark:text-slate-400">
                Next Tutorial
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
              <div className="font-medium text-slate-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                {nextTutorial.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  )
}

export default TutorialNavigation
