import React from "react"
import {
  getLanguageBySlug,
  getLanguages,
  getTutorialBySlug,
  getTutorialsByLanguageId,
} from "@/lib/getData"
import { notFound } from "next/navigation"
import TutorialView from "./components/TutorialView"

interface TutorialPageProps {
  params: Promise<{
    langSlug: string
    tutSlug: string
  }>
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { langSlug, tutSlug } = await params

  // Get language first
  const language = await getLanguageBySlug(langSlug)
  if (!language) {
    notFound()
  }

  // Get tutorial, all tutorials for navigation, and all languages for header
  const [tutorial, allTutorials, languages] = await Promise.all([
    getTutorialBySlug(tutSlug, language.id),
    getTutorialsByLanguageId(language.id),
    getLanguages(),
  ])

  if (!tutorial) {
    notFound()
  }

  // Find previous and next tutorials
  const currentIndex = allTutorials.findIndex((t) => t.id === tutorial.id)
  const previousTutorial =
    currentIndex > 0 ? allTutorials[currentIndex - 1] : null
  const nextTutorial =
    currentIndex < allTutorials.length - 1
      ? allTutorials[currentIndex + 1]
      : null

  return (
    <TutorialView
      tutorial={tutorial}
      language={language}
      allTutorials={allTutorials}
      previousTutorial={previousTutorial}
      nextTutorial={nextTutorial}
      languages={languages}
    />
  )
}

export async function generateMetadata({ params }: TutorialPageProps) {
  const { langSlug, tutSlug } = await params

  const language = await getLanguageBySlug(langSlug)
  if (!language) {
    return { title: "Tutorial Not Found" }
  }

  const tutorial = await getTutorialBySlug(tutSlug, language.id)
  if (!tutorial) {
    return { title: "Tutorial Not Found" }
  }

  return {
    title: `${tutorial.title} - ${language.title} Tutorial`,
    description:
      tutorial.description ||
      `Learn ${tutorial.title} in ${language.title} with interactive lessons and practical examples.`,
    keywords: `${tutorial.title}, ${language.title} tutorial, programming tutorial, learn ${language.title}`,
  }
}
