// Enhanced code editor with better separation of concerns
"use client"

import React, { memo, useCallback, useMemo } from "react"
import {
  useCodeEditor,
  useCodeExecution,
  useMonacoConfig,
} from "../../hooks/useCodeEditor"
import {
  codeEditorPropsEqual,
} from "../Performance/OptimizedComponents"
import EditorOutput from "./EditorOutput"
import {
  CodeInput,
  EditorActions,
  EditorStatus,
  FontControls,
} from "./EditorToolbar"
import MonacoEditor from "./MonacoEditor"

// Enhanced code editor with better separation of concerns

interface EnhancedCodeEditorProps {
  exercise: any
  language: any
  code: string
  onCodeChange?: (code: string) => void
  onLoadBoilerplate?: () => void
  onRunCode?: () => void
  isBoilerplateLoaded?: boolean
  onBoilerplateStatusChange?: (loaded: boolean) => void
  mode?: "problem" | "solution"
  isReadOnly?: boolean
  className?: string
}

/**
 * Enhanced code editor with better performance and modularity
 */
const EnhancedCodeEditor: React.FC<EnhancedCodeEditorProps> = ({
  exercise,
  language,
  code,
  onCodeChange,
  onLoadBoilerplate,
  onRunCode,
  isBoilerplateLoaded = false,
  onBoilerplateStatusChange,
  mode = "problem",
  isReadOnly = false,
  className = "",
}) => {
  const {
    fontSize,
    showLineNumbers,
    isEditorReady,
    setFontSize,
    toggleLineNumbers,
    copyCode,
    editorRef,
  } = useCodeEditor({
    initialCode: code,
    language: language.slug,
    onChange: onCodeChange,
    onRun: onRunCode,
  })

  const { getMonacoLanguage, getBoilerplate } = useMonacoConfig(language.slug)
  const { isRunning, output, executeCode, clearOutput, setOutput } =
    useCodeExecution()

  // Handle font size controls - memoized
  const increaseFontSize = useCallback(() => {
    setFontSize(Math.min(fontSize + 2, 20))
  }, [fontSize, setFontSize])

  const decreaseFontSize = useCallback(() => {
    setFontSize(Math.max(fontSize - 2, 10))
  }, [fontSize, setFontSize])

  const resetFontSize = useCallback(() => {
    setFontSize(14)
  }, [setFontSize])

  // Handle code operations
  const handleLoadBoilerplate = useCallback(() => {
    const boilerplate = getBoilerplate()
    onCodeChange?.(boilerplate)
    onBoilerplateStatusChange?.(true)
    onLoadBoilerplate?.()
  }, [
    getBoilerplate,
    onCodeChange,
    onBoilerplateStatusChange,
    onLoadBoilerplate,
  ])

  const handleResetCode = useCallback(() => {
    onCodeChange?.("")
    onBoilerplateStatusChange?.(false)
    clearOutput()
  }, [onCodeChange, onBoilerplateStatusChange, clearOutput])

  const handleRunCode = useCallback(async () => {
    if (!code.trim() || isRunning) return

    // Execute code using the hook
    await executeCode(code, language.slug)

    // Notify parent
    onRunCode?.()
  }, [code, isRunning, executeCode, language.slug, onRunCode])

  const handleCopyCode = useCallback(async () => {
    await copyCode()
  }, [copyCode])

  // Determine if we should show the Load button
  const shouldShowLoadButton = useMemo(() => {
    return mode === "problem" && !isBoilerplateLoaded && !code.trim()
  }, [mode, isBoilerplateLoaded, code])

  // Get placeholder text
  const placeholder = useMemo(() => {
    if (mode === "solution" || isReadOnly) return ""
    return `// Click "Load Boilerplate" to get started\n// Or write your ${getMonacoLanguage()} code from scratch...\n\n// Pro tip: Use Ctrl+Enter to run your code quickly!`
  }, [mode, isReadOnly, getMonacoLanguage])

  // Calculate line and character counts
  const lineCount = useMemo(() => code.split("\n").length, [code])
  const charCount = useMemo(() => code.length, [code])

  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Monaco Editor */}
      <MonacoEditor
        code={code}
        language={language.slug}
        onChange={onCodeChange || (() => {})}
        fontSize={fontSize}
        showLineNumbers={showLineNumbers}
        isReadOnly={isReadOnly}
        placeholder={placeholder}
      />

      {/* Bottom Control Panel */}
      <div className="border-t border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
        {/* Font Controls */}
        <div className="mb-2 flex items-center justify-between">
          <FontControls
            fontSize={fontSize}
            onIncrease={increaseFontSize}
            onDecrease={decreaseFontSize}
            onReset={resetFontSize}
            disabled={!isEditorReady}
          />

          {/* Line Numbers Toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={showLineNumbers}
              onChange={toggleLineNumbers}
              className="rounded"
            />
            Line numbers
          </label>
        </div>

        {/* Program Input (if supported) */}
        <CodeInput
          input="" // This would need to be managed by parent or another hook
          onChange={() => {}} // This would need to be implemented
          disabled={isRunning}
          language={language.slug}
        />

        {/* Action Buttons */}
        <EditorActions
          onLoadBoilerplate={
            shouldShowLoadButton ? handleLoadBoilerplate : undefined
          }
          onRunCode={handleRunCode}
          onCopyCode={handleCopyCode}
          onResetCode={handleResetCode}
          showLoadButton={shouldShowLoadButton}
          canRun={!!code.trim()}
          isRunning={isRunning}
          disabled={!isEditorReady}
        />

        {/* Status Bar */}
        <EditorStatus
          language={getMonacoLanguage()}
          lineCount={lineCount}
          charCount={charCount}
          isReady={isEditorReady}
        />
      </div>

      {/* Output Panel */}
      <EditorOutput
        output={output}
        isRunning={isRunning}
        onClear={clearOutput}
        language={getMonacoLanguage()}
      />
    </div>
  )
}

// Export memoized version with custom comparison
export default memo(EnhancedCodeEditor, codeEditorPropsEqual)
