// Solution playground component matching problem view structure
"use client"

import React, { useRef, useState } from "react"
import { removeComments } from "@/app/utils/codeCommentUtils"
import { Editor } from "@monaco-editor/react"
import { Play, Settings, Zap } from "lucide-react"
import SolutionHelpMenu from "./SolutionHelpMenu"
import { CleanSolutionModal, ExplanationModal } from "./SolutionModals"

// Solution playground component matching problem view structure

interface SolutionPlaygroundState {
  mode: "with-explanation" | "clean-solution"
  showHelpMenu: boolean
  showExplanationModal: boolean
  showCleanSolutionModal: boolean
  showAdvancedControls: boolean
}

interface SolutionPlaygroundProps {
  exercise: any
  language: any
  isReadOnly?: boolean
}

const SolutionPlayground: React.FC<SolutionPlaygroundProps> = ({
  exercise,
  language,
  isReadOnly = true,
}) => {
  // Simple, predictable state
  const [state, setState] = useState<SolutionPlaygroundState>({
    mode: "with-explanation",
    showHelpMenu: false,
    showExplanationModal: false,
    showCleanSolutionModal: false,
    showAdvancedControls: false,
  })

  const editorRef = useRef<any>(null)
  const solutionCode = exercise?.solution_code || ""
  const cleanSolutionCode = removeComments(
    solutionCode,
    language?.slug || "javascript"
  )

  // Get current code based on mode
  const getCurrentCode = () => {
    return state.mode === "clean-solution" ? cleanSolutionCode : solutionCode
  }

  // Get Monaco language
  const getMonacoLanguage = () => {
    if (!language?.slug) return "javascript"

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
      default:
        return "javascript"
    }
  }

  // Update state helper
  const updateState = (updates: Partial<SolutionPlaygroundState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  // Handle help menu actions
  const handleShowExplanation = () => {
    updateState({ showExplanationModal: true, showHelpMenu: false })
  }

  const handleShowCleanSolution = () => {
    updateState({ showCleanSolutionModal: true, showHelpMenu: false })
  }

  // Handle code mode switching
  const handleLoadCleanSolution = () => {
    updateState({ mode: "clean-solution", showHelpMenu: false })
  }

  const handleLoadWithExplanation = () => {
    updateState({ mode: "with-explanation", showHelpMenu: false })
  }

  return (
    <div className="relative flex h-full flex-col bg-gray-900">
      {/* Modern Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 p-3">
        {/* Left side - Code mode indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-gray-700 px-3 py-1.5">
            <div
              className={`h-2 w-2 rounded-full ${
                state.mode === "with-explanation"
                  ? "bg-blue-400"
                  : "bg-yellow-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-300">
              {state.mode === "with-explanation"
                ? "With Comments"
                : "Clean Code"}
            </span>
          </div>
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-2">
          {/* Need Help Button */}
          <div className="relative">
            <button
              onClick={() => updateState({ showHelpMenu: !state.showHelpMenu })}
              className={`focus-ring group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium shadow-md transition-all duration-300 hover:scale-[1.02] ${
                state.showHelpMenu
                  ? "bg-blue-600 text-white shadow-blue-500/25"
                  : "bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white"
              }`}
              title="Get help with explanations and solution resources"
            >
              <Play className="h-4 w-4" />
              <span className="hidden font-medium sm:inline">Need Help</span>
            </button>

            <SolutionHelpMenu
              isOpen={state.showHelpMenu}
              onClose={() => updateState({ showHelpMenu: false })}
              onShowExplanation={handleShowExplanation}
              onShowCleanSolution={handleShowCleanSolution}
            />
          </div>

          {/* Advanced Settings */}
          <div className="relative">
            <button
              onClick={() =>
                updateState({
                  showAdvancedControls: !state.showAdvancedControls,
                })
              }
              className="rounded-lg bg-gray-700 p-2 text-gray-400 transition-all duration-300 hover:bg-gray-600 hover:text-gray-300"
              title="Advanced controls"
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* Advanced Controls Dropdown */}
            {state.showAdvancedControls && (
              <>
                <div
                  role="button"
                  tabIndex={0}
                  className="fixed inset-0 z-40"
                  onClick={() => updateState({ showAdvancedControls: false })}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    updateState({ showAdvancedControls: false })
                  }
                  aria-label="Close advanced controls"
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
                  <div className="p-2">
                    <button
                      onClick={handleLoadWithExplanation}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 transition-all hover:bg-gray-700 ${
                        state.mode === "with-explanation"
                          ? "bg-blue-600/20 text-blue-400"
                          : "text-gray-300"
                      }`}
                    >
                      <Play className="h-4 w-4" />
                      <span className="text-sm font-medium">With Comments</span>
                    </button>
                    <button
                      onClick={handleLoadCleanSolution}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 transition-all hover:bg-gray-700 ${
                        state.mode === "clean-solution"
                          ? "bg-yellow-600/20 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <Zap className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Clean Solution
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="relative flex-1">
        <Editor
          height="100%"
          language={getMonacoLanguage()}
          value={getCurrentCode()}
          theme="vs-dark"
          options={{
            readOnly: isReadOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
            },
          }}
          onMount={(editor) => {
            editorRef.current = editor
          }}
        />
      </div>

      {/* Modals */}
      <ExplanationModal
        isOpen={state.showExplanationModal}
        onClose={() => updateState({ showExplanationModal: false })}
        exercise={exercise}
        language={language}
      />

      <CleanSolutionModal
        isOpen={state.showCleanSolutionModal}
        onClose={() => updateState({ showCleanSolutionModal: false })}
        exercise={exercise}
        language={language}
      />
    </div>
  )
}

export default SolutionPlayground
