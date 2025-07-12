"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Activity, Calendar, Mail, Shield, User } from "lucide-react"
import { useRouter } from "next/navigation"
import LogoutButton from "../_components/LogoutButton"
import { useUser } from "../_providers/UserProvider"

export default function ProfilePage() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
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
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Prevent rendering the profile page if user is not logged in and redirect is handled by useEffect
  }

  // Format date if user has createdAt
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">
            Your <span className="text-blue-400">Profile</span>
          </h1>
          <p className="text-slate-300 dark:text-slate-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl border-2 border-transparent bg-sky-50 shadow-lg transition-all duration-300 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/10 dark:bg-slate-800 dark:hover:border-blue-400 dark:hover:shadow-blue-400/10">
          {/* Profile Header */}
          <div className="border-b border-slate-200 p-8 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gradient-to-br from-blue-600 to-blue-800 p-4 dark:from-blue-500 dark:to-blue-700">
                <User className="h-12 w-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Welcome back!
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {`Here's your account information`}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6 p-8">
            {/* Email Section */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-600 dark:bg-slate-700">
              <div className="mb-3 flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Email Address
                </h3>
              </div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                {user.email}
              </p>
            </div>

            {/* Account Status */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-600 dark:bg-slate-700">
              <div className="mb-3 flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Account Status
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <p className="font-medium text-slate-600 dark:text-slate-300">
                  Active Account
                </p>
              </div>
            </div>

            {/* Account Created Date */}
            {user.createdAt && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-600 dark:bg-slate-700">
                <div className="mb-3 flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Member Since
                  </h3>
                </div>
                <p className="font-medium text-slate-600 dark:text-slate-300">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-600 dark:bg-slate-700">
              <div className="mb-4 flex items-center space-x-3">
                <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Quick Stats
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    0
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tutorials Completed
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    0
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Projects Created
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-6 sm:flex-row">
              <Button className="flex flex-1 transform items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                <User className="h-5 w-5" />
                <span>Edit Profile</span>
              </Button>

              <LogoutButton />
              {/* <div className="flex-1">
              </div> */}
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 text-center">
          <p className="mb-4 text-slate-400 dark:text-slate-500">
            Need help with your account?
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/Learn"
              className="font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300"
            >
              Back to Learning
            </a>
            <a
              href="/"
              className="font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
