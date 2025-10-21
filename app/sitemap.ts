import { type MetadataRoute } from "next"

const BASE_URL = "https://codehubindia.in"
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL
const AUTH = process.env.NEXT_PUBLIC_STRAPI_API_AUTH

const headers = {
  Authorization: `Bearer ${AUTH}`,
  "Content-Type": "application/json",
}

// Slug generator (safe)
function generateSlug(name: string | undefined): string {
  return (
    name
      ?.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") ?? ""
  )
}

// Exercise slug (Title + ID)
function generateExerciseSlug(post: any): string {
  const title = post?.Title
  const id = post?.documentId
  return title && id ? `${generateSlug(title)}-${id}` : ""
}

// Tutorial slug
function generateTutorialSlug(tutorial: any): string {
  const title = tutorial?.Title
  return generateSlug(title)
}

// Fetch exercises
async function fetchExercises() {
  try {
    const res = await fetch(
      `${API_URL}posts?populate=*&pagination[pageSize]=1000`,
      {
        headers,
        next: { revalidate: 86400 },
      }
    )
    const json = await res.json()
    return Array.isArray(json?.data) ? json.data : []
  } catch (e) {
    console.error("Failed to fetch exercises", e)
    return []
  }
}

// Fetch languages
async function fetchLanguages() {
  try {
    const res = await fetch(`${API_URL}programming-languages?populate=*`, {
      headers,
      next: { revalidate: 86400 },
    })
    const json = await res.json()
    return Array.isArray(json?.data) ? json.data : []
  } catch (e) {
    console.error("Failed to fetch languages", e)
    return []
  }
}

// Fetch tutorials for a language
async function fetchTutorialsByLang(langId: number) {
  try {
    const res = await fetch(
      `${API_URL}tutorials?filters[programming_language][id][$eq]=${langId}&populate=*`,
      {
        headers,
        next: { revalidate: 86400 },
      }
    )
    const json = await res.json()
    return Array.isArray(json?.data) ? json.data : []
  } catch (e) {
    console.error(`Failed to fetch tutorials for lang ${langId}`, e)
    return []
  }
}

// Fetch exercises for a tutorial
async function fetchExercisesByTutorial(tutorialId: number) {
  try {
    const res = await fetch(
      `${API_URL}posts?filters[tutorial][id][$eq]=${tutorialId}&populate=*&pagination[pageSize]=100`,
      {
        headers,
        next: { revalidate: 86400 },
      }
    )
    const json = await res.json()
    return Array.isArray(json?.data) ? json.data : []
  } catch (e) {
    console.error(`Failed to fetch exercises for tutorial ${tutorialId}`, e)
    return []
  }
}

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
  const languages = await fetchLanguages()

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
    const langName = lang?.Name
    const langSlug = generateSlug(langName)

    if (!langSlug || !lang.id) continue

    // Add language-level pages
    languageTutorialPages.push(`Learn/Tutorials/${langSlug}`)
    languageExercisePages.push(`Learn/Exercise/${langSlug}`)

    const tutorials = await fetchTutorialsByLang(lang.id)

    for (const tut of tutorials) {
      const tutSlug = generateTutorialSlug(tut)
      if (!tutSlug) continue

      // Add tutorial page (FIXED PATH)
      tutorialPaths.push(`Learn/Tutorials/${langSlug}/${tutSlug}`)

      // Add exercise tutorial listing page
      exercisePaths.push(`Learn/Exercise/${langSlug}/${tutSlug}`)

      // Fetch and add individual exercises
      const tutorialExercises = await fetchExercisesByTutorial(tut.id)
      for (const exercise of tutorialExercises) {
        const exerciseSlug = generateExerciseSlug(exercise)
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

  return allPaths.map((path) => ({
    url: `${BASE_URL}/${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: getChangeFrequency(path),
    priority: getPriority(path),
  }))
}

export const revalidate = 86400 // daily
