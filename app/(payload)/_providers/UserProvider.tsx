"use client"

import { createContext, useContext } from "react"
import { useAuth } from "@/hooks/useAuth"
import { AuthContextType } from "@/lib/auth/types"

const UserContext = createContext<AuthContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const authData = useAuth()

  return (
    <UserContext.Provider value={authData}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
