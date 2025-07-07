"use client"

import IntroSection from "./components/IntroSection"
import LanguageGrid from "./components/LanguageGrid"
import { Language } from "./types/TutorialTypes"

interface LearnPageProps {
  languages: Language[]
}
const LearnPage = ({ languages }: LearnPageProps) => {
  return (
    <div className="min-h-screen bg-slate-900">
      <IntroSection />
      <LanguageGrid languages={languages} />
    </div>
  )
}

export default LearnPage
