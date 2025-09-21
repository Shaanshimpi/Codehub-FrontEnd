import { useCallback } from "react"
import { useConversationStore } from "../store"
import { PaginationOptions } from "../types"

/**
 * Simplified hook for conversation operations
 * Delegates to ConversationStore and ConversationService
 */
export function useConversations() {
  const {
    conversations,
    currentConversation,
    loading,
    searchQuery,
    pagination,
    loadConversations,
    loadConversation,
    createConversation,
    updateConversation,
    deleteConversation,
    duplicateConversation,
    searchConversations,
    clearSearch,
    setCurrentConversation,
    autoSaveConversation,
    clearError,
  } = useConversationStore()

  // Memoized actions to prevent unnecessary re-renders
  const actions = {
    loadConversations: useCallback(
      (options?: PaginationOptions) => {
        return loadConversations(options)
      },
      [loadConversations]
    ),

    loadConversation: useCallback(
      (id: string) => {
        return loadConversation(id)
      },
      [loadConversation]
    ),

    createConversation: useCallback(
      (title: string, model: string, messages: any[], options?: any) => {
        return createConversation(title, model, messages, options)
      },
      [createConversation]
    ),

    updateConversation: useCallback(
      (id: string, updates: any) => {
        return updateConversation(id, updates)
      },
      [updateConversation]
    ),

    deleteConversation: useCallback(
      (id: string) => {
        return deleteConversation(id)
      },
      [deleteConversation]
    ),

    duplicateConversation: useCallback(
      (id: string) => {
        return duplicateConversation(id)
      },
      [duplicateConversation]
    ),

    searchConversations: useCallback(
      (query: string, options?: PaginationOptions) => {
        return searchConversations(query, options)
      },
      [searchConversations]
    ),

    clearSearch: useCallback(() => {
      clearSearch()
    }, [clearSearch]),

    setCurrentConversation: useCallback(
      (conversation: any) => {
        setCurrentConversation(conversation)
      },
      [setCurrentConversation]
    ),

    autoSaveConversation: useCallback(
      (id: string, messages: any[]) => {
        return autoSaveConversation(id, messages)
      },
      [autoSaveConversation]
    ),

    clearError: useCallback(() => {
      clearError()
    }, [clearError]),
  }

  return {
    // State
    conversations,
    currentConversation,
    loading: loading.isLoading,
    error: loading.error,
    searchQuery,
    pagination,

    // Actions
    ...actions,
  }
}

/**
 * Hook for current conversation only
 */
export function useCurrentConversation() {
  const { currentConversation, setCurrentConversation, loadConversation } =
    useConversationStore()

  return {
    conversation: currentConversation,
    setConversation: setCurrentConversation,
    loadConversation,
  }
}

/**
 * Hook for conversation list only
 */
export function useConversationList() {
  const {
    conversations,
    loading,
    pagination,
    loadConversations,
    searchConversations,
    clearSearch,
    searchQuery,
  } = useConversationStore()

  return {
    conversations,
    loading: loading.isLoading,
    error: loading.error,
    pagination,
    searchQuery,
    loadConversations,
    searchConversations,
    clearSearch,
  }
}
