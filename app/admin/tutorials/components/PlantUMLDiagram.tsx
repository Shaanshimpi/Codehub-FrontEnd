"use client"

import React, { useEffect, useState } from "react"
import {
  DiagramData,
  convertJSONToPlantUML,
  createFallbackDiagram,
  plantumlUrl,
  validateDiagramData,
} from "../utils/diagramConverter"

interface PlantUMLDiagramProps {
  diagramData?: DiagramData | string | null
  children?: string
  className?: string
  showDebugInfo?: boolean
  showPlantUMLEditor?: boolean
  onPlantUMLChange?: (plantUMLCode: string) => void
  editable?: boolean
}

const PlantUMLDiagram: React.FC<PlantUMLDiagramProps> = ({
  diagramData,
  children,
  className = "",
  showDebugInfo = false,
  showPlantUMLEditor = true,
  onPlantUMLChange,
  editable = true,
}) => {
  const [imageError, setImageError] = useState(false)
  const [showPlantUMLCode, setShowPlantUMLCode] = useState(false)
  const [manualPlantUMLCode, setManualPlantUMLCode] = useState("")

  // Generate PlantUML URL for rendering
  const generatePlantUMLUrl = (plantUmlCode: string): string => {
    console.log(
      "🌐 generatePlantUMLUrl called with code length:",
      plantUmlCode?.length || 0
    )

    if (!plantUmlCode || !plantUmlCode.trim()) {
      console.log("❌ Empty PlantUML code provided")
      return ""
    }

    try {
      // Use base64 encoding with ~1 prefix for PlantUML server
      const url = `${plantumlUrl(plantUmlCode)}`
      console.log("✅ Generated PlantUML URL:", url)
      console.log("📝 PlantUML code being encoded:", plantUmlCode)
      return url
    } catch (error) {
      console.error("❌ Error generating PlantUML URL:", error)
      console.error("❌ PlantUML code that caused error:", plantUmlCode)
      return ""
    }
  }

  // Convert diagram data to PlantUML syntax
  const getPlantUMLCode = (): { code: string; error?: string } => {
    console.log("🔍 PlantUMLDiagram getPlantUMLCode called with:", {
      hasDiagramData: !!diagramData,
      diagramDataType: typeof diagramData,
      diagramData: diagramData,
      hasChildren: !!children,
      hasManualCode: !!manualPlantUMLCode,
    })

    // If user has manually edited the PlantUML code, use that
    if (manualPlantUMLCode && manualPlantUMLCode.trim()) {
      console.log("✏️ Using manually edited PlantUML code")
      return { code: manualPlantUMLCode }
    }

    // If we have diagramData (JSON format), convert it to PlantUML
    if (diagramData) {
      if (typeof diagramData === "string") {
        console.log("📝 Using diagram data as PlantUML string directly")
        // If it's already PlantUML string, use it directly
        return { code: diagramData }
      } else if (validateDiagramData(diagramData)) {
        console.log(
          "✅ Valid diagram data structure detected, converting to PlantUML"
        )
        // Convert JSON diagram data to PlantUML
        const convertedCode = convertJSONToPlantUML(diagramData)
        console.log("🎯 Converted PlantUML code:", convertedCode)
        return { code: convertedCode }
      } else {
        console.log("❌ Invalid diagram data structure:", diagramData)
        return {
          code: createFallbackDiagram("Invalid Data"),
          error: "Invalid diagram data structure",
        }
      }
    }

    // Fallback to children prop (for backward compatibility)
    if (children && children.trim()) {
      console.log("📝 Using children prop as PlantUML code")
      return { code: children }
    }

    // No valid data provided
    console.log("❌ No diagram data provided")
    return { code: "", error: "No diagram data provided" }
  }

  // Auto-populate the manual code field when diagram data changes
  useEffect(() => {
    if (!manualPlantUMLCode) {
      let generatedCode = ""

      if (diagramData) {
        if (typeof diagramData === "string") {
          generatedCode = diagramData
        } else if (validateDiagramData(diagramData)) {
          generatedCode = convertJSONToPlantUML(diagramData)
        } else {
          generatedCode = createFallbackDiagram("Invalid Data")
        }
      } else if (children && children.trim()) {
        generatedCode = children
      }

      if (generatedCode && generatedCode.trim()) {
        setManualPlantUMLCode(generatedCode)
        console.log("🔄 Auto-populated PlantUML editor with generated code")
      }
    }
  }, [diagramData, children, manualPlantUMLCode])

  // Handle manual PlantUML code changes
  const handlePlantUMLChange = (newCode: string) => {
    setManualPlantUMLCode(newCode)
    setImageError(false) // Reset image error when code changes
    if (onPlantUMLChange) {
      onPlantUMLChange(newCode)
    }
    console.log(
      "✏️ Manual PlantUML code updated:",
      newCode.length,
      "characters"
    )
  }

  const { code: plantUmlCode, error } = getPlantUMLCode()
  const plantUmlUrl = generatePlantUMLUrl(plantUmlCode)

  if (!plantUmlCode || (!plantUmlUrl && !error)) {
    return (
      <div className={`text-sm italic text-gray-500 ${className}`}>
        <div>No diagram data provided</div>
        {showDebugInfo && diagramData && (
          <div className="mt-2 text-xs">
            <strong>Raw data:</strong>
            <pre className="overflow-auto rounded bg-gray-100 p-2 text-xs">
              {typeof diagramData === "string"
                ? diagramData
                : JSON.stringify(diagramData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`plantuml-diagram ${className}`}>
      {error && (
        <div className="mb-2 text-sm text-red-600">
          <strong>Warning:</strong> {error}
        </div>
      )}

      {plantUmlUrl && !imageError && (
        <img
          src={plantUmlUrl}
          alt="PlantUML Diagram"
          className="mx-auto h-auto max-w-full rounded border"
          onError={(e) => {
            console.error("Error loading PlantUML diagram:", plantUmlUrl)
            setImageError(true)
          }}
        />
      )}

      {(imageError || !plantUmlUrl) && (
        <div className="rounded border border-yellow-200 bg-yellow-50 p-3 text-sm">
          <div className="mb-2 text-yellow-800">
            <strong>Diagram Rendering Error</strong>
          </div>
          <div className="text-gray-600">
            Unable to render diagram.{" "}
            {imageError ? "Image failed to load." : "No valid URL generated."}
          </div>
        </div>
      )}

      {showPlantUMLEditor && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              PlantUML Code (Dynamic Preview)
            </label>
            <textarea
              value={manualPlantUMLCode}
              onChange={(e) => handlePlantUMLChange(e.target.value)}
              className="h-40 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="PlantUML code will auto-populate here..."
              readOnly={!editable}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {editable
                ? "Edit this PlantUML code to customize the diagram. Preview updates automatically."
                : "Auto-generated PlantUML code (read-only)"}
            </p>
          </div>
        </div>
      )}

      {showDebugInfo && (
        <div className="mt-3 space-y-2">
          <button
            onClick={() => setShowPlantUMLCode(!showPlantUMLCode)}
            className="text-xs text-blue-600 underline hover:text-blue-800"
          >
            {showPlantUMLCode ? "Hide" : "Show"} Generated PlantUML Code
          </button>

          {showPlantUMLCode && (
            <div className="space-y-2">
              <div>
                <strong className="text-xs">Original Data:</strong>
                <pre className="overflow-auto rounded bg-gray-100 p-2 text-xs">
                  {typeof diagramData === "string"
                    ? diagramData
                    : JSON.stringify(diagramData, null, 2)}
                </pre>
              </div>
              <div>
                <strong className="text-xs">Generated PlantUML:</strong>
                <pre className="overflow-auto rounded bg-gray-100 p-2 text-xs">
                  {plantUmlCode}
                </pre>
              </div>
              {plantUmlUrl && (
                <div>
                  <strong className="text-xs">PlantUML URL:</strong>
                  <div className="break-all text-xs text-blue-600">
                    {plantUmlUrl}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PlantUMLDiagram
