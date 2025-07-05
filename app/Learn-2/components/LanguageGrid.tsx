import React from "react"
import { Language } from "../types/TutorialTypes"
import LanguageCard from "./LanguageCard"

interface LearnPageProps {
  languages: Language[]
}
const LanguageGrid = ({ languages }: LearnPageProps) => {
  return (
    <section className="bg-slate-900 px-6 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Programming Languages
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-sky-100 dark:text-slate-300">
            Explore different programming languages and find the one that suits
            your interests and goals
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {languages.map((language) => (
            <LanguageCard key={language.id} language={language} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default LanguageGrid
