// Instructions modal for viewing boilerplate with comments
"use client"

import React, { useEffect, useRef, useState } from "react"
import { Editor } from "@monaco-editor/react"
import { BookOpen, Check, Copy, X } from "lucide-react"
import { BoilerplateGenerator } from "./BoilerplateGenerator"

// Instructions modal for viewing boilerplate with comments

interface InstructionsModalProps {
  isOpen: boolean
  exercise: any
  language: any
  onClose: () => void
  onCopyToEditor: (code: string) => void
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  exercise,
  language,
  onClose,
  onCopyToEditor,
}) => {
  const [instructionalCode, setInstructionalCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Generate instructional code when modal opens
  useEffect(() => {
    if (isOpen) {
      // Store previous focus for restoration
      previousFocusRef.current = document.activeElement as HTMLElement

      const boilerplate = BoilerplateGenerator.generate(exercise, language)
      setInstructionalCode(boilerplate.instructional)
      setIsEditorReady(false)

      // Focus management for modal
      const timer = setTimeout(() => {
        const closeButton = modalRef.current?.querySelector(
          'button[aria-label*="Close"]'
        ) as HTMLElement
        if (closeButton) {
          closeButton.focus()
        }
      }, 100)

      return () => clearTimeout(timer)
    } else if (previousFocusRef.current) {
      // Restore focus when modal closes
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [isOpen, exercise, language])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case "Escape":
          onClose()
          break
        case "Tab": {
          // Trap focus within modal
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement
            const lastElement = focusableElements[
              focusableElements.length - 1
            ] as HTMLElement

            if (event.shiftKey) {
              if (document.activeElement === firstElement) {
                event.preventDefault()
                lastElement.focus()
              }
            } else {
              if (document.activeElement === lastElement) {
                event.preventDefault()
                firstElement.focus()
              }
            }
          }
          break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  // Handle copy to editor
  const handleCopyToEditor = () => {
    onCopyToEditor(instructionalCode)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      onClose() // Close modal after copying
    }, 1500)
  }

  // Handle copy to clipboard
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(instructionalCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to copy to clipboard:", error)
    }
  }

  // Monaco editor configuration
  const getMonacoLanguage = () => {
    switch (language.slug) {
      case "c-programming":
      case "c":
        return "c"
      case "cpp":
      case "c++":
        return "cpp"
      case "java":
        return "java"
      case "python":
        return "python"
      case "javascript":
        return "javascript"
      case "typescript":
        return "typescript"
      case "html":
        return "html"
      case "css":
        return "css"
      case "json":
        return "json"
      case "sql":
        return "sql"
      default:
        return "plaintext"
    }
  }

  const editorOptions = {
    readOnly: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineHeight: 20,
    fontFamily:
      "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
    wordWrap: "on" as const,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    renderLineHighlight: "none" as const,
    selectOnLineNumbers: false,
    lineNumbers: "on" as const,
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    renderWhitespace: "none" as const,
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      indentation: true,
    },
    contextmenu: false,
    mouseWheelZoom: false,
    cursorBlinking: "solid" as const,
    smoothScrolling: true,
    scrollbar: {
      vertical: "visible" as const,
      horizontal: "visible" as const,
      useShadows: false,
      verticalHasArrows: false,
      horizontalHasArrows: false,
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
  }

  const handleEditorDidMount = (editor: any, _monaco: any) => {
    editorRef.current = editor
    setIsEditorReady(true)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="instructions-modal-title"
      aria-describedby="instructions-modal-desc"
    >
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
        onKeyDown={(e) => e.key === "Enter" && handleBackdropClick(e as any)}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="modal-enter relative mx-2 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 sm:mx-0 sm:max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-green-200 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/50">
              <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2
                id="instructions-modal-title"
                className="text-lg font-bold text-green-900 dark:text-green-100"
              >
                Exercise Instructions
              </h2>
              <p
                id="instructions-modal-desc"
                className="text-sm text-green-700 dark:text-green-300"
              >
                Step-by-step guidance with hints and examples
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="focus-ring rounded-lg p-2 transition-colors hover:bg-green-100 dark:hover:bg-green-900/50"
            aria-label="Close instructions modal"
          >
            <X className="h-5 w-5 text-green-600 dark:text-green-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[60vh] flex-col sm:h-[70vh]">
          {/* Editor */}
          <div className="m-3 mb-2 flex-1 overflow-hidden rounded-lg border border-green-200 dark:border-green-700 sm:m-4">
            <Editor
              height="100%"
              language={getMonacoLanguage()}
              value={instructionalCode}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={editorOptions}
              loading={
                <div className="flex h-full items-center justify-center bg-slate-900">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="h-4 w-4 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                    <span className="text-sm">Loading instructions...</span>
                  </div>
                </div>
              }
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 bg-gray-50 p-3 pt-2 dark:bg-gray-800/50 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="text-center text-xs text-gray-600 dark:text-gray-400 sm:text-left sm:text-sm">
              <span className="font-medium">💡 Tip:</span> Use these
              instructions as a guide, then write your own solution
            </div>

            <div className="flex items-center justify-center gap-2 sm:justify-end sm:gap-3">
              {/* Copy to Clipboard */}
              <button
                onClick={handleCopyToClipboard}
                disabled={!isEditorReady}
                className="focus-ring flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                title="Copy instructions to clipboard"
                aria-label={
                  copied
                    ? "Instructions copied to clipboard"
                    : "Copy instructions to clipboard"
                }
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* Copy to Editor */}
              <button
                onClick={handleCopyToEditor}
                disabled={!isEditorReady}
                className="btn-success btn-shimmer focus-ring flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                title="Replace editor content with instructions"
                aria-label={
                  copied
                    ? "Instructions copied to editor"
                    : "Copy instructions to the code editor"
                }
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied to Editor!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy to Editor</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-friendly footer */}
        <div className="block p-4 pt-0 sm:hidden">
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            Use the guidance above to understand the exercise requirements
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructionsModal
