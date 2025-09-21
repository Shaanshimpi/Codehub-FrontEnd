import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Cpu } from "lucide-react"
import { AIModel, AI_MODELS } from "../constants/models"
import { getTierColors, getTierDisplayName } from "../utils/models"

interface ModelSelectorProps {
  selectedModel: AIModel
  onModelChange: (model: AIModel) => void
  disabled?: boolean
}

export function ModelSelector({
  selectedModel,
  onModelChange,
  disabled = false,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
    budget: AI_MODELS.filter((m) => m.tier === "budget"),
    mid: AI_MODELS.filter((m) => m.tier === "mid"),
    premium: AI_MODELS.filter((m) => m.tier === "premium"),
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
        <span className="text-lg">{selectedModel.icon}</span>
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
            {selectedModel.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-400">
            {selectedModel.pricing}
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
                Current: {selectedModel.icon} {selectedModel.name}
              </span>
            </div>
            <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
              {selectedModel.pricing} • {selectedModel.description}
            </div>
          </div>

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
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onModelChange(model)
                        setIsOpen(false)
                      }}
                      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
                        selectedModel.id === model.id
                          ? "border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
                          : "border border-transparent"
                      }`}
                    >
                      <span className="text-lg">{model.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                          {model.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">
                          {model.pricing}
                        </div>
                        <div className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                          {model.description}
                        </div>
                      </div>
                      {selectedModel.id === model.id && (
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
