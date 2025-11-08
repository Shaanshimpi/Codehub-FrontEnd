import React from "react"
import LanguageHero from "@/app/Learn/components/LanguageHero"
import { Language } from "@/app/Learn/types/TutorialTypes"

interface LanguageHeaderProps {
  language: Language
}

const LanguageHeader: React.FC<LanguageHeaderProps> = ({ language }) => {
  return <LanguageHero language={language} variant="exercises" />
}

export default LanguageHeader
