"use client"

import React, { useState } from "react"
import type { ExerciseAIData } from "@/app/Learn/types/TutorialTypes"
import CodeBlock from "./components/CodeBlock"
import Header from "./components/Header"
import Metadata from "./components/Metadata"
import Section from "./components/Section"
import Title from "./components/Title"
import {
  getDifficultyLabel,
  getLocalizedContent,
} from "./utils/exerciseHelpers"
import { formatExplanation } from "./utils/textFormatter"

interface ExercisePreviewProps {
  exerciseData: ExerciseAIData
  formData: any
  onBack: () => void
  onContinue: () => void
}

const ExercisePreview: React.FC<ExercisePreviewProps> = ({
  exerciseData,
  formData,
  onBack,
  onContinue,
}) => {
  const [showHints, setShowHints] = useState(false)
  const [showCode, setShowCode] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)

  const content = getLocalizedContent(exerciseData, "en") // Replace 'en' with a dynamic language if needed
  console.log(exerciseData)
  const style = document.createElement("style")
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `
  document.head.appendChild(style)
  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-slate-900 p-6 text-white shadow-lg">
      <Header onBack={onBack} onContinue={onContinue} />
      <div className="space-y-4">
        <Title title={content.title} />
        <Section show={showHints} setShow={setShowHints} label="💡 Show Hints">
          <div className="rounded-lg bg-slate-800 p-4 text-slate-300">
            {content.hints}
          </div>
        </Section>
        <Section show={showCode} setShow={setShowCode} label="💻 Show Code">
          <CodeBlock code={exerciseData.code} />
        </Section>
        <Section
          show={showExplanation}
          setShow={setShowExplanation}
          label="📝 Show Explanation"
        >
          <div className="rounded-lg bg-slate-800 p-4">
            {formatExplanation(content.explanation)}
          </div>
        </Section>
        <Metadata
          difficulty={getDifficultyLabel(formData?.difficulty)}
          slug={formData?.slug}
        />
      </div>
    </div>
  )
}

export default ExercisePreview
