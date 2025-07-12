"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AuthForm from "../_components/AuthForm"
import { useUser } from "../_providers/UserProvider"

export default function LoginPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/Learn")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 dark:bg-slate-950">
        <div className="rounded-xl bg-sky-50 p-8 shadow-lg dark:bg-slate-800">
          <div className="flex items-center justify-center space-x-3">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400" />
            <p className="font-medium text-slate-900 dark:text-slate-100">
              Loading...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Prevent rendering the login form if user is logged in and redirect is handled by useEffect
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-blu text-center text-2xl font-bold">Log In</h1>
        <AuthForm formType="login" />
      </div>
    </div>
  )
}
