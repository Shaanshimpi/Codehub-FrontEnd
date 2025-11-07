import React from "react"
import {
  getExercisesByTutorialId,
  getLanguageBySlug,
  getTutorialBySlug,
} from "@/lib/getData"
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

    const exercises = await getExercisesByTutorialId(tutorial.id)

    return (
      <TutorialPageContainer
        tutorial={{ ...tutorial, exercises }}
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
        title: "Tutorial Not Found | CodeHub",
        description: "The requested tutorial was not found.",
        robots: { index: false, follow: true },
      }
    }

    const tutorial = await getTutorialBySlug(tutSlug, language.id)
    if (!tutorial) {
      return {
        title: "Tutorial Not Found | CodeHub",
        description: "The requested tutorial was not found.",
        robots: { index: false, follow: true },
      }
    }

    const exercises = await getExercisesByTutorialId(tutorial.id)
    const exerciseCount = exercises?.length || 0
    const lessonCount = tutorial.lessons?.length || 0
    const estimatedTime = lessonCount * 15 // minutes per lesson
    const difficulty = tutorial.difficulty || "Beginner"

    return {
      title: `${tutorial.title} - ${language.title} Tutorial | CodeHub`,
      description: `Learn ${tutorial.title} in ${language.title} with ${lessonCount} interactive lessons and ${exerciseCount} practice exercises. Includes code examples, quizzes, and hands-on challenges. ${difficulty} level. Estimated time: ${estimatedTime} minutes.`,
      keywords: `${language.title} ${tutorial.title}, ${tutorial.title} tutorial, learn ${tutorial.title} ${language.title}, ${tutorial.title} explained, ${language.title} ${tutorial.title} examples, ${tutorial.title} guide, ${difficulty} ${language.title}, ${tutorial.title} exercises`,
      openGraph: {
        title: `${tutorial.title} - ${language.title} Tutorial`,
        description: `Master ${tutorial.title} with ${lessonCount} interactive lessons and ${exerciseCount} practice exercises`,
        url: `https://codehubindia.in/Learn/Tutorials/${langSlug}/${tutSlug}`,
        type: "article",
        siteName: "CodeHub",
        article: {
          publishedTime: tutorial.createdAt,
          modifiedTime: tutorial.updatedAt,
          section: "Programming Tutorials",
          tags: [
            language.title,
            tutorial.title,
            "Programming",
            "Coding",
            difficulty,
          ],
        },
        images: [
          {
            url:
              tutorial.coverImage ||
              "https://codehubindia.in/assets/logo-sqr.png",
            width: 1200,
            height: 630,
            alt: `${tutorial.title} Tutorial Cover`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${tutorial.title} - ${language.title} Tutorial`,
        description: `Master ${tutorial.title} with interactive lessons`,
        images: [
          tutorial.coverImage || "https://codehubindia.in/assets/logo-sqr.png",
        ],
      },
      alternates: {
        canonical: `https://codehubindia.in/Learn/Tutorials/${langSlug}/${tutSlug}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
    }
  } catch (error) {
    return {
      title: "Tutorial Error | CodeHub",
      description: "There was an error loading the tutorial.",
      robots: { index: false, follow: true },
    }
  }
}
