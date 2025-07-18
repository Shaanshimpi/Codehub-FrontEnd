"use client"

import React, { useState } from "react"
import { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import { BookOpen, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { readTime } from "../../../utils"

interface TutorialSidebarProps {
  tutorials: Tutorial[]
  language: Language
  currentTutorial: Tutorial
}

const TutorialSidebar: React.FC<TutorialSidebarProps> = ({
  tutorials,
  language,
  currentTutorial,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const basePath = pathname.replace(`/${currentTutorial.slug}`, "")

  // Function to extract text content from HTML
  const extractTextFromHtml = (html: string): string => {
    const text = html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim()
    return text
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Toggle Sidebar Arrow Button - Left Center */}
      <button
        onClick={toggleSidebar}
        className="fixed left-0 top-1/2 z-[200] flex h-12 w-6 -translate-y-1/2 items-center justify-center rounded-r-lg bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-80 transform bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-slate-900 lg:z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white dark:from-slate-800 dark:to-slate-900">
            <div className="flex items-center space-x-3">
              {language.logo && (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-2 dark:bg-slate-700">
                  <img
                    src={language.logo.url}
                    alt={language.logo.alt || `${language.title} logo`}
                    className="h-8 w-8 object-contain"
                  />
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold">{language.title}</h2>
                <p className="text-sm text-sky-100 dark:text-sky-200">
                  {tutorials.length} Tutorials
                </p>
              </div>
            </div>
          </div>

          {/* Tutorial List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {tutorials.map((tutorial, index) => {
                const isActive = tutorial.id === currentTutorial.id
                const plainTextContent = tutorial.content
                  ? extractTextFromHtml(tutorial.content)
                  : ""

                return (
                  <Link
                    key={tutorial.id}
                    href={`${basePath}/${tutorial.slug}`}
                    className={`group block rounded-lg p-4 transition-all duration-200 ${
                      isActive
                        ? "border-2 border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-slate-800"
                        : "border-2 border-transparent hover:border-blue-200 hover:bg-sky-50 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                          isActive
                            ? "bg-blue-600 text-white dark:bg-blue-500"
                            : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
                        }`}
                      >
                        {tutorial.index || index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`mb-1 truncate font-semibold ${
                            isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-slate-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400"
                          }`}
                        >
                          {tutorial.title}
                        </h3>
                        <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center">
                            <BookOpen className="mr-1 h-3 w-3" />
                            Tutorial
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {`${readTime(plainTextContent)} min`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4 dark:border-slate-700">
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              <p>
                Progress:{" "}
                {tutorials.findIndex((t) => t.id === currentTutorial.id) + 1} of{" "}
                {tutorials.length}
              </p>
              <div className="mt-2 h-2 rounded-full bg-gray-200 dark:bg-slate-700">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 transition-all duration-300"
                  style={{
                    width: `${((tutorials.findIndex((t) => t.id === currentTutorial.id) + 1) / tutorials.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TutorialSidebar
