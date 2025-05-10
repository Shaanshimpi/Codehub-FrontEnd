// import { type MetadataRoute } from "next";
// // Add all your static pages here
// const staticRoutes = ["", "Exercise", "Learn", "Blog"];
// export default function sitemap(): MetadataRoute.Sitemap {
//   const baseUrl = "https://codehubindia.in";
//   const routes = staticRoutes.map((route) => ({
//     url: `${baseUrl}/${route}`,
//     lastModified: new Date().toISOString(),
//   }));
//   return [...routes];
// }
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

// Fetch all data
async function fetchAllData() {
  const [exercisesRes, langsRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/exercises`),
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/languages`),
  ])

  const exercises = await exercisesRes.json()
  const languages = await langsRes.json()

  return { exercises, languages }
}

// Fetch tutorials per language
async function fetchTutorialsByLang(langId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tutorials?lang=${langId}`
  )
  return await res.json()
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

export const revalidate = 86400 // regenerate daily
