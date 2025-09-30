// View-related types for Exercise components

export type ViewType = "problem" | "solution"

export interface PersistentCodeState {
  userCode: string
  isBoilerplateLoaded: boolean
}

export interface ExerciseViewProps {
  exercise: any
  language: any
  isFullscreen?: boolean
  panelWidth?: number
  onPanelResize?: (e: React.MouseEvent) => void
}

export interface CodeEditorState {
  code: string
  output: string
  isRunning: boolean
  fontSize: number
  showLineNumbers: boolean
}

export interface ProgressState {
  currentProgress: number
  isCompleted: boolean
  lastUpdated: Date
}
