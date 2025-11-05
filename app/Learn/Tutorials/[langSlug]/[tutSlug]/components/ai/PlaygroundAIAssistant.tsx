"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { MarkdownRenderer } from "@/app/Learn/Vivy/components/MarkdownRenderer"
import { ModelSelector } from "@/app/Learn/Vivy/components/ModelSelector"
import { getAllModels, getModelIcon } from "@/app/Learn/Vivy/constants/models"
import { useChat } from "@/app/Learn/Vivy/hooks/useChat"
import { modelService, userService } from "@/app/Learn/Vivy/services"
import { useChatStore } from "@/app/Learn/Vivy/store"
import type { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import { Bot, Send, Settings, X } from "lucide-react"
import { buildAIContext } from "../../services/AIContextService"

interface PlaygroundAIAssistantProps {
  tutorial: Tutorial
  lesson: any | null
  language: Language
  currentCode?: string
  codeOutput?: string
  onClose: () => void
}

/**
 * Dedicated AI Assistant for Code Playground
 * Uses Vivy infrastructure (API, credits, auth) but with custom UI
 */
const PlaygroundAIAssistant: React.FC<PlaygroundAIAssistantProps> = ({
  tutorial,
  lesson,
  language,
  currentCode,
  codeOutput,
  onClose,
}) => {
  // Use Vivy's chat infrastructure
  const {
    messages,
    inputValue,
    isLoading,
    error,
    selectedModel,
    messagesEndRef,
    handleInputChange,
    handleModelChange,
    clearError,
  } = useChat()

  const contextRef = useRef<string>("")
  const [showModelSelector, setShowModelSelector] = useState(false)

  // Get available coding models - prioritize free models for unauthenticated users
  const isAuth = userService.isAuthenticated()
  const availableModels = useMemo(() => {
    const allModels = getAllModels().filter(
      (m) => m.capabilities.coding && m.isActive
    )
    // If not authenticated, prioritize free models
    if (!isAuth) {
      const freeModels = allModels.filter(
        (m) => m.pricing.input === 0 && m.pricing.output === 0
      )
      return freeModels.length > 0 ? freeModels : allModels
    }
    return allModels
  }, [isAuth])

  // Initialize model on mount
  useEffect(() => {
    if (!selectedModel && availableModels.length > 0) {
      handleModelChange(availableModels[0])
    }
  }, [selectedModel, availableModels, handleModelChange])

  // Build and update context (includes code editor content)
  useEffect(() => {
    const context = buildAIContext({
      tutorial,
      lesson,
      language,
      currentCode,
      codeOutput,
    })
    contextRef.current = context
  }, [tutorial, lesson, language, currentCode, codeOutput])

  // Custom send message that uses playground API with system context
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !selectedModel) return

    const userMessage = inputValue.trim()
    handleInputChange("") // Clear input

    // Add user message to UI
    const {
      addMessage,
      createUserMessage,
      createAssistantMessage,
      setLoading,
    } = useChatStore.getState()
    const newUserMessage = createUserMessage(userMessage)
    addMessage(newUserMessage)
    setLoading(true, null)

    // Add timeout for API call (60 seconds)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000)

    try {
      // Build messages array (only user/assistant, no system)
      const chatMessages = [
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user" as const,
          content: userMessage,
        },
      ]

      // Call playground API with system context
      const response = await fetch("/api/chat/playground", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: chatMessages,
          model: selectedModel.id,
          systemContext: contextRef.current,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        // Provide user-friendly error messages
        if (response.status === 401) {
          throw new Error("Please log in to use this feature")
        } else if (response.status === 403) {
          throw new Error(
            "This model requires a Gold subscription. Please upgrade or switch to a free model."
          )
        } else if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a moment.")
        } else {
          throw new Error(
            errorData.error || `Failed to get response (${response.status})`
          )
        }
      }

      const data = await response.json()

      if (!data.content) {
        throw new Error("No response content received from AI")
      }

      const assistantMessage = createAssistantMessage(
        data.content,
        selectedModel.id
      )

      if (data.tokens) {
        assistantMessage.tokens = data.tokens
      }

      addMessage(assistantMessage)
      setLoading(false, null)
    } catch (error: any) {
      clearTimeout(timeoutId)

      let errorMessage = "Failed to send message"

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorMessage = "Request timed out. Please try again."
        } else {
          errorMessage = error.message
        }
      }

      setLoading(false, errorMessage)
      console.error("Playground chat error:", error)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange(suggestion)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Check if model requires Gold subscription
  const requiresGold = selectedModel
    ? modelService.requiresGoldSubscription(selectedModel)
    : false
  const isGoldUser = userService.isGoldUser()
  const isAuthenticated = userService.isAuthenticated()

  // Check if user can use selected model
  // Free models are available to everyone (authenticated or not)
  // Paid models require Gold subscription
  const canUseModel = !requiresGold || isGoldUser

  return (
    <div className="relative flex h-full flex-col bg-white dark:bg-gray-800">
      {/* Floating Close Button - Top Right */}
      <button
        onClick={onClose}
        className="absolute right-2 top-2 z-10 flex items-center justify-center rounded-lg bg-white/90 p-1.5 text-gray-700 shadow-md backdrop-blur-sm transition-all hover:bg-white dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label="Close AI assistant"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mb-1.5 text-sm font-semibold text-gray-900 dark:text-white">
              Ask for Help
            </h3>
            <p className="mb-4 max-w-sm text-xs text-gray-600 dark:text-gray-400">
              I can help you understand concepts, debug your code, explain
              errors, or guide you through the tutorial.
            </p>

            {/* Show auth warning if needed */}
            {requiresGold && !isGoldUser && (
              <div className="mb-3 max-w-sm rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-900/20">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  {!isAuthenticated
                    ? "Log in with a Gold account to use this premium model."
                    : "This model requires a Gold subscription. Upgrade to use it."}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-1.5 text-left">
              {[
                "Explain the current concept",
                "Help debug my code",
                "What does this error mean?",
                "Give me a hint",
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={!canUseModel}
                  className="rounded border border-gray-200 bg-white px-3 py-1.5 text-left text-xs text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Bot className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-1.5 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="whitespace-pre-wrap break-words text-xs leading-relaxed">
                      {message.content}
                    </p>
                  ) : (
                    <div className="prose prose-xs dark:prose-invert max-w-none">
                      <MarkdownRenderer content={message.content} />
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500">
                    <span className="text-[10px] font-semibold">U</span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Bot className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-gray-700">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400" />
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400 [animation-delay:0.2s]" />
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400 [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="border-t border-red-200 bg-red-50 px-3 py-1.5 dark:border-red-900/50 dark:bg-red-900/20">
          <div className="flex items-start justify-between gap-2">
            <p className="flex-1 whitespace-pre-line text-[10px] text-red-800 dark:text-red-200">
              {error}
            </p>
            <button
              onClick={clearError}
              className="flex-none rounded px-1.5 py-0.5 text-[10px] font-medium text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input Area - Matching Exercise Toolbar Style */}
      <div className="border-t border-gray-300 bg-white px-3 py-2 shadow-lg dark:border-gray-600 dark:bg-black">
        {/* Model Selector - Floating Above Input */}
        {showModelSelector && selectedModel && (
          <div className="mb-2 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={(model) => {
                handleModelChange(model)
                setShowModelSelector(false)
              }}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Model selection hint */}
        {!canUseModel && (
          <div className="mb-2 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            {!isAuthenticated
              ? "Please log in with a Gold account to use this model. Free models are available."
              : "This model requires a Gold subscription. Switch to a free model or upgrade."}
          </div>
        )}

        <div className="flex items-center justify-between">
          {/* Left: Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Model Selector Button */}
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="focus-ring toolbar-button group flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-50 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
              title="Change AI model"
              aria-label="Change AI model"
            >
              <Settings className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden sm:inline">
                {(selectedModel ? getModelIcon(selectedModel) : "🤖") || "🤖"}{" "}
                {selectedModel?.name || "Select Model"}
              </span>
            </button>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !canUseModel}
              className={`focus-ring toolbar-button group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-lg transition-all duration-300 ${
                !inputValue.trim() || isLoading || !canUseModel
                  ? "cursor-not-allowed bg-gray-400 opacity-50"
                  : "btn-primary btn-shimmer hover:scale-105"
              } ${isLoading ? "loading-pulse" : ""}`}
              title="Send message"
              aria-label="Send message"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative">
                    Send
                    {!isLoading && inputValue.trim() && canUseModel && (
                      <span className="absolute inset-0 translate-x-[-100%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[200%]" />
                    )}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Right: Info */}
          <div className="flex items-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
            <div className="hidden items-center gap-3 sm:flex">
              <span className="hidden font-semibold text-blue-600 dark:text-blue-400 md:inline">
                Enter to send
              </span>
            </div>
          </div>
        </div>

        {/* Input Textarea */}
        <div className="mt-2">
          <textarea
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            disabled={isLoading || !canUseModel}
            rows={2}
            className="w-full resize-none rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  )
}

export default PlaygroundAIAssistant
