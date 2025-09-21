import { useEffect } from "react"
import { useUserStore } from "../store"

/**
 * Simplified hook for user operations
 * Delegates to UserStore and UserService
 */
export function useUser() {
  const {
    currentUser,
    preferences,
    loading,
    isInitialized,
    initialize,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    refreshSession,
    isAuthenticated,
    isTemporary,
    getUserId,
    getNumericUserId,
    setLoading,
    clearError,
  } = useUserStore()

  // Initialize user service on mount
  useEffect(() => {
    if (!isInitialized) {
      initialize()
    }
  }, [isInitialized, initialize])

  return {
    // State
    user: currentUser,
    preferences,
    loading: loading.isLoading,
    error: loading.error,
    isInitialized,

    // Computed state
    isAuthenticated: isAuthenticated(),
    isTemporary: isTemporary(),
    userId: getUserId(),
    numericUserId: getNumericUserId(),

    // Actions
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    refreshSession,

    // UI actions
    clearError,
  }
}

/**
 * Hook for authentication status only
 */
export function useAuth() {
  const { currentUser, isAuthenticated, isTemporary } = useUserStore()

  return {
    user: currentUser,
    isAuthenticated: isAuthenticated(),
    isTemporary: isTemporary(),
    isLoading: currentUser === null, // Simple loading check
  }
}

/**
 * Hook for user preferences only
 */
export function useUserPreferences() {
  const { preferences, updatePreferences } = useUserStore()

  return {
    preferences,
    updatePreferences,
  }
}
