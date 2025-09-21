import React from "react"
import { getLanguageBySlug, getTutorialBySlug } from "@/lib/getData"
import { notFound } from "next/navigation"
import TutorialPageContainer from "./components/TutorialPageContainer"

interface TutorialPageProps {
  params: Promise<{
    langSlug: string
    tutSlug: string
  }>
}

export default async function NewTutorialPage({ params }: TutorialPageProps) {
  const { langSlug, tutSlug } = await params

  try {
    // Fetch language and tutorial data
    const language = await getLanguageBySlug(langSlug)
    if (!language) {
      notFound()
    }

    const tutorial = await getTutorialBySlug(tutSlug, language.id)

    if (!tutorial) {
      console.log("Tutorial not found, calling notFound()")
      notFound()
    }

    return (
      <TutorialPageContainer
        tutorial={tutorial}
        language={language}
        langSlug={langSlug}
        tutSlug={tutSlug}
      />
    )
  } catch (error) {
    console.error("Error loading tutorial:", error)
    notFound()
  }
}

export async function generateMetadata({ params }: TutorialPageProps) {
  const { langSlug, tutSlug } = await params

  try {
    const language = await getLanguageBySlug(langSlug)
    if (!language) {
      return {
        title: "Tutorial Not Found",
        description: "The requested tutorial was not found.",
      }
    }

    const tutorial = await getTutorialBySlug(tutSlug, language.id)
    if (!tutorial) {
      return {
        title: "Tutorial Not Found",
        description: "The requested tutorial was not found.",
      }
    }

    return {
      title: `${tutorial.title} - ${language.title} Interactive Tutorial`,
      description: `Learn ${tutorial.title} in ${language.title} through interactive lessons, quizzes, and hands-on exercises.`,
      keywords: `${language.title}, ${tutorial.title}, interactive tutorial, programming lessons, coding practice`,
    }
  } catch (error) {
    return {
      title: "Tutorial Error",
      description: "There was an error loading the tutorial.",
    }
  }
}
