"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useUser } from "../_providers/UserProvider"

export default function LogoutButton() {
  const { setUser, refetchUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/payload/logout", { method: "POST" })
      setUser(null) // Explicitly set user to null immediately
      await refetchUser() // Ensure user state is updated after logout
    } catch (error) {
      console.error("Failed to log out", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex w-full flex-1 transform items-center justify-center space-x-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
    >
      {isLoading ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
          <span>Signing Out...</span>
        </>
      ) : (
        <>
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </>
      )}
    </Button>
  )
}
