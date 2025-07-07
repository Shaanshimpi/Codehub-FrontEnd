import {
  getLanguageBySlug,
  getTutorialBySlug,
  getTutorialsByLanguageId,
} from "@/lib/getData"
import { notFound } from "next/navigation"
import { TutorialPageProps } from "../../types/TutorialTypes"
import TutorialPageContent from "./components/TutorialPageContent"

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { langSlug, tutSlug } = await params

  const language = await getLanguageBySlug(langSlug)
  const tutorial = await getTutorialBySlug(tutSlug, language.id)
  if (!language) {
    notFound()
  }

  if (!tutorial) {
    notFound()
  }

  // Get all tutorials for navigation
  const allTutorials = await getTutorialsByLanguageId(language.id)

  // Find current tutorial index for navigation
  const currentIndex = allTutorials.findIndex((t) => t.slug === tutSlug)
  const previousTutorial =
    currentIndex > 0 ? allTutorials[currentIndex - 1] : null
  const nextTutorial =
    currentIndex < allTutorials.length - 1
      ? allTutorials[currentIndex + 1]
      : null

  return (
    <TutorialPageContent
      tutorial={tutorial}
      language={language}
      allTutorials={allTutorials}
      previousTutorial={previousTutorial}
      nextTutorial={nextTutorial}
    />
  )
}

export async function generateMetadata({ params }: TutorialPageProps) {
  const { langSlug, tutSlug } = await params

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
    title: `${tutorial.title} - ${language.title} Tutorial`,
    description: `Learn ${tutorial.title} in ${language.title}. Step-by-step tutorial with examples and explanations.`,
    keywords: `${language.title}, ${tutorial.title}, programming, tutorial, learn coding`,
  }
}

export async function generateStaticParams() {
  try {
    const languages = await getLanguageBySlug()

    const params = []

    for (const lang of languages) {
      const tutorials = await getTutorialsByLanguageId(lang.id)

      for (const tutorial of tutorials) {
        params.push({
          langSlug: lang.slug,
          tutSlug: tutorial.slug,
        })
      }
    }

    return params
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}
