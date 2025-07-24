import React from "react"
import { Language } from "@/app/Learn/types/TutorialTypes"
import ExerciseLanguageCard from "./ExerciseLanguageCard"

interface ExerciseLanguageGridProps {
  languages: Language[]
}

const ExerciseLanguageGrid = ({ languages }: ExerciseLanguageGridProps) => {
  return (
    <section className="bg-slate-900 px-6 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Choose Your Practice Language
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-sky-100 dark:text-slate-300">
            Select a programming language to start practicing with interactive
            exercises and coding challenges
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {languages.map((language) => (
            <ExerciseLanguageCard key={language.id} language={language} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExerciseLanguageGrid
