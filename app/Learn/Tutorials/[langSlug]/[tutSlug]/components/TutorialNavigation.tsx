"use client"

import React from "react"
import Link from "next/link"
import { Language, Tutorial } from "../../../../types/TutorialTypes"

interface TutorialNavigationProps {
  language: Language
  previousTutorial: Tutorial | null
  nextTutorial: Tutorial | null
}

const TutorialNavigation = ({
  language,
  previousTutorial,
  nextTutorial,
}: TutorialNavigationProps) => {
  if (!previousTutorial && !nextTutorial) {
    return null
  }

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between">
        {/* Previous Tutorial */}
        <div className="flex-1">
          {previousTutorial ? (
            <Link
              href={`/learn/Tutorials/${language.slug}/${previousTutorial.slug}`}
              className="group flex items-center rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="mr-4">
                <svg
                  className="h-6 w-6 text-gray-400 group-hover:text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500 group-hover:text-blue-600">
                  Previous
                </div>
                <div className="max-w-xs truncate font-medium text-gray-900 group-hover:text-blue-700">
                  {previousTutorial.title}
                </div>
              </div>
            </Link>
          ) : (
            <div /> // Empty div to maintain flex layout
          )}
        </div>

        {/* Back to tutorials list */}
        <div className="mx-4">
          <Link
            href={`/learn/Tutorials/${language.slug}`}
            className="px-4 py-2 text-sm text-gray-600 transition-colors hover:text-blue-600"
          >
            All Tutorials
          </Link>
        </div>

        {/* Next Tutorial */}
        <div className="flex flex-1 justify-end">
          {nextTutorial ? (
            <Link
              href={`/learn/Tutorials/${language.slug}/${nextTutorial.slug}`}
              className="group flex items-center rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-200 hover:bg-blue-50"
            >
              <div>
                <div className="text-right text-sm text-gray-500 group-hover:text-blue-600">
                  Next
                </div>
                <div className="max-w-xs truncate font-medium text-gray-900 group-hover:text-blue-700">
                  {nextTutorial.title}
                </div>
              </div>
              <div className="ml-4">
                <svg
                  className="h-6 w-6 text-gray-400 group-hover:text-blue-500"
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
              </div>
            </Link>
          ) : (
            <div /> // Empty div to maintain flex layout
          )}
        </div>
      </div>
    </div>
  )
}

export default TutorialNavigation
