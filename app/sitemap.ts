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

// Learn route slug
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [exercises, languages] = await Promise.all([
    fetchExercises(),
    fetchLanguages(),
  ])
  const staticPaths = ["", "Exercise", "Learn", "Blog"]

  const exercisePaths = exercises
    .map((post: any) => generateExerciseSlug(post))
    .filter(Boolean)
    .map((slug) => `Exercise/${slug}`)

  const tutorialPaths: string[] = []

  for (const lang of languages) {
    const langName = lang?.Name
    const langSlug = generateSlug(langName)

    if (!langSlug || !lang.id) continue

    const tutorials = await fetchTutorialsByLang(lang.id)

    for (const tut of tutorials) {
      const tutSlug = generateTutorialSlug(tut)
      if (tutSlug) {
        tutorialPaths.push(`Learn/${langSlug}/${tutSlug}`)
      }
    }
  }

  const allPaths = [...staticPaths, ...exercisePaths, ...tutorialPaths]

  return allPaths.map((path) => ({
    url: `${BASE_URL}/${path}`,
    lastModified: new Date().toISOString(),
  }))
}

export const revalidate = 86400 // daily
