import { cn } from "@/lib/utils"
import { ArrowRight, Crown, Lock, Sparkles } from "lucide-react"
import Link from "next/link"

interface UpgradePromptProps {
  variant?: "banner" | "modal" | "inline"
  feature?: string
  currentRole?: string
  onClose?: () => void
  className?: string
}

export function UpgradePrompt({
  variant = "banner",
  feature = "Premium AI Models",
  currentRole: _currentRole = "user",
  onClose,
  className,
}: UpgradePromptProps) {
  // Banner variant (above chat input)
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "flex-none rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-lg dark:border-amber-900/50 dark:from-amber-900/20 dark:to-orange-900/20",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">
                🔒 {feature} Require Gold Membership
              </h4>
              <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
                Upgrade to Gold to access all premium AI models with a $0.80/day
                spending limit and priority support.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/Learn/upgrade">
                  <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-amber-700 hover:to-orange-700 hover:shadow-lg">
                    <Crown className="h-4 w-4" />
                    Upgrade to Gold
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Use Free Models
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Modal variant (full modal)
  if (variant === "modal") {
    return (
      <>
        {/* Backdrop */}
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Enter" && onClose?.()}
          aria-label="Close modal"
        />

        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg rounded-2xl border-2 border-amber-500 bg-white shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="rounded-t-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
              <div className="mb-2 flex items-center gap-2">
                <Crown className="h-8 w-8" />
                <h2 className="text-2xl font-bold">Upgrade to Gold</h2>
              </div>
              <p className="text-amber-50">
                Unlock premium AI models and advanced features
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      Access All Premium Models
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Use GPT-4, Claude, Gemini, and other cutting-edge AI
                      models
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      $0.80/day Spending Limit
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Generous daily budget for all your coding needs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      Priority Support
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Get help faster with dedicated support
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link href="/Learn/upgrade" className="flex-1">
                  <button className="w-full rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-amber-700 hover:to-orange-700 hover:shadow-lg">
                    <span className="flex items-center justify-center gap-2">
                      <Crown className="h-5 w-5" />
                      Upgrade Now
                    </span>
                  </button>
                </Link>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Maybe Later
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Inline variant (small badge/button)
  return (
    <Link href="/Learn/upgrade">
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:from-amber-600 hover:to-orange-700 hover:shadow-md",
          className
        )}
      >
        <Crown className="h-3 w-3" />
        <span>Gold</span>
      </div>
    </Link>
  )
}
