import { fetchCollection } from "@/lib/FetchDataPayload"
import { notFound } from "next/navigation"
import { Language, PageProps, Tutorial } from "../types/TutorialTypes"
import LanguageHeader from "./LanguageHeader"
import TutorialsList from "./TutorialsList"

async function getLanguageBySlug(slug: string): Promise<Language | null> {
  try {
    const languages = await fetchCollection("programming-languages", {
      where: `[slug][equals]=${slug}`,
    })
    console.log(languages)

    return languages.length > 0 ? languages[0] : null
  } catch (error) {
    console.error("Error fetching language:", error)
    return null
  }
}

async function getTutorialsByLanguageId(
  languageId: string | number
): Promise<Tutorial[]> {
  try {
    const tutorials = await fetchCollection("tutorials", {
      where: `programmingLanguage[equals]=${languageId}`,
      sort: "index",
      depth: 2, // To populate the programming language relationship
    })

    return tutorials
  } catch (error) {
    console.error("Error fetching tutorials:", error)
    return []
  }
}

export default async function LanguagePage({ params }: PageProps) {
  const { slug } = params
  console.log(slug)
  // First, get the language by slug
  const language = await getLanguageBySlug(slug)

  if (!language) {
    notFound()
  }

  // Then get tutorials for this language
  const tutorials = await getTutorialsByLanguageId(language.id)

  return (
    <div className="min-h-screen bg-slate-900">
      <LanguageHeader language={language} />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h2 className="mb-4 text-3xl font-bold text-white">
            {language.title} Tutorials
          </h2>
          <p className="text-lg text-sky-100">
            Learn {language.title} with our comprehensive tutorials and
            examples.
          </p>
        </div>

        {tutorials.length > 0 ? (
          <TutorialsList tutorials={tutorials} />
        ) : (
          <div className="rounded-lg bg-sky-50 p-8 text-center">
            <p className="text-lg text-slate-600">
              No tutorials available for {language.title} yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = params
  const language = await getLanguageBySlug(slug)

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

// Optional: Generate static params for better performance
export async function generateStaticParams() {
  try {
    const languages = await fetchCollection("programming-languages", {
      limit: 100,
    })

    return languages.map((lang: Language) => ({
      slug: lang.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}
