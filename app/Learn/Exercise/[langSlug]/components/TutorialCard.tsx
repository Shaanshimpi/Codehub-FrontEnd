"use client"

import React from "react"
import { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import { BookOpen, PlayCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface TutorialCardProps {
  tutorial: Tutorial
  index: number
  language: Language
}

// Function to extract text content from HTML
const extractTextFromHtml = (html: string): string => {
  // Remove HTML tags and decode entities
  const text = html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
    .replace(/&amp;/g, "&") // Replace &amp; with &
    .replace(/&lt;/g, "<") // Replace &lt; with <
    .replace(/&gt;/g, ">") // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim()

  return text
}

const TutorialCard: React.FC<TutorialCardProps> = ({
  tutorial,
  index,
  language,
}) => {
  const pathname = usePathname()

  // Extract plain text from HTML content
  const plainTextContent = tutorial.content
    ? extractTextFromHtml(tutorial.content)
    : ""

  return (
    <Link href={`${pathname}/${tutorial.slug}`} className="group block">
      <div className="flex h-full flex-col rounded-xl border-2 border-transparent bg-white p-6 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-600/10 dark:bg-slate-800 dark:hover:border-blue-400 dark:hover:shadow-blue-400/10">
        {/* Header with index and icon */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-lg font-bold text-white dark:from-blue-500 dark:to-blue-600">
            {index}
          </div>
          <div className="rounded-full bg-blue-50 p-2 dark:bg-slate-700">
            <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="mb-3 text-xl font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
            {tutorial.title}
          </h3>

          {plainTextContent && (
            <p className="mb-4 line-clamp-3 text-slate-600 dark:text-slate-300">
              {plainTextContent.length > 120
                ? `${plainTextContent.substring(0, 120)}...`
                : plainTextContent}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <BookOpen className="mr-1 h-4 w-4" />
              Exercises
            </div>
          </div>

          <div className="text-blue-600 transition-colors group-hover:text-blue-800 dark:text-blue-400 dark:group-hover:text-blue-300">
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
          </div>
        </div>
      </div>
    </Link>
  )
}

export default TutorialCard
