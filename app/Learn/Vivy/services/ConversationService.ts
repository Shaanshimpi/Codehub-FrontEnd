import {
  ChatRequest,
  ChatResponse,
  Conversation,
  ConversationCreateRequest,
  ConversationUpdateRequest,
  ConversationsResponse,
  Message,
  PaginationOptions,
} from "../types"
import {
  CONVERSATION_CONFIG,
  ValidationResult,
  calculateConversationCost,
  calculateTotalTokens,
  generateTitle,
  validateConversationTitle,
  validateMessageContent,
  validateModel,
  validatePagination,
} from "../utils"
import { apiService } from "./APIService"
import { userService } from "./UserService"

/**
 * Service for conversation CRUD operations and chat functionality
 */
export class ConversationService {
  /**
   * Fetch conversations for the current user
   */
  async getConversations(
    options: PaginationOptions = {}
  ): Promise<ConversationsResponse> {
    const { page = 1, limit = CONVERSATION_CONFIG.DEFAULT_PAGE_SIZE } = options

    // Validate pagination
    const validation = validatePagination(page, limit)
    if (!validation.isValid) {
      throw new Error(
        validation.getFirstError() || "Invalid pagination parameters"
      )
    }

    try {
      const userId = userService.getAPIUserId()
      const response = await apiService.get<ConversationsResponse>(
        `/api/conversations?userId=${userId}&page=${page}&limit=${limit}`
      )

      // Transform dates to ensure consistency
      response.docs = response.docs.map(this.transformConversation)

      return response
    } catch (error) {
      throw new Error(
        `Failed to fetch conversations: ${(error as Error).message}`
      )
    }
  }

  /**
   * Get a specific conversation by ID
   */
  async getConversation(conversationId: string): Promise<Conversation> {
    if (!conversationId || typeof conversationId !== "string") {
      throw new Error("Invalid conversation ID")
    }

    try {
      const conversation = await apiService.get<Conversation>(
        `/api/conversations/${conversationId}`
      )
      return this.transformConversation(conversation)
    } catch (error) {
      throw new Error(
        `Failed to load conversation: ${(error as Error).message}`
      )
    }
  }

  /**
   * Create a new conversation
   */
  async createConversation(
    title: string,
    model: string,
    messages: Message[],
    options: { tags?: string[]; isPublic?: boolean } = {}
  ): Promise<Conversation> {
    // Validate inputs
    const validations = [
      validateConversationTitle(title),
      validateModel(model),
      ...messages.map((msg) => validateMessageContent(msg.content)),
    ]

    const errors = validations.filter((v) => !v.isValid)
    if (errors.length > 0) {
      throw new Error(errors[0].getFirstError() || "Validation failed")
    }

    // Calculate metrics
    const _totalTokens = calculateTotalTokens(messages)
    const _estimatedCost = calculateConversationCost(messages, model)

    const requestData: ConversationCreateRequest = {
      title: title.trim(),
      model,
      messages,
      userId: userService.getAPIUserId(),
      tags: options.tags || [],
      isPublic: options.isPublic || false,
    }

    try {
      const conversation = await apiService.post<Conversation>(
        "/api/conversations",
        requestData
      )
      return this.transformConversation(conversation)
    } catch (error) {
      throw new Error(
        `Failed to create conversation: ${(error as Error).message}`
      )
    }
  }

  /**
   * Update an existing conversation
   */
  async updateConversation(
    conversationId: string,
    updates: ConversationUpdateRequest
  ): Promise<Conversation> {
    if (!conversationId) {
      throw new Error("Conversation ID is required")
    }

    // Validate updates
    const validations: ValidationResult[] = []

    if (updates.title !== undefined) {
      validations.push(validateConversationTitle(updates.title))
    }

    if (updates.model !== undefined) {
      validations.push(validateModel(updates.model))
    }

    if (updates.messages !== undefined) {
      validations.push(
        ...updates.messages.map((msg) => validateMessageContent(msg.content))
      )

      // Recalculate metrics if messages are updated
      if (updates.model) {
        updates.totalTokens = calculateTotalTokens(updates.messages)
        updates.estimatedCost = calculateConversationCost(
          updates.messages,
          updates.model
        )
      }
    }

    const errors = validations.filter((v) => !v.isValid)
    if (errors.length > 0) {
      throw new Error(errors[0].getFirstError() || "Validation failed")
    }

    try {
      const conversation = await apiService.patch<Conversation>(
        `/api/conversations/${conversationId}`,
        updates
      )
      return this.transformConversation(conversation)
    } catch (error) {
      throw new Error(
        `Failed to update conversation: ${(error as Error).message}`
      )
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    if (!conversationId) {
      throw new Error("Conversation ID is required")
    }

    try {
      await apiService.delete(`/api/conversations/${conversationId}`)
    } catch (error) {
      throw new Error(
        `Failed to delete conversation: ${(error as Error).message}`
      )
    }
  }

  /**
   * Send a chat message and get AI response
   */
  async sendMessage(
    messages: Message[],
    model: string,
    options: { stream?: boolean; temperature?: number; maxTokens?: number } = {}
  ): Promise<ChatResponse> {
    // Validate inputs
    const modelValidation = validateModel(model)
    if (!modelValidation.isValid) {
      throw new Error(modelValidation.getFirstError() || "Invalid model")
    }

    const messageValidations = messages.map((msg) =>
      validateMessageContent(msg.content)
    )
    const invalidMessages = messageValidations.filter((v) => !v.isValid)
    if (invalidMessages.length > 0) {
      throw new Error(
        invalidMessages[0].getFirstError() || "Invalid message content"
      )
    }

    const requestData: ChatRequest = {
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      model,
      ...options,
    }

    try {
      const response = await apiService.post<ChatResponse>(
        "/api/chat",
        requestData,
        {
          timeout: 60000, // Longer timeout for chat responses
        }
      )

      return response
    } catch (error) {
      throw new Error(`Failed to send message: ${(error as Error).message}`)
    }
  }

  /**
   * Auto-save conversation with debouncing
   */
  async autoSaveConversation(
    conversationId: string,
    messages: Message[]
  ): Promise<void> {
    if (!conversationId || messages.length === 0) return

    try {
      await this.updateConversation(conversationId, { messages })
    } catch (error) {
      console.warn("Auto-save failed:", error)
      // Don't throw error for auto-save failures
    }
  }

  /**
   * Generate conversation title from first message
   */
  generateConversationTitle(messages: Message[]): string {
    const firstUserMessage = messages.find((msg) => msg.role === "user")
    if (firstUserMessage?.content) {
      return generateTitle(
        firstUserMessage.content,
        CONVERSATION_CONFIG.MAX_TITLE_LENGTH
      )
    }
    return "New Conversation"
  }

  /**
   * Search conversations
   */
  async searchConversations(
    query: string,
    options: PaginationOptions = {}
  ): Promise<ConversationsResponse> {
    const { page = 1, limit = CONVERSATION_CONFIG.DEFAULT_PAGE_SIZE } = options

    if (!query || typeof query !== "string") {
      throw new Error("Search query is required")
    }

    try {
      const userId = userService.getAPIUserId()
      const response = await apiService.get<ConversationsResponse>(
        `/api/conversations/search?userId=${userId}&q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      )

      response.docs = response.docs.map(this.transformConversation)
      return response
    } catch (error) {
      throw new Error(`Search failed: ${(error as Error).message}`)
    }
  }

  /**
   * Export conversation as JSON
   */
  async exportConversation(conversationId: string): Promise<Blob> {
    try {
      const conversation = await this.getConversation(conversationId)

      const exportData = {
        title: conversation.title,
        model: conversation.model,
        messages: conversation.messages,
        createdAt: conversation.createdAt,
        totalTokens: conversation.totalTokens,
        estimatedCost: conversation.estimatedCost,
        exportedAt: new Date().toISOString(),
      }

      const json = JSON.stringify(exportData, null, 2)
      return new Blob([json], { type: "application/json" })
    } catch (error) {
      throw new Error(`Export failed: ${(error as Error).message}`)
    }
  }

  /**
   * Duplicate conversation
   */
  async duplicateConversation(conversationId: string): Promise<Conversation> {
    try {
      const original = await this.getConversation(conversationId)

      return this.createConversation(
        `${original.title} (Copy)`,
        original.model,
        original.messages,
        {
          tags: original.tags,
          isPublic: false, // Always private for duplicates
        }
      )
    } catch (error) {
      throw new Error(`Duplication failed: ${(error as Error).message}`)
    }
  }

  /**
   * Transform conversation data from API
   */
  private transformConversation(conversation: Conversation): Conversation {
    return {
      ...conversation,
      createdAt: conversation.createdAt || new Date().toISOString(),
      updatedAt: conversation.updatedAt || new Date().toISOString(),
      messages: conversation.messages.map((msg) => ({
        ...msg,
        timestamp:
          typeof msg.timestamp === "string"
            ? new Date(msg.timestamp)
            : msg.timestamp,
      })),
    }
  }
}

// Create default instance
export const conversationService = new ConversationService()
