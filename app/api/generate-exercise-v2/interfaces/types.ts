// interfaces/types.ts - Type definitions for exercise generation

export interface GenerateExerciseRequest {
  questionInput: string
  selectedLanguage: string
  difficulty: number
  selectedModel: string
  exclusions?: string
}

export interface HintItem {
  text: string
  code_snippet?: string
}

export interface ExplanationItem {
  text: string
  type: "text" | "concept" | "warning" | "tip"
  code_ref?: number[]
}

export interface MemoryState {
  name: string
  value: string
  type: string
  changed: boolean
}

export interface ExecutionStep {
  step: number
  line_number?: number
  line: string
  description: string
  output: string
  memory_state: MemoryState[]
}

export interface ConceptItem {
  name: string
  description: string
  visual_metaphor: string
}

export interface VisualElements {
  execution_steps: ExecutionStep[]
  concepts: ConceptItem[]
}

export interface ExerciseResponse {
  title: string
  description: string
  solution_code: string
  mermaid_diagram: string
  hints: HintItem[]
  explanation: ExplanationItem[]
  tags: string[]
  learning_objectives: string[]
  visual_elements: VisualElements
  boilerplate_code: string
}

export interface APIError {
  error: string
  details?: string
}
