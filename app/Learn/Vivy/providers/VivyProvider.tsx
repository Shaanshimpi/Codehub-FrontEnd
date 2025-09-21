"use client"

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { AI_MODELS } from "../constants/models"
import { initializeServices } from "../services"
import { useChatStore, useUserStore } from "../store"

interface VivyContextType {
  isInitialized: boolean
  error: string | null
}

const VivyContext = createContext<VivyContextType | undefined>(undefined)

interface VivyProviderProps {
  children: ReactNode
}

/**
 * Provider that initializes all Vivy services and sets up default state
 */
export function VivyProvider({ children }: VivyProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { setSelectedModel } = useChatStore()
  const { initialize: initializeUser } = useUserStore()

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("🚀 Initializing Vivy services...")

        // Initialize all services
        await initializeServices()

        // Initialize user service
        await initializeUser()

        // Set default model if none selected
        const { selectedModel } = useChatStore.getState()
        if (!selectedModel && AI_MODELS.length > 0) {
          setSelectedModel(AI_MODELS[0])
        }

        setIsInitialized(true)
        console.log("✅ Vivy initialization complete")
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown initialization error"
        console.error("❌ Vivy initialization failed:", errorMessage)
        setError(errorMessage)

        // Even on error, mark as initialized to prevent infinite loops
        setIsInitialized(true)
      }
    }

    initialize()
  }, [initializeUser, setSelectedModel])

  const contextValue: VivyContextType = {
    isInitialized,
    error,
  }

  return (
    <VivyContext.Provider value={contextValue}>{children}</VivyContext.Provider>
  )
}

/**
 * Hook to access Vivy initialization state
 */
export function useVivyProvider() {
  const context = useContext(VivyContext)
  if (context === undefined) {
    throw new Error("useVivyProvider must be used within a VivyProvider")
  }
  return context
}

/**
 * Loading component for initialization
 */
export function VivyInitializing() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
        <p className="text-gray-600">Initializing Vivy...</p>
      </div>
    </div>
  )
}

/**
 * Error component for initialization failures
 */
export function VivyInitializationError({ error }: { error: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md p-6 text-center">
        <div className="mb-4 text-6xl text-red-500">⚠️</div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Initialization Failed
        </h2>
        <p className="mb-4 text-gray-600">
          Vivy failed to initialize properly:
        </p>
        <p className="rounded-md bg-red-50 p-3 font-mono text-sm text-red-600">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
