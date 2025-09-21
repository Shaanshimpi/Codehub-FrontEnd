import React from "react"
import { getLanguageBySlug, getTutorialsByLanguage } from "@/lib/getData"
import { LanguagePageProps } from "../../types/TutorialTypes"
import TutorialLanguageView from "./components/TutorialLanguageView"

export default async function TutorialLanguagePage({
  params,
}: LanguagePageProps) {
  const { langSlug } = await params

  try {
    const [language, tutorials] = await Promise.all([
      getLanguageBySlug(langSlug),
      getTutorialsByLanguage(langSlug),
    ])
    console.log(language, tutorials)

    // If no language found, create a mock one for now
    const finalLanguage = language || {
      id: 1,
      title: langSlug.charAt(0).toUpperCase() + langSlug.slice(1),
      slug: langSlug,
      index: 1,
    }

    return (
      <TutorialLanguageView
        language={finalLanguage}
        tutorials={tutorials || []}
      />
    )
  } catch (error) {
    console.error("Error loading tutorial page:", error)

    // Fallback language object
    const fallbackLanguage = {
      id: 1,
      title: langSlug.charAt(0).toUpperCase() + langSlug.slice(1),
      slug: langSlug,
      index: 1,
    }

    return <TutorialLanguageView language={fallbackLanguage} tutorials={[]} />
  }
}

export async function generateMetadata({ params }: LanguagePageProps) {
  const { langSlug } = await params

  try {
    const language = await getLanguageBySlug(langSlug)
    const languageTitle =
      language?.title || langSlug.charAt(0).toUpperCase() + langSlug.slice(1)

    return {
      title: `${languageTitle} Tutorials - Learn Programming Step by Step`,
      description: `Learn ${languageTitle} programming through comprehensive tutorials with interactive lessons, examples, and practice exercises.`,
      keywords: `${languageTitle} tutorials, learn ${languageTitle}, ${languageTitle} programming, ${languageTitle} lessons`,
    }
  } catch (error) {
    const languageTitle = langSlug.charAt(0).toUpperCase() + langSlug.slice(1)
    return {
      title: `${languageTitle} Tutorials - Learn Programming Step by Step`,
      description: `Learn ${languageTitle} programming through comprehensive tutorials with interactive lessons.`,
      keywords: `${languageTitle} tutorials, programming tutorials`,
    }
  }
}
