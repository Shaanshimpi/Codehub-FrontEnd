import React from "react"
import { getLanguageBySlug, getTutorialsByLanguage } from "@/lib/getData"
import { LanguagePageProps } from "../../types/TutorialTypes"
import TutorialLanguageView from "./components/TutorialLanguageView"

export default async function TutorialLanguagePage({
  params,
}: LanguagePageProps) {
  const { langSlug } = await params

  try {
    const [language, tutorials] = await Promise.all([
      getLanguageBySlug(langSlug),
      getTutorialsByLanguage(langSlug),
    ])
    console.log(language, tutorials)

    // If no language found, create a mock one for now
    const finalLanguage = language || {
      id: 1,
      title: langSlug.charAt(0).toUpperCase() + langSlug.slice(1),
      slug: langSlug,
      index: 1,
    }

    return (
      <TutorialLanguageView
        language={finalLanguage}
        tutorials={tutorials || []}
      />
    )
  } catch (error) {
    console.error("Error loading tutorial page:", error)

    // Fallback language object
    const fallbackLanguage = {
      id: 1,
      title: langSlug.charAt(0).toUpperCase() + langSlug.slice(1),
      slug: langSlug,
      index: 1,
    }

    return <TutorialLanguageView language={fallbackLanguage} tutorials={[]} />
  }
}

export async function generateMetadata({ params }: LanguagePageProps) {
  const { langSlug } = await params

  try {
    const [language, tutorials] = await Promise.all([
      getLanguageBySlug(langSlug),
      getTutorialsByLanguage(langSlug),
    ])

    const languageTitle =
      language?.title || langSlug.charAt(0).toUpperCase() + langSlug.slice(1)
    const tutorialCount = tutorials?.length || 0

    return {
      title: `${languageTitle} Tutorials - Complete Programming Guide | CodeHub`,
      description: `Master ${languageTitle} with ${tutorialCount}+ comprehensive tutorials. Interactive lessons, code examples, quizzes, and real-world projects. From beginner to advanced level. Start learning ${languageTitle} today!`,
      keywords: `${languageTitle} tutorials, learn ${languageTitle} programming, ${languageTitle} course online, ${languageTitle} for beginners, ${languageTitle} step by step, ${languageTitle} interactive tutorials, ${languageTitle} lessons, master ${languageTitle}`,
      openGraph: {
        title: `${languageTitle} Tutorials - Complete Programming Guide`,
        description: `Master ${languageTitle} with ${tutorialCount}+ interactive tutorials and hands-on exercises`,
        url: `https://codehubindia.in/Learn/Tutorials/${langSlug}`,
        type: "website",
        siteName: "CodeHub",
        images: [
          {
            url: "https://codehubindia.in/assets/logo-sqr.png",
            width: 1200,
            height: 630,
            alt: `${languageTitle} Programming Tutorials`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${languageTitle} Tutorials - Complete Programming Guide`,
        description: `Master ${languageTitle} with interactive tutorials`,
        images: ["https://codehubindia.in/assets/logo-sqr.png"],
      },
      alternates: {
        canonical: `https://codehubindia.in/Learn/Tutorials/${langSlug}`,
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch (error) {
    const languageTitle = langSlug.charAt(0).toUpperCase() + langSlug.slice(1)
    return {
      title: `${languageTitle} Tutorials - Learn Programming | CodeHub`,
      description: `Learn ${languageTitle} programming through comprehensive tutorials with interactive lessons.`,
      keywords: `${languageTitle} tutorials, programming tutorials`,
      alternates: {
        canonical: `https://codehubindia.in/Learn/Tutorials/${langSlug}`,
      },
    }
  }
}
