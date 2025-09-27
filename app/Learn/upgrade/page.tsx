"use client"

import React, { useEffect, useState } from "react"
import { CheckCircle, Clock, Loader2, User } from "lucide-react"
import ApplicationForm from "./components/ApplicationForm"
import IntentCapture from "./components/IntentCapture"

interface UpgradeUser {
  id: string
  email: string
  role: string
  goldApplicationStatus?: string
  goldApplicationDate?: string
  goldApplicationData?: any
}

export default function UpgradePage() {
  const [user, setUser] = useState<UpgradeUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserStatus()
  }, [])

  const fetchUserStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/gold-application/intent")

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else if (response.status === 401) {
        // User not authenticated
        setUser(null)
      } else {
        throw new Error("Failed to fetch user status")
      }
    } catch (err) {
      console.error("Error fetching user status:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const handleApplyIntent = async () => {
    try {
      const response = await fetch("/api/gold-application/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to record application intent")
      }

      const data = await response.json()
      setUser(data.user)
    } catch (err) {
      console.error("Error recording intent:", err)
      setError(err instanceof Error ? err.message : "Failed to apply")
    }
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await fetch("/api/gold-application/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit application")
      }

      const data = await response.json()
      setUser(data.user)
    } catch (err) {
      console.error("Error submitting application:", err)
      setError(
        err instanceof Error ? err.message : "Failed to submit application"
      )
      throw err // Re-throw to let the form handle the error
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-yellow-400" />
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="mb-4 text-6xl text-red-400">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-white">
            Something went wrong
          </h2>
          <p className="mb-4 text-slate-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-yellow-600 px-4 py-2 font-medium text-black hover:bg-yellow-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-12">
              <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
                Gold Membership
              </h1>
              <div className="mb-8 inline-block rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-3 text-xl font-semibold text-black">
                Completely FREE
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-8">
              <div className="mb-4 text-6xl text-blue-400">
                <User className="mx-auto h-16 w-16" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-white">
                Login Required
              </h2>
              <p className="mb-6 text-lg text-slate-300">
                Please log in to your Codehub account to apply for Gold
                membership.
              </p>
              <button
                onClick={() => (window.location.href = "/login")}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                Login to Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Already Gold user
  if (user.role === "gold" || user.role === "admin" || user.role === "editor") {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="rounded-2xl border border-green-500 bg-slate-800 p-8">
              <div className="mb-4 text-6xl text-green-400">
                <CheckCircle className="mx-auto h-16 w-16" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-white">
                You&apos;re Already Gold! 🎉
              </h2>
              <p className="mb-6 text-lg text-slate-300">
                You already have {user.role} access with all Gold membership
                benefits.
              </p>
              <button
                onClick={() => (window.location.href = "/Learn")}
                className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Application already submitted
  if (
    user.goldApplicationStatus === "submitted" ||
    user.goldApplicationStatus === "under_review"
  ) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="rounded-2xl border border-yellow-500 bg-slate-800 p-8">
              <div className="mb-4 text-6xl text-yellow-400">
                <Clock className="mx-auto h-16 w-16" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-white">
                Application Under Review
              </h2>
              <p className="mb-6 text-lg text-slate-300">
                Your Gold membership application is being reviewed. Our team
                will contact you soon!
              </p>
              <div className="mb-6 rounded-lg bg-slate-700 p-4">
                <p className="text-sm text-slate-400">
                  Application submitted:{" "}
                  {user.goldApplicationDate
                    ? new Date(user.goldApplicationDate).toLocaleDateString()
                    : "Recently"}
                </p>
              </div>
              <button
                onClick={() => (window.location.href = "/Learn")}
                className="rounded-lg bg-slate-600 px-6 py-3 font-medium text-white hover:bg-slate-700"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show application form when user has expressed interest
  if (user.goldApplicationStatus === "interested") {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-6 py-16">
          <div className="mx-auto max-w-4xl">
            {/* Progress indicator */}
            <div className="mb-8 text-center">
              <div className="mb-6 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Interest Recorded</span>
                </div>
                <div className="h-px max-w-20 flex-1 bg-yellow-400" />
                <div className="flex items-center gap-2 text-yellow-400">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-yellow-400">
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  </div>
                  <span className="text-sm font-medium">
                    Complete Application
                  </span>
                </div>
                <div className="h-px max-w-20 flex-1 bg-slate-600" />
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="h-5 w-5 rounded-full border-2 border-slate-600" />
                  <span className="text-sm font-medium">Review & Approval</span>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <ApplicationForm user={user} onSubmit={handleFormSubmit} />
          </div>
        </div>
      </div>
    )
  }

  // Show intent capture (default state)
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
              Gold Membership
            </h1>
            <div className="mb-8 inline-block rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-3 text-xl font-semibold text-black">
              Completely FREE
            </div>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-slate-300">
              Get the complete Codehub learning platform, premium lessons,
              exercises, and 60+ AI subscriptions. Free for all Codehub students
              - just join and start learning!
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-white">What You Get</h2>
            <div className="mb-12 grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                <div className="mb-4 text-4xl text-yellow-400">📚</div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Complete Learning Platform
                </h3>
                <p className="text-slate-400">
                  Access to all programming tutorials, exercises, and
                  interactive coding challenges
                </p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                <div className="mb-4 text-4xl text-yellow-400">🤖</div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  60+ AI Subscriptions
                </h3>
                <p className="text-slate-400">
                  Premium access to ChatGPT Plus, Claude Pro, Gemini Advanced,
                  and 60+ more AI tools
                </p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                <div className="mb-4 text-4xl text-yellow-400">🎓</div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Premium Lessons
                </h3>
                <p className="text-slate-400">
                  Expert-crafted curriculum with hands-on projects and
                  real-world applications
                </p>
              </div>
            </div>
          </div>

          {/* Intent Capture Section */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-8">
            <IntentCapture onApply={handleApplyIntent} />
          </div>

          {/* FAQ Section */}
          <div className="mx-auto mt-16 max-w-2xl text-left">
            <h2 className="mb-8 text-center text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Is this really free?
                </h3>
                <p className="text-slate-400">
                  Yes! Everything is 100% free for Codehub students. No
                  subscriptions, no hidden fees.
                </p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  What AI tools are included?
                </h3>
                <p className="text-slate-400">
                  ChatGPT Plus, Claude Pro, Gemini Advanced, and 60+ other
                  premium AI subscriptions.
                </p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  How do I get started?
                </h3>
                <p className="text-slate-400">
                  Fill out the form above and our representative will reach out
                  to you with next steps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
