// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
  PAYLOAD_URL: process.env.PAYLOAD_API_URL || "http://localhost:3001/api",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

// User Management
export const USER_CONFIG = {
  TEMP_USER_PREFIX: "temp_",
  MIN_USER_ID: 1,
  MAX_USER_ID: 999999999,
  SESSION_KEY: "user_session",
  TEMP_USER_KEY: "temp_user_id",
} as const

// Conversation Settings
export const CONVERSATION_CONFIG = {
  MAX_TITLE_LENGTH: 100,
  MIN_TITLE_LENGTH: 1,
  MAX_MESSAGE_LENGTH: 10000,
  AUTO_SAVE_DELAY: 500, // milliseconds
  MAX_MESSAGES_PER_CONVERSATION: 1000,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

// Token and Cost Calculation
export const TOKEN_CONFIG = {
  CHARS_PER_TOKEN: 4, // Rough estimation
  COST_PER_MILLION_TOKENS: {
    "deepseek/deepseek-chat": 0,
    "openai/gpt-4o-mini": 0.6,
    "google/gemini-flash-1.5": 0.6,
    "meta-llama/llama-3.3-70b-instruct": 2.4,
    "openai/gpt-4o": 10.0,
    "anthropic/claude-3.5-sonnet": 15.0,
  },
  DEFAULT_COST_PER_MILLION: 1.0,
} as const

// UI Constants
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  MAX_SIDEBAR_WIDTH: 320,
  MIN_SIDEBAR_WIDTH: 280,
  MOBILE_BREAKPOINT: 768,
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Network connection failed. Please check your connection and try again.",
  VALIDATION_ERROR: "Please check your input and try again.",
  AUTHENTICATION_ERROR: "Authentication failed. Please log in again.",
  AUTHORIZATION_ERROR: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error occurred. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
  USER_ID_INVALID: "Invalid user ID format. Must be a number.",
  CONVERSATION_NOT_FOUND: "Conversation not found.",
  MESSAGE_TOO_LONG: `Message is too long. Maximum length is ${CONVERSATION_CONFIG.MAX_MESSAGE_LENGTH} characters.`,
  TITLE_TOO_LONG: `Title is too long. Maximum length is ${CONVERSATION_CONFIG.MAX_TITLE_LENGTH} characters.`,
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  CONVERSATION_CREATED: "Conversation created successfully.",
  CONVERSATION_UPDATED: "Conversation updated successfully.",
  CONVERSATION_DELETED: "Conversation deleted successfully.",
  MESSAGE_SENT: "Message sent successfully.",
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_SESSION: "vivy_user_session",
  TEMP_USER_ID: "vivy_temp_user_id",
  USER_PREFERENCES: "vivy_user_preferences",
  DRAFT_MESSAGES: "vivy_draft_messages",
  LAST_MODEL: "vivy_last_model",
} as const
