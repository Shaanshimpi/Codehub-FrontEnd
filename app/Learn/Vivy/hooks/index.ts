// Export all new simplified hooks
export * from "./useUser"
export * from "./useConversations"
export * from "./useChat"
export * from "./useChatPage"

// Re-export for backward compatibility (these use the new architecture)
export { useUser as useAuth } from "./useUser"
export { useConversations as useConversationManager } from "./useConversations"
export { useChat as useChatManager } from "./useChat"
export { useChatPage as useChatPageManager } from "./useChatPage"
