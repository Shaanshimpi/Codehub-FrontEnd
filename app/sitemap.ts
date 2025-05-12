import { type MetadataRoute } from "next"

const BASE_URL = "https://codehubindia.in"

// Slug generator (shared for both)
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// Exercise slug (Title + ID)
function generateExerciseSlug(post: any): string {
  return `${generateSlug(post.Title)}-${post.documentId}`
}

// Learn route slug (lang + tutorial)
function generateTutorialSlug(tutorial: any): string {
  return generateSlug(tutorial.Title)
}

// Fetch all data (with safety)
async function fetchAllData() {
  try {
    const [exercisesRes, langsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/exercises`),
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/languages`),
    ])

    const exercisesJson = await exercisesRes.json()
    const languagesJson = await langsRes.json()

    return {
      exercises: Array.isArray(exercisesJson) ? exercisesJson : [],
      languages: Array.isArray(languagesJson) ? languagesJson : [],
    }
  } catch (error) {
    console.error("Error fetching exercise or language data:", error)
    return { exercises: [], languages: [] }
  }
}

// Fetch tutorials per language (safe fallback)
async function fetchTutorialsByLang(langId: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tutorials?lang=${langId}`
    )
    const json = await res.json()
    return Array.isArray(json) ? json : []
  } catch (error) {
    console.error(`Error fetching tutorials for lang ${langId}:`, error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { exercises, languages } = await fetchAllData()

  // Static paths
  const staticPaths = ["", "Exercise", "Learn", "Blog"]

  // Exercise pages
  const exercisePaths = exercises.map(
    (post: any) => `Exercise/${generateExerciseSlug(post)}`
  )

  // Learn pages
  const tutorialPaths: string[] = []

  for (const lang of languages) {
    const langSlug = generateSlug(lang.Name)
    const tutorials = await fetchTutorialsByLang(lang.id)

    for (const tut of tutorials) {
      const tutSlug = generateTutorialSlug(tut)
      tutorialPaths.push(`Learn/${langSlug}/${tutSlug}`)
    }
  }

  const allPaths = [...staticPaths, ...exercisePaths, ...tutorialPaths]

  return allPaths.map((path) => ({
    url: `${BASE_URL}/${path}`,
    lastModified: new Date().toISOString(),
  }))
}

export const revalidate = 86400 // Regenerate daily
