import { useState } from "react"
import { Check, Download, FileDown, FileJson, FileText, X } from "lucide-react"
import { Conversation } from "../hooks/useConversations"
import {
  ExportFormat,
  ExportOptions,
  downloadConversation,
} from "../utils/export"

interface ExportDialogProps {
  conversation: Conversation
  isOpen: boolean
  onClose: () => void
}

export function ExportDialog({
  conversation,
  isOpen,
  onClose,
}: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("markdown")
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [includeTimestamps, setIncludeTimestamps] = useState(false)
  const [includeTokenCount, setIncludeTokenCount] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen) return null

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const options: ExportOptions = {
        format,
        includeMetadata,
        includeTimestamps,
        includeTokenCount,
      }

      downloadConversation(conversation, options)

      // Show success briefly then close
      setTimeout(() => {
        setIsExporting(false)
        onClose()
      }, 1000)
    } catch (error) {
      console.error("Export failed:", error)
      setIsExporting(false)
    }
  }

  const formatOptions = [
    {
      value: "markdown" as ExportFormat,
      label: "Markdown",
      description: "Rich text format with formatting preserved",
      icon: FileText,
      extension: ".md",
    },
    {
      value: "json" as ExportFormat,
      label: "JSON",
      description: "Structured data format for developers",
      icon: FileJson,
      extension: ".json",
    },
    {
      value: "txt" as ExportFormat,
      label: "Plain Text",
      description: "Simple text format readable anywhere",
      icon: FileDown,
      extension: ".txt",
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Export Conversation
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {conversation.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Format Selection */}
          <div>
            <fieldset>
              <legend className="mb-3 block text-sm font-medium text-slate-900 dark:text-slate-100">
                Export Format
              </legend>
              <div className="space-y-2">
                {formatOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormat(option.value)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-all ${
                      format === option.value
                        ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300 dark:border-slate-600 dark:hover:border-slate-500"
                    }`}
                  >
                    <option.icon
                      className={`h-5 w-5 ${
                        format === option.value
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            format === option.value
                              ? "text-blue-900 dark:text-blue-100"
                              : "text-slate-900 dark:text-slate-100"
                          }`}
                        >
                          {option.label}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-xs ${
                            format === option.value
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300"
                              : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400"
                          }`}
                        >
                          {option.extension}
                        </span>
                      </div>
                      <p
                        className={`mt-1 text-xs ${
                          format === option.value
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {option.description}
                      </p>
                    </div>
                    {format === option.value && (
                      <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Export Options */}
          <div>
            <label className="mb-3 block text-sm font-medium text-slate-900 dark:text-slate-100">
              Include Options
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Conversation metadata
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Model used, creation date, and conversation details
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeTimestamps}
                  onChange={(e) => setIncludeTimestamps(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Message timestamps
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    When each message was sent
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeTokenCount}
                  onChange={(e) => setIncludeTokenCount(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Usage statistics
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Token count and estimated cost
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Preview Info */}
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Messages:
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {conversation.messages.length}
                </span>
              </div>
              {conversation.totalTokens > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Tokens:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {conversation.totalTokens.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Model:
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {conversation.model.split("/").pop()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
