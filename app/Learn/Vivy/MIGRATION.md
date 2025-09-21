# Vivy Architecture Migration Guide

## Overview

The Vivy AI chat system has been completely restructured with a new architecture that addresses the following issues:

### Fixed Issues:

1. **API 400 errors** - User ID format mismatch (string vs numeric)
2. **Poor separation of concerns** - Business logic mixed with UI logic
3. **Race conditions** - Multiple state updates competing
4. **Inefficient architecture** - Hooks doing too much
5. **Poor maintainability** - Everything in a few large files

## New Architecture

### 1. **Core Services Layer** (`/services/`)

- `APIService.ts` - Base API client with error handling and retries
- `UserService.ts` - User management and session handling
- `ConversationService.ts` - All conversation CRUD operations
- `StorageService.ts` - Local storage utilities

### 2. **State Management Layer** (`/store/`)

- `UserStore.ts` - User session state (Zustand)
- `ConversationStore.ts` - Conversation state management (Zustand)
- `ChatStore.ts` - Chat UI state (Zustand)

### 3. **Utils Layer** (`/utils/`)

- `constants.ts` - App constants and configuration
- `dateUtils.ts` - Date formatting utilities
- `tokenUtils.ts` - Token counting and cost calculation
- `validationUtils.ts` - Input validation with proper error handling

### 4. **Types Layer** (`/types/`)

- `user.ts` - User interfaces
- `conversation.ts` - Conversation interfaces
- `api.ts` - API response types
- `models.ts` - AI model types

### 5. **Simplified Hooks** (`/hooks/`)

- `useUser.ts` - Just user operations
- `useConversations.ts` - Just conversation operations
- `useChat.ts` - Just chat operations
- `useChatPage.ts` - Orchestrates all functionality

## Migration Steps

### For Existing Components

#### Option 1: Use Compatibility Layer (Recommended for quick migration)

```typescript
// Before
import { useChat } from "../hooks/useChat"
import { useChatPage } from "../hooks/useChatPage"
import { useConversations } from "../hooks/useConversations"

// After - No changes needed!
// The compatibility layer provides the same interface
```

#### Option 2: Migrate to New Architecture

```typescript
// Before
import { useConversations } from '../hooks/useConversations'

const {
  conversations,
  loading,
  error,
  fetchConversations,
  createConversation,
  updateConversation,
  deleteConversation,
} = useConversations(userId)

// After
import { useConversations } from '../hooks'

const {
  conversations,
  loading,
  error,
  loadConversations,
  createConversation,
  updateConversation,
  deleteConversation,
} = useConversations()

// Note: No need to pass userId anymore - handled automatically
```

### User ID Handling

```typescript
// After - Automatic handling
import { useUser } from "../hooks"

// Before - String or mixed types
const [currentUserId] = useState(() => {
  // Complex logic for generating temp user IDs
})

const { userId, numericUserId, isAuthenticated, isTemporary } = useUser()
```

### Error Handling

```typescript
// After - Automatic error handling with retries
import { useConversations } from "../hooks"

// Before - Manual error handling
try {
  const response = await fetch("/api/conversations")
  if (!response.ok) {
    throw new Error("Failed to fetch")
  }
  // Handle response
} catch (error) {
  console.error("Error:", error)
}

const { conversations, loading, error, loadConversations } = useConversations()

// Errors are automatically handled and exposed through the error state
```

## Key Improvements

### 1. **Proper User ID Management**

- Automatic conversion between temporary string IDs and numeric IDs for API calls
- Consistent handling throughout the application
- No more 400 errors due to ID format mismatches

### 2. **Separation of Concerns**

- Services handle business logic
- Stores manage state
- Hooks orchestrate between services and UI
- Components only handle presentation

### 3. **Better Error Handling**

- Centralized error handling in services
- Automatic retry logic for network failures
- Proper validation at all layers
- User-friendly error messages

### 4. **Improved Performance**

- Proper state management with Zustand
- Memoized hook returns to prevent unnecessary re-renders
- Debounced auto-save operations
- Efficient draft management

### 5. **Enhanced Maintainability**

- Clear separation of responsibilities
- Comprehensive TypeScript types
- Proper validation utilities
- Modular architecture

## Component Updates Required

### Wrap Your App with VivyProvider

```typescript
// In your layout or app component
import { VivyProvider } from './Learn/Vivy/providers/VivyProvider'

export default function Layout({ children }) {
  return (
    <VivyProvider>
      {children}
    </VivyProvider>
  )
}
```

### Initialize Services

The VivyProvider automatically initializes all services, but you can also do it manually:

```typescript
import { initializeServices } from "./Learn/Vivy/services"

// Initialize once at app startup
await initializeServices()
```

## Testing the Migration

### 1. **Backwards Compatibility**

All existing components should work without changes due to the compatibility layer.

### 2. **User ID Handling**

Test that temporary users can create and manage conversations without 400 errors.

### 3. **Error Recovery**

Test network failures and ensure proper retry behavior.

### 4. **State Management**

Verify that state updates don't conflict and auto-save works correctly.

## Rollback Plan

If issues arise, you can quickly rollback by:

1. Reverting to the original hook files
2. Removing the new architecture folders
3. The API routes maintain backward compatibility

## Performance Improvements

- **Reduced bundle size**: Modular architecture allows better tree-shaking
- **Fewer re-renders**: Proper memoization and state management
- **Better caching**: Services handle caching automatically
- **Faster operations**: Optimized API calls with proper batching

## Future Enhancements

The new architecture enables:

- Easy addition of new AI models
- Better offline support
- Enhanced collaboration features
- Improved analytics and monitoring
- Better testing capabilities

## Support

For any issues during migration:

1. Check the compatibility layer first
2. Review error messages in the browser console
3. Verify that services are properly initialized
4. Test with both temporary and authenticated users
