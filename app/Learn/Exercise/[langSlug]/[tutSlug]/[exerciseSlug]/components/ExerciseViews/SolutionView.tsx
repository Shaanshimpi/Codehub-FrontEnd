// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/SolutionView.tsx
"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useUser } from "@/app/(payload)/_providers/UserProvider"
import LoginModal from "@/app/Learn/components/LoginModal"
import { useLanguage } from "@/app/contexts/LanguageContext"
import { removeComments } from "@/app/utils/codeCommentUtils"
import { getLocalizedContent } from "@/app/utils/exerciseHelpers"
import {
  Code,
  FileText,
  Lightbulb,
  Lock,
  MessageSquare,
  Network,
  Play,
  Zap,
} from "lucide-react"
import EnhancedTabContainer, { TabConfig } from "../Shared/EnhancedTabContainer"
import UnifiedCodeEditor from "../Shared/UnifiedCodeEditor"
import ExecutionStepsPanel from "../SolutionView/ExecutionStepsPanel"
import ExplanationTabs from "../SolutionView/ExplanationTabs"
import KeyConceptsPanel from "../SolutionView/KeyConceptsPanel"
import MermaidViewer from "../SolutionView/MermaidViewer"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/SolutionView.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/SolutionView.tsx

interface SolutionViewProps {
  exercise: any
  language: any
  isFullscreen?: boolean
  panelWidth?: number
  onPanelResize?: (e: React.MouseEvent) => void
}

type TabType = "explanation" | "flowchart" | "execution" | "concepts"

const SolutionView: React.FC<SolutionViewProps> = ({
  exercise,
  language,
  isFullscreen = false,
  panelWidth = 50,
  onPanelResize,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("explanation")
  const [mobileActiveTab, setMobileActiveTab] = useState<
    "explanation" | "code"
  >("explanation")
  const [currentCode, setCurrentCode] = useState(exercise.solution_code)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [lockedFeature, setLockedFeature] = useState("")
  const { language: currentLanguage } = useLanguage()
  const { user } = useUser()

  // Reset code when exercise changes
  useEffect(() => {
    setCurrentCode(exercise.solution_code)
  }, [exercise.solution_code])

  // Get localized content based on selected language
  const content = getLocalizedContent(exercise, currentLanguage)

  // Handle solution code changes
  const handleSolutionCodeChange = useCallback((code: string) => {
    setCurrentCode(code)
  }, [])

  // Enhanced tabs configuration for solution code section
  const solutionTabsConfig: TabConfig[] = useMemo(() => {
    const solutionCode = exercise.solution_code || ""
    const cleanSolutionCode = removeComments(solutionCode, language.slug)

    return [
      {
        id: "with-explanation",
        label: "With Explanation",
        icon: <MessageSquare className="h-4 w-4" />,
        content: (
          <UnifiedCodeEditor
            key="solution-explanation-editor"
            exercise={exercise}
            language={language}
            code={currentCode}
            onCodeChange={handleSolutionCodeChange}
            mode="solution"
          />
        ),
      },
      {
        id: "clean-solution",
        label: "Clean Solution",
        icon: <Zap className="h-4 w-4" />,
        content: (
          <UnifiedCodeEditor
            key="solution-clean-editor"
            exercise={exercise}
            language={language}
            code={cleanSolutionCode}
            onCodeChange={() => {}} // Read-only
            mode="solution"
            isReadOnly={true}
          />
        ),
      },
    ]
  }, [exercise, language, currentCode, handleSolutionCodeChange])

  // Check if premium features are locked
  const isPremiumLocked = !user

  // Premium feature names mapping
  const premiumFeatures = {
    flowchart: "Mermaid Diagram",
    execution: "Execution Steps with Memory States",
  }

  // Handle tab click with premium feature check
  const handleTabClick = (tabId: TabType) => {
    if (isPremiumLocked && (tabId === "flowchart" || tabId === "execution")) {
      setLockedFeature(premiumFeatures[tabId])
      setShowLoginModal(true)
      return
    }
    setActiveTab(tabId)
  }

  const tabs = [
    {
      id: "explanation" as TabType,
      label: "Explanation",
      icon: FileText,
      description: "Step-by-step solution breakdown",
    },
    {
      id: "flowchart" as TabType,
      label: "Flowchart",
      icon: Network,
      description: "Visual program flow",
    },
    {
      id: "execution" as TabType,
      label: "Execution & Memory",
      icon: Play,
      description: "Line-by-line execution with memory states",
    },
    {
      id: "concepts" as TabType,
      label: "Key Concepts",
      icon: Lightbulb,
      description: "Important programming concepts",
    },
  ]

  const renderTabContent = () => {
    return (
      <div className="relative">
        {/* Explanation Tab */}
        <div className={activeTab === "explanation" ? "block" : "hidden"}>
          <ExplanationTabs explanation={content.explanation} />
        </div>

        {/* Flowchart Tab */}
        <div className={activeTab === "flowchart" ? "block" : "hidden"}>
          <MermaidViewer
            diagram={exercise.mermaid_diagram}
            title="Program Flow Diagram"
          />
        </div>

        {/* Execution Tab with Memory States */}
        <div className={activeTab === "execution" ? "block" : "hidden"}>
          <ExecutionStepsPanel
            executionSteps={exercise.visual_elements?.execution_steps || []}
            title="Execution Steps with Memory States"
          />
        </div>

        {/* Concepts Tab */}
        <div className={activeTab === "concepts" ? "block" : "hidden"}>
          <KeyConceptsPanel
            concepts={exercise.visual_elements?.concepts || []}
            tags={exercise.tags}
            objectives={exercise.learning_objectives}
            title="Programming Concepts"
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Tab Switcher - Hidden on desktop */}
      <div className="bg-white dark:bg-slate-900 lg:hidden">
        <div className="flex">
          <button
            onClick={() => setMobileActiveTab("explanation")}
            className={`flex flex-1 items-center justify-center gap-1 border-b-2 px-4 py-2 text-sm font-medium ${
              mobileActiveTab === "explanation"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500"
            }`}
          >
            <FileText className="h-3 w-3" />
            Explanation
          </button>
          <button
            onClick={() => setMobileActiveTab("code")}
            className={`flex flex-1 items-center justify-center gap-1 border-b-2 px-4 py-2 text-sm font-medium ${
              mobileActiveTab === "code"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500"
            }`}
          >
            <Code className="h-3 w-3" />
            Code
          </button>
        </div>
      </div>

      {/* Responsive Layout */}
      <div
        className={`lg:flex ${isFullscreen ? "h-screen" : "lg:h-[calc(100vh-10rem)]"}`}
      >
        {/* Explanation Panel */}
        <div
          className={`lg:border-r lg:border-slate-200 lg:bg-white lg:dark:border-slate-700 lg:dark:bg-slate-900 ${mobileActiveTab === "explanation" ? `block ${isFullscreen ? "h-screen" : "h-[calc(100vh-6rem)]"} overflow-y-auto` : "hidden lg:block"} ${!isFullscreen ? "lg:h-full lg:w-1/2 lg:overflow-y-auto" : "lg:flex-none"}`}
          style={isFullscreen ? { width: `${panelWidth}%` } : {}}
        >
          <div className="flex h-full flex-col">
            {/* Compact Header - Always visible */}
            <div className="border-b border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
              {/* Compact Tab Navigation */}
              <div className="flex space-x-1 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isLocked =
                    isPremiumLocked &&
                    (tab.id === "flowchart" || tab.id === "execution")
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white"
                          : isLocked
                            ? "text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
                            : "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
                      } ${isLocked ? "cursor-pointer" : ""}`}
                      title={
                        isLocked
                          ? `${tab.description} (Premium Feature)`
                          : tab.description
                      }
                    >
                      {isLocked ? (
                        <Lock className="h-3 w-3" />
                      ) : (
                        <Icon className="h-3 w-3" />
                      )}
                      <span className="hidden sm:inline">{tab.label}</span>
                      {isLocked && <Lock className="ml-1 h-2 w-2" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-2">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Resize Handle - Only visible on desktop in fullscreen */}
        {isFullscreen && onPanelResize && (
          <button
            className="hidden w-1 flex-none cursor-col-resize bg-slate-300 transition-colors hover:bg-blue-500 lg:block"
            onMouseDown={onPanelResize}
            title="Drag to resize panels"
          />
        )}

        {/* Enhanced Solution Code Panel with Sub-tabs */}
        <div
          className={`lg:bg-slate-900 ${mobileActiveTab === "code" ? `block ${isFullscreen ? "h-screen" : "h-[calc(100vh-6rem)]"}` : "hidden lg:block"} ${!isFullscreen ? "lg:h-full lg:w-1/2 lg:overflow-y-auto" : "lg:flex-1"}`}
          style={
            isFullscreen ? { width: `calc(${100 - panelWidth}% - 4px)` } : {}
          }
        >
          <EnhancedTabContainer
            tabs={solutionTabsConfig}
            variant="secondary"
            size="sm"
            className="h-full bg-slate-900"
            contentClassName="h-[calc(100%-3rem)]"
            defaultTab="with-explanation"
          />
        </div>
      </div>

      {/* Login Modal for Premium Features */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        featureType="premium-feature"
        featureName={lockedFeature}
      />
    </>
  )
}

export default SolutionView
