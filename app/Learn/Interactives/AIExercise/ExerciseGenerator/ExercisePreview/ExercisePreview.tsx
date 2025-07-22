// app/Learn/Interactives/AIExercise/ExerciseGenerator/ExercisePreview/ExercisePreview.tsx
"use client"

import React, { useState } from "react"
import type { ExerciseAIData } from "@/app/Learn/types/TutorialTypes"
import { useLanguage } from "@/app/contexts/LanguageContext"
import { MermaidDiagram } from "@lightenna/react-mermaid-diagram"
import { Tag } from "lucide-react"
import Header from "./components/Header"
import LearningObjectivesDisplay from "./components/LearningObjectivesDisplay"
import Metadata from "./components/Metadata"
import Section from "./components/Section"
import TagsDisplay from "./components/TagsDisplay"
import Title from "./components/Title"
import {
  formatCode,
  formatExplanationArray,
  formatHintsArray,
  formatVisualElements,
} from "./utils/exerciseFormatter"
import {
  getDifficultyLabel,
  getLocalizedContent,
} from "./utils/exerciseHelpers"

// app/Learn/Interactives/AIExercise/ExerciseGenerator/ExercisePreview/ExercisePreview.tsx

// app/Learn/Interactives/AIExercise/ExerciseGenerator/ExercisePreview/ExercisePreview.tsx

// app/Learn/Interactives/AIExercise/ExerciseGenerator/ExercisePreview/ExercisePreview.tsx

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
  const [showBoilerCode, setShowBoilerCode] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showDiagram, setShowDiagram] = useState(false)
  const [showVisuals, setShowVisuals] = useState(false)

  const [showLearningObjectives, setShowLearningObjectives] = useState(true)
  const [diagramError, setDiagramError] = useState(false)

  const { language } = useLanguage()

  const content = getLocalizedContent(exerciseData, language) // Replace with dynamic language

  // Add custom styles for the component
  React.useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
      
      .exercise-preview-container {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      }
      
      .section-content {
        animation: fadeIn 0.3s ease-out;
      }
      
      .mermaid-container {
        max-width: 100%;
        overflow-x: auto;
        background: white;
        border-radius: 8px;
        padding: 1rem;
      }
      
      .mermaid-error {
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 8px;
        padding: 1rem;
        color: #c00;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  // console.log(exerciseData)
  return (
    <div className="exercise-preview-container mx-auto max-w-4xl rounded-lg p-6 text-white shadow-2xl">
      <Header onBack={onBack} onContinue={onContinue} />

      <div className="space-y-6">
        <Title title={content.title} />
        {/* Tags Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Tag className="h-5 w-5 text-blue-600" />
            Programming Concepts
          </h3>
          <TagsDisplay tags={exerciseData.tags} />
        </div>

        {/* Learning Objectives Section */}
        <Section
          show={showLearningObjectives}
          setShow={setShowLearningObjectives}
          label="🎯 Learning Objectives"
        >
          <LearningObjectivesDisplay
            objectives={exerciseData.learning_objectives}
          />
        </Section>

        {/* Hints Section */}
        <Section show={showHints} setShow={setShowHints} label="💡 Show Hints">
          <div className="section-content">
            {formatHintsArray(content.hints)}
          </div>
        </Section>

        {/* Code Section */}
        <Section show={showCode} setShow={setShowCode} label="💻 Show Code">
          <div className="section-content">
            {formatCode(exerciseData.solution_code, formData.selectedLangObj)}
          </div>
        </Section>
        {/* Code Section */}
        <Section
          show={showBoilerCode}
          setShow={setShowBoilerCode}
          label="BoilerPlate Code"
        >
          <div className="section-content">
            {formatCode(
              exerciseData.boilerplate_code,
              formData.selectedLangObj
            )}
          </div>
        </Section>

        {/* Explanation Section */}
        <Section
          show={showExplanation}
          setShow={setShowExplanation}
          label="📝 Show Explanation"
        >
          <div className="section-content">
            {formatExplanationArray(content.explanation)}
          </div>
        </Section>
        {/* Mermaid Diagram */}
        {
          <Section
            show={showDiagram}
            setShow={setShowDiagram}
            label="📊 Concept Diagram"
          >
            <div className="section-content">
              <div className="mermaid-container">
                {diagramError ? (
                  <div className="mermaid-error">
                    <p>{`Error rendering diagram. Here's the raw diagram code:`}</p>
                    <pre
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.5rem",
                        background: "#f5f5f5",
                        borderRadius: "4px",
                        overflow: "auto",
                        fontSize: "0.875rem",
                      }}
                    >
                      {exerciseData.mermaid_diagram}
                    </pre>
                  </div>
                ) : (
                  <div>
                    <MermaidDiagram>
                      {exerciseData.mermaid_diagram}
                    </MermaidDiagram>
                  </div>
                )}
              </div>
            </div>
          </Section>
        }

        {/* Visual Elements */}
        {exerciseData.visual_elements && (
          <Section
            show={showVisuals}
            setShow={setShowVisuals}
            label="🎨 Visual Learning Aids"
          >
            <div className="section-content">
              {formatVisualElements(exerciseData.visual_elements)}
            </div>
          </Section>
        )}

        <Metadata
          difficulty={getDifficultyLabel(formData?.difficulty)}
          slug={formData?.slug}
        />
      </div>
    </div>
  )
}

export default ExercisePreview
