import { getLanguageBySlug, getTutorialsByLanguageId } from "@/lib/getData"
import { TutorialPageProps } from "../../types/TutorialTypes"

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { langSlug, tutSlug } = await params

  //   Get the language by slug
  const language = await getLanguageBySlug(langSlug)

  //   if (!language) {
  //     notFound()
  //   }

  // Get the specific tutorial
  //   const tutorial = await getTutorialBySlug(tutSlug, language.id)

  //   if (!tutorial) {
  //     notFound()
  //   }

  // Get all tutorials for navigation
  const allTutorials = await getTutorialsByLanguageId(language.id)

  // Find current tutorial index for navigation
  const currentIndex = allTutorials.findIndex((t) => t.slug === tutSlug)
  const previousTutorial =
    currentIndex > 0 ? allTutorials[currentIndex - 1] : null
  const nextTutorial =
    currentIndex < allTutorials.length - 1
      ? allTutorials[currentIndex + 1]
      : null

  return <div>{/* <TutorialPageContent /> */}</div>
}
