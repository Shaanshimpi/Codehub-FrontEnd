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
  multiLessonTutorial?: MultiLessonTutorial
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
  line_number?: number
  line: string
  description: string
  output: string
  memory_state?: {
    name: string
    value: string
    type: string
    changed?: boolean
  }[]
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
  solution_code: string
  mermaid_diagram: string
  hints_en: HintItem[]
  explanation_en: ExplanationItem[]
  hints_hi: HintItem[]
  explanation_hi: ExplanationItem[]
  hints_mr: HintItem[]
  explanation_mr: ExplanationItem[]
  visual_elements?: VisualElements
  boilerplate_code: string
  learning_objectives?: string[]
  tags?: string[]
}

// Update the getLocalizedContent helper
// Multi-lesson tutorial interfaces
export interface MCQOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface FillInTheBlankData {
  questions: {
    id: string
    scenario?: string
    code: string
    diagram_data?: any // JSON objects that convert to Mermaid
    blanks: {
      id: string
      position: number
      type: "text" | "dropdown" | "code"
      correctAnswer: string
      options?: string[]
      hint?: string
      explanation?: string
    }[]
    hints?: string[]
    solution?: {
      completeCode: string
      explanation: string
      diagram_data?: any // JSON objects that convert to Mermaid
    }
    difficulty?: 1 | 2 | 3
  }[]
}

export interface CodeRearrangeData {
  questions: {
    id: string
    scenario?: string
    targetCode?: string
    diagram_data?: any // JSON objects that convert to Mermaid
    blocks: {
      id: string
      code: string
      correctOrder: number
    }[]
    hints?: string[]
    difficulty?: 1 | 2 | 3
  }[]
}

export interface CodeCompletionData {
  description: string
  starterCode: string
  expectedOutput: string
  hints: string[]
}

export interface QuestionToCodeData {
  question: string
  expectedPseudocode: string[]
  expectedCode: string
  hints: string[]
}

// Enhanced lesson types for richer content
export interface ConceptLessonData {
  explanation: string
  keyPoints: string[]
  codeExamples: {
    id: string
    title: string
    code: string
    language: string
    explanation: string
    diagram_data?: any // JSON objects that convert to Mermaid
  }[]
  practiceHints: string[]
  diagram_data?: any // JSON objects that convert to Mermaid
  commonMistakes?: string[]
  bestPractices?: string[]
}

export interface PracticalExampleData {
  scenario: string
  problem: string
  stepByStepSolution: {
    step: number
    description: string
    code?: string
    output?: string
  }[]
  keyLearnings: string[]
  commonMistakes: string[]
  relatedConcepts: string[]
}

export interface InteractiveContentData {
  contentType: "text" | "code" | "quiz" | "diagram"
  content: string
  interactiveElements?: {
    type: "input" | "select" | "drag"
    question: string
    correctAnswer: string
    options?: string[]
  }[]
}

export type LessonType =
  | "concept"
  | "mcq"
  | "codeblock_rearranging"
  | "fill_in_blanks"

// Enhanced lesson interface with richer content structure
export interface TutorialLesson {
  id: string
  title: string
  type: LessonType
  order: number
  description?: string
  learningObjectives?: string[]
  keyTopics?: string[]
  estimatedTime?: number // in minutes
  difficulty?: 1 | 2 | 3
  data:
    | MCQOption[]
    | FillInTheBlankData
    | CodeRearrangeData
    | CodeCompletionData
    | QuestionToCodeData
    | ConceptLessonData
    | PracticalExampleData
    | InteractiveContentData
  prerequisites?: string[]
  followUpSuggestions?: string[]
}

export interface MultiLessonTutorial {
  id?: string
  title?: string
  description?: string
  learningObjectives: string[]
  keyTopics?: string[]
  difficulty?: 1 | 2 | 3
  lessons: TutorialLesson[]
  practicalApplications?: string[]
  tags?: string[]
  programmingLanguage?: string
  focusAreas?: string
}

// Multi-language text interface for API schema
export interface MultiLanguageText {
  en: string
  hi: string
  mr: string
}

// MCQ Question interface for API schema
export interface MCQQuestion {
  id: string
  question: string
  options: {
    id: string
    text: string
    isCorrect: boolean
  }[]
  explanation: string
  difficulty: 1 | 2 | 3
  codeSnippet?: string
  diagram_data?: any // JSON objects that convert to Mermaid
}

// Code example interface for API schema
export interface CodeExample {
  title: string
  code: string
  explanation: string
}

// Code block for rearranging exercise
export interface CodeBlock {
  id: string
  content: string
}

// Fill in the blanks interface
export interface FillInBlank {
  id: string
  type: "text" | "dropdown" | "code"
  correctAnswer: string
  options?: string[]
  hint?: string
  explanation: string
}

// Solution interface for fill in blanks
export interface BlanksSolution {
  completeCode: string
  explanation: string
}

// Lesson content based on API schema
export interface LessonContent {
  // Concept lesson content
  explanation?: string
  keyPoints?: string[]
  codeExamples?: CodeExample[]
  practiceHints?: string[]
  commonMistakes?: string[]
  bestPractices?: string[]

  // MCQ lesson content
  questions?: MCQQuestion[]

  // Code block rearranging content
  scenario?: string
  targetCode?: string
  codeBlocks?: CodeBlock[]
  correctOrder?: string[]
  hints?: string[]
  difficulty?: 1 | 2 | 3
  estimatedTime?: number

  // Fill in blanks content
  codeTemplate?: string
  blanks?: FillInBlank[]
  solution?: BlanksSolution
}

// Tutorial lesson based on API schema
export interface APITutorialLesson {
  id: string
  title: MultiLanguageText
  type: "concept" | "mcq" | "codeblock_rearranging" | "fill_in_blanks"
  content: LessonContent
  learningObjectives: MultiLanguageText[]
  difficulty: 1 | 2 | 3
  tags: string[]
  order: number
  estimatedTime: number
}

// Unified Tutorial Data Interface - Used by both AI and Manual tutorials
export interface TutorialData {
  id: string
  title: string
  description: string
  keyTopics: string[]
  difficulty: 1 | 2 | 3
  lessons: {
    id: string
    title: string
    type: "concept" | "mcq" | "codeblock_rearranging" | "fill_in_blanks"
    content: LessonContent
    order: number
  }[]
  practicalApplications: string[]
  tags: string[]
  prerequisites?: string[]
  programmingLanguage?: string
  focusAreas?: string
  reference?: {
    title: string
    subtitle: string
    introduction: string
    examples: {
      title: string
      description: string
      code: string
      explanation: string
      output?: string
    }[]
    key_points: string[]
    common_mistakes: {
      mistake: string
      why_wrong: string
      correct_approach: string
    }[]
    syntax_guide: {
      basic_syntax: string
      parameters: {
        name: string
        description: string
        required: boolean
      }[]
    }
  }
}

// Legacy alias for backward compatibility
export interface TutorialAIData extends TutorialData {}

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
