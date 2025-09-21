"use client"

import { Menu, X } from "lucide-react"
import { useParams } from "next/navigation"
import { ChatInput } from "../components/ChatInput"
import { ConversationSidebar } from "../components/ConversationSidebar"
import { MessagesContainer } from "../components/MessagesContainer"
import { useChatPage } from "../hooks/useChatPage"

export default function ConversationPage() {
  const params = useParams()
  const conversationId = params.id as string

  const {
    showSidebar,
    setShowSidebar,
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    selectedModel,
    messagesEndRef,
    handleSendMessage,
    handleModelChange,
    handleSuggestionClick,
    conversations,
    currentConversation,
    conversationsLoading,
    handleDeleteConversation,
    handleRenameConversation,
  } = useChatPage({ conversationId })

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      {showSidebar && (
        <ConversationSidebar
          conversations={conversations}
          currentConversation={currentConversation}
          loading={conversationsLoading}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header with Sidebar Toggle */}
        <div className="flex items-center justify-between border-b border-gray-200/50 p-4 dark:border-slate-700/50 lg:hidden">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            {showSidebar ? (
              <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>

          {currentConversation && (
            <h1 className="truncate font-medium text-slate-900 dark:text-slate-100">
              {currentConversation.title}
            </h1>
          )}
        </div>

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
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
        </div>
      </div>
    </div>
  )
}
