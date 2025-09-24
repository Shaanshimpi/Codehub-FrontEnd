import {
  AIModel,
  AI_MODELS,
  getAllModels,
  setDynamicModels,
} from "../constants/models"
import { apiService } from "./APIService"
import { storageService } from "./StorageService"

interface ModelsResponse {
  models: AIModel[]
  cached: boolean
  stale?: boolean
  error?: string
  lastUpdate: string
  totalFound?: number
  filtered?: number
}

/**
 * Service for managing AI models from OpenRouter API
 */
export class ModelService {
  private isLoading = false
  private lastFetch = 0
  private retryCount = 0
  private maxRetries = 3

  /**
   * Load models from API or cache
   */
  async loadModels(forceRefresh = false): Promise<AIModel[]> {
    // Prevent multiple simultaneous requests
    if (this.isLoading) {
      console.log("⏳ Model loading already in progress")
      return this.waitForLoad()
    }

    // Check if we should use cached models
    const now = Date.now()
    const cacheAge = now - this.lastFetch
    const shouldUseCache = !forceRefresh && cacheAge < 300000 // 5 minutes

    if (shouldUseCache && getAllModels() !== AI_MODELS) {
      console.log("✅ Using cached dynamic models")
      return getAllModels()
    }

    this.isLoading = true
    console.log("🔄 Loading models from API...")

    try {
      const response = await apiService.get<ModelsResponse>("/api/models", {
        timeout: 10000, // 10 second timeout
      })

      if (response.models && Array.isArray(response.models)) {
        // Add icons to dynamic models
        const modelsWithIcons = response.models.map((model) => ({
          ...model,
          icon: this.getProviderIcon(model.provider),
        }))

        // Update dynamic models
        setDynamicModels(modelsWithIcons)
        this.lastFetch = now
        this.retryCount = 0

        // Cache models locally for offline use
        this.cacheModelsLocally(modelsWithIcons, response)

        console.log(`✅ Loaded ${modelsWithIcons.length} dynamic models`)
        console.log(`📊 Models by tier:`, this.getModelStats(modelsWithIcons))

        return modelsWithIcons
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("❌ Failed to load dynamic models:", error)

      // Try to load from local cache on error
      const cachedModels = this.getCachedModels()
      if (cachedModels.length > 0) {
        console.log("⚠️ Using locally cached models due to API error")
        setDynamicModels(cachedModels)
        return cachedModels
      }

      // Fall back to static models
      console.log("⚠️ Falling back to static models")
      return AI_MODELS
    } finally {
      this.isLoading = false
    }
  }

  /**
   * Get current models (dynamic or fallback)
   */
  getModels(): AIModel[] {
    return getAllModels()
  }

  /**
   * Filter models by capabilities
   */
  filterModels(criteria: {
    tier?: ("budget" | "mid" | "premium")[]
    capabilities?: ("chat" | "reasoning" | "coding" | "multimodal")[]
    maxPrice?: number
    minContextLength?: number
    providers?: string[]
    requireAuth?: boolean
    isAuthenticated?: boolean
  }): AIModel[] {
    const models = this.getModels()

    return models.filter((model) => {
      // Filter by tier
      if (criteria.tier && !criteria.tier.includes(model.tier)) {
        return false
      }

      // Filter by capabilities
      if (criteria.capabilities) {
        const hasRequiredCapabilities = criteria.capabilities.every(
          (capability) =>
            model.capabilities[capability as keyof typeof model.capabilities]
        )
        if (!hasRequiredCapabilities) return false
      }

      // Filter by price
      if (
        criteria.maxPrice !== undefined &&
        model.pricing.input > criteria.maxPrice
      ) {
        return false
      }

      // Filter by context length
      if (
        criteria.minContextLength !== undefined &&
        model.contextLength < criteria.minContextLength
      ) {
        return false
      }

      // Filter by providers
      if (criteria.providers && !criteria.providers.includes(model.provider)) {
        return false
      }

      // Filter by authentication requirements for paid models
      if (
        criteria.requireAuth !== undefined ||
        criteria.isAuthenticated !== undefined
      ) {
        const isPaidModel = model.pricing.input > 0 || model.pricing.output > 0

        if (isPaidModel && criteria.isAuthenticated === false) {
          return false // Hide paid models for non-authenticated users
        }
      }

      return true
    })
  }

  /**
   * Get model by ID
   */
  getModelById(id: string): AIModel | undefined {
    return this.getModels().find((model) => model.id === id)
  }

  /**
   * Get models available to user based on authentication status and Gold membership
   */
  getAvailableModels(
    isAuthenticated: boolean,
    isGoldUser: boolean = false
  ): AIModel[] {
    if (!isAuthenticated) {
      return this.getFreeModels() // Only free models for unauthenticated users
    }

    if (!isGoldUser) {
      return this.getFreeModels() // Only free models for regular authenticated users
    }

    return this.getModels() // All models for Gold+ users
  }

  /**
   * Check if a model requires authentication (is paid)
   */
  requiresAuthentication(model: AIModel): boolean {
    return model.pricing.input > 0 || model.pricing.output > 0
  }

  /**
   * Check if a model requires Gold subscription or higher
   */
  requiresGoldSubscription(model: AIModel): boolean {
    return model.pricing.input > 0 || model.pricing.output > 0
  }

  /**
   * Get free models only
   */
  getFreeModels(): AIModel[] {
    return this.getModels().filter(
      (model) => model.pricing.input === 0 && model.pricing.output === 0
    )
  }

  /**
   * Get recommended models for specific use cases
   */
  getRecommendedModels(
    useCase: "coding" | "reasoning" | "general" | "multimodal" | "budget"
  ): AIModel[] {
    const models = this.getModels()

    switch (useCase) {
      case "coding":
        return models
          .filter((m) => m.capabilities.coding && m.contextLength >= 32000)
          .slice(0, 5)

      case "reasoning":
        return models.filter((m) => m.capabilities.reasoning).slice(0, 5)

      case "multimodal":
        return models.filter((m) => m.capabilities.multimodal).slice(0, 5)

      case "budget":
        return models.filter((m) => m.tier === "budget").slice(0, 10)

      case "general":
      default:
        return models.filter((m) => m.isActive).slice(0, 12)
    }
  }

  /**
   * Check if models need refresh
   */
  shouldRefreshModels(): boolean {
    const cacheAge = Date.now() - this.lastFetch
    return cacheAge > 1800000 // 30 minutes
  }

  /**
   * Clear models cache and force refresh
   */
  async refreshModels(): Promise<AIModel[]> {
    console.log("🔄 Force refreshing models...")
    return this.loadModels(true)
  }

  // Private helper methods

  private async waitForLoad(): Promise<AIModel[]> {
    while (this.isLoading) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    return this.getModels()
  }

  private getProviderIcon(provider: string): string {
    const icons: Record<string, string> = {
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
      nvidia: "🔥",
      databricks: "📊",
    }

    return icons[provider.toLowerCase()] || "🤖"
  }

  private getModelStats(models: AIModel[]): Record<string, number> {
    const stats = { budget: 0, mid: 0, premium: 0 }
    models.forEach((model) => {
      stats[model.tier]++
    })
    return stats
  }

  private cacheModelsLocally(
    models: AIModel[],
    response: ModelsResponse
  ): void {
    try {
      storageService.setItem("vivy_dynamic_models", {
        models,
        cached: response.cached,
        lastUpdate: response.lastUpdate,
        fetchTime: Date.now(),
      })
    } catch (error) {
      console.warn("Failed to cache models locally:", error)
    }
  }

  private getCachedModels(): AIModel[] {
    try {
      const cached = storageService.getItem("vivy_dynamic_models", null)
      if (cached && Array.isArray(cached.models)) {
        const age = Date.now() - cached.fetchTime
        // Use cache if less than 24 hours old
        if (age < 86400000) {
          console.log("📦 Using locally cached models")
          return cached.models
        }
      }
    } catch (error) {
      console.warn("Failed to read cached models:", error)
    }

    return []
  }
}

// Create default instance
export const modelService = new ModelService()
