"use client"

import React from "react"
import { TutorialHeaderProps } from "@/app/Learn/types/TutorialTypes"
import { readTime } from "../../utils"

const TutorialHeader: React.FC<TutorialHeaderProps> = ({
  tutorial,
  language,
  allTutorials,
}) => {
  const tutorialReadTime = tutorial.content ? readTime(tutorial.content) : 5

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white dark:bg-blue-500 dark:text-gray-100">
          {tutorial.index}
        </div>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {language.title} Tutorial
        </span>
      </div>

      <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-gray-100">
        {tutorial.title}
      </h1>

      <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
        <span>
          Tutorial {tutorial.index} of {allTutorials.length}
        </span>
        <span>•</span>
        <span>~{tutorialReadTime} min read</span>
      </div>
    </div>
  )
}

export default TutorialHeader
