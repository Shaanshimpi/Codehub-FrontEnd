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

  console.log("🔍 [SSR] ExercisePage - Starting fetch for:", {
    langSlug,
    tutSlug,
    exerciseSlug,
  })

  try {
    // Fetch the language first
    console.log("📡 [SSR] Fetching language:", langSlug)
    const language = await getLanguageBySlug(langSlug)
    console.log(
      "✅ [SSR] Language result:",
      language ? { id: language.id, title: language.title } : "❌ NOT FOUND"
    )

    if (!language) {
      console.error(
        "❌ [SSR] notFound() called - Language not found for slug:",
        langSlug
      )
      notFound()
    }

    // Fetch the tutorial using language ID
    console.log(
      "📡 [SSR] Fetching tutorial:",
      tutSlug,
      "for language ID:",
      language.id
    )
    const tutorial = await getTutorialBySlug(tutSlug, language.id)
    console.log(
      "✅ [SSR] Tutorial result:",
      tutorial ? { id: tutorial.id, title: tutorial.title } : "❌ NOT FOUND"
    )

    if (!tutorial) {
      console.error(
        "❌ [SSR] notFound() called - Tutorial not found for slug:",
        tutSlug,
        "language ID:",
        language.id
      )
      notFound()
    }

    // Fetch the exercise using tutorial ID
    console.log(
      "📡 [SSR] Fetching exercise:",
      exerciseSlug,
      "for tutorial ID:",
      tutorial.id
    )
    const exercise = await getExerciseBySlug(exerciseSlug, tutorial.id)
    console.log(
      "✅ [SSR] Exercise result:",
      exercise ? { id: exercise.id, title: exercise.title } : "❌ NOT FOUND"
    )

    if (!exercise) {
      console.error(
        "❌ [SSR] notFound() called - Exercise not found for slug:",
        exerciseSlug,
        "tutorial ID:",
        tutorial.id
      )
      notFound()
    }

    console.log(
      "🎉 [SSR] All data fetched successfully, rendering ExerciseLayout"
    )
    return (
      <ExerciseLayout
        exercise={exercise}
        language={language}
        tutorial={tutorial}
        params={{ langSlug, tutSlug, exerciseSlug }}
      />
    )
  } catch (error) {
    // Error fetching exercise data
    console.error("💥 [SSR] Exception in ExercisePage:", error)
    console.error(
      "💥 [SSR] Error type:",
      error instanceof Error ? error.constructor.name : typeof error
    )
    console.error(
      "💥 [SSR] Error message:",
      error instanceof Error ? error.message : String(error)
    )
    console.error(
      "💥 [SSR] Stack trace:",
      error instanceof Error ? error.stack : "No stack trace available"
    )
    console.error("💥 [SSR] Params were:", { langSlug, tutSlug, exerciseSlug })
    notFound()
  }
}

// Real metadata function using fetched data
export async function generateMetadata({ params }: ExercisePageProps) {
  const { langSlug, tutSlug, exerciseSlug } = await params

  console.log("🔍 [METADATA] generateMetadata - Starting fetch for:", {
    langSlug,
    tutSlug,
    exerciseSlug,
  })

  try {
    // Fetch the same data as the main component
    console.log("📡 [METADATA] Fetching language:", langSlug)
    const language = await getLanguageBySlug(langSlug)
    console.log(
      "✅ [METADATA] Language result:",
      language ? { id: language.id, title: language.title } : "❌ NOT FOUND"
    )

    if (!language) {
      console.error(
        "❌ [METADATA] Language not found, returning error metadata"
      )
      return {
        title: "Exercise Not Found",
        description: "The requested exercise could not be found.",
      }
    }

    console.log(
      "📡 [METADATA] Fetching tutorial:",
      tutSlug,
      "for language ID:",
      language.id
    )
    const tutorial = await getTutorialBySlug(tutSlug, language.id)
    console.log(
      "✅ [METADATA] Tutorial result:",
      tutorial ? { id: tutorial.id, title: tutorial.title } : "❌ NOT FOUND"
    )

    if (!tutorial) {
      console.error(
        "❌ [METADATA] Tutorial not found, returning error metadata"
      )
      return {
        title: "Exercise Not Found",
        description: "The requested exercise could not be found.",
      }
    }

    console.log(
      "📡 [METADATA] Fetching exercise:",
      exerciseSlug,
      "for tutorial ID:",
      tutorial.id
    )
    const exercise = await getExerciseBySlug(exerciseSlug, tutorial.id)
    console.log(
      "✅ [METADATA] Exercise result:",
      exercise ? { id: exercise.id, title: exercise.title } : "❌ NOT FOUND"
    )

    if (!exercise) {
      console.error(
        "❌ [METADATA] Exercise not found, returning error metadata"
      )
      return {
        title: "Exercise Not Found",
        description: "The requested exercise could not be found.",
      }
    }

    // Get clean title without HTML tags
    const cleanTitle = (exercise.title || "Exercise")
      .replace(/<[^>]*>/g, "")
      .trim()
    const languageTitle =
      exercise.programmingLanguage?.title || language.title || "Programming"
    const tags =
      exercise.tags
        ?.map((t: any) => (typeof t === "string" ? t : t.tag))
        .join(", ") || "programming, coding"

    console.log(
      "🎉 [METADATA] Successfully generated metadata for:",
      cleanTitle
    )

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
  } catch (error) {
    // Error generating metadata
    console.error("💥 [METADATA] Exception in generateMetadata:", error)
    console.error(
      "💥 [METADATA] Error type:",
      error instanceof Error ? error.constructor.name : typeof error
    )
    console.error(
      "💥 [METADATA] Error message:",
      error instanceof Error ? error.message : String(error)
    )
    console.error(
      "💥 [METADATA] Stack trace:",
      error instanceof Error ? error.stack : "No stack trace available"
    )
    console.error("💥 [METADATA] Params were:", {
      langSlug,
      tutSlug,
      exerciseSlug,
    })
    return {
      title: "Exercise - MotionScape",
      description:
        "Practice programming with interactive exercises on MotionScape.",
    }
  }
}
