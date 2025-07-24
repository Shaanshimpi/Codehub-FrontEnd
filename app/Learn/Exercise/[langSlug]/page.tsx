import { getLanguageBySlug, getTutorialsByLanguageId } from "@/lib/getData"
import { notFound } from "next/navigation"
import LanguageHeader from "./components/LanguageHeader"
import TutorialsGrid from "./components/TutorialsGrid"

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

  const tutorials = await getTutorialsByLanguageId(language.id)

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950">
      <LanguageHeader language={language} />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h2 className="mb-4 text-3xl font-bold text-white dark:text-gray-100">
            {language.title} Exercise Tutorials
          </h2>
          <p className="text-lg text-sky-100 dark:text-sky-200">
            Practice {language.title} with hands-on exercises and coding
            challenges.
          </p>
        </div>

        {tutorials.length > 0 ? (
          <TutorialsGrid tutorials={tutorials} language={language} />
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
      title: "Language Not Found",
      description: "The requested programming language was not found.",
    }
  }

  return {
    title: `${language.title} Exercises - Practice Programming`,
    description: `Practice ${language.title} programming with hands-on exercises, coding challenges, and step-by-step tutorials.`,
    keywords: `${language.title}, programming exercises, coding practice, ${language.title} challenges, learn coding`,
  }
}
