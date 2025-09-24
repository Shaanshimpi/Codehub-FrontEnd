// Combined store hooks for common patterns
import { useChatStore } from "./ChatStore"
import { useUserStore } from "./UserStore"

// Export all stores
export * from "./UserStore"
export * from "./ChatStore"

// Store hooks
export { useUserStore } from "./UserStore"
export { useChatStore } from "./ChatStore"

/**
 * Hook to get all loading states
 */
export const useAppLoading = () => {
  const userLoading = useUserStore((state) => state.loading.isLoading)
  const chatLoading = useChatStore((state) => state.isLoading)

  return {
    user: userLoading,
    chat: chatLoading,
    isAnyLoading: userLoading || chatLoading,
  }
}

/**
 * Hook to get all error states
 */
export const useAppErrors = () => {
  const userError = useUserStore((state) => state.loading.error)
  const chatError = useChatStore((state) => state.error)

  const errors = [userError, chatError].filter(Boolean)

  return {
    user: userError,
    chat: chatError,
    hasErrors: errors.length > 0,
    firstError: errors[0] || null,
    allErrors: errors,
  }
}

/**
 * Hook to clear all errors
 */
export const useClearAllErrors = () => {
  const clearUserError = useUserStore((state) => state.clearError)
  const clearChatError = useChatStore((state) => state.clearError)

  return () => {
    clearUserError()
    clearChatError()
  }
}

/**
 * Hook to reset all stores
 */
export const useResetAllStores = () => {
  const resetUserStore = useUserStore((state) => state.reset)
  const resetChatStore = useChatStore((state) => state.reset)

  return () => {
    resetUserStore()
    resetChatStore()
  }
}

/**
 * Hook for chat page state management
 */
export const useChatPageState = () => {
  // User state
  const user = useUserStore((state) => state.currentUser)
  const isAuthenticated = useUserStore((state) => state.isAuthenticated())
  const userLoading = useUserStore((state) => state.loading.isLoading)

  // Chat state
  const messages = useChatStore((state) => state.messages)
  const inputValue = useChatStore((state) => state.inputValue)
  const isTyping = useChatStore((state) => state.isLoading)
  const showSidebar = useChatStore((state) => state.showSidebar)
  const selectedModel = useChatStore((state) => state.selectedModel)

  return {
    // User
    user,
    isAuthenticated,
    userLoading,

    // Chat
    messages,
    inputValue,
    isTyping,
    showSidebar,
    selectedModel,

    // Combined states
    isLoading: userLoading || isTyping,
    hasData: messages.length > 0,
  }
}

/**
 * Hook for chat actions
 */
export const useChatActions = () => {
  const { sendMessage } = useChatStore()

  return {
    sendMessage,
  }
}

/**
 * Hook for user actions
 */
export const useUserActions = () => {
  const {
    initialize,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    refreshSession,
  } = useUserStore()

  return {
    initialize,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    refreshSession,
  }
}
