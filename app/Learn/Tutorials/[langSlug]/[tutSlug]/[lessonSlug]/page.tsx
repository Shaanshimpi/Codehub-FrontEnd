import {
  getLanguageBySlug,
  getLanguages,
  getTutorialBySlug,
} from "@/lib/getData"
import { notFound } from "next/navigation"
import LessonView from "./components/LessonView"

interface LessonPageProps {
  params: Promise<{
    langSlug: string
    tutSlug: string
    lessonSlug: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { langSlug, tutSlug, lessonSlug } = await params

  const language = await getLanguageBySlug(langSlug)
  if (!language) {
    notFound()
  }

  // Get tutorial and all languages for header
  const [tutorial, languages] = await Promise.all([
    getTutorialBySlug(tutSlug, language.id),
    getLanguages(),
  ])

  if (!tutorial) {
    notFound()
  }

  // Find the lesson by slug or order
  const lessonIndex = parseInt(lessonSlug) - 1 // Convert to 0-based index
  const lesson = tutorial.lessons?.[lessonIndex]

  if (!lesson) {
    notFound()
  }

  return (
    <LessonView
      lesson={lesson}
      tutorial={tutorial}
      language={language}
      lessonIndex={lessonIndex}
      totalLessons={tutorial.lessons?.length || 0}
      languages={languages}
    />
  )
}

export async function generateMetadata({ params }: LessonPageProps) {
  const { langSlug, tutSlug, lessonSlug } = await params

  const language = await getLanguageBySlug(langSlug)
  if (!language) {
    return { title: "Lesson Not Found" }
  }

  const tutorial = await getTutorialBySlug(tutSlug, language.id)
  if (!tutorial) {
    return { title: "Lesson Not Found" }
  }

  const lessonIndex = parseInt(lessonSlug) - 1
  const lesson = tutorial.lessons?.[lessonIndex]

  if (!lesson) {
    return { title: "Lesson Not Found" }
  }

  return {
    title: `${lesson.title} - ${tutorial.title} | ${language.title}`,
    description: `Learn ${lesson.title} in ${tutorial.title} tutorial with interactive ${lesson.type} lesson.`,
    keywords: `${lesson.title}, ${tutorial.title}, ${language.title}, ${lesson.type} lesson, programming tutorial`,
  }
}
