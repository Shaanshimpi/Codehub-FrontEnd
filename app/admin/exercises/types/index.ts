// Exercise Management Types
export interface AdminLanguage {
  id: number
  title: string
  slug: string
}

export interface AdminTutorial {
  id: number
  title: string
  slug: string
}

export interface AdminExercise {
  id: number
  title_en: string
  title_hi?: string
  title_mr?: string
  slug: string
  difficultyLevel: number
  programmingLanguage: AdminLanguage
  tutorial: AdminTutorial
  isLocked: boolean
  createdAt: string
  updatedAt: string
  solution_code?: string
  boilerplate_code?: string
  learning_objectives?: Array<{ objective: string }>
  tags?: Array<{ tag: string }>
  hints_en?: Array<{ text: string; code_snippet?: string }>
  hints_hi?: Array<{ text: string; code_snippet?: string }>
  hints_mr?: Array<{ text: string; code_snippet?: string }>
  explanation_en?: Array<{
    text: string
    type: "text" | "concept" | "warning" | "tip"
    code_ref?: number[]
  }>
  explanation_hi?: Array<{
    text: string
    type: "text" | "concept" | "warning" | "tip"
    code_ref?: number[]
  }>
  explanation_mr?: Array<{
    text: string
    type: "text" | "concept" | "warning" | "tip"
    code_ref?: number[]
  }>
  visual_elements?: {
    execution_steps: Array<{
      step: number
      line_number?: number
      line: string
      description: string
      output: string
      memory_state: Array<{
        name: string
        value: string
        type: string
        changed: boolean
      }>
    }>
    concepts: Array<{
      name: string
      description: string
      visual_metaphor: string
    }>
  }
}

export interface ExerciseFormData {
  // Basic Info
  title_en: string
  title_hi: string
  title_mr: string
  slug: string
  difficultyLevel: number
  programmingLanguage: number
  tutorial: number
  isLocked: boolean

  // Problem Statements
  problem_statement_en: string
  problem_statement_hi: string
  problem_statement_mr: string

  // Code
  solution_code: string
  boilerplate_code: string
  mermaid_diagram?: string

  // Learning Elements
  learning_objectives: string[]
  tags: string[]

  // Hints
  hints_en: Array<{ text: string; code_snippet?: string }>
  hints_hi: Array<{ text: string; code_snippet?: string }>
  hints_mr: Array<{ text: string; code_snippet?: string }>

  // Explanations
  explanation_en?: Array<{
    text: string
    type: "text" | "concept" | "warning" | "tip"
    code_ref?: number[]
  }>
  explanation_hi?: Array<{
    text: string
    type: "text" | "concept" | "warning" | "tip"
    code_ref?: number[]
  }>
  explanation_mr?: Array<{
    text: string
    type: "text" | "concept" | "warning" | "tip"
    code_ref?: number[]
  }>

  // Visual Elements
  visual_elements?: {
    execution_steps: Array<{
      step: number
      line_number?: number
      line: string
      description: string
      output: string
      memory_state: Array<{
        name: string
        value: string
        type: string
        changed: boolean
      }>
    }>
    concepts: Array<{
      name: string
      description: string
      visual_metaphor: string
    }>
  }
}

export type ExerciseView = "list" | "create-manual" | "create-ai"

export type LanguageTab = "en" | "hi" | "mr"

export interface ValidationError {
  field: string
  message: string
}

export interface ExerciseFormProps {
  onCancel: () => void
  onSuccess: () => void
}

export interface ExerciseModalProps {
  exercise: AdminExercise
  onClose: () => void
  onSave: (updatedExercise: AdminExercise) => void
}
