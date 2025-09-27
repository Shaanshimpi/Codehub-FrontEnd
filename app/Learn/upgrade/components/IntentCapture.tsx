"use client"

import React, { useState } from "react"
import { Loader2, Sparkles } from "lucide-react"

interface IntentCaptureProps {
  onApply: () => Promise<void>
  loading?: boolean
}

const IntentCapture: React.FC<IntentCaptureProps> = ({
  onApply,
  loading = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApplyClick = async () => {
    setIsSubmitting(true)
    try {
      await onApply()
    } catch (error) {
      console.error("Error applying for Gold:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <Sparkles className="h-6 w-6 text-yellow-400" />
        </div>
        <p className="mx-auto max-w-2xl text-lg text-slate-300">
          Click below to apply for your free Gold membership and unlock
          everything Codehub has to offer!
        </p>
      </div>

      <button
        onClick={handleApplyClick}
        disabled={isSubmitting || loading}
        className="group relative inline-flex transform items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-4 text-lg font-bold text-black transition-all duration-200 hover:scale-105 hover:from-yellow-500 hover:to-yellow-700 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <span className="text-2xl">🚀</span>
            Apply for Free Gold Membership
            <span className="text-2xl">✨</span>
          </>
        )}

        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 transition-opacity duration-200 group-hover:opacity-20" />
      </button>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-400">
          🔒 No payment required • ⚡ Instant processing • 🎯 100% free forever
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="mb-2 text-2xl text-yellow-400">🎓</div>
          <h3 className="mb-1 text-sm font-semibold text-white">
            Complete Platform
          </h3>
          <p className="text-xs text-slate-400">All tutorials & exercises</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="mb-2 text-2xl text-yellow-400">🤖</div>
          <h3 className="mb-1 text-sm font-semibold text-white">
            60+ AI Tools
          </h3>
          <p className="text-xs text-slate-400">ChatGPT, Claude & more</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="mb-2 text-2xl text-yellow-400">⚡</div>
          <h3 className="mb-1 text-sm font-semibold text-white">
            Instant Access
          </h3>
          <p className="text-xs text-slate-400">Start learning immediately</p>
        </div>
      </div>
    </div>
  )
}

export default IntentCapture
