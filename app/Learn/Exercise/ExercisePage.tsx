"use client"

import HeaderClient from "@/app/Learn/layouts/HeaderClient"
import { Language } from "@/app/Learn/types/TutorialTypes"
import ExerciseIntroSection from "./components/ExerciseIntroSection"
import ExerciseLanguageGrid from "./components/ExerciseLanguageGrid"

interface ExercisePageProps {
  languages: Language[]
}

const ExercisePage = ({ languages }: ExercisePageProps) => {
  return (
    <div className="bg-slate-900">
      <HeaderClient languages={languages} />
      <ExerciseIntroSection />
      <ExerciseLanguageGrid languages={languages} />
    </div>
  )
}

export default ExercisePage
