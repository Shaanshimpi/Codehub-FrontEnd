export interface AIModel {
  id: string
  name: string
  pricing: string
  tier: "budget" | "mid" | "premium"
  icon: string
  description: string
}

export const AI_MODELS: AIModel[] = [
  // Budget Tier - Free/Low Cost
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek Chat",
    pricing: "Free",
    tier: "budget",
    icon: "💎",
    description: "Fast and capable free model",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    pricing: "$0.15/$0.60",
    tier: "budget",
    icon: "⚡",
    description: "OpenAI's efficient small model",
  },

  // Mid Tier - Balanced
  {
    id: "google/gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    pricing: "$0.20/$0.60",
    tier: "mid",
    icon: "✨",
    description: "Google's fast multimodal model",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    pricing: "$0.80/$2.40",
    tier: "mid",
    icon: "🦙",
    description: "Meta's powerful open source model",
  },

  // Premium Tier - High Quality
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    pricing: "$2.50/$10.00",
    tier: "premium",
    icon: "🧠",
    description: "OpenAI's flagship model",
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    pricing: "$3.00/$15.00",
    tier: "premium",
    icon: "🎭",
    description: "Anthropic's most capable model",
  },
]

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
