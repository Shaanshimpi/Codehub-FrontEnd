"use client"

import React from "react"
import { ArrowRight, Lock, Sparkles, User, X } from "lucide-react"
import Link from "next/link"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  featureType?: "exercise" | "premium-feature"
  featureName?: string
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  featureType = "exercise",
  featureName = "this feature",
}) => {
  if (!isOpen) return null

  const getModalContent = () => {
    if (featureType === "exercise") {
      return {
        icon: <Lock className="h-12 w-12 text-amber-500" />,
        title: "Premium Exercise",
        description:
          "This exercise is part of our premium content. Sign in to unlock advanced coding challenges and comprehensive learning materials.",
        benefits: [
          "Access to premium exercises",
          "Detailed step-by-step solutions",
          "Advanced coding challenges",
          "Progress tracking",
        ],
      }
    } else {
      return {
        icon: <Sparkles className="h-12 w-12 text-purple-500" />,
        title: "Premium Feature",
        description: `${featureName} is a premium feature. Sign in to unlock advanced learning tools and enhanced educational content.`,
        benefits: [
          "Interactive visualizations",
          "Memory state tracking",
          "Execution flow diagrams",
          "Advanced learning aids",
        ],
      }
    }
  }

  const content = getModalContent()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />
      <div role="dialog" aria-modal="true" className="relative z-10">
        <div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl dark:bg-slate-800">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal content */}
          <div className="p-8">
            {/* Icon and title */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                {content.icon}
              </div>
              <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {content.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                {content.description}
              </p>
            </div>

            {/* Benefits list */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                What you&apos;ll get:
              </h3>
              <ul className="space-y-2">
                {content.benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
              >
                <User className="h-4 w-4" />
                Sign In to Continue
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="text-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Don&apos;t have an account?{" "}
                </span>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign up here
                </Link>
              </div>
            </div>

            {/* Bottom note */}
            <div className="mt-6 rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Join thousands of learners mastering programming with
                CodeHub&apos;s premium content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
