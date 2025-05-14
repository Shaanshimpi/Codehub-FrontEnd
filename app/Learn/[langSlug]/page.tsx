import { fetchLang, fetchTutorialsByLanguage } from "@/lib/FetchData"
import { redirect } from "next/navigation"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default async function LangRedirectPage({
  params,
}: {
  params: { langSlug: string }
}) {
  const languages = await fetchLang()
  const lang = languages.find(
    (language) => generateSlug(language.Name) === params.langSlug
  )

  if (!lang) return <div>Language not found</div>

  const tutorials = await fetchTutorialsByLanguage(lang.id)
  if (!tutorials || tutorials.length === 0) return <div>No tutorials found</div>
  console.log(tutorials)
  const firstTutorialSlug = generateSlug(tutorials[0].Title)

  redirect(`/Learn/${params.langSlug}/${firstTutorialSlug}`)
}
