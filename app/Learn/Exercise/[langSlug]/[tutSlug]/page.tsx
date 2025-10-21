import {
  getExercisesByTutorialId,
  getLanguageBySlug,
  getTutorialBySlug,
} from "@/lib/getData"
import { notFound } from "next/navigation"
import ExercisesWithFilter from "./components/ExercisesWithFilter"
import TutorialHeader from "./components/TutorialHeader"

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

  const tutorial = await getTutorialBySlug(tutSlug, language.id)

  if (!tutorial) {
    notFound()
  }

  const exercises = await getExercisesByTutorialId(tutorial.id)

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950">
      <TutorialHeader tutorial={tutorial} language={language} />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h2 className="mb-4 text-3xl font-bold text-white dark:text-gray-100">
            {tutorial.title} - Practice Exercises
          </h2>
          <p className="text-lg text-sky-100 dark:text-sky-200">
            Master {tutorial.title} concepts with hands-on coding exercises
          </p>
        </div>

        {exercises.length > 0 ? (
          <ExercisesWithFilter
            exercises={exercises}
            tutorial={tutorial}
            language={language}
          />
        ) : (
          <div className="rounded-lg bg-sky-50 p-8 text-center dark:bg-slate-800">
            <p className="text-lg text-slate-600 dark:text-slate-300">
              No exercises available for {tutorial.title} yet. Check back soon!
            </p>
          </div>
        )}
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
