import { UserPreferences, UserSession } from "../types"
import { STORAGE_KEYS } from "../utils"

/**
 * Service for managing local storage operations
 */
export class StorageService {
  /**
   * Get item from localStorage with fallback
   */
  getItem<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error)
      return fallback
    }
  }

  /**
   * Set item in localStorage
   */
  setItem(key: string, value: any): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
    }
  }

  /**
   * Remove item from localStorage
   */
  private removeItem(key: string): void {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }

  /**
   * User session management
   */
  getUserSession(): UserSession | null {
    return this.getItem<UserSession | null>(STORAGE_KEYS.USER_SESSION, null)
  }

  setUserSession(session: UserSession): void {
    this.setItem(STORAGE_KEYS.USER_SESSION, session)
  }

  clearUserSession(): void {
    this.removeItem(STORAGE_KEYS.USER_SESSION)
  }

  /**
   * Temporary user ID management
   */
  getTempUserId(): string | null {
    return this.getItem<string | null>(STORAGE_KEYS.TEMP_USER_ID, null)
  }

  setTempUserId(userId: string): void {
    this.setItem(STORAGE_KEYS.TEMP_USER_ID, userId)
  }

  clearTempUserId(): void {
    this.removeItem(STORAGE_KEYS.TEMP_USER_ID)
  }

  /**
   * User preferences management
   */
  getUserPreferences(): UserPreferences {
    return this.getItem<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES, {
      defaultModel: "deepseek/deepseek-chat",
      theme: "system",
      autoSave: true,
      showTimestamps: true,
    })
  }

  setUserPreferences(preferences: Partial<UserPreferences>): void {
    const current = this.getUserPreferences()
    const updated = { ...current, ...preferences }
    this.setItem(STORAGE_KEYS.USER_PREFERENCES, updated)
  }

  /**
   * Draft messages management
   */
  getDraftMessage(conversationId: string): string | null {
    const drafts = this.getItem<Record<string, string>>(
      STORAGE_KEYS.DRAFT_MESSAGES,
      {}
    )
    return drafts[conversationId] || null
  }

  setDraftMessage(conversationId: string, message: string): void {
    const drafts = this.getItem<Record<string, string>>(
      STORAGE_KEYS.DRAFT_MESSAGES,
      {}
    )

    if (message.trim()) {
      drafts[conversationId] = message
    } else {
      delete drafts[conversationId]
    }

    this.setItem(STORAGE_KEYS.DRAFT_MESSAGES, drafts)
  }

  clearDraftMessage(conversationId: string): void {
    this.setDraftMessage(conversationId, "")
  }

  /**
   * Last used model management
   */
  getLastModel(): string | null {
    return this.getItem<string | null>(STORAGE_KEYS.LAST_MODEL, null)
  }

  setLastModel(model: string): void {
    this.setItem(STORAGE_KEYS.LAST_MODEL, model)
  }

  /**
   * Clear all app data
   */
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      this.removeItem(key)
    })
  }

  /**
   * Get storage usage info
   */
  getStorageInfo(): { used: number; available: number; quota: number } {
    if (typeof window === "undefined" || !navigator.storage?.estimate) {
      return { used: 0, available: 0, quota: 0 }
    }

    // This is async, but we return a default sync version
    // For real usage, you'd want to make this async
    return { used: 0, available: 0, quota: 0 }
  }

  /**
   * Export all data for backup
   */
  exportData(): Record<string, any> {
    const data: Record<string, any> = {}

    Object.values(STORAGE_KEYS).forEach((key) => {
      try {
        const value = localStorage.getItem(key)
        if (value) {
          data[key] = JSON.parse(value)
        }
      } catch (error) {
        console.warn(`Error exporting key "${key}":`, error)
      }
    })

    return data
  }

  /**
   * Import data from backup
   */
  importData(data: Record<string, any>): void {
    Object.entries(data).forEach(([key, value]) => {
      if (Object.values(STORAGE_KEYS).includes(key as any)) {
        this.setItem(key, value)
      }
    })
  }

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      if (typeof window === "undefined") return false

      const testKey = "__storage_test__"
      localStorage.setItem(testKey, "test")
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }
}

// Create default instance
export const storageService = new StorageService()
