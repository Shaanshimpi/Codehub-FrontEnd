import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Cpu, Loader2, Lock, User, X } from "lucide-react"
import { createPortal } from "react-dom"
import { AIModel, getAllModels, getModelIcon } from "../constants/models"
import { modelService, userService } from "../services"
import { getTierColors, getTierDisplayName } from "../utils/models"

interface ModelSelectorProps {
  selectedModel: AIModel
  onModelChange: (model: AIModel) => void
  disabled?: boolean
  onRequestLogin?: () => void
}

export function ModelSelector({
  selectedModel,
  onModelChange,
  disabled = false,
  onRequestLogin,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [models, setModels] = useState<AIModel[]>(getAllModels())
  const [isAuthenticated, setIsAuthenticated] = useState(
    userService.isAuthenticated()
  )
  const [isGoldUser, setIsGoldUser] = useState(userService.isGoldUser())
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load models on component mount and filter by authentication
  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true)
      try {
        await modelService.loadModels()
        const currentAuth = userService.isAuthenticated()
        const currentGold = userService.isGoldUser()
        setIsAuthenticated(currentAuth)
        setIsGoldUser(currentGold)

        // Show ALL models but we'll handle selection logic separately
        const allModels = modelService.getModels()
        setModels(allModels)
      } catch (error) {
        console.error("Failed to load models:", error)
        const currentAuth = userService.isAuthenticated()
        const currentGold = userService.isGoldUser()
        setIsAuthenticated(currentAuth)
        setIsGoldUser(currentGold)
        // Still show all models even on error
        const allModels = modelService.getModels()
        setModels(allModels)
      } finally {
        setIsLoading(false)
      }
    }

    loadModels()

    // Listen for authentication changes
    const checkAuthPeriodically = setInterval(() => {
      const currentAuth = userService.isAuthenticated()
      const currentGold = userService.isGoldUser()
      if (currentAuth !== isAuthenticated || currentGold !== isGoldUser) {
        setIsAuthenticated(currentAuth)
        setIsGoldUser(currentGold)
        // Always show all models
        const allModels = modelService.getModels()
        setModels(allModels)
      }
    }, 1000)

    return () => clearInterval(checkAuthPeriodically)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const groupedModels = {
    budget: models.filter((m) => m.tier === "budget"),
    mid: models.filter((m) => m.tier === "mid"),
    premium: models.filter((m) => m.tier === "premium"),
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all hover:bg-white dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-700 ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:border-blue-300 dark:hover:border-blue-500"
        }`}
      >
        <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
        ) : (
          <span className="text-lg">{getModelIcon(selectedModel) || "🤖"}</span>
        )}
        <div className="flex-1 text-left">
          <div className="text-base font-medium text-gray-900 dark:text-slate-100">
            {selectedModel?.name || "Select Model"}
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform dark:text-slate-500 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 z-50 mb-2 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white/95 shadow-xl backdrop-blur-sm dark:border-slate-600 dark:bg-slate-800/95">
          {/* Current Model Header - Shown on Mobile */}
          <div className="border-b border-gray-200 bg-blue-50/50 p-3 dark:border-slate-600 dark:bg-blue-900/20 sm:hidden">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Current: {getModelIcon(selectedModel) || "🤖"}{" "}
                {selectedModel?.name || "Select Model"}
              </span>
            </div>
            <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
              {selectedModel?.description || "No description"}
            </div>
          </div>

          {/* Login/Upgrade Prompt */}
          {!isAuthenticated ? (
            <div className="border-b border-yellow-200 bg-yellow-50/80 p-4 dark:border-yellow-700 dark:bg-yellow-900/20">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Unlock Premium Models
                  </h4>
                  <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                    Log in with a Gold account to access GPT-4, Claude, and
                    other premium AI models. Free models are available below.
                  </p>
                  <button
                    onClick={() => {
                      if (onRequestLogin) {
                        onRequestLogin()
                      } else {
                        window.location.href = "/login"
                      }
                    }}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-yellow-800 hover:text-yellow-900 dark:text-yellow-200 dark:hover:text-yellow-100"
                  >
                    <User className="h-3 w-3" />
                    Log In with Gold Account
                  </button>
                </div>
              </div>
            </div>
          ) : (
            !isGoldUser && (
              <div className="border-b border-yellow-200 bg-yellow-50/80 p-4 dark:border-yellow-700 dark:bg-yellow-900/20">
                <div className="flex items-start gap-3">
                  <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Upgrade to Gold
                    </h4>
                    <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                      Gold membership is completely free! Apply now to unlock
                      all premium AI models including GPT-4, Claude, and more.
                    </p>
                    <button
                      onClick={() => {
                        window.location.href = "/Learn/upgrade"
                      }}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-yellow-800 hover:text-yellow-900 dark:text-yellow-200 dark:hover:text-yellow-100"
                    >
                      <User className="h-3 w-3" />
                      Apply for Free Gold
                    </button>
                  </div>
                </div>
              </div>
            )
          )}

          {Object.entries(groupedModels).map(([tier, models]) => {
            const tierColors = getTierColors(tier as any)
            return (
              <div
                key={tier}
                className="border-b border-gray-100 p-3 last:border-b-0 dark:border-slate-700"
              >
                <div
                  className={`mb-3 inline-block rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold ${tier === "budget" ? "from-green-100 to-green-200 text-green-800 dark:from-green-900/50 dark:to-green-800/50 dark:text-green-300" : tier === "mid" ? "from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/50 dark:to-blue-800/50 dark:text-blue-300" : "from-purple-100 to-purple-200 text-purple-800 dark:from-purple-900/50 dark:to-purple-800/50 dark:text-purple-300"}`}
                >
                  {getTierDisplayName(tier as any)} Models
                </div>
                <div className="space-y-1">
                  {models.map((model) => {
                    const requiresGold =
                      modelService.requiresGoldSubscription(model)
                    const canSelect = !requiresGold || isGoldUser

                    return (
                      <button
                        key={model.id}
                        onClick={() => {
                          if (canSelect) {
                            onModelChange(model)
                            setIsOpen(false)
                          } else {
                            // Show appropriate modal based on auth status
                            if (!isAuthenticated) {
                              if (onRequestLogin) {
                                onRequestLogin()
                              }
                            } else {
                              setShowUpgradeModal(true)
                            }
                          }
                        }}
                        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all ${
                          canSelect
                            ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50"
                            : "cursor-pointer opacity-75 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                        } ${
                          selectedModel?.id === model.id
                            ? "border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
                            : "border border-transparent"
                        }`}
                      >
                        <span className="text-lg">{getModelIcon(model)}</span>
                        <div className="flex-1">
                          <div
                            className={`flex items-center gap-2 text-base font-medium ${
                              canSelect
                                ? "text-gray-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400"
                                : "text-gray-600 dark:text-slate-400"
                            }`}
                          >
                            {model.name}
                            {requiresGold && !canSelect && (
                              <Lock className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                            )}
                          </div>
                          <div className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                            {model.description}
                            {requiresGold && !canSelect && (
                              <span className="ml-2 font-medium text-yellow-600 dark:text-yellow-400">
                                • Gold Required
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedModel?.id === model.id && (
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        )}
                        {requiresGold && !canSelect && (
                          <Lock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upgrade Modal for authenticated users who need Gold */}
      {showUpgradeModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
                    <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Gold Membership Required
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Apply for free Gold membership
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 p-4 dark:from-yellow-900/20 dark:to-amber-900/20">
                <div className="mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    Gold Features
                  </span>
                </div>
                <ul className="space-y-1 text-xs text-yellow-800 dark:text-yellow-200">
                  <li>• Access to all premium AI models</li>
                  <li>• GPT-4, Claude, Gemini, and 60+ more</li>
                  <li>• Complete learning platform access</li>
                  <li>• 100% free for Codehub students</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                >
                  Continue with Free Models
                </button>
                <button
                  onClick={() => {
                    setShowUpgradeModal(false)
                    window.location.href = "/Learn/upgrade"
                  }}
                  className="flex-1 rounded-lg bg-yellow-600 px-4 py-3 text-sm font-medium text-white hover:bg-yellow-700"
                >
                  Apply for Free Gold
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
