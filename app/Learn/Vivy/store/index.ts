// Combined store hooks for common patterns
import { useChatStore } from "./ChatStore"
import { useConversationStore } from "./ConversationStore"
import { useUserStore } from "./UserStore"

// Export all stores
export * from "./ConversationStore"
export * from "./UserStore"
export * from "./ChatStore"

// Store hooks
export { useConversationStore } from "./ConversationStore"
export { useUserStore } from "./UserStore"
export { useChatStore } from "./ChatStore"

/**
 * Hook to get all loading states
 */
export const useAppLoading = () => {
  const conversationLoading = useConversationStore(
    (state) => state.loading.isLoading
  )
  const userLoading = useUserStore((state) => state.loading.isLoading)
  const chatLoading = useChatStore((state) => state.isLoading)

  return {
    conversations: conversationLoading,
    user: userLoading,
    chat: chatLoading,
    isAnyLoading: conversationLoading || userLoading || chatLoading,
  }
}

/**
 * Hook to get all error states
 */
export const useAppErrors = () => {
  const conversationError = useConversationStore((state) => state.loading.error)
  const userError = useUserStore((state) => state.loading.error)
  const chatError = useChatStore((state) => state.error)

  const errors = [conversationError, userError, chatError].filter(Boolean)

  return {
    conversation: conversationError,
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
  const clearConversationError = useConversationStore(
    (state) => state.clearError
  )
  const clearUserError = useUserStore((state) => state.clearError)
  const clearChatError = useChatStore((state) => state.clearError)

  return () => {
    clearConversationError()
    clearUserError()
    clearChatError()
  }
}

/**
 * Hook to reset all stores
 */
export const useResetAllStores = () => {
  const resetConversationStore = useConversationStore((state) => state.reset)
  const resetUserStore = useUserStore((state) => state.reset)
  const resetChatStore = useChatStore((state) => state.reset)

  return () => {
    resetConversationStore()
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

  // Conversation state
  const conversations = useConversationStore((state) => state.conversations)
  const currentConversation = useConversationStore(
    (state) => state.currentConversation
  )
  const conversationLoading = useConversationStore(
    (state) => state.loading.isLoading
  )

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

    // Conversations
    conversations,
    currentConversation,
    conversationLoading,

    // Chat
    messages,
    inputValue,
    isTyping,
    showSidebar,
    selectedModel,

    // Combined states
    isLoading: userLoading || conversationLoading || isTyping,
    hasData: conversations.length > 0 || messages.length > 0,
  }
}

/**
 * Hook for conversation management
 */
export const useConversationActions = () => {
  const {
    loadConversations,
    loadConversation,
    createConversation,
    updateConversation,
    deleteConversation,
    duplicateConversation,
    setCurrentConversation,
    autoSaveConversation,
  } = useConversationStore()

  const { sendMessage } = useChatStore()

  return {
    loadConversations,
    loadConversation,
    createConversation,
    updateConversation,
    deleteConversation,
    duplicateConversation,
    setCurrentConversation,
    autoSaveConversation,
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
