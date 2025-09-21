import { AuthenticatedUser, TempUser, User, UserSession } from "../types"
import { USER_CONFIG, createId, isTemporaryUserId } from "../utils"
import { apiService } from "./APIService"
import { storageService } from "./StorageService"

/**
 * Service for user management and session handling
 */
export class UserService {
  private currentUser: AuthenticatedUser | null = null

  /**
   * Initialize user service and load current user
   */
  async initialize(): Promise<void> {
    // Try to load authenticated user from session
    const session = storageService.getUserSession()

    if (session && this.isValidSession(session)) {
      try {
        // Verify session is still valid with the server
        const user = await this.verifySession(session)
        this.currentUser = user
        return
      } catch (error) {
        console.warn("Session verification failed:", error)
        storageService.clearUserSession()
      }
    }

    // Fall back to temporary user
    this.currentUser = this.getOrCreateTempUser()
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthenticatedUser | null {
    return this.currentUser
  }

  /**
   * Get current user ID (numeric for authenticated users, string for temp users)
   */
  getCurrentUserId(): number | string | null {
    if (!this.currentUser) return null
    return this.currentUser.id
  }

  /**
   * Get numeric user ID for API calls
   */
  getNumericUserId(): number | null {
    if (!this.currentUser) return null

    if (typeof this.currentUser.id === "number") {
      return this.currentUser.id
    }

    // For temporary users, generate a hash-based numeric ID
    if (isTemporaryUserId(this.currentUser.id)) {
      return this.generateNumericIdFromTemp(this.currentUser.id)
    }

    return null
  }

  /**
   * Check if current user is authenticated (not temporary)
   */
  isAuthenticated(): boolean {
    return this.currentUser ? !isTemporaryUserId(this.currentUser.id) : false
  }

  /**
   * Check if current user is temporary
   */
  isTemporaryUser(): boolean {
    return this.currentUser ? isTemporaryUserId(this.currentUser.id) : false
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await apiService.post<{
        user: User
        token: string
        expiresAt: string
      }>("/api/auth/login", { email, password })

      const session: UserSession = {
        user: response.user,
        token: response.token,
        expiresAt: response.expiresAt,
      }

      storageService.setUserSession(session)
      storageService.clearTempUserId() // Clear temp user when logging in
      this.currentUser = response.user

      return response.user
    } catch (error) {
      throw new Error(`Login failed: ${(error as Error).message}`)
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      if (this.isAuthenticated()) {
        await apiService.post("/api/auth/logout")
      }
    } catch (error) {
      console.warn("Logout API call failed:", error)
    } finally {
      storageService.clearUserSession()
      this.currentUser = this.getOrCreateTempUser() // Switch back to temp user
    }
  }

  /**
   * Register new user
   */
  async register(
    email: string,
    password: string,
    name?: string
  ): Promise<User> {
    try {
      const response = await apiService.post<{
        user: User
        token: string
        expiresAt: string
      }>("/api/auth/register", { email, password, name })

      const session: UserSession = {
        user: response.user,
        token: response.token,
        expiresAt: response.expiresAt,
      }

      storageService.setUserSession(session)
      storageService.clearTempUserId() // Clear temp user when registering
      this.currentUser = response.user

      return response.user
    } catch (error) {
      throw new Error(`Registration failed: ${(error as Error).message}`)
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    updates: Partial<Pick<User, "name" | "email">>
  ): Promise<User> {
    if (!this.isAuthenticated()) {
      throw new Error("Must be logged in to update profile")
    }

    try {
      const updatedUser = await apiService.patch<User>(
        "/api/auth/profile",
        updates
      )

      // Update session
      const session = storageService.getUserSession()
      if (session) {
        session.user = updatedUser
        storageService.setUserSession(session)
      }

      this.currentUser = updatedUser
      return updatedUser
    } catch (error) {
      throw new Error(`Profile update failed: ${(error as Error).message}`)
    }
  }

  /**
   * Get or create temporary user
   */
  private getOrCreateTempUser(): TempUser {
    let tempId = storageService.getTempUserId()

    if (!tempId || !this.isValidTempUserId(tempId)) {
      tempId = this.generateTempUserId()
      storageService.setTempUserId(tempId)
    }

    return {
      id: tempId,
      isTemporary: true,
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Generate temporary user ID
   */
  private generateTempUserId(): string {
    return `${USER_CONFIG.TEMP_USER_PREFIX}${Date.now()}_${createId()}`
  }

  /**
   * Validate temporary user ID format
   */
  private isValidTempUserId(id: string): boolean {
    return (
      typeof id === "string" &&
      id.startsWith(USER_CONFIG.TEMP_USER_PREFIX) &&
      id.length > 10
    )
  }

  /**
   * Generate numeric ID from temporary user ID for API compatibility
   */
  private generateNumericIdFromTemp(tempId: string): number {
    // Create a consistent hash from the temp ID
    let hash = 0
    for (let i = 0; i < tempId.length; i++) {
      const char = tempId.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }

    // Ensure positive number within valid range
    const positiveHash = Math.abs(hash)
    return (
      (positiveHash % (USER_CONFIG.MAX_USER_ID - USER_CONFIG.MIN_USER_ID)) +
      USER_CONFIG.MIN_USER_ID
    )
  }

  /**
   * Verify session with server
   */
  private async verifySession(session: UserSession): Promise<User> {
    return apiService.get<User>("/api/auth/me", {
      timeout: 5000, // Quick verification
    })
  }

  /**
   * Check if session is valid (not expired)
   */
  private isValidSession(session: UserSession): boolean {
    if (!session.token || !session.expiresAt) return false

    const expiresAt = new Date(session.expiresAt)
    const now = new Date()

    // Add 5 minute buffer
    return expiresAt.getTime() > now.getTime() + 5 * 60 * 1000
  }

  /**
   * Refresh session token
   */
  async refreshSession(): Promise<void> {
    const session = storageService.getUserSession()
    if (!session) throw new Error("No session to refresh")

    try {
      const response = await apiService.post<{
        token: string
        expiresAt: string
      }>("/api/auth/refresh", { token: session.token })

      const updatedSession: UserSession = {
        ...session,
        token: response.token,
        expiresAt: response.expiresAt,
      }

      storageService.setUserSession(updatedSession)
    } catch (error) {
      // Refresh failed, clear session
      storageService.clearUserSession()
      this.currentUser = this.getOrCreateTempUser()
      throw error
    }
  }

  /**
   * Convert user for API requests (ensures numeric ID)
   */
  getAPIUserId(): number {
    const numericId = this.getNumericUserId()
    if (!numericId) {
      throw new Error("No valid user ID available")
    }
    return numericId
  }
}

// Create default instance
export const userService = new UserService()
