// Re-export all types from individual modules
export * from "./user"
export * from "./api"

// Chat message interface
export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  model?: string
  tokens?: {
    prompt: number
    completion: number
    total: number
  }
}

// Common utility types
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface PaginationOptions {
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
}

export interface SearchOptions {
  query?: string
  filters?: Record<string, any>
  pagination?: PaginationOptions
}

// UI State types
export interface ChatUIState {
  showSidebar: boolean
  isTyping: boolean
  selectedMessageId: string | null
  inputValue: string
}

// Event types
export interface ChatEvent {
  type: "message_sent" | "message_received"
  payload: any
  timestamp: string
}

// Error types
export type AppError =
  | "NETWORK_ERROR"
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND"
  | "SERVER_ERROR"
  | "UNKNOWN_ERROR"

export interface AppErrorDetails {
  type: AppError
  message: string
  details?: string
  timestamp: string
  recoverable: boolean
}
