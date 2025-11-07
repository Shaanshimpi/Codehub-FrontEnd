import {
  getExercisesByTutorialId,
  getLanguageBySlug,
  getTutorialBySlug,
  getTutorialsWithExercisesByLanguageId,
} from "@/lib/getData"
import { notFound } from "next/navigation"
import LanguageExercisesExplorer from "../components/LanguageExercisesExplorer"
import LanguageHeader from "../components/LanguageHeader"

interface ExerciseTutorialPageProps {
  params: Promise<{
    langSlug: string
    tutSlug: string
  }>
}

export default async function ExerciseTutorialPage({
  params,
}: ExerciseTutorialPageProps) {
  const { langSlug, tutSlug } = await params

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

  const selectedTutorial = tutorialsWithExercises.find(
    (tutorial) => tutorial.slug === tutSlug
  )

  if (!selectedTutorial) {
    notFound()
  }

  const totalExercises = tutorialsWithExercises.reduce(
    (sum, tutorial) => sum + (tutorial.exercises?.length ?? 0),
    0
  )

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950">
      <LanguageHeader language={language} />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <LanguageExercisesExplorer
          language={language}
          tutorials={tutorialsWithExercises}
          initialTutorialSlug={tutSlug}
        />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: ExerciseTutorialPageProps) {
  const { langSlug, tutSlug } = await params
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

  return {
    title: `${tutorial.title} Exercises - ${language.title} Practice | CodeHub`,
    description: `Practice ${tutorial.title} concepts with ${exerciseCount} hands-on ${language.title} exercises and coding challenges. Master ${tutorial.title} through interactive practice.`,
    keywords: `${tutorial.title} exercises, ${language.title} ${tutorial.title}, programming exercises, coding practice ${language.title}, ${tutorial.title} challenges, ${tutorial.title} practice problems`,
    openGraph: {
      title: `${tutorial.title} Exercises - ${language.title} Practice`,
      description: `Practice ${tutorial.title} with ${exerciseCount} hands-on exercises`,
      url: `https://codehubindia.in/Learn/Exercise/${langSlug}/${tutSlug}`,
      type: "website",
      siteName: "CodeHub",
      images: [
        {
          url: "https://codehubindia.in/assets/logo-sqr.png",
          width: 1200,
          height: 630,
          alt: `${tutorial.title} Exercises`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tutorial.title} Exercises - ${language.title} Practice`,
      description: `Practice ${tutorial.title} with hands-on exercises`,
      images: ["https://codehubindia.in/assets/logo-sqr.png"],
    },
    alternates: {
      canonical: `https://codehubindia.in/Learn/Exercise/${langSlug}/${tutSlug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
