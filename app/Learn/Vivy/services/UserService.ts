import { fetchCurrentUser, loginUser, logoutUser } from "@/lib/auth/api"
import { canAccessPremiumModels } from "@/lib/auth/permissions"
import { User } from "@/lib/auth/types"

/**
 * Service for user management and session handling
 * Integrates with the existing auth system
 */
export class UserService {
  private currentUser: User | null = null

  /**
   * Initialize user service and load current user
   */
  async initialize(): Promise<void> {
    try {
      const user = await fetchCurrentUser()
      this.currentUser = user
    } catch (error) {
      console.warn("Failed to load current user:", error)
      this.currentUser = null
    }
  }

  /**
   * Refresh current user data
   */
  async refresh(): Promise<void> {
    await this.initialize()
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    if (!this.currentUser) return null
    return this.currentUser.id
  }

  /**
   * Check if current user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.currentUser.isActive
  }

  /**
   * Check if current user has Gold subscription or higher (Gold, Editor, Admin)
   */
  isGoldUser(): boolean {
    return canAccessPremiumModels(this.currentUser)
  }

  /**
   * Get current user role
   */
  getUserRole(): string {
    if (!this.currentUser) return "guest"
    return this.currentUser.role
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const user = await loginUser(email, password)
      this.currentUser = user
      return user
    } catch (error) {
      throw new Error(`Login failed: ${(error as Error).message}`)
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await logoutUser()
    } catch (error) {
      console.warn("Logout API call failed:", error)
    } finally {
      this.currentUser = null
    }
  }
}

// Create default instance
export const userService = new UserService()
