import { useMemo, useState } from "react"
import {
  Clock,
  Download,
  Edit3,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  X,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { Conversation } from "../hooks/useConversations"
import { formatTimeString } from "../utils/chat"
import { ExportDialog } from "./ExportDialog"

interface ConversationSidebarProps {
  conversations: Conversation[]
  currentConversation: Conversation | null
  loading: boolean
  onDeleteConversation: (conversationId: string) => void
  onRenameConversation: (conversationId: string, newTitle: string) => void
}

export function ConversationSidebar({
  conversations,
  currentConversation,
  loading,
  onDeleteConversation,
  onRenameConversation,
}: ConversationSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [showActions, setShowActions] = useState<string | null>(null)
  const [exportingConversation, setExportingConversation] =
    useState<Conversation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleStartEdit = (conversation: Conversation) => {
    setEditingId(conversation.id)
    setEditTitle(conversation.title)
    setShowActions(null)
  }

  const handleSaveEdit = (conversationId: string) => {
    if (editTitle.trim()) {
      onRenameConversation(conversationId, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
  }

  const getModelIcon = (model: string) => {
    if (!model || typeof model !== "string") return "🤖"
    if (model.includes("deepseek")) return "💎"
    if (model.includes("gpt-4o-mini")) return "🤖"
    if (model.includes("gemini")) return "✨"
    if (model.includes("llama")) return "🦙"
    if (model.includes("gpt-4o")) return "🧠"
    if (model.includes("claude")) return "🎭"
    return "🤖"
  }

  const getModelTier = (model: string) => {
    if (!model || typeof model !== "string") return "mid"
    if (model.includes("deepseek") || model.includes("gpt-4o-mini"))
      return "budget"
    if (model.includes("gemini") || model.includes("llama")) return "mid"
    if (model.includes("gpt-4o") || model.includes("claude")) return "premium"
    return "mid"
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "budget":
        return "text-green-600 dark:text-green-400"
      case "mid":
        return "text-blue-600 dark:text-blue-400"
      case "premium":
        return "text-purple-600 dark:text-purple-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations

    const query = searchQuery.toLowerCase()
    return conversations.filter((conversation) => {
      // Search in title
      if (conversation.title.toLowerCase().includes(query)) return true

      // Search in message content
      if (
        conversation.messages.some((msg) =>
          msg.content.toLowerCase().includes(query)
        )
      )
        return true

      // Search in tags
      if (conversation.tags?.some((tag) => tag.toLowerCase().includes(query)))
        return true

      // Search in model name
      if (getModelDisplayName(conversation.model).toLowerCase().includes(query))
        return true

      return false
    })
  }, [conversations, searchQuery])

  const getModelDisplayName = (model: string) => {
    if (!model || typeof model !== "string") return "Unknown Model"

    const modelMap: { [key: string]: string } = {
      "deepseek/deepseek-chat": "DeepSeek Chat",
      "openai/gpt-4o-mini": "GPT-4o Mini",
      "google/gemini-flash-1.5": "Gemini 1.5 Flash",
      "meta-llama/llama-3.3-70b-instruct": "Llama 3.3 70B",
      "openai/gpt-4o": "GPT-4o",
      "anthropic/claude-3.5-sonnet": "Claude 3.5 Sonnet",
    }
    return modelMap[model] || model
  }

  return (
    <div className="flex h-full w-80 flex-col border-r border-gray-200/50 bg-white/90 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/90 sm:w-64 md:w-72 lg:w-80">
      {/* Header */}
      <div className="space-y-3 border-b border-gray-200/50 p-4 dark:border-slate-700/50">
        <Link
          href="/Learn/Vivy/new"
          className="flex w-full transform items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">New Conversation</span>
        </Link>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 transition-all placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform rounded p-0.5 transition-colors hover:bg-gray-200 dark:hover:bg-slate-600"
            >
              <X className="h-3 w-3 text-slate-400" />
            </button>
          )}
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {filteredConversations.length} of {conversations.length}{" "}
            conversations
          </div>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-3 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={`loading-skeleton-${i}`} className="animate-pulse">
                <div className="h-16 rounded-lg bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center">
            <MessageSquare className="mx-auto mb-3 h-12 w-12 text-slate-400 dark:text-slate-500" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {searchQuery
                ? `No conversations match "${searchQuery}"`
                : "No conversations yet. Start a new one!"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation, index) => (
              <Link
                key={conversation.id || `conversation-${index}`}
                href={`/Learn/Vivy/${conversation.id}`}
                className={`group relative block rounded-lg p-3 transition-all duration-200 ${
                  currentConversation?.id === conversation.id
                    ? "border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
                    : "border border-transparent hover:bg-gray-50 dark:hover:bg-slate-700/50"
                }`}
              >
                {/* Conversation Content */}
                <div className="flex items-start gap-3">
                  {/* Model Icon */}
                  <div
                    className={`text-lg ${getTierColor(getModelTier(conversation.model))}`}
                  >
                    {getModelIcon(conversation.model)}
                  </div>

                  {/* Conversation Info */}
                  <div className="min-w-0 flex-1">
                    {editingId === conversation.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleSaveEdit(conversation.id)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSaveEdit(conversation.id)
                          if (e.key === "Escape") handleCancelEdit()
                        }}
                        className="w-full rounded border border-blue-300 bg-white px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-600 dark:bg-slate-800"
                      />
                    ) : (
                      <h3 className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {conversation.title}
                      </h3>
                    )}

                    {/* Metadata */}
                    <div className="mt-1 flex items-center gap-2">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatTimeString(conversation.updatedAt)}
                      </span>

                      {conversation.totalTokens &&
                        conversation.totalTokens > 0 && (
                          <>
                            <span className="text-slate-300 dark:text-slate-600">
                              •
                            </span>
                            <Zap className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {conversation.totalTokens.toLocaleString()} tokens
                            </span>
                          </>
                        )}
                    </div>

                    {/* Cost (if applicable) */}
                    {conversation.estimatedCost > 0 && (
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        ~${conversation.estimatedCost.toFixed(4)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowActions(
                          showActions === conversation.id
                            ? null
                            : conversation.id
                        )
                      }}
                      className="rounded p-1.5 transition-colors hover:bg-gray-200 dark:hover:bg-slate-600"
                    >
                      <MoreVertical className="h-4 w-4 text-slate-500" />
                    </button>

                    {/* Actions Dropdown */}
                    {showActions === conversation.id && (
                      <div className="absolute right-2 top-8 z-10 min-w-[120px] rounded-lg border border-gray-200 bg-white py-1 shadow-xl dark:border-slate-600 dark:bg-slate-800">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStartEdit(conversation)
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <Edit3 className="h-4 w-4" />
                          Rename
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setExportingConversation(conversation)
                            setShowActions(null)
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <Download className="h-4 w-4" />
                          Export
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteConversation(conversation.id)
                            setShowActions(null)
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {conversations.length > 0 && (
        <div className="border-t border-gray-200/50 p-4 dark:border-slate-700/50">
          <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Total Conversations:</span>
              <span className="font-medium">{conversations.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Tokens:</span>
              <span className="font-medium">
                {conversations
                  .reduce((sum, conv) => sum + (conv.totalTokens || 0), 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Export Dialog */}
      {exportingConversation && (
        <ExportDialog
          conversation={exportingConversation}
          isOpen={!!exportingConversation}
          onClose={() => setExportingConversation(null)}
        />
      )}
    </div>
  )
}
