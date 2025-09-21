/**
 * Compatibility layer for existing components
 * Provides the same interface as the old hooks but uses the new architecture
 */
import { useMemo } from "react"
import { useChat, useChatPage, useConversations, useUser } from "../hooks"
import { Message } from "../types"

/**
 * Legacy useConversations hook compatibility
 * Maps new hook interface to old interface
 */
export function useLegacyConversations(userId?: string) {
  const {
    conversations,
    currentConversation,
    loading,
    error,
    loadConversations,
    createConversation,
    updateConversation,
    deleteConversation,
    loadConversation,
    setCurrentConversation,
    autoSaveConversation,
  } = useConversations()

  const { numericUserId } = useUser()

  // Map new interface to old interface
  return useMemo(
    () => ({
      conversations,
      currentConversation,
      loading,
      error,

      // Map methods to match old signatures
      fetchConversations: async (page = 1, limit = 20) => {
        return loadConversations({ page, limit })
      },

      createConversation: async (
        title: string,
        model: string,
        messages: Message[],
        tags?: string[]
      ) => {
        return createConversation(title, model, messages, { tags })
      },

      updateConversation: async (conversationId: string, updates: any) => {
        return updateConversation(conversationId, updates)
      },

      deleteConversation: async (conversationId: string) => {
        return deleteConversation(conversationId)
      },

      loadConversation: async (conversationId: string) => {
        return loadConversation(conversationId)
      },

      autoSaveConversation: async (
        conversationId: string,
        messages: Message[]
      ) => {
        return autoSaveConversation(conversationId, messages)
      },

      setCurrentConversation,
    }),
    [
      conversations,
      currentConversation,
      loading,
      error,
      loadConversations,
      createConversation,
      updateConversation,
      deleteConversation,
      loadConversation,
      autoSaveConversation,
      setCurrentConversation,
    ]
  )
}

/**
 * Legacy useChat hook compatibility
 */
export function useLegacyChat() {
  const {
    messages,
    inputValue,
    isLoading,
    selectedModel,
    messagesEndRef,
    sendMessage,
    handleInputChange,
    handleModelChange,
    setMessages,
  } = useChat()

  return useMemo(
    () => ({
      messages,
      inputMessage: inputValue,
      setInputMessage: handleInputChange,
      isLoading,
      selectedModel,
      messagesEndRef,

      handleSendMessage: async () => {
        return sendMessage(inputValue)
      },

      handleModelChange,

      handleSuggestionClick: (prompt: string) => {
        handleInputChange(prompt)
      },

      setMessages,
    }),
    [
      messages,
      inputValue,
      isLoading,
      selectedModel,
      messagesEndRef,
      sendMessage,
      handleInputChange,
      handleModelChange,
      setMessages,
    ]
  )
}

/**
 * Legacy useChatPage hook compatibility
 */
export function useLegacyChatPage(
  options: {
    conversationId?: string
    isNewConversation?: boolean
  } = {}
) {
  const {
    user,
    isAuthenticated,
    conversations,
    currentConversation,
    conversationsLoading,
    messages,
    inputValue,
    isLoading,
    selectedModel,
    messagesEndRef,
    showSidebar,
    handleSendMessage,
    handleInputChange,
    handleModelChange,
    handleDeleteConversation,
    handleRenameConversation,
    handleSidebarToggle,
  } = useChatPage(options)

  return useMemo(
    () => ({
      // UI State
      showSidebar,
      setShowSidebar: handleSidebarToggle,

      // Chat State
      messages,
      inputMessage: inputValue,
      setInputMessage: handleInputChange,
      isLoading,
      selectedModel,
      messagesEndRef,
      handleSendMessage,
      handleModelChange,

      handleSuggestionClick: (prompt: string) => {
        handleInputChange(prompt)
      },

      // Conversation State
      conversations,
      currentConversation,
      conversationsLoading,
      handleDeleteConversation,
      handleRenameConversation,

      // User state
      user,
      isAuthenticated,
    }),
    [
      showSidebar,
      handleSidebarToggle,
      messages,
      inputValue,
      handleInputChange,
      isLoading,
      selectedModel,
      messagesEndRef,
      handleSendMessage,
      handleModelChange,
      conversations,
      currentConversation,
      conversationsLoading,
      handleDeleteConversation,
      handleRenameConversation,
      user,
      isAuthenticated,
    ]
  )
}
