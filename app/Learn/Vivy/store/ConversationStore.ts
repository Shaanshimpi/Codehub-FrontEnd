import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { conversationService } from "../services"
import {
  Conversation,
  LoadingState,
  Message,
  PaginationOptions,
} from "../types"

interface ConversationState {
  // State
  conversations: Conversation[]
  currentConversation: Conversation | null
  loading: LoadingState
  searchQuery: string
  pagination: {
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }

  // Actions
  loadConversations: (options?: PaginationOptions) => Promise<void>
  loadConversation: (id: string) => Promise<Conversation | null>
  createConversation: (
    title: string,
    model: string,
    messages: Message[],
    options?: { tags?: string[]; isPublic?: boolean }
  ) => Promise<Conversation | null>
  updateConversation: (
    id: string,
    updates: Partial<Conversation>
  ) => Promise<boolean>
  deleteConversation: (id: string) => Promise<boolean>
  duplicateConversation: (id: string) => Promise<Conversation | null>
  searchConversations: (
    query: string,
    options?: PaginationOptions
  ) => Promise<void>
  clearSearch: () => void
  setCurrentConversation: (conversation: Conversation | null) => void
  autoSaveConversation: (id: string, messages: Message[]) => Promise<void>

  // UI Actions
  setLoading: (isLoading: boolean, error?: string | null) => void
  clearError: () => void
  reset: () => void
}

const initialState = {
  conversations: [],
  currentConversation: null,
  loading: { isLoading: false, error: null },
  searchQuery: "",
  pagination: {
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
}

export const useConversationStore = create<ConversationState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      loadConversations: async (options = {}) => {
        const { setLoading } = get()
        setLoading(true, null)

        try {
          const response = await conversationService.getConversations(options)

          set((state) => ({
            conversations: response.docs,
            pagination: {
              page: response.page,
              totalPages: response.totalPages,
              hasNextPage: response.hasNextPage,
              hasPrevPage: response.hasPrevPage,
            },
            loading: { isLoading: false, error: null },
          }))
        } catch (error) {
          setLoading(false, (error as Error).message)
        }
      },

      loadConversation: async (id: string) => {
        const { setLoading } = get()
        setLoading(true, null)

        try {
          const conversation = await conversationService.getConversation(id)

          set((state) => ({
            currentConversation: conversation,
            loading: { isLoading: false, error: null },
          }))

          return conversation
        } catch (error) {
          setLoading(false, (error as Error).message)
          return null
        }
      },

      createConversation: async (title, model, messages, options = {}) => {
        const { setLoading } = get()
        setLoading(true, null)

        try {
          const conversation = await conversationService.createConversation(
            title,
            model,
            messages,
            options
          )

          set((state) => ({
            conversations: [conversation, ...state.conversations],
            currentConversation: conversation,
            loading: { isLoading: false, error: null },
          }))

          return conversation
        } catch (error) {
          setLoading(false, (error as Error).message)
          return null
        }
      },

      updateConversation: async (id, updates) => {
        try {
          const updatedConversation =
            await conversationService.updateConversation(id, updates)

          set((state) => ({
            conversations: state.conversations.map((conv) =>
              conv.id === id ? updatedConversation : conv
            ),
            currentConversation:
              state.currentConversation?.id === id
                ? updatedConversation
                : state.currentConversation,
          }))

          return true
        } catch (error) {
          set((state) => ({
            loading: { ...state.loading, error: (error as Error).message },
          }))
          return false
        }
      },

      deleteConversation: async (id) => {
        try {
          await conversationService.deleteConversation(id)

          set((state) => ({
            conversations: state.conversations.filter((conv) => conv.id !== id),
            currentConversation:
              state.currentConversation?.id === id
                ? null
                : state.currentConversation,
          }))

          return true
        } catch (error) {
          set((state) => ({
            loading: { ...state.loading, error: (error as Error).message },
          }))
          return false
        }
      },

      duplicateConversation: async (id) => {
        const { setLoading } = get()
        setLoading(true, null)

        try {
          const duplicated = await conversationService.duplicateConversation(id)

          set((state) => ({
            conversations: [duplicated, ...state.conversations],
            loading: { isLoading: false, error: null },
          }))

          return duplicated
        } catch (error) {
          setLoading(false, (error as Error).message)
          return null
        }
      },

      searchConversations: async (query, options = {}) => {
        const { setLoading } = get()
        setLoading(true, null)

        try {
          const response = await conversationService.searchConversations(
            query,
            options
          )

          set((state) => ({
            conversations: response.docs,
            searchQuery: query,
            pagination: {
              page: response.page,
              totalPages: response.totalPages,
              hasNextPage: response.hasNextPage,
              hasPrevPage: response.hasPrevPage,
            },
            loading: { isLoading: false, error: null },
          }))
        } catch (error) {
          setLoading(false, (error as Error).message)
        }
      },

      clearSearch: () => {
        set((state) => ({
          searchQuery: "",
        }))
        get().loadConversations()
      },

      setCurrentConversation: (conversation) => {
        set((state) => ({
          currentConversation: conversation,
        }))
      },

      autoSaveConversation: async (id, messages) => {
        try {
          await conversationService.autoSaveConversation(id, messages)

          // Silently update the conversation in the store
          set((state) => ({
            conversations: state.conversations.map((conv) =>
              conv.id === id
                ? { ...conv, messages, updatedAt: new Date().toISOString() }
                : conv
            ),
            currentConversation:
              state.currentConversation?.id === id
                ? {
                    ...state.currentConversation,
                    messages,
                    updatedAt: new Date().toISOString(),
                  }
                : state.currentConversation,
          }))
        } catch (error) {
          console.warn("Auto-save failed:", error)
          // Don't update UI state for auto-save failures
        }
      },

      setLoading: (isLoading, error = null) => {
        set((state) => ({
          loading: { isLoading, error },
        }))
      },

      clearError: () => {
        set((state) => ({
          loading: { ...state.loading, error: null },
        }))
      },

      reset: () => {
        set(initialState)
      },
    }),
    {
      name: "conversation-store",
      partialize: (state) => ({
        // Only persist current conversation for recovery
        currentConversation: state.currentConversation,
      }),
    }
  )
)
