import { fetchCollection } from "@/lib/FetchDataPayload"
import { getLanguageBySlug, getTutorialsByLanguageId } from "@/lib/getData"
import { notFound } from "next/navigation"
import { Language } from "../types/TutorialTypes"
import LanguageHeader from "./LanguageHeader"
import TutorialsList from "./TutorialsList"
import TryYourSelfSection from "./[tutSlug]/components/TryYourSelfDirectory/TryYourSelfSection"

interface LanguagePageProps {
  params: Promise<{
    langSlug: string
  }>
}

// async function getLanguageBySlug(langSlug: string): Promise<Language | null> {
//   try {
//     const languages = await fetchCollection("programming-languages", {
//       where: `[slug][equals]=${langSlug}`,
//     })

//     return languages.length > 0 ? languages[0] : null
//   } catch (error) {
//     console.error("Error fetching language:", error)
//     return null
//   }
// }

// async function getTutorialsByLanguageId(
//   languageId: string | number
// ): Promise<Tutorial[]> {
//   try {
//     const tutorials = await fetchCollection("tutorials", {
//       where: `programmingLanguage[equals]=${languageId}`,
//       sort: "index",
//       depth: 2,
//     })

//     return tutorials
//   } catch (error) {
//     console.error("Error fetching tutorials:", error)
//     return []
//   }
// }

export default async function LanguagePage({ params }: LanguagePageProps) {
  const { langSlug } = await params
  console.log("Language slug:", langSlug)

  const language = await getLanguageBySlug(langSlug)

  if (!language) {
    console.log("Language not found for slug:", langSlug)
    notFound()
  }

  const tutorials = await getTutorialsByLanguageId(language.id)

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950">
      <LanguageHeader language={language} />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h2 className="mb-4 text-3xl font-bold text-white dark:text-gray-100">
            {language.title} Tutorials
          </h2>
          <p className="text-lg text-sky-100 dark:text-sky-200">
            Learn {language.title} with our comprehensive tutorials and
            examples.
          </p>
        </div>
        <TryYourSelfSection language={language} />

        {tutorials.length > 0 ? (
          <TutorialsList tutorials={tutorials} />
        ) : (
          <div className="rounded-lg bg-sky-50 p-8 text-center dark:bg-slate-800">
            <p className="text-lg text-slate-600 dark:text-slate-300">
              No tutorials available for {language.title} yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: LanguagePageProps) {
  const { langSlug } = await params
  const language = await getLanguageBySlug(langSlug)

  if (!language) {
    return {
      title: "Language Not Found",
      description: "The requested programming language was not found.",
    }
  }

  return {
    title: `Learn ${language.title} - Programming Tutorials`,
    description: `Learn ${language.title} programming with our comprehensive tutorials, examples, and step-by-step guides.`,
    keywords: `${language.title}, programming, tutorials, learn coding, ${language.title} examples`,
  }
}

export async function generateStaticParams() {
  try {
    const languages = await fetchCollection("programming-languages", {
      limit: 100,
    })

    return languages.map((lang: Language) => ({
      langSlug: lang.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}
