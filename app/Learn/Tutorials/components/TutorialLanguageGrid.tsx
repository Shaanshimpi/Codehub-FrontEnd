"use client"

import React from "react"
import { Language } from "../../types/TutorialTypes"
import TutorialLanguageCard from "./TutorialLanguageCard"
import TutorialLoading from "./TutorialLoading"

interface TutorialLanguageGridProps {
  languages: Language[]
}

const TutorialLanguageGrid = ({ languages }: TutorialLanguageGridProps) => {
  if (!languages || languages.length === 0) {
    return <TutorialLoading />
  }

  return (
    <section className="bg-slate-900 px-6 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Choose Your Learning Language
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-sky-100 dark:text-slate-300">
            Select a programming language to start learning with comprehensive
            tutorials and interactive lessons
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {languages.map((language) => (
            <TutorialLanguageCard key={language.id} language={language} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TutorialLanguageGrid
