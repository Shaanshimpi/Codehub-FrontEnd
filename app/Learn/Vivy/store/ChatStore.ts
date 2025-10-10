import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { AIModel, getAllModels } from "../constants/models"
import {
  apiService,
  modelService,
  storageService,
  userService,
} from "../services"
import { BudgetInfo, ChatUIState, Message } from "../types"
import { createId, debounce } from "../utils"

interface ChatState extends ChatUIState {
  // Chat State
  messages: Message[]
  isLoading: boolean
  error: string | null
  selectedModel: AIModel | null
  budget: BudgetInfo | null

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

  // Budget Management
  setBudget: (budget: BudgetInfo | null) => void

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

  // Initialization
  initialize: () => void

  // Reset
  reset: () => void
}

const initialState = {
  // Chat State
  messages: [],
  isLoading: false,
  error: null,
  selectedModel: null,
  budget: null,

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

        // Check authentication and Gold subscription for paid models
        const isAuthenticated = userService.isAuthenticated()
        const isGoldUser = userService.isGoldUser()
        const requiresGold =
          modelService.requiresGoldSubscription(selectedModel)

        if (requiresGold && !isGoldUser) {
          if (!isAuthenticated) {
            setLoading(
              false,
              "Please log in with a Gold account to use this premium model. Free models are available without login."
            )
          } else {
            setLoading(
              false,
              "This premium model requires a Gold subscription. Please upgrade your account or use free models."
            )
          }
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
          const response = await apiService.post<{
            content: string
            tokens?: {
              prompt: number
              completion: number
              total: number
            }
            model: string
            cost?: number
            budget?: BudgetInfo | null
            id?: string
            created?: number
          }>("/api/chat", {
            messages: currentMessages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            model: selectedModel.id,
          })

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

          // Update budget if provided (for Gold+ users)
          if (response.budget !== undefined) {
            get().setBudget(response.budget)
          }

          setLoading(false, null)

          return true
        } catch (error: any) {
          console.log("❌ Chat error caught:", error)
          console.log("❌ Error response:", error?.response)

          // Check if it's a rate limit error with suggestions
          let errorMessage = error?.message || "An error occurred"

          // If the error response contains suggested models, format a helpful message
          if (error?.response?.suggestedModels) {
            const suggestions = error.response.suggestedModels
              .slice(0, 3)
              .join(", ")
            errorMessage = `🚦 ${errorMessage}\n\n💡 Try switching to: ${suggestions}`
          } else if (
            errorMessage.includes("429") ||
            errorMessage.includes("rate limit") ||
            errorMessage.includes("heavy load")
          ) {
            errorMessage =
              "🚦 This model is experiencing heavy load. Please try a different model from the dropdown above."
          }

          console.log("❌ Final error message:", errorMessage)
          setLoading(false, errorMessage)
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

          const response = await apiService.post<{
            content: string
            tokens?: {
              prompt: number
              completion: number
              total: number
            }
            model: string
            cost?: number
            budget?: BudgetInfo | null
            id?: string
            created?: number
          }>("/api/chat", {
            messages: contextMessages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            model: selectedModel.id,
          })

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

          // Update budget if provided (for Gold+ users)
          if (response.budget !== undefined) {
            get().setBudget(response.budget)
          }

          setLoading(false, null)
          return true
        } catch (error: any) {
          // Check if it's a rate limit error with suggestions
          let errorMessage = error?.message || "An error occurred"

          // If the error response contains suggested models, format a helpful message
          if (error?.response?.suggestedModels) {
            const suggestions = error.response.suggestedModels
              .slice(0, 3)
              .join(", ")
            errorMessage = `🚦 ${errorMessage}\n\n💡 Try switching to: ${suggestions}`
          } else if (
            errorMessage.includes("429") ||
            errorMessage.includes("rate limit") ||
            errorMessage.includes("heavy load")
          ) {
            errorMessage =
              "🚦 This model is experiencing heavy load. Please try a different model from the dropdown above."
          }

          setLoading(false, errorMessage)
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

      setBudget: (budget) => {
        set({ budget })
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

      initialize: async () => {
        try {
          // Load dynamic models first
          await modelService.loadModels()

          // Check authentication status and Gold membership
          const isAuthenticated = userService.isAuthenticated()
          const isGoldUser = userService.isGoldUser()

          // Set default model if none selected
          const { selectedModel } = get()
          if (!selectedModel) {
            // Get models available to the user based on auth status and Gold membership
            const availableModels = modelService.getAvailableModels(
              isAuthenticated,
              isGoldUser
            )

            // Try to load from storage or use first available model
            const lastModelId = storageService.getLastModel()
            let defaultModel = lastModelId
              ? availableModels.find((m) => m.id === lastModelId)
              : null

            // If last model is not available (e.g., paid model for non-authenticated user),
            // use first available model
            if (!defaultModel && availableModels.length > 0) {
              defaultModel = availableModels[0]
            }

            if (defaultModel) {
              set({ selectedModel: defaultModel })
              console.log(
                `✅ Initialized with model: ${defaultModel.name} (Auth: ${isAuthenticated}, Gold: ${isGoldUser})`
              )
            }
          } else {
            // Check if current model is still available to the user
            const requiresGold =
              modelService.requiresGoldSubscription(selectedModel)
            if (requiresGold && !isGoldUser) {
              // Switch to a free model
              const freeModels = modelService.getFreeModels()
              if (freeModels.length > 0) {
                set({ selectedModel: freeModels[0] })
                console.log(
                  `⚠️ Switched to free model due to Gold subscription requirement: ${freeModels[0].name}`
                )
              }
            }
          }
        } catch (error) {
          console.error("❌ Failed to initialize models:", error)
          // Fallback to static models
          const availableModels = getAllModels()
          if (availableModels.length > 0) {
            set({ selectedModel: availableModels[0] })
          }
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
