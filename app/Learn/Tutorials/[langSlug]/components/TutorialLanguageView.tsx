"use client"

import React from "react"
import { Language, Tutorial } from "../../../types/TutorialTypes"
import TutorialGrid from "./TutorialGrid"
import TutorialLanguageHeader from "./TutorialLanguageHeader"

interface TutorialLanguageViewProps {
  language: Language
  tutorials: Tutorial[]
}

const TutorialLanguageView = ({
  language,
  tutorials,
}: TutorialLanguageViewProps) => {
  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950">
      <TutorialLanguageHeader
        language={language}
        tutorialCount={tutorials.length}
      />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h2 className="mb-4 text-3xl font-bold text-white dark:text-gray-100">
            {language.title} Learning Tutorials
          </h2>
          <p className="text-lg text-sky-100 dark:text-sky-200">
            Learn {language.title} with comprehensive tutorials and interactive
            lessons.
          </p>
        </div>

        {tutorials.length > 0 ? (
          <TutorialGrid tutorials={tutorials} language={language} />
        ) : (
          <div className="rounded-lg bg-sky-50 p-8 text-center dark:bg-slate-800">
            <p className="text-lg text-slate-600 dark:text-slate-300">
              No learning tutorials available for {language.title} yet. Check
              back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TutorialLanguageView
