import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { storageService, userService } from "../services"
import {
  AuthenticatedUser,
  LoadingState,
  User,
  UserPreferences,
} from "../types"

interface UserState {
  // State
  currentUser: AuthenticatedUser | null
  preferences: UserPreferences
  loading: LoadingState
  isInitialized: boolean

  // Actions
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<User | null>
  register: (
    email: string,
    password: string,
    name?: string
  ) => Promise<User | null>
  logout: () => Promise<void>
  updateProfile: (
    updates: Partial<Pick<User, "name" | "email">>
  ) => Promise<User | null>
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  refreshSession: () => Promise<void>

  // Getters
  isAuthenticated: () => boolean
  isTemporary: () => boolean
  getUserId: () => number | string | null
  getNumericUserId: () => number | null

  // UI Actions
  setLoading: (isLoading: boolean, error?: string | null) => void
  clearError: () => void
  reset: () => void
}

const initialPreferences: UserPreferences = {
  defaultModel: "deepseek/deepseek-chat",
  theme: "system",
  autoSave: true,
  showTimestamps: true,
}

const initialState = {
  currentUser: null,
  preferences: initialPreferences,
  loading: { isLoading: false, error: null },
  isInitialized: false,
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        initialize: async () => {
          const { setLoading } = get()
          setLoading(true, null)

          try {
            await userService.initialize()
            const currentUser = userService.getCurrentUser()
            const preferences = storageService.getUserPreferences()

            set((state) => ({
              currentUser,
              preferences,
              isInitialized: true,
              loading: { isLoading: false, error: null },
            }))
          } catch (error) {
            console.error("User initialization failed:", error)
            setLoading(false, (error as Error).message)

            // Set initialized even on failure to prevent infinite loops
            set((state) => ({
              isInitialized: true,
            }))
          }
        },

        login: async (email, password) => {
          const { setLoading } = get()
          setLoading(true, null)

          try {
            const user = await userService.login(email, password)

            set((state) => ({
              currentUser: user,
              loading: { isLoading: false, error: null },
            }))

            return user
          } catch (error) {
            setLoading(false, (error as Error).message)
            return null
          }
        },

        register: async (email, password, name) => {
          const { setLoading } = get()
          setLoading(true, null)

          try {
            const user = await userService.register(email, password, name)

            set((state) => ({
              currentUser: user,
              loading: { isLoading: false, error: null },
            }))

            return user
          } catch (error) {
            setLoading(false, (error as Error).message)
            return null
          }
        },

        logout: async () => {
          const { setLoading } = get()
          setLoading(true, null)

          try {
            await userService.logout()
            const tempUser = userService.getCurrentUser()

            set((state) => ({
              currentUser: tempUser,
              loading: { isLoading: false, error: null },
            }))
          } catch (error) {
            console.error("Logout failed:", error)
            setLoading(false, (error as Error).message)
          }
        },

        updateProfile: async (updates) => {
          const { setLoading } = get()
          setLoading(true, null)

          try {
            const updatedUser = await userService.updateProfile(updates)

            set((state) => ({
              currentUser: updatedUser,
              loading: { isLoading: false, error: null },
            }))

            return updatedUser
          } catch (error) {
            setLoading(false, (error as Error).message)
            return null
          }
        },

        updatePreferences: (newPreferences) => {
          const { preferences } = get()
          const updated = { ...preferences, ...newPreferences }

          storageService.setUserPreferences(updated)

          set((state) => ({
            preferences: updated,
          }))
        },

        refreshSession: async () => {
          try {
            await userService.refreshSession()
            const currentUser = userService.getCurrentUser()

            set((state) => ({
              currentUser,
            }))
          } catch (error) {
            console.error("Session refresh failed:", error)
            // User service handles fallback to temp user
            const currentUser = userService.getCurrentUser()

            set((state) => ({
              currentUser,
              loading: {
                ...state.loading,
                error: "Session expired. Please log in again.",
              },
            }))
          }
        },

        isAuthenticated: () => {
          return userService.isAuthenticated()
        },

        isTemporary: () => {
          return userService.isTemporaryUser()
        },

        getUserId: () => {
          return userService.getCurrentUserId()
        },

        getNumericUserId: () => {
          return userService.getNumericUserId()
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
          set({
            ...initialState,
            preferences: initialPreferences,
          })
        },
      }),
      {
        name: "user-store",
        partialize: (state) => ({
          // Only persist preferences, not user session
          // (user session is handled by storage service)
          preferences: state.preferences,
        }),
      }
    ),
    {
      name: "user-store",
    }
  )
)
