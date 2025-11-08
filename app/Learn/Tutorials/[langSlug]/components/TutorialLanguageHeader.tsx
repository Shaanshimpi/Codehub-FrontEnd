import React from "react"
import LanguageHero from "@/app/Learn/components/LanguageHero"
import { Language } from "../../../types/TutorialTypes"

interface TutorialLanguageHeaderProps {
  language: Language
  tutorialCount: number
}

const TutorialLanguageHeader = ({ language }: TutorialLanguageHeaderProps) => {
  return <LanguageHero language={language} variant="tutorials" />
}

export default TutorialLanguageHeader
