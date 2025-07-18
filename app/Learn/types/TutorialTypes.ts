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
  previousTutorial: Tutorial
  nextTutorial: Tutorial
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
  previousTutorial: Tutorial
  nextTutorial: Tutorial
}

export interface InteractivePageProps {
  params: Promise<{
    eleSlug: string
  }>
}

export interface CodeReviewPageProps {
  language?: string
  content?: string
}

export interface Message {
  sender: string
  text: string
}

export interface CodeReviewViewProps {
  language?: string
  content?: string
  onClose?: () => void
  showCloseButton?: boolean
  className?: string
}

export interface CodeRunnerViewProps {
  language: string
  initialCode?: string
  stdin?: string
  className?: string
  showHeader?: boolean
  onHeaderAction?: (action: "settings" | "fullscreen" | "close") => void
  headerActions?: React.ReactNode
}

export interface CodeRunnerPageProps {
  language?: string
  initialCode?: string
  stdin?: string
}

// export interface ExerciseAIData {
//   title_en: string
//   title_hi: string
//   title_mr: string
//   code: string
//   hints_en: string
//   explanation_en: string
//   hints_hi: string
//   explanation_hi: string
//   hints_mr: string
//   explanation_mr: string
// }

export interface VisualVariable {
  name: string
  value: string
  type: string
}

export interface MemoryState {
  step: string
  variables: VisualVariable[]
}

export interface ExecutionStep {
  step: number
  line: string
  description: string
  output?: string
}

export interface Concept {
  name: string
  description: string
  visual_metaphor?: string
}

export interface VisualElements {
  memory_states?: MemoryState[]
  execution_steps?: ExecutionStep[]
  concepts?: Concept[]
}

export interface ExerciseAIData {
  title_en: string
  title_hi: string
  title_mr: string
  code: string
  mermaid_diagram: string
  hints_en: string
  explanation_en: string
  hints_hi: string
  explanation_hi: string
  hints_mr: string
  explanation_mr: string
  visual_elements?: VisualElements
  languages?: Language[] // Add this if needed for language detection
}
