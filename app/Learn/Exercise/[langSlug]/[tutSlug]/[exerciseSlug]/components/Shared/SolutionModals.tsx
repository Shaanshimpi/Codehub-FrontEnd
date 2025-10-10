// Modals for displaying solution explanation and clean code
"use client"

import React, { useEffect, useState } from "react"
import { removeComments } from "@/app/utils/codeCommentUtils"
import { Editor } from "@monaco-editor/react"
import { Check, Copy, MessageSquare, X, Zap } from "lucide-react"
import UnifiedCodeEditor from "./UnifiedCodeEditor"

// Modals for displaying solution explanation and clean code

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden"
      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative max-h-[95vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              {icon}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[calc(95vh-80px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ExplanationModalProps {
  isOpen: boolean
  onClose: () => void
  exercise: any
  language: any
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  exercise,
  language,
}) => {
  const solutionCode = exercise?.solution_code || ""
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(solutionCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Solution Code with Instructions"
      icon={
        <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      }
    >
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Here&apos;s the complete solution with helpful comments and
            explanations to guide you through the code.
          </p>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Code
              </>
            )}
          </button>
        </div>

        <div
          className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
          style={{ height: "450px" }}
        >
          <div style={{ height: "100%" }}>
            <Editor
              height="100%"
              language={
                language?.slug === "c-programming" || language?.slug === "c"
                  ? "c"
                  : language?.slug === "cpp" || language?.slug === "c++"
                    ? "cpp"
                    : language?.slug || "javascript"
              }
              value={solutionCode}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 20,
                fontFamily:
                  "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
                wordWrap: "on" as const,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                renderLineHighlight: "gutter" as const,
                selectOnLineNumbers: true,
                lineNumbers: "on" as const,
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                scrollbar: {
                  vertical: "visible" as const,
                  horizontal: "visible" as const,
                  useShadows: false,
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
              }}
              loading={
                <div className="flex h-full items-center justify-center bg-slate-900">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="h-4 w-4 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                    <span className="text-sm">Loading code...</span>
                  </div>
                </div>
              }
            />
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            💡 Read the comments carefully to understand each step. You can copy
            this code to the editor and modify it.
          </p>
        </div>
      </div>
    </BaseModal>
  )
}

interface CleanSolutionModalProps {
  isOpen: boolean
  onClose: () => void
  exercise: any
  language: any
}

export const CleanSolutionModal: React.FC<CleanSolutionModalProps> = ({
  isOpen,
  onClose,
  exercise,
  language,
}) => {
  const solutionCode = exercise?.solution_code || ""
  const cleanSolutionCode = removeComments(
    solutionCode,
    language?.slug || "javascript"
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Clean Solution Code"
      icon={<Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
    >
      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Here&apos;s the complete solution without comments or explanations.
            Use this as a reference or copy it to experiment with modifications.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <UnifiedCodeEditor
            exercise={exercise}
            language={language}
            code={cleanSolutionCode}
            onCodeChange={() => {}} // Read-only
            mode="solution"
            isReadOnly={true}
          />
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 This code is read-only. Copy it to your editor if you want to
            make changes.
          </p>
        </div>
      </div>
    </BaseModal>
  )
}
