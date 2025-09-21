// Image generation API types
export interface ImageGenerationRequest {
  prompt: string
  model?: string
}

export interface ImageGenerationResponse {
  images: GeneratedImage[]
  textContent?: string
  tokens: {
    prompt: number
    completion: number
    total: number
  }
  model: string
  id: string
  created: number
  prompt: string
}

export interface GeneratedImage {
  url: string
  type: string
}

// Error handling types
export interface ImageGenerationError {
  error: string
  details?: string
}

// UI state types
export interface ImageGenerationState {
  isGenerating: boolean
  currentPrompt: string
  generatedImages: GeneratedImage[]
  error: string | null
  lastResponse: ImageGenerationResponse | null
}

// Available models for image generation
export interface ImageModel {
  id: string
  name: string
  description?: string
  maxTokens?: number
}

export const IMAGE_MODELS: ImageModel[] = [
  {
    id: "google/gemini-2.5-flash-image-preview",
    name: "Gemini 2.5 Flash Image Preview",
    description: "State-of-the-art image generation with character consistency",
    maxTokens: 1000,
  },
]

// Constants
export const IMAGE_GENERATION_ENDPOINT = "/api/generate-image"
export const DEFAULT_MODEL = "google/gemini-2.5-flash-image-preview"
