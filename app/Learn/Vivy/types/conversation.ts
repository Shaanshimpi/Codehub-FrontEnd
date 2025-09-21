export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date | string
  model?: string
  tokens?: {
    prompt: number
    completion: number
    total: number
  }
}

export interface Conversation {
  id: string
  title: string
  model: string
  messages: Message[]
  user: number // Numeric user ID
  tags: string[]
  isPublic: boolean
  totalTokens: number
  estimatedCost: number
  createdAt: string
  updatedAt: string
}

export interface ConversationCreateRequest {
  title: string
  model: string
  messages: Message[]
  userId: number
  tags?: string[]
  isPublic?: boolean
}

export interface ConversationUpdateRequest {
  title?: string
  model?: string
  messages?: Message[]
  tags?: string[]
  isPublic?: boolean
  totalTokens?: number
  estimatedCost?: number
}

export interface ConversationsResponse {
  docs: Conversation[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

export interface ConversationSummary {
  id: string
  title: string
  model: string
  messageCount: number
  lastMessageAt: string
  estimatedCost: number
}
