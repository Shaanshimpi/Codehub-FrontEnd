export interface Language {
  id: string | number
  title: string
  index: number
  slug: string
  [key: string]: any
}

export interface Tutorial {
  id: string | number
  title: string
  slug: string
  index: number
  programmingLanguage: string | Language
  content: string
  [key: string]: any
}

export interface TutorialPageProps {
  params: Promise<{
    langSlug: string
    tutSlug: string
  }>
}

export interface LanguagePageProps {
  params: Promise<{
    langSlug: string
  }>
}

export interface TutorialPageContentProps {
  tutorial: Tutorial
  language: Language
  allTutorials: Tutorial[]
  previousTutorial: Tutorial | null
  nextTutorial: Tutorial | null
}

export interface TutorialContentProps {
  content: string
}

export interface TutorialNavigationProps {
  language: Language
  previousTutorial: Tutorial | null
  nextTutorial: Tutorial | null
}

export interface TutorialBreadcrumbProps {
  language: Language
  tutorial: Tutorial
}

export interface TutorialHeaderProps {
  tutorial: Tutorial
  language: Language
  allTutorials: Tutorial[]
}
