// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/page.tsx
import React from "react"
import {
  getExerciseBySlug,
  getLanguageBySlug,
  getTutorialBySlug,
} from "@/lib/getData"
import { notFound } from "next/navigation"
import ExerciseLayout from "./components/ExerciseLayout"

interface ExercisePageProps {
  params: Promise<{
    langSlug: string
    tutSlug: string
    exerciseSlug: string
  }>
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { langSlug, tutSlug, exerciseSlug } = await params

  try {
    // Fetch the language first
    const language = await getLanguageBySlug(langSlug)
    if (!language) {
      notFound()
    }

    // Fetch the tutorial using language ID
    const tutorial = await getTutorialBySlug(tutSlug, language.id)
    if (!tutorial) {
      notFound()
    }

    // Fetch the exercise using tutorial ID
    const exercise = await getExerciseBySlug(exerciseSlug, tutorial.id)
    if (!exercise) {
      notFound()
    }

    return (
      <ExerciseLayout
        exercise={exercise}
        language={language}
        tutorial={tutorial}
        params={{ langSlug, tutSlug, exerciseSlug }}
      />
    )
  } catch {
    // Error fetching exercise data
    notFound()
  }
}

// Real metadata function using fetched data
export async function generateMetadata({ params }: ExercisePageProps) {
  const { langSlug, tutSlug, exerciseSlug } = await params

  try {
    // Fetch the same data as the main component
    const language = await getLanguageBySlug(langSlug)
    if (!language) {
      return {
        title: "Exercise Not Found",
        description: "The requested exercise could not be found.",
      }
    }

    const tutorial = await getTutorialBySlug(tutSlug, language.id)
    if (!tutorial) {
      return {
        title: "Exercise Not Found",
        description: "The requested exercise could not be found.",
      }
    }

    const exercise = await getExerciseBySlug(exerciseSlug, tutorial.id)
    if (!exercise) {
      return {
        title: "Exercise Not Found",
        description: "The requested exercise could not be found.",
      }
    }

    // Get clean title without HTML tags
    const cleanTitle = (exercise.title_en || exercise.title || "Exercise")
      .replace(/<[^>]*>/g, "")
      .trim()
    const languageTitle =
      exercise.programmingLanguage?.title || language.title || "Programming"
    const tags =
      exercise.tags?.map((t: any) => t.tag).join(", ") || "programming, coding"

    return {
      title: `${cleanTitle} - ${languageTitle} Exercise`,
      description: `Practice ${languageTitle} programming with this hands-on exercise. Learn ${tags}.`,
      keywords: `${languageTitle}, programming, exercise, ${tags}, ${langSlug}, ${tutSlug}, ${exerciseSlug}`,
      openGraph: {
        title: cleanTitle,
        description: `Practice ${languageTitle} programming with interactive exercises`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: cleanTitle,
        description: `Practice ${languageTitle} programming with interactive exercises`,
      },
    }
  } catch {
    // Error generating metadata
    return {
      title: "Exercise - MotionScape",
      description:
        "Practice programming with interactive exercises on MotionScape.",
    }
  }
}
