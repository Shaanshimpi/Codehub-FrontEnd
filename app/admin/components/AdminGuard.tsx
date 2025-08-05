"use client"

import React from "react"
import { useUser } from "@/app/(payload)/_providers/UserProvider"
import AuthGuard from "@/components/auth/AuthGuard"

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading, hasAdminAccess } = useUser()

  return (
    <AuthGuard
      user={user}
      isLoading={isLoading}
      hasAccess={hasAdminAccess()}
      loadingMessage="Checking admin permissions..."
      accessDeniedMessage="You don't have permission to access the admin dashboard."
    >
      {children}
    </AuthGuard>
  )
}
