import { AIModel, AI_MODELS, TIER_COLORS } from "../constants/models"
import type { ModelTier, TierColors } from "../types"

export const getModelById = (id: string) => {
  return AI_MODELS.find((model) => model.id === id) || AI_MODELS[0]
}

export const getModelsByTier = (tier: ModelTier) => {
  return AI_MODELS.filter((model) => model.tier === tier)
}

export const getTierColors = (tier: ModelTier): TierColors => {
  return TIER_COLORS[tier]
}

export const formatModelDisplayName = (model: AIModel) => {
  return `${model.icon} ${model.name} (${model.pricing})`
}

export const getTierDisplayName = (tier: ModelTier): string => {
  const tierNames = {
    budget: "Budget",
    mid: "Mid-tier",
    premium: "Premium",
  }
  return tierNames[tier]
}
