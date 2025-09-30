// Locked exercise view for premium content
"use client"

import React from "react"
import { ArrowRight, Lock, User } from "lucide-react"
import Link from "next/link"

// Locked exercise view for premium content

interface LockedExerciseViewProps {
  exercise: any
  language: any
  tutorial: any
  params: {
    langSlug: string
    tutSlug: string
    exerciseSlug: string
  }
}

/**
 * Component displayed when exercise is locked for non-authenticated users
 */
const LockedExerciseView: React.FC<LockedExerciseViewProps> = ({
  exercise,
  language,
  tutorial,
  params,
}) => {
  const features = [
    "Access to premium exercises",
    "Detailed step-by-step solutions",
    "Advanced coding challenges",
    "Progress tracking",
  ]

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        {/* Lock Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
          <Lock className="h-10 w-10 text-amber-600 dark:text-amber-400" />
        </div>

        {/* Title and Description */}
        <h1 className="mb-4 text-3xl font-bold text-white">Premium Exercise</h1>
        <p className="mb-8 text-lg text-slate-300">
          This exercise is part of our premium content. Sign in to unlock
          advanced coding challenges and comprehensive learning materials.
        </p>

        {/* Features List */}
        <div className="mb-8 space-y-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-left text-slate-300"
            >
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <User className="h-5 w-5" />
            Sign In to Continue
            <ArrowRight className="h-5 w-5" />
          </Link>

          <div className="text-center">
            <span className="text-sm text-slate-400">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/signup"
              className="rounded text-sm font-medium text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LockedExerciseView
