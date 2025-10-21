import {
  getExercisesByTutorialId,
  getLanguages,
  getTutorialsByLanguageId,
} from "@/lib/getData"
import { type MetadataRoute } from "next"

const BASE_URL = "https://codehubindia.in"

// Get priority based on path
function getPriority(path: string): number {
  if (path === "" || path === "Learn") return 1.0
  if (path.match(/^Learn\/(Tutorials|Exercise)$/)) return 0.9
  if (path.match(/^Learn\/(Tutorials|Exercise)\/[^/]+$/)) return 0.8
  if (path.match(/^Learn\/Tutorials\/[^/]+\/[^/]+$/)) return 0.7
  if (path.match(/^Learn\/Exercise\/[^/]+\/[^/]+$/)) return 0.7
  if (path.match(/^Learn\/Exercise\/[^/]+\/[^/]+\/[^/]+$/)) return 0.6
  if (path.includes("Vivy")) return 0.6
  if (path === "Learn/upgrade") return 0.7
  return 0.5
}

// Get change frequency
function getChangeFrequency(
  path: string
): "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" {
  if (path === "" || path === "Learn") return "daily"
  if (path.match(/^Learn\/(Tutorials|Exercise)$/)) return "daily"
  if (path.match(/^Learn\/(Tutorials|Exercise)\/[^/]+$/)) return "weekly"
  if (path.includes("Tutorial") || path.includes("Exercise")) return "weekly"
  return "monthly"
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log("🗺️ [SITEMAP] Starting sitemap generation...")

  try {
    const languages = await getLanguages()
    console.log(`🗺️ [SITEMAP] Fetched ${languages.length} languages`)

    // Static pages (home, blog, etc.)
    const staticPaths = ["", "Blog"]

    // Learn static pages (excluding Vivy-image)
    const learnStaticPages = [
      "Learn",
      "Learn/Tutorials",
      "Learn/Exercise",
      "Learn/Vivy",
      "Learn/upgrade",
    ]

    // Dynamic paths
    const tutorialPaths: string[] = []
    const exercisePaths: string[] = []
    const languageTutorialPages: string[] = []
    const languageExercisePages: string[] = []

    for (const lang of languages) {
      const langSlug = lang?.slug
      const langName = lang?.title

      if (!langSlug || !lang.id) {
        console.log(`⚠️ [SITEMAP] Skipping language with missing slug or id`)
        continue
      }

      console.log(`🗺️ [SITEMAP] Processing language: ${langName} (${langSlug})`)

      // Add language-level pages
      languageTutorialPages.push(`Learn/Tutorials/${langSlug}`)
      languageExercisePages.push(`Learn/Exercise/${langSlug}`)

      const tutorials = await getTutorialsByLanguageId(lang.id)
      console.log(
        `🗺️ [SITEMAP] Found ${tutorials.length} tutorials for ${langName}`
      )

      for (const tut of tutorials) {
        const tutSlug = tut?.slug
        if (!tutSlug) {
          console.log(
            `⚠️ [SITEMAP] Skipping tutorial with missing slug: ${tut?.title}`
          )
          continue
        }

        // Add tutorial page
        tutorialPaths.push(`Learn/Tutorials/${langSlug}/${tutSlug}`)

        // Add exercise tutorial listing page
        exercisePaths.push(`Learn/Exercise/${langSlug}/${tutSlug}`)

        // Fetch and add individual exercises
        const tutorialExercises = await getExercisesByTutorialId(tut.id)
        if (tutorialExercises.length > 0) {
          console.log(
            `🗺️ [SITEMAP] Found ${tutorialExercises.length} exercises for tutorial: ${tut.title}`
          )
        }

        for (const exercise of tutorialExercises) {
          const exerciseSlug = exercise?.slug
          if (exerciseSlug) {
            exercisePaths.push(
              `Learn/Exercise/${langSlug}/${tutSlug}/${exerciseSlug}`
            )
          }
        }
      }
    }

    const allPaths = [
      ...staticPaths,
      ...learnStaticPages,
      ...languageTutorialPages,
      ...languageExercisePages,
      ...tutorialPaths,
      ...exercisePaths,
    ]

    console.log(`🗺️ [SITEMAP] Generated sitemap with ${allPaths.length} URLs:`)
    console.log(`   - Static pages: ${staticPaths.length}`)
    console.log(`   - Learn static pages: ${learnStaticPages.length}`)
    console.log(`   - Language tutorial pages: ${languageTutorialPages.length}`)
    console.log(`   - Language exercise pages: ${languageExercisePages.length}`)
    console.log(`   - Tutorial pages: ${tutorialPaths.length}`)
    console.log(`   - Exercise pages: ${exercisePaths.length}`)

    return allPaths.map((path) => ({
      url: `${BASE_URL}/${path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: getChangeFrequency(path),
      priority: getPriority(path),
    }))
  } catch (error) {
    console.error("❌ [SITEMAP] Error generating sitemap:", error)

    // Return at least static pages if dynamic fetch fails
    const fallbackPaths = [
      "",
      "Blog",
      "Learn",
      "Learn/Tutorials",
      "Learn/Exercise",
      "Learn/Vivy",
      "Learn/upgrade",
    ]

    return fallbackPaths.map((path) => ({
      url: `${BASE_URL}/${path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  }
}

export const revalidate = 86400 // daily
