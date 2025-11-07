import {
  getExercisesByTutorialId,
  getLanguageBySlug,
  getTutorialsWithExercisesByLanguageId,
} from "@/lib/getData"
import { notFound } from "next/navigation"
import LanguageExercisesExplorer from "./components/LanguageExercisesExplorer"
import LanguageHeader from "./components/LanguageHeader"

interface ExerciseLanguagePageProps {
  params: Promise<{
    langSlug: string
  }>
}

export default async function ExerciseLanguagePage({
  params,
}: ExerciseLanguagePageProps) {
  const { langSlug } = await params

  const language = await getLanguageBySlug(langSlug)

  if (!language) {
    notFound()
  }

  const tutorials = await getTutorialsWithExercisesByLanguageId(language.id)
  const tutorialsWithExercises = (
    await Promise.all(
      tutorials.map(async (tutorial) => {
        const exercises = await getExercisesByTutorialId(tutorial.id)
        return { ...tutorial, exercises }
      })
    )
  ).filter((tutorial) => (tutorial.exercises?.length ?? 0) > 0)

  const totalExercises = tutorialsWithExercises.reduce(
    (sum, tutorial) => sum + (tutorial.exercises?.length ?? 0),
    0
  )

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950">
      <LanguageHeader language={language} />
      <div className="mx-auto max-w-6xl px-6 py-12">
        {tutorialsWithExercises.length > 0 ? (
          <>
            <LanguageExercisesExplorer
              language={language}
              tutorials={tutorialsWithExercises}
            />
          </>
        ) : (
          <div className="rounded-lg bg-sky-50 p-8 text-center dark:bg-slate-800">
            <p className="text-lg text-slate-600 dark:text-slate-300">
              No exercise tutorials available for {language.title} yet. Check
              back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: ExerciseLanguagePageProps) {
  const { langSlug } = await params
  const language = await getLanguageBySlug(langSlug)

  if (!language) {
    return {
      title: "Language Not Found | CodeHub",
      description: "The requested programming language was not found.",
      robots: { index: false, follow: true },
    }
  }

  const tutorials = await getTutorialsWithExercisesByLanguageId(language.id)
  const exerciseCount = (
    await Promise.all(
      tutorials.map(async (tutorial) => {
        const exercises = await getExercisesByTutorialId(tutorial.id)
        return exercises.length
      })
    )
  ).reduce((sum, count) => sum + count, 0)

  return {
    title: `${language.title} Exercises - Practice Programming | CodeHub`,
    description: `Practice ${language.title} programming with ${exerciseCount}+ hands-on exercises, coding challenges, and step-by-step tutorials. Build real skills with instant feedback.`,
    keywords: `${language.title} exercises, ${language.title} programming exercises, coding practice ${language.title}, ${language.title} challenges, learn coding ${language.title}, ${language.title} practice problems`,
    openGraph: {
      title: `${language.title} Exercises - Practice Programming`,
      description: `Practice ${language.title} with ${exerciseCount}+ hands-on exercises and coding challenges`,
      url: `https://codehubindia.in/Learn/Exercise/${langSlug}`,
      type: "website",
      siteName: "CodeHub",
      images: [
        {
          url: "https://codehubindia.in/assets/logo-sqr.png",
          width: 1200,
          height: 630,
          alt: `${language.title} Programming Exercises`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${language.title} Exercises - Practice Programming`,
      description: `Practice ${language.title} with hands-on exercises`,
      images: ["https://codehubindia.in/assets/logo-sqr.png"],
    },
    alternates: {
      canonical: `https://codehubindia.in/Learn/Exercise/${langSlug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
