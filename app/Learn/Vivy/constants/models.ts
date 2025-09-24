export interface AIModel {
  id: string
  name: string
  description: string
  provider: string
  contextLength: number
  pricing: {
    input: number // per million tokens
    output: number // per million tokens
    display: string // formatted display string
  }
  capabilities: {
    chat: boolean
    reasoning: boolean
    coding: boolean
    multimodal: boolean
  }
  tier: "budget" | "mid" | "premium"
  icon?: string // Optional for dynamic models
  isActive: boolean
  architecture?: any
  topProvider?: any
  perRequestLimits?: any
}

// Fallback models (used when API is unavailable)
export const AI_MODELS: AIModel[] = [
  // Budget Tier - Free/Low Cost
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek Chat",
    description: "Fast and capable free model",
    provider: "deepseek",
    contextLength: 32768,
    pricing: {
      input: 0,
      output: 0,
      display: "Free",
    },
    capabilities: {
      chat: true,
      reasoning: false,
      coding: true,
      multimodal: false,
    },
    tier: "budget",
    icon: "💎",
    isActive: true,
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "OpenAI's efficient small model",
    provider: "openai",
    contextLength: 128000,
    pricing: {
      input: 0.15,
      output: 0.6,
      display: "$0.15/$0.60",
    },
    capabilities: {
      chat: true,
      reasoning: false,
      coding: true,
      multimodal: true,
    },
    tier: "budget",
    icon: "⚡",
    isActive: true,
  },

  // Mid Tier - Balanced
  {
    id: "google/gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Google's fast multimodal model",
    provider: "google",
    contextLength: 1000000,
    pricing: {
      input: 0.2,
      output: 0.6,
      display: "$0.20/$0.60",
    },
    capabilities: {
      chat: true,
      reasoning: false,
      coding: true,
      multimodal: true,
    },
    tier: "mid",
    icon: "✨",
    isActive: true,
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    description: "Meta's powerful open source model",
    provider: "meta",
    contextLength: 131072,
    pricing: {
      input: 0.8,
      output: 2.4,
      display: "$0.80/$2.40",
    },
    capabilities: {
      chat: true,
      reasoning: false,
      coding: true,
      multimodal: false,
    },
    tier: "mid",
    icon: "🦙",
    isActive: true,
  },

  // Premium Tier - High Quality
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    description: "OpenAI's flagship model",
    provider: "openai",
    contextLength: 128000,
    pricing: {
      input: 2.5,
      output: 10.0,
      display: "$2.50/$10.00",
    },
    capabilities: {
      chat: true,
      reasoning: true,
      coding: true,
      multimodal: true,
    },
    tier: "premium",
    icon: "🧠",
    isActive: true,
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    description: "Anthropic's most capable model",
    provider: "anthropic",
    contextLength: 200000,
    pricing: {
      input: 3.0,
      output: 15.0,
      display: "$3.00/$15.00",
    },
    capabilities: {
      chat: true,
      reasoning: true,
      coding: true,
      multimodal: true,
    },
    tier: "premium",
    icon: "🎭",
    isActive: true,
  },
]

// Dynamic models will be loaded from API and stored here
export let DYNAMIC_MODELS: AIModel[] = []

export const setDynamicModels = (models: AIModel[]) => {
  DYNAMIC_MODELS = models
}

export const getAllModels = (): AIModel[] => {
  return DYNAMIC_MODELS.length > 0 ? DYNAMIC_MODELS : AI_MODELS
}

// Provider icons mapping for dynamic models
export const PROVIDER_ICONS: Record<string, string> = {
  openai: "🧠",
  anthropic: "🎭",
  google: "✨",
  meta: "🦙",
  deepseek: "💎",
  mistral: "🌊",
  cohere: "🔮",
  ai21: "🚀",
  huggingface: "🤗",
  perplexity: "🔍",
  groq: "⚡",
  together: "🤝",
  fireworks: "🎆",
  unknown: "🤖",
}

export const getModelIcon = (model: AIModel): string => {
  return model.icon || PROVIDER_ICONS[model.provider] || PROVIDER_ICONS.unknown
}

export const TIER_COLORS = {
  budget: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    badge: "bg-green-100",
  },
  mid: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    badge: "bg-blue-100",
  },
  premium: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-800",
    badge: "bg-purple-100",
  },
}

export const CONVERSATION_STARTERS = [
  {
    title: "Explain a concept",
    description: "Learn about complex topics",
    prompt: "Explain quantum computing in simple terms",
  },
  {
    title: "Code assistance",
    description: "Get help with programming",
    prompt: "Write a Python function to reverse a string",
  },
  {
    title: "Creative brainstorming",
    description: "Generate ideas and solutions",
    prompt: "Help me brainstorm ideas for a mobile app",
  },
  {
    title: "Get insights",
    description: "Stay updated on topics",
    prompt: "What are the latest trends in web development?",
  },
]
