export interface User {
  id: number
  email: string
  name?: string
  avatar?: string
  role: "user" | "admin"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserSession {
  user: User
  token: string
  expiresAt: string
}

export interface UserPreferences {
  defaultModel: string
  theme: "light" | "dark" | "system"
  autoSave: boolean
  showTimestamps: boolean
}

export interface TempUser {
  id: string
  isTemporary: true
  createdAt: string
}

export type AuthenticatedUser = User | TempUser
