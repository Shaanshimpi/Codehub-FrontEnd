"use client"

import React, { useState } from "react"
import type { TutorialData } from "@/app/Learn/types/TutorialTypes"
import { BookOpen, Plus, Sparkles } from "lucide-react"
import AITutorialForm from "../components/AITutorialForm"
import MultiLessonTutorialForm from "../components/MultiLessonTutorialForm"

const TutorialManagementView: React.FC = () => {
  const [showForm, setShowForm] = useState<"manual" | "ai" | false>(false)
  const [aiGeneratedData, setAiGeneratedData] = useState<TutorialData | null>(
    null
  )

  const handleAIGenerated = (data: TutorialData) => {
    console.log("🤖 AI generated tutorial data:", data)
    setAiGeneratedData(data)
    setShowForm("manual") // Switch to manual form with AI data
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setAiGeneratedData(null) // Clear AI data when canceling
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Tutorial Management
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create and manage multi-lesson programming tutorials
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setAiGeneratedData(null)
                setShowForm("manual")
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create Tutorial
            </button>
            <button
              onClick={() => setShowForm("ai")}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-blue-700"
            >
              <Sparkles className="h-4 w-4" />
              AI Generate
            </button>
          </div>
        </div>
      </div>

      {showForm === "manual" ? (
        <MultiLessonTutorialForm
          onCancel={handleFormCancel}
          initialData={aiGeneratedData}
        />
      ) : showForm === "ai" ? (
        <AITutorialForm
          onCancel={handleFormCancel}
          onGenerated={handleAIGenerated}
        />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 py-12 dark:border-slate-600">
          <BookOpen className="mb-4 h-12 w-12 text-slate-400" />
          <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">
            No tutorials created yet
          </h3>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Get started by creating your first multi-lesson tutorial
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setAiGeneratedData(null)
                setShowForm("manual")
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create Tutorial
            </button>
            <button
              onClick={() => setShowForm("ai")}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-blue-700"
            >
              <Sparkles className="h-4 w-4" />
              AI Generate
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TutorialManagementView
