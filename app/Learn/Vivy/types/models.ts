export type ModelTier = "budget" | "mid" | "premium"

export interface TierColors {
  bg: string
  border: string
  text: string
  badge: string
}

export interface AIModel {
  id: string
  name: string
  provider: string
  tier: ModelTier
  description: string
  contextLength: number
  pricing: {
    input: number // per million tokens
    output: number // per million tokens
  }
  capabilities: {
    chat: boolean
    completion: boolean
    reasoning: boolean
    coding: boolean
    multimodal: boolean
  }
  isActive: boolean
}

export interface ModelUsageStats {
  modelId: string
  totalTokens: number
  totalCost: number
  requestCount: number
  averageLatency: number
}

export interface ConversationStarter {
  title: string
  description: string
  prompt: string
  category: string
  tags: string[]
}
