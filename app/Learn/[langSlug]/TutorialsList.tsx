"use client"

import React from "react"
import { BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tutorial } from "../types/TutorialTypes"
import { readTime } from "./utils"

interface TutorialsListProps {
  tutorials: Tutorial[]
}

const TutorialsList: React.FC<TutorialsListProps> = ({ tutorials }) => {
  return (
    <div className="space-y-4">
      {tutorials.map((tutorial, index) => (
        <TutorialCard key={tutorial.id} tutorial={tutorial} index={index + 1} />
      ))}
    </div>
  )
}

interface TutorialCardProps {
  tutorial: Tutorial
  index: number
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

const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial, index }) => {
  const pathname = usePathname()

  // Extract plain text from HTML content
  const plainTextContent = tutorial.content
    ? extractTextFromHtml(tutorial.content)
    : ""

  return (
    <Link href={`${pathname}/${tutorial.slug}`} className="group block">
      <div className="rounded-lg border-2 border-transparent bg-sky-50 p-6 transition-all duration-300 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/10 dark:bg-slate-800 dark:hover:border-blue-400 dark:hover:shadow-blue-400/10">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white dark:bg-blue-500 dark:text-gray-100">
              {tutorial.index || index}
            </div>

            <div className="flex-1">
              <h3 className="mb-2 text-xl font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                {tutorial.title}
              </h3>

              {plainTextContent && (
                <p className="mb-3 line-clamp-2 text-slate-600 dark:text-slate-300">
                  {plainTextContent.length > 150
                    ? `${plainTextContent.substring(0, 150)}...`
                    : plainTextContent}
                </p>
              )}

              <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" />
                  Tutorial
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {`~${readTime(plainTextContent)} min read`}
                </div>
              </div>
            </div>
          </div>

          <div className="text-blue-600 transition-colors group-hover:text-blue-800 dark:text-blue-400 dark:group-hover:text-blue-300">
            <svg
              className="h-6 w-6"
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

export default TutorialsList
