// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/SolutionView.tsx
"use client"

import React, { useState } from "react"
import { useLanguage } from "@/app/contexts/LanguageContext"
import { getLocalizedContent } from "@/app/utils/exerciseHelpers"
import { Database, FileText, Lightbulb, Network, Play } from "lucide-react"
import AnswerCode from "../SolutionView/AnswerCode"
import ExecutionStepsPanel from "../SolutionView/ExecutionStepsPanel"
import ExplanationTabs from "../SolutionView/ExplanationTabs"
import KeyConceptsPanel from "../SolutionView/KeyConceptsPanel"
import MemoryStatesPanel from "../SolutionView/MemoryStatesPanel"
import MermaidViewer from "../SolutionView/MermaidViewer"

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
    <div className="flex h-[calc(100vh-200px)] overflow-hidden">
      {/* Left Panel - Explanation and Learning Content */}
      <div className="w-1/2 border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Solution & Learning
              </h2>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex min-w-0 flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                    }`}
                    title={tab.description}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">{renderTabContent()}</div>
        </div>
      </div>

      {/* Right Panel - Answer Code */}
      <div className="w-1/2 bg-slate-900">
        <AnswerCode
          code={exercise.solution_code}
          language={language}
          title="Complete Solution"
        />
      </div>
    </div>
  )
}

export default SolutionView
