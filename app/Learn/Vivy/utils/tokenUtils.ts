import { Message } from "../types"
import { TOKEN_CONFIG } from "./constants"

/**
 * Utility functions for token counting and cost calculation
 */

export const estimateTokenCount = (text: string): number => {
  if (!text || typeof text !== "string") return 0

  // Simple estimation: divide character count by average characters per token
  return Math.ceil(text.length / TOKEN_CONFIG.CHARS_PER_TOKEN)
}

export const calculateMessageTokens = (message: Message): number => {
  const contentTokens = estimateTokenCount(message.content)

  // Add some overhead for message structure (role, timestamp, etc.)
  const overheadTokens = 10

  return contentTokens + overheadTokens
}

export const calculateTotalTokens = (messages: Message[]): number => {
  return messages.reduce((total, message) => {
    return total + calculateMessageTokens(message)
  }, 0)
}

export const calculateCostForModel = (
  model: string,
  tokens: number
): number => {
  const costPerMillion =
    TOKEN_CONFIG.COST_PER_MILLION_TOKENS[
      model as keyof typeof TOKEN_CONFIG.COST_PER_MILLION_TOKENS
    ] || TOKEN_CONFIG.DEFAULT_COST_PER_MILLION

  return (tokens / 1000000) * costPerMillion
}

export const calculateConversationCost = (
  messages: Message[],
  model: string
): number => {
  const totalTokens = calculateTotalTokens(messages)
  return calculateCostForModel(model, totalTokens)
}

export const formatCost = (cost: number): string => {
  if (cost === 0) return "Free"

  if (cost < 0.001) {
    return "<$0.001"
  }

  if (cost < 0.01) {
    return `$${cost.toFixed(4)}`
  }

  if (cost < 1) {
    return `$${cost.toFixed(3)}`
  }

  return `$${cost.toFixed(2)}`
}

export const formatTokenCount = (tokens: number): string => {
  if (tokens < 1000) {
    return tokens.toString()
  }

  if (tokens < 1000000) {
    return `${(tokens / 1000).toFixed(1)}K`
  }

  return `${(tokens / 1000000).toFixed(1)}M`
}

export const getModelEfficiency = (
  model: string
): "high" | "medium" | "low" => {
  const cost =
    TOKEN_CONFIG.COST_PER_MILLION_TOKENS[
      model as keyof typeof TOKEN_CONFIG.COST_PER_MILLION_TOKENS
    ]

  if (!cost || cost === 0) return "high"
  if (cost <= 1) return "high"
  if (cost <= 5) return "medium"
  return "low"
}

export interface TokenBreakdown {
  totalTokens: number
  estimatedCost: number
  messageCount: number
  averageTokensPerMessage: number
  efficiency: "high" | "medium" | "low"
}

export const analyzeConversationUsage = (
  messages: Message[],
  model: string
): TokenBreakdown => {
  const totalTokens = calculateTotalTokens(messages)
  const estimatedCost = calculateCostForModel(model, totalTokens)
  const messageCount = messages.length
  const averageTokensPerMessage =
    messageCount > 0 ? Math.round(totalTokens / messageCount) : 0
  const efficiency = getModelEfficiency(model)

  return {
    totalTokens,
    estimatedCost,
    messageCount,
    averageTokensPerMessage,
    efficiency,
  }
}

export const predictCostForPrompt = (prompt: string, model: string): number => {
  const promptTokens = estimateTokenCount(prompt)

  // Estimate response tokens (typically 20-50% of prompt length)
  const estimatedResponseTokens = Math.ceil(promptTokens * 0.35)

  const totalEstimatedTokens = promptTokens + estimatedResponseTokens

  return calculateCostForModel(model, totalEstimatedTokens)
}
