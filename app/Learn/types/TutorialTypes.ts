// app/Learn/types/TutorialTypes.ts (Updated with optional test case fields)

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

export interface VisualVariable {
  name: string
  value: string
  type: string
}

// Test case related interfaces (NEW)
export interface TestCase {
  id: string
  name: string
  description: string
  input: string
  expected_output: string
  is_hidden: boolean
  difficulty: 1 | 2 | 3
  points: number
  timeout_ms: number
  test_type: "basic" | "edge_case" | "performance" | "error_handling"
}

export interface TestingConfig {
  is_testable: boolean
  reason: string
  test_type?: "function" | "complete_program" | "output_only" | "interactive"
}

export interface SolutionApproach {
  steps: string[]
  key_concepts: string[]
  common_mistakes: string[]
}

// app/Learn/types/TutorialTypes.ts
export interface MemoryState {
  step: number
  variables: {
    name: string
    value: string
    type: string
  }[]
}

export interface ExecutionStep {
  step: number
  line: string
  description: string
  output: string
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

export interface HintItem {
  text: string
  code_snippet?: string
}

export interface ExplanationItem {
  text: string
  type: "text" | "code" | "concept" | "warning" | "tip"
  code_ref?: number[]
}

// Updated ExerciseAIData interface with boilerplate_code as required
export interface ExerciseAIData {
  title_en: string
  title_hi: string
  title_mr: string
  code: string
  mermaid_diagram: string
  hints_en: HintItem[]
  explanation_en: ExplanationItem[]
  hints_hi: HintItem[]
  explanation_hi: ExplanationItem[]
  hints_mr: HintItem[]
  explanation_mr: ExplanationItem[]
  visual_elements?: VisualElements
  boilerplate_code: string
}

// Update the getLocalizedContent helper
export const getLocalizedContent = (
  exerciseData: ExerciseAIData,
  language: string
) => {
  switch (language) {
    case "hi":
      return {
        title: exerciseData.title_hi,
        hints: exerciseData.hints_hi,
        explanation: exerciseData.explanation_hi,
      }
    case "mr":
      return {
        title: exerciseData.title_mr,
        hints: exerciseData.hints_mr,
        explanation: exerciseData.explanation_mr,
      }
    default:
      return {
        title: exerciseData.title_en,
        hints: exerciseData.hints_en,
        explanation: exerciseData.explanation_en,
      }
  }
}
