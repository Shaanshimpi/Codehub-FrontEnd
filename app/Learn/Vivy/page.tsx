"use client"

import { useEffect, useState } from "react"
import { BudgetBadge } from "./components/BudgetBadge"
import { BudgetDetailsModal } from "./components/BudgetDetailsModal"
import { BudgetWarningModal } from "./components/BudgetWarningModal"
import { ChatInput } from "./components/ChatInput"
import { LoginModal } from "./components/LoginModal"
import { MessagesContainer } from "./components/MessagesContainer"
import { UpgradePrompt } from "./components/UpgradePrompt"
import { getAllModels } from "./constants/models"
import { useChat } from "./hooks/useChat"
import { userService } from "./services"

export default function VivyChat() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [showBudgetDetails, setShowBudgetDetails] = useState(false)
  const [showBudgetWarning, setShowBudgetWarning] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Initialize user service on mount
  useEffect(() => {
    userService.initialize()
  }, [])

  const {
    messages,
    inputValue,
    isLoading,
    error,
    selectedModel,
    budget,
    messagesEndRef,
    sendMessage,
    handleInputChange,
    handleModelChange,
    clearError,
  } = useChat()

  // Suggestion click handler
  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange(suggestion)
    handleSendMessage()
  }

  // Handle sending messages (simplified - no conversation saving)
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return false
    const success = await sendMessage(inputValue)

    // Check if we need to show upgrade prompt (for regular users trying paid models)
    if (!success && error?.includes("Gold membership")) {
      setShowUpgradePrompt(true)
    }

    return success
  }

  // Check budget warning after messages update
  useEffect(() => {
    if (budget && budget.percentUsed >= 80 && !showBudgetWarning) {
      setShowBudgetWarning(true)
    }
  }, [budget, showBudgetWarning])

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true)
    try {
      await userService.login(email, password)
      setShowLoginModal(false)
      // Refresh user service to pick up new user data
      await userService.refresh()
      // Refresh the page to reinitialize everything with new user
      window.location.reload()
    } catch (error) {
      console.error("Login failed:", error)
      // TODO: Show error message to user
    } finally {
      setLoginLoading(false)
    }
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      {/* Main Chat Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Messages Area */}
        <div className="min-h-0 flex-1">
          <MessagesContainer
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>

        {/* Upgrade Prompt (for regular users) */}
        {showUpgradePrompt && (
          <div className="flex-none px-4 pb-4">
            <div className="mx-auto max-w-4xl">
              <UpgradePrompt
                variant="banner"
                feature="Premium AI Models"
                onClose={() => setShowUpgradePrompt(false)}
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex-none px-4 pb-4">
            <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-4 shadow-lg dark:border-red-900/50 dark:bg-red-900/20">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="whitespace-pre-line text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
                <button
                  onClick={clearError}
                  className="flex-none rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Input with Budget Badge */}
        <div className="flex-none">
          <div className="relative">
            {/* Budget Badge (Gold+ users only) - positioned above input */}
            {budget && (
              <div className="absolute -top-12 left-1/2 z-10 -translate-x-1/2">
                <BudgetBadge
                  budget={budget}
                  onOpenDetails={() => setShowBudgetDetails(true)}
                />
              </div>
            )}

            <ChatInput
              inputMessage={inputValue}
              setInputMessage={handleInputChange}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              selectedModel={selectedModel || getAllModels()[0]}
              onModelChange={handleModelChange}
              onRequestLogin={() => setShowLoginModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        loading={loginLoading}
      />

      {/* Budget Details Modal */}
      {budget && (
        <BudgetDetailsModal
          isOpen={showBudgetDetails}
          onClose={() => setShowBudgetDetails(false)}
          budget={budget}
        />
      )}

      {/* Budget Warning Modal */}
      {budget && (
        <BudgetWarningModal
          isOpen={showBudgetWarning}
          onClose={() => setShowBudgetWarning(false)}
          budget={budget}
        />
      )}

      {/* Upgrade Modal (when trying to use paid model as regular user) */}
      {showUpgradePrompt && (
        <UpgradePrompt
          variant="modal"
          onClose={() => setShowUpgradePrompt(false)}
        />
      )}
    </div>
  )
}
