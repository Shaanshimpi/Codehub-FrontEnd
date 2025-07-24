// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/SolutionView.tsx
"use client"

import React, { useState } from "react"
import { useLanguage } from "@/app/contexts/LanguageContext"
import { getLocalizedContent } from "@/app/utils/exerciseHelpers"
import {
  Code,
  Database,
  FileText,
  Lightbulb,
  Network,
  Play,
} from "lucide-react"
import UnifiedCodeEditor from "../Shared/UnifiedCodeEditor"
import ExecutionStepsPanel from "../SolutionView/ExecutionStepsPanel"
import ExplanationTabs from "../SolutionView/ExplanationTabs"
import KeyConceptsPanel from "../SolutionView/KeyConceptsPanel"
import MemoryStatesPanel from "../SolutionView/MemoryStatesPanel"
import MermaidViewer from "../SolutionView/MermaidViewer"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/SolutionView.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/SolutionView.tsx

interface SolutionViewProps {
  exercise: any
  language: any
  onComplete: () => void
}

type TabType = "explanation" | "flowchart" | "memory" | "execution" | "concepts"

const SolutionView: React.FC<SolutionViewProps> = ({
  exercise,
  language,
  onComplete,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("explanation")
  const [mobileActiveTab, setMobileActiveTab] = useState<
    "explanation" | "code"
  >("explanation")
  const { language: currentLanguage } = useLanguage()

  // Get localized content based on selected language
  const content = getLocalizedContent(exercise, currentLanguage)

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
      id: "memory" as TabType,
      label: "Memory States",
      icon: Database,
      description: "Variable states during execution",
    },
    {
      id: "execution" as TabType,
      label: "Execution Steps",
      icon: Play,
      description: "Line-by-line execution trace",
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

        {/* Memory Tab */}
        <div className={activeTab === "memory" ? "block" : "hidden"}>
          <MemoryStatesPanel
            memoryStates={exercise.memory_states}
            title="Memory State Changes"
          />
        </div>

        {/* Execution Tab */}
        <div className={activeTab === "execution" ? "block" : "hidden"}>
          <ExecutionStepsPanel
            executionSteps={exercise.execution_steps}
            title="Step-by-Step Execution"
          />
        </div>

        {/* Concepts Tab */}
        <div className={activeTab === "concepts" ? "block" : "hidden"}>
          <KeyConceptsPanel
            concepts={exercise.concepts}
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
      <div className="lg:flex lg:h-[calc(100vh-10rem)]">
        {/* Explanation Panel */}
        <div
          className={`lg:w-1/2 lg:border-r lg:border-slate-200 lg:bg-white lg:dark:border-slate-700 lg:dark:bg-slate-900 ${mobileActiveTab === "explanation" ? "block h-[calc(100vh-6rem)]" : "hidden lg:block"} `}
        >
          <div className="flex h-full flex-col">
            {/* Compact Header - Always visible */}
            <div className="border-b border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
              {/* Compact Tab Navigation */}
              <div className="flex space-x-1 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
                      }`}
                      title={tab.description}
                    >
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{tab.label}</span>
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

        {/* Solution Code Panel */}
        <div
          className={`lg:w-1/2 lg:bg-slate-900 ${mobileActiveTab === "code" ? "block h-[calc(100vh-6rem)]" : "hidden lg:block"} `}
        >
          <UnifiedCodeEditor
            exercise={exercise}
            language={language}
            code={exercise.solution_code}
            mode="solution"
          />
        </div>
      </div>
    </>
  )
}

export default SolutionView
