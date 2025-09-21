"use client"

import React from "react"
import { Language } from "../types/TutorialTypes"
import TutorialIntroSection from "./components/TutorialIntroSection"
import TutorialLanguageGrid from "./components/TutorialLanguageGrid"

interface TutorialPageProps {
  languages: Language[]
}

const TutorialPage = ({ languages }: TutorialPageProps) => {
  return (
    <div className="bg-slate-900">
      {/* <HeaderClient languages={languages} /> */}
      <TutorialIntroSection />
      <TutorialLanguageGrid languages={languages} />
    </div>
  )
}

export default TutorialPage
