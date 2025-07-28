"use client"

import IntroSection from "./components/IntroSection"
import LanguageGrid from "./components/LanguageGrid"
import LearningPathsSection from "./components/LearningPathsSection"
import { Language } from "./types/TutorialTypes"

interface LearnPageProps {
  languages: Language[]
}
const LearnPage = ({ languages }: LearnPageProps) => {
  return (
    <div className="bg-slate-900">
      <IntroSection />
      <LearningPathsSection />
      <LanguageGrid languages={languages} />
    </div>
  )
}

export default LearnPage
