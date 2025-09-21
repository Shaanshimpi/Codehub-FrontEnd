import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useChatStore } from "../store"
import { useChat } from "./useChat"
import { useConversations } from "./useConversations"
import { useUser } from "./useUser"

interface UseChatPageOptions {
  conversationId?: string
  isNewConversation?: boolean
}

/**
 * Simplified chat page hook that combines user, conversation, and chat functionality
 * No business logic - just orchestrates the individual hooks
 */
export function useChatPage({
  conversationId,
  isNewConversation = false,
}: UseChatPageOptions = {}) {
  const router = useRouter()
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)

  // Initialize services
  const { user, isAuthenticated, numericUserId, isInitialized } = useUser()

  const {
    conversations,
    currentConversation,
    loading: conversationsLoading,
    loadConversation,
    createConversation,
    updateConversation,
    deleteConversation,
    setCurrentConversation,
    autoSaveConversation,
  } = useConversations()

  const {
    messages,
    inputValue,
    isLoading: chatLoading,
    selectedModel,
    showSidebar,
    messagesEndRef,
    sendMessage,
    handleInputChange,
    handleModelChange,
    setMessages,
    clearAllMessages,
    loadConversationDraft,
    clearConversationDraft,
  } = useChat()

  const { setShowSidebar } = useChatStore()

  // Clear conversation state for new conversation
  useEffect(() => {
    if (isNewConversation) {
      clearAllMessages()
      setCurrentConversation(null)
      clearConversationDraft()
    }
  }, [
    isNewConversation,
    clearAllMessages,
    setCurrentConversation,
    clearConversationDraft,
  ])

  // Load specific conversation when ID is provided
  useEffect(() => {
    if (
      conversationId &&
      conversationId !== "new" &&
      !isNewConversation &&
      isInitialized
    ) {
      const loadSpecificConversation = async () => {
        console.log("🔄 Loading conversation:", conversationId)
        const loaded = await loadConversation(conversationId)
        if (loaded) {
          console.log("✅ Conversation loaded:", loaded.title)
          setMessages(loaded.messages)
          setCurrentConversation(loaded)
          loadConversationDraft(conversationId)
        } else {
          console.error("❌ Failed to load conversation:", conversationId)
          router.push("/Learn/Vivy/new")
        }
      }
      loadSpecificConversation()
    }
  }, [
    conversationId,
    isNewConversation,
    isInitialized,
    loadConversation,
    setMessages,
    setCurrentConversation,
    loadConversationDraft,
    router,
  ])

  // Auto-save conversation when messages change
  useEffect(() => {
    const saveConversation = async () => {
      // Only save if we have messages and user is initialized
      if (messages.length === 0 || !isInitialized || isCreatingConversation)
        return

      // Skip if we're on the new conversation page
      if (isNewConversation) return

      if (!currentConversation) {
        // Create new conversation after first complete exchange (user + assistant)
        if (messages.length >= 2) {
          setIsCreatingConversation(true)

          const firstUserMessage = messages.find((msg) => msg.role === "user")
          const title =
            firstUserMessage?.content?.slice(0, 50) +
              (firstUserMessage?.content && firstUserMessage.content.length > 50
                ? "..."
                : "") || "New Conversation"

          try {
            const newConversation = await createConversation(
              title,
              selectedModel?.id || "deepseek/deepseek-chat",
              messages
            )

            if (newConversation?.id) {
              console.log("✅ New conversation created:", newConversation)
              setCurrentConversation(newConversation)
              router.replace(`/Learn/Vivy/${newConversation.id}`)
            }
          } catch (error) {
            console.error("Failed to create conversation:", error)
          } finally {
            setIsCreatingConversation(false)
          }
        }
      } else if (currentConversation.id) {
        // Update existing conversation with new messages
        try {
          await autoSaveConversation(currentConversation.id, messages)
        } catch (error) {
          console.error("Failed to auto-save conversation:", error)
        }
      }
    }

    // Debounce the save operation
    const timeoutId = setTimeout(saveConversation, 500)
    return () => clearTimeout(timeoutId)
  }, [
    messages,
    currentConversation,
    selectedModel,
    isInitialized,
    isNewConversation,
    isCreatingConversation,
    createConversation,
    autoSaveConversation,
    setCurrentConversation,
    router,
  ])

  // Handle conversation deletion
  const handleDeleteConversation = useCallback(
    async (conversationId: string) => {
      const success = await deleteConversation(conversationId)
      if (success && currentConversation?.id === conversationId) {
        router.push("/Learn/Vivy/new")
      }
      return success
    },
    [deleteConversation, currentConversation, router]
  )

  // Handle conversation renaming
  const handleRenameConversation = useCallback(
    async (conversationId: string, newTitle: string) => {
      return await updateConversation(conversationId, { title: newTitle })
    },
    [updateConversation]
  )

  // Handle sending messages
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || chatLoading) return false

    const success = await sendMessage(inputValue, currentConversation?.id)
    if (success && currentConversation?.id) {
      clearConversationDraft(currentConversation.id)
    }
    return success
  }, [
    inputValue,
    chatLoading,
    sendMessage,
    currentConversation,
    clearConversationDraft,
  ])

  // Handle input changes with draft saving
  const handleInputChangeWithDraft = useCallback(
    (value: string) => {
      handleInputChange(value, currentConversation?.id)
    },
    [handleInputChange, currentConversation]
  )

  // Handle sidebar toggle
  const handleSidebarToggle = useCallback(() => {
    setShowSidebar(!showSidebar)
  }, [showSidebar, setShowSidebar])

  return {
    // User state
    user,
    isAuthenticated,
    isInitialized,

    // Conversation state
    conversations,
    currentConversation,
    conversationsLoading,

    // Chat state
    messages,
    inputValue,
    isLoading: chatLoading || isCreatingConversation,
    selectedModel,
    messagesEndRef,

    // UI state
    showSidebar,

    // Actions
    handleSendMessage,
    handleInputChange: handleInputChangeWithDraft,
    handleModelChange,
    handleDeleteConversation,
    handleRenameConversation,
    handleSidebarToggle,

    // Status flags
    isCreatingConversation,
    isNewConversation,
  }
}

/**
 * Simplified version for basic chat functionality
 */
export function useSimpleChatPage() {
  const { setShowSidebar } = useChatStore()
  const [showSidebar, setShowSidebarState] = useState(true)

  const handleSidebarToggle = useCallback(() => {
    const newValue = !showSidebar
    setShowSidebarState(newValue)
    setShowSidebar(newValue)
  }, [showSidebar, setShowSidebar])

  return {
    showSidebar,
    handleSidebarToggle,
  }
}
