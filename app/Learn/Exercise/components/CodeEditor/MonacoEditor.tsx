// Monaco Editor wrapper component
"use client"

import React, { memo, useCallback, useMemo, useRef } from "react"
import { Editor } from "@monaco-editor/react"

// Monaco Editor wrapper component

interface MonacoEditorProps {
  code: string
  language: string
  onChange: (code: string) => void
  onMount?: (editor: any, monaco: any) => void
  fontSize: number
  showLineNumbers: boolean
  isReadOnly?: boolean
  placeholder?: string
  className?: string
}

/**
 * Monaco Editor wrapper with optimized configuration
 */
const MonacoEditor: React.FC<MonacoEditorProps> = ({
  code,
  language,
  onChange,
  onMount,
  fontSize,
  showLineNumbers,
  isReadOnly = false,
  placeholder = "",
  className = "",
}) => {
  const editorRef = useRef<any>(null)

  // Map language slugs to Monaco language identifiers
  const getMonacoLanguage = useCallback((lang: string): string => {
    const languageMap: Record<string, string> = {
      "c-programming": "c",
      c: "c",
      cpp: "cpp",
      "c++": "cpp",
      java: "java",
      python: "python",
      javascript: "javascript",
      typescript: "typescript",
      html: "html",
      css: "css",
      json: "json",
      sql: "sql",
    }
    return languageMap[lang.toLowerCase()] || "plaintext"
  }, [])

  // Handle editor mount with keyboard shortcuts
  const handleEditorDidMount = useCallback(
    (editor: any, monaco: any) => {
      editorRef.current = editor

      // Add keyboard shortcuts
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        // Save shortcut - could trigger auto-save
        console.log("Save shortcut pressed")
      })

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        // Run shortcut - trigger parent callback
        if (code.trim() && !isReadOnly) {
          // This would need to be passed from parent
          console.log("Run shortcut pressed")
        }
      })

      // Focus the editor if not read-only
      if (!isReadOnly) {
        editor.focus()
      }

      // Call parent mount handler
      onMount?.(editor, monaco)
    },
    [code, isReadOnly, onMount]
  )

  // Editor configuration options - memoized for performance
  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize,
      lineHeight: 20,
      fontFamily:
        "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
      wordWrap: "on" as const,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderLineHighlight: "gutter" as const,
      selectOnLineNumbers: true,
      lineNumbers: showLineNumbers ? ("on" as const) : ("off" as const),
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 3,
      renderWhitespace: "selection" as const,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: "on" as const,
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
      parameterHints: { enabled: true },
      hover: { enabled: true },
      contextmenu: true,
      mouseWheelZoom: true,
      cursorBlinking: "blink" as const,
      cursorSmoothCaretAnimation: "on" as const,
      smoothScrolling: true,
      readOnly: isReadOnly,
      scrollbar: {
        vertical: "visible" as const,
        horizontal: "visible" as const,
        useShadows: false,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    }),
    [fontSize, showLineNumbers, isReadOnly]
  )

  const displayValue = code || placeholder

  return (
    <div
      className={`flex-1 overflow-hidden border border-slate-200 dark:border-slate-700 ${className}`}
    >
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={displayValue}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={editorOptions}
        loading={
          <div className="flex h-full items-center justify-center bg-slate-900">
            <div className="flex items-center gap-2 text-slate-400">
              <div className="h-4 w-4 animate-spin rounded-full border border-slate-400 border-t-transparent" />
              <span className="text-sm">Loading Monaco Editor...</span>
            </div>
          </div>
        }
      />
    </div>
  )
}

// Custom comparison function for MonacoEditor props
const monacoEditorPropsEqual = (
  prevProps: MonacoEditorProps,
  nextProps: MonacoEditorProps
): boolean => {
  return (
    prevProps.code === nextProps.code &&
    prevProps.language === nextProps.language &&
    prevProps.fontSize === nextProps.fontSize &&
    prevProps.showLineNumbers === nextProps.showLineNumbers &&
    prevProps.isReadOnly === nextProps.isReadOnly &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.className === nextProps.className
  )
}

export default memo(MonacoEditor, monacoEditorPropsEqual)
