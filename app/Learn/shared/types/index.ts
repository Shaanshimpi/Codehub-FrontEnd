/**
 * Shared type definitions for the Learn platform
 */

// Basic data structures
export interface Language {
  id: number
  title: string
  slug: string
  index: number
  logo: string
  description?: string
}

export interface Tutorial {
  id: number
  title: string
  slug: string
  description?: string
  difficultyLevel: number
  isLocked: boolean
  index: number
  programmingLanguage: Language | string
  createdAt: string
  updatedAt: string
}

export interface Exercise {
  id: number
  title: string
  slug: string
  description?: string
  difficultyLevel: number
  isLocked: boolean
  index: number
  tutorial: Tutorial | string
  programmingLanguage: Language | string
  createdAt: string
  updatedAt: string
}

// Common state types
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Difficulty levels
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  1: "Beginner",
  2: "Easy",
  3: "Medium",
  4: "Hard",
  5: "Expert",
}

// Component variant types
export type ComponentSize = "sm" | "md" | "lg"
export type ComponentVariant = "primary" | "secondary" | "outline" | "ghost"

// Common props interfaces
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface CardProps extends BaseComponentProps {
  variant?: ComponentVariant
  size?: ComponentSize
  disabled?: boolean
  loading?: boolean
}

// Progress tracking
export interface ProgressState {
  completed: boolean
  progress: number // 0-100
  timeSpent?: number // in seconds
  lastAccessedAt?: string
}

// Filter and sort types
export type SortOrder = "asc" | "desc"
export type SortField =
  | "title"
  | "difficultyLevel"
  | "index"
  | "createdAt"
  | "updatedAt"

export interface FilterOptions {
  difficulty?: DifficultyLevel[]
  isLocked?: boolean
  search?: string
}

export interface SortOptions {
  field: SortField
  order: SortOrder
}

// Route segment types
export interface RouteSegments {
  section?: string
  langSlug?: string
  tutSlug?: string
  exerciseSlug?: string
  fullPath: string
}

// Theme and UI types
export type ThemeMode = "light" | "dark" | "system"

// Code editor types
export interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  readOnly?: boolean
  height?: string
  theme?: "light" | "dark"
}

// Error boundary types
export interface ErrorInfo {
  componentStack: string
  errorBoundary?: string
}

// Image handling types
export interface ImageProps {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
  onError?: () => void
  onLoad?: () => void
}
