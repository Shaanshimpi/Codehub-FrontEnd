"use client"

import React, { useState } from "react"
import HeaderClient from "@/app/Learn/layouts/HeaderClient"
import { Language, Tutorial } from "../../../../types/TutorialTypes"
import TutorialContent from "./TutorialContent"
import TutorialHeader from "./TutorialHeader"
import TutorialNavigation from "./TutorialNavigation"

interface TutorialViewProps {
  tutorial: Tutorial
  language: Language
  allTutorials: Tutorial[]
  previousTutorial: Tutorial | null
  nextTutorial: Tutorial | null
  languages: Language[]
}

const TutorialView = ({
  tutorial,
  language,
  allTutorials,
  previousTutorial,
  nextTutorial,
  languages,
}: TutorialViewProps) => {
  const [activeLesson, setActiveLesson] = useState(-1) // Start with overview like Exercise system
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const hasLessons = tutorial.lessons && tutorial.lessons.length > 0
  const hasReference =
    tutorial.reference && Object.keys(tutorial.reference).length > 0

  return (
    <div className="bg-slate-900">
      {/* Header matching Exercise system exactly */}
      <HeaderClient languages={languages} />

      {/* Tutorial Header like Exercise TutorialHeader */}
      <TutorialHeader tutorial={tutorial} language={language} />

      {/* Main Content matching Exercise layout */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h2 className="mb-4 text-3xl font-bold text-white dark:text-gray-100">
            {tutorial.title} - Interactive Tutorial
          </h2>
          <p className="text-lg text-sky-100 dark:text-sky-200">
            Learn {tutorial.title} concepts with comprehensive lessons and
            interactive content
          </p>
        </div>

        <TutorialContent
          tutorial={tutorial}
          language={language}
          activeLesson={activeLesson}
          setActiveLesson={setActiveLesson}
          showReference={hasReference}
        />

        {/* Navigation */}
        <TutorialNavigation
          language={language}
          previousTutorial={previousTutorial}
          nextTutorial={nextTutorial}
        />
      </div>
    </div>
  )
}

export default TutorialView
