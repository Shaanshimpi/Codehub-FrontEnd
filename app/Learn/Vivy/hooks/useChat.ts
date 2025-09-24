import { useCallback, useEffect, useRef } from "react"
import { AIModel } from "../constants/models"
import { useChatStore } from "../store"
import { scrollToBottom } from "../utils"

/**
 * Simplified hook for chat operations
 * Delegates to ChatStore and services
 */
export function useChat() {
  const {
    messages,
    isLoading,
    error,
    selectedModel,
    inputValue,
    currentDraft,
    isTyping,
    selectedMessageId,
    setMessages,
    addMessage,
    updateMessage,
    removeMessage,
    clearMessages,
    sendMessage,
    resendMessage,
    setSelectedModel,
    setDraft,
    loadDraft,
    clearDraft,
    setInputValue,
    setIsTyping,
    setSelectedMessage,
    setLoading,
    clearError,
    createUserMessage,
    createAssistantMessage,
    initialize,
  } = useChatStore()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize on first load
  useEffect(() => {
    initialize()
  }, [initialize])

  // Auto-scroll when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      scrollToBottom(messagesEndRef.current)
    }
  }, [messages])

  // Memoized actions
  const actions = {
    sendMessage: useCallback(
      async (content: string, conversationId?: string) => {
        if (!content.trim() || isLoading) return false
        return await sendMessage(content, conversationId)
      },
      [sendMessage, isLoading]
    ),

    resendMessage: useCallback(
      async (messageId: string) => {
        return await resendMessage(messageId)
      },
      [resendMessage]
    ),

    handleInputChange: useCallback(
      (value: string, conversationId?: string) => {
        setInputValue(value)
        setDraft(value, conversationId)
      },
      [setInputValue, setDraft]
    ),

    handleModelChange: useCallback(
      (model: AIModel) => {
        setSelectedModel(model)
      },
      [setSelectedModel]
    ),

    handleMessageSelect: useCallback(
      (messageId: string | null) => {
        setSelectedMessage(messageId)
      },
      [setSelectedMessage]
    ),

    addUserMessage: useCallback(
      (content: string) => {
        const message = createUserMessage(content)
        addMessage(message)
        return message
      },
      [createUserMessage, addMessage]
    ),

    addAssistantMessage: useCallback(
      (content: string, model?: string) => {
        const message = createAssistantMessage(content, model)
        addMessage(message)
        return message
      },
      [createAssistantMessage, addMessage]
    ),

    loadConversationDraft: useCallback(
      (conversationId: string) => {
        loadDraft(conversationId)
      },
      [loadDraft]
    ),

    clearConversationDraft: useCallback(
      (conversationId?: string) => {
        clearDraft(conversationId)
      },
      [clearDraft]
    ),

    clearError: useCallback(() => {
      clearError()
    }, [clearError]),

    clearAllMessages: useCallback(() => {
      clearMessages()
    }, [clearMessages]),
  }

  return {
    // State
    messages,
    inputValue,
    isLoading,
    error,
    selectedModel,
    currentDraft,
    isTyping,
    selectedMessageId,
    messagesEndRef,

    // Actions
    ...actions,

    // Message management
    setMessages,
    updateMessage,
    removeMessage,

    // UI state
    setIsTyping,
  }
}

/**
 * Hook for message operations only
 */
export function useMessages() {
  const {
    messages,
    addMessage,
    updateMessage,
    removeMessage,
    clearMessages,
    setMessages,
    createUserMessage,
    createAssistantMessage,
  } = useChatStore()

  return {
    messages,
    addMessage,
    updateMessage,
    removeMessage,
    clearMessages,
    setMessages,
    createUserMessage,
    createAssistantMessage,
  }
}

/**
 * Hook for chat input only
 */
export function useChatInput() {
  const {
    inputValue,
    currentDraft,
    isLoading,
    setInputValue,
    setDraft,
    loadDraft,
    clearDraft,
    sendMessage,
  } = useChatStore()

  const handleSend = useCallback(
    async (conversationId?: string) => {
      if (!inputValue.trim() || isLoading) return false
      return await sendMessage(inputValue, conversationId)
    },
    [inputValue, isLoading, sendMessage]
  )

  const handleInputChange = useCallback(
    (value: string, conversationId?: string) => {
      setInputValue(value)
      setDraft(value, conversationId)
    },
    [setInputValue, setDraft]
  )

  return {
    inputValue,
    currentDraft,
    isLoading,
    setInputValue: handleInputChange,
    loadDraft,
    clearDraft,
    sendMessage: handleSend,
  }
}

/**
 * Hook for model selection only
 */
export function useModelSelection() {
  const { selectedModel, setSelectedModel } = useChatStore()

  return {
    selectedModel,
    setSelectedModel,
  }
}
