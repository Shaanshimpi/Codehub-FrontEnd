"use client"

import { useEffect, useState } from "react"
import { ChatInput } from "./components/ChatInput"
import { LoginModal } from "./components/LoginModal"
import { MessagesContainer } from "./components/MessagesContainer"
import { getAllModels } from "./constants/models"
import { useChat } from "./hooks/useChat"
import { userService } from "./services"

export default function VivyChat() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)

  // Initialize user service on mount
  useEffect(() => {
    userService.initialize()
  }, [])

  const {
    messages,
    inputValue,
    isLoading,
    selectedModel,
    messagesEndRef,
    sendMessage,
    handleInputChange,
    handleModelChange,
  } = useChat()

  // Suggestion click handler
  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange(suggestion)
    handleSendMessage()
  }

  // Handle sending messages (simplified - no conversation saving)
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return false
    return await sendMessage(inputValue)
  }

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

        {/* Chat Input */}
        <div className="flex-none">
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

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        loading={loginLoading}
      />
    </div>
  )
}
