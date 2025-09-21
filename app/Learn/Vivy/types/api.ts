export interface APIResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface APIError {
  error: string
  details?: string
  status: number
  timestamp: string
}

export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

export interface ChatRequest {
  messages: Array<{
    role: "user" | "assistant"
    content: string
  }>
  model: string
  stream?: boolean
  temperature?: number
  maxTokens?: number
}

export interface ChatResponse {
  content: string
  tokens: {
    prompt: number
    completion: number
    total: number
  }
  model: string
  id: string
  created: number
  finishReason?: string
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface APIRequestConfig {
  timeout?: number
  retries?: number
  retryDelay?: number
  signal?: AbortSignal
}
