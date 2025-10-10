// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/SolutionView.tsx
"use client"

import React, { useState } from "react"
import { useUser } from "@/app/(payload)/_providers/UserProvider"
import UnifiedMobileTabSwitcher from "@/app/Learn/Exercise/components/Mobile/UnifiedMobileTabSwitcher"
import LoginModal from "@/app/Learn/components/LoginModal"
import {
  Code,
  FileText,
  Lightbulb,
  Lock,
  Network,
  Play,
} from "lucide-react"
import SolutionCodePlayground from "../Shared/SolutionCodePlayground"
import ExecutionStepsPanel from "../SolutionView/ExecutionStepsPanel"
import ExplanationTabs from "../SolutionView/ExplanationTabs"
import KeyConceptsPanel from "../SolutionView/KeyConceptsPanel"
import MermaidViewer from "../SolutionView/MermaidViewer"

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
  const [mobileActiveTab, setMobileActiveTab] = useState<"solution" | "code">(
    "solution"
  )
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [lockedFeature, setLockedFeature] = useState("")
  const { user } = useUser()

  // Use exercise data directly (no multi-language support)
  const content = {
    title: exercise.title,
    hints: exercise.hints,
    explanation: exercise.explanation,
  }

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

  // Mobile tabs configuration for UnifiedMobileTabSwitcher
  const mobileTabs = [
    {
      id: "solution",
      label: "Solution Guide",
      icon: <FileText className="h-4 w-4" />,
      description: "Detailed explanation with flowcharts and concepts",
    },
    {
      id: "code",
      label: "Solution Code",
      icon: <Code className="h-4 w-4" />,
      description: "Complete solution with comments",
    },
  ]

  return (
    <>
      {/* Enhanced Mobile Tab Switcher - Hidden on desktop */}
      <div className="lg:hidden">
        <UnifiedMobileTabSwitcher
          tabs={mobileTabs}
          activeTab={mobileActiveTab}
          onTabChange={(tabId) =>
            setMobileActiveTab(tabId as "solution" | "code")
          }
          className="bg-white dark:bg-neutral-900"
        />
      </div>

      {/* Responsive Layout */}
      <div
        className={`lg:flex ${isFullscreen ? "h-screen" : "h-[calc(100vh-8rem)]"}`}
      >
        {/* Solution Guide Panel - Left Side */}
        <div
          className={`lg:border-r lg:border-gray-300 lg:bg-gradient-to-br lg:from-neutral-50 lg:to-white lg:dark:border-gray-600 lg:dark:from-neutral-900 lg:dark:to-neutral-800 ${mobileActiveTab === "solution" ? `block ${isFullscreen ? "h-screen" : "h-[calc(100vh-8rem)]"} overflow-y-auto` : "hidden lg:block"} ${!isFullscreen ? "lg:h-full lg:w-1/2 lg:overflow-y-auto" : "lg:flex-none"}`}
          style={isFullscreen ? { width: `${panelWidth}%` } : {}}
        >
          <div className="flex h-full flex-col">
            {/* Modern Tab Navigation - High Contrast Design */}
            <div className="border-b border-gray-300 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-black">
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
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold shadow-lg transition-all duration-200 hover:shadow-xl ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                          : isLocked
                            ? "border border-amber-200 bg-white text-amber-600 hover:bg-amber-50 dark:border-amber-700 dark:bg-gray-900 dark:text-amber-400 dark:hover:bg-amber-900/20"
                            : "border border-gray-300 bg-white text-black hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-blue-900"
                      }`}
                      title={
                        isLocked
                          ? `${tab.description} (Premium Feature)`
                          : tab.description
                      }
                    >
                      {isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline">{tab.label}</span>
                      {isLocked && <Lock className="ml-1 h-3 w-3" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-2 lg:p-3">
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

        {/* Solution Code Panel - Right Side (Like StudentPlayground) */}
        <div
          className={`${mobileActiveTab === "code" ? `block h-full` : "hidden lg:block"} ${!isFullscreen ? "lg:h-full lg:w-1/2" : "lg:flex-1"}`}
          style={
            isFullscreen ? { width: `calc(${100 - panelWidth}% - 4px)` } : {}
          }
        >
          <SolutionCodePlayground exercise={exercise} language={language} />
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
