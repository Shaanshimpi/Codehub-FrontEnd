// app/Learn/[langSlug]/[tutorialSlug]/page.tsx
import { fetchLang, fetchTutorialsByLanguage } from "@/lib/FetchData"
import MainSpace from "./MainSpace"
import Sidebar from "./Sidebar"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default async function Page(context: {
  params: { langSlug: string; tutorialSlug: string }
}) {
  const { langSlug, tutorialSlug } = context.params

  const languages = await fetchLang()
  if (!languages || !Array.isArray(languages)) {
    return <div>Failed to load languages</div>
  }
  const lang = languages.find((lang) => generateSlug(lang.Name) === langSlug)
  if (!lang) return <div>Language not found</div>

  const tutorials = await fetchTutorialsByLanguage(lang.id)
  if (!tutorials || !Array.isArray(tutorials)) {
    return <div>Failed to load tutorials</div>
  }
  const tutorial = tutorials.find(
    (tut) => generateSlug(tut.Title) === tutorialSlug
  )
  if (!tutorial) return <div>Tutorial not found</div>

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar tutorials={tutorials} langSlug={langSlug} />
      <MainSpace tutorial={tutorial} />
    </div>
  )
}
