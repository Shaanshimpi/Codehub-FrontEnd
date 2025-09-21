import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { conversationService, storageService } from "../services"
import { AIModel, ChatUIState, Message } from "../types"
import { createId, debounce } from "../utils"

interface ChatState extends ChatUIState {
  // Chat State
  messages: Message[]
  isLoading: boolean
  error: string | null
  selectedModel: AIModel | null

  // Draft Management
  currentDraft: string

  // UI State
  showSidebar: boolean
  isTyping: boolean
  selectedMessageId: string | null
  inputValue: string

  // Actions
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  removeMessage: (id: string) => void
  clearMessages: () => void

  sendMessage: (content: string, conversationId?: string) => Promise<boolean>
  resendMessage: (messageId: string) => Promise<boolean>

  // Model Management
  setSelectedModel: (model: AIModel) => void

  // Draft Management
  setDraft: (content: string, conversationId?: string) => void
  loadDraft: (conversationId: string) => void
  clearDraft: (conversationId?: string) => void

  // UI Actions
  setInputValue: (value: string) => void
  setShowSidebar: (show: boolean) => void
  setIsTyping: (typing: boolean) => void
  setSelectedMessage: (id: string | null) => void
  setLoading: (loading: boolean, error?: string | null) => void
  clearError: () => void

  // Utility Actions
  scrollToBottom: () => void
  generateMessageId: () => string
  createUserMessage: (content: string) => Message
  createAssistantMessage: (content: string, model?: string) => Message

  // Reset
  reset: () => void
}

const initialState = {
  // Chat State
  messages: [],
  isLoading: false,
  error: null,
  selectedModel: null,

  // Draft Management
  currentDraft: "",

  // UI State
  showSidebar: true,
  isTyping: false,
  selectedMessageId: null,
  inputValue: "",
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setMessages: (messages) => {
        set({ messages })
      },

      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }))
      },

      updateMessage: (id, updates) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        }))
      },

      removeMessage: (id) => {
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== id),
        }))
      },

      clearMessages: () => {
        set({ messages: [] })
      },

      sendMessage: async (content, conversationId) => {
        const {
          selectedModel,
          addMessage,
          setLoading,
          createUserMessage,
          createAssistantMessage,
        } = get()

        if (!content.trim() || !selectedModel) {
          return false
        }

        setLoading(true, null)

        try {
          // Add user message
          const userMessage = createUserMessage(content.trim())
          addMessage(userMessage)

          // Clear input and draft
          set({ inputValue: "", currentDraft: "" })
          if (conversationId) {
            storageService.setDraftMessage(conversationId, "")
          }

          // Send to AI
          const currentMessages = [...get().messages, userMessage]
          const response = await conversationService.sendMessage(
            currentMessages,
            selectedModel.id
          )

          // Add assistant message
          const assistantMessage = createAssistantMessage(
            response.content,
            selectedModel.id
          )

          // Update with token information if available
          if (response.tokens) {
            assistantMessage.tokens = response.tokens
          }

          addMessage(assistantMessage)
          setLoading(false, null)

          return true
        } catch (error) {
          setLoading(false, (error as Error).message)
          return false
        }
      },

      resendMessage: async (messageId) => {
        const {
          messages,
          selectedModel,
          setLoading,
          createAssistantMessage,
          updateMessage,
        } = get()

        if (!selectedModel) return false

        const messageIndex = messages.findIndex((msg) => msg.id === messageId)
        if (messageIndex === -1) return false

        const message = messages[messageIndex]
        if (message.role !== "user") return false

        setLoading(true, null)

        try {
          // Get messages up to the selected message
          const contextMessages = messages.slice(0, messageIndex + 1)

          const response = await conversationService.sendMessage(
            contextMessages,
            selectedModel.id
          )

          // Update or add new assistant message
          const nextMessageIndex = messageIndex + 1
          const assistantMessage = createAssistantMessage(
            response.content,
            selectedModel.id
          )

          if (response.tokens) {
            assistantMessage.tokens = response.tokens
          }

          if (
            nextMessageIndex < messages.length &&
            messages[nextMessageIndex].role === "assistant"
          ) {
            // Update existing assistant message
            updateMessage(messages[nextMessageIndex].id, {
              content: response.content,
              tokens: response.tokens,
              timestamp: new Date(),
            })
          } else {
            // Insert new assistant message
            set((state) => ({
              messages: [
                ...state.messages.slice(0, nextMessageIndex),
                assistantMessage,
                ...state.messages.slice(nextMessageIndex),
              ],
            }))
          }

          setLoading(false, null)
          return true
        } catch (error) {
          setLoading(false, (error as Error).message)
          return false
        }
      },

      setSelectedModel: (model) => {
        set({ selectedModel: model })

        // Save to preferences
        if (model) {
          storageService.setLastModel(model.id)
        }
      },

      setDraft: debounce((content: string, conversationId?: string) => {
        set({ currentDraft: content })

        if (conversationId) {
          storageService.setDraftMessage(conversationId, content)
        }
      }, 500),

      loadDraft: (conversationId) => {
        const draft = storageService.getDraftMessage(conversationId)

        set({
          currentDraft: draft || "",
          inputValue: draft || "",
        })
      },

      clearDraft: (conversationId) => {
        set({ currentDraft: "", inputValue: "" })

        if (conversationId) {
          storageService.clearDraftMessage(conversationId)
        }
      },

      setInputValue: (value) => {
        set({ inputValue: value })
      },

      setShowSidebar: (show) => {
        set({ showSidebar: show })
      },

      setIsTyping: (typing) => {
        set({ isTyping: typing })
      },

      setSelectedMessage: (id) => {
        set({ selectedMessageId: id })
      },

      setLoading: (loading, error = null) => {
        set({ isLoading: loading, error })
      },

      clearError: () => {
        set({ error: null })
      },

      scrollToBottom: () => {
        // This will be handled by the UI components
        // Store just tracks the intent
        set((state) => ({ ...state }))
      },

      generateMessageId: () => {
        return createId()
      },

      createUserMessage: (content) => {
        return {
          id: get().generateMessageId(),
          role: "user" as const,
          content,
          timestamp: new Date(),
        }
      },

      createAssistantMessage: (content, model) => {
        return {
          id: get().generateMessageId(),
          role: "assistant" as const,
          content,
          timestamp: new Date(),
          model,
        }
      },

      reset: () => {
        set(initialState)
      },
    }),
    {
      name: "chat-store",
      partialize: (state) => ({
        // Don't persist sensitive chat data
        // Only persist UI preferences
        showSidebar: state.showSidebar,
      }),
    }
  )
)
