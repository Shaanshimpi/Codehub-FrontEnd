import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Settings } from "lucide-react"
import { AIModel } from "../constants/models"
import { ModelSelector } from "./ModelSelector"

interface ChatInputProps {
  inputMessage: string
  setInputMessage: (message: string) => void
  onSendMessage: () => void
  isLoading: boolean
  selectedModel: AIModel
  onModelChange: (model: AIModel) => void
}

export function ChatInput({
  inputMessage,
  setInputMessage,
  onSendMessage,
  isLoading,
  selectedModel,
  onModelChange,
}: ChatInputProps) {
  const [showModelSelector, setShowModelSelector] = useState(false)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSendMessage()
    }
  }

  return (
    <div className="relative bg-transparent p-4">
      {/* Floating Container */}
      <div className="mx-auto max-w-4xl">
        {/* Model Selector - Floating Above */}
        {showModelSelector && (
          <div className="mb-4 duration-200 animate-in slide-in-from-bottom-2">
            <div className="rounded-2xl border border-white/20 bg-white/90 p-1 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/90">
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={(model) => {
                  onModelChange(model)
                  setShowModelSelector(false)
                }}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Main Input Container - Floating */}
        <div className="relative">
          {/* Glassmorphism Background */}
          <div className="absolute inset-0 rounded-3xl border border-white/30 bg-gradient-to-r from-white/70 via-white/60 to-white/70 shadow-2xl backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-800/70 dark:via-slate-800/60 dark:to-slate-800/70" />

          {/* Content */}
          <div className="relative p-3">
            {/* Single Row - Input with Model Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Model Controls - Left Side */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowModelSelector(!showModelSelector)}
                  className="group flex items-center gap-1 rounded-lg border border-blue-200/50 bg-blue-500/10 px-2 py-2 transition-all duration-200 hover:bg-blue-500/20 dark:border-blue-700/50 dark:bg-blue-400/10 dark:hover:bg-blue-400/20"
                >
                  <Settings className="h-3 w-3 text-blue-600 transition-transform duration-200 group-hover:rotate-90 dark:text-blue-400" />
                  <span className="hidden text-xs font-medium text-blue-700 dark:text-blue-300 sm:inline">
                    {showModelSelector ? "Hide" : "Model"}
                  </span>
                </button>

                {/* Current Model Display - Hidden on Mobile */}
                <div className="hidden items-center gap-1 rounded-lg border border-slate-200/50 bg-slate-100/50 px-2 py-2 dark:border-slate-600/50 dark:bg-slate-700/50 sm:flex">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {selectedModel.icon} {selectedModel.name}
                  </span>
                </div>
              </div>

              {/* Input Area - Center */}
              <div className="group relative flex-1">
                {/* Input Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 blur-xl transition-opacity duration-300 group-focus-within:opacity-100" />

                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message Vivy..."
                  disabled={isLoading}
                  className="relative h-10 rounded-2xl border-2 border-white/50 bg-white/90 px-4 text-sm font-medium text-slate-800 shadow-lg backdrop-blur-sm transition-all duration-200 placeholder:text-slate-500 hover:shadow-xl focus:border-blue-400/80 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700/50 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-blue-500/80 dark:focus:ring-blue-400/20"
                />
              </div>

              {/* Send Button - Right Side */}
              <Button
                onClick={onSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
                className="h-10 w-10 transform rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
