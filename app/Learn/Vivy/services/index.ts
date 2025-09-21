// Export all services
export * from "./APIService"
export * from "./StorageService"
export * from "./UserService"
export * from "./ConversationService"

// Service instances
export { apiService } from "./APIService"
export { storageService } from "./StorageService"
export { userService } from "./UserService"
export { conversationService } from "./ConversationService"

/**
 * Initialize all services
 */
export async function initializeServices(): Promise<void> {
  try {
    // Initialize user service first (loads user session)
    await userService.initialize()

    console.log("✅ Services initialized successfully")
  } catch (error) {
    console.error("❌ Service initialization failed:", error)
    throw error
  }
}

/**
 * Service health check
 */
export async function healthCheck(): Promise<{
  storage: boolean
  api: boolean
  user: boolean
}> {
  const results = {
    storage: false,
    api: false,
    user: false,
  }

  try {
    // Test storage
    results.storage = storageService.isAvailable()

    // Test API connectivity
    try {
      await apiService.get("/api/health", { timeout: 5000 })
      results.api = true
    } catch {
      results.api = false
    }

    // Test user service
    results.user = userService.getCurrentUser() !== null
  } catch (error) {
    console.error("Health check failed:", error)
  }

  return results
}
