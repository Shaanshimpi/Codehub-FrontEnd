// Exercise-specific types and interfaces
// Re-export commonly used types from the main TutorialTypes for convenience

export type {
  ExerciseAIData,
  Language,
  Tutorial,
  HintItem,
  ExplanationItem,
  ExecutionStep,
  Concept,
  VisualElements,
  TestCase,
  TestingConfig,
  SolutionApproach,
} from "@/app/Learn/types/TutorialTypes"

// Exercise-specific extended interfaces
export interface ExerciseLayoutProps {
  exercise: any
  language: any
  tutorial: any
  params: {
    langSlug: string
    tutSlug: string
    exerciseSlug: string
  }
}

export interface ExerciseProgressData {
  exerciseId: string
  progress: number
  completedAt?: Date
  timeSpent: number
  attempts: number
}

export interface ExerciseSettings {
  fontSize: number
  theme: "light" | "dark"
  showLineNumbers: boolean
  autoSave: boolean
}

export interface ExerciseState {
  currentView: "problem" | "solution"
  codeState: {
    userCode: string
    isBoilerplateLoaded: boolean
  }
  progressData: ExerciseProgressData
  settings: ExerciseSettings
}
