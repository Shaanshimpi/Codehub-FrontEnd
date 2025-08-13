// app/Learn/Interactives/AIExercise/ExerciseGenerator/ExercisePreview/utils/exerciseFormatter.tsx (Fixed)
import React from "react"
import { Language } from "@/app/Learn/types/TutorialTypes"
import CodeBlock from "../components/CodeBlock"

// Helper function to format inline code and bold text
const formatTextWithCode = (text: string): string => {
  return text
    .replace(
      /`([^`]+)`/g,
      '<code style="background: rgba(243, 244, 246, 0.1); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.875rem; color: #60A5FA;">$1</code>'
    )
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong style="color: #F59E0B; font-weight: 600;">$1</strong>'
    )
}

// FIXED: Format hints array with proper HTML rendering
export const formatHintsArray = (
  hints: Array<{ text: string; code_snippet?: string }>
): JSX.Element => {
  if (!hints || hints.length === 0) {
    return <div className="text-gray-400">No hints available</div>
  }

  return (
    <div className="hints-container space-y-3">
      {hints.map((hint, index) => (
        /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
        <div
          key={index}
          className="hint-item group"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
            background: "rgba(59, 130, 246, 0.05)",
            borderLeft: "4px solid #3B82F6",
            borderRadius: "0 8px 8px 0",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(4px)"
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0)"
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.05)"
          }}
        >
          <div className="flex items-start gap-3">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                background: "#3B82F6",
                color: "white",
                borderRadius: "50%",
                flexShrink: 0,
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {index + 1}
            </span>
            {/* FIXED: Use dangerouslySetInnerHTML to render HTML properly */}
            <span
              style={{ color: "#e5e7eb", lineHeight: "1.6", flex: 1 }}
              dangerouslySetInnerHTML={{
                __html: formatTextWithCode(hint.text),
              }}
            />
          </div>

          {hint.code_snippet && (
            <div className="ml-10 mt-3">
              <pre
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                  color: "#60A5FA",
                  overflow: "auto",
                }}
              >
                <code>{hint.code_snippet}</code>
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// FIXED: Format explanation array with proper HTML rendering
export const formatExplanationArray = (
  explanation: Array<{
    text: string
    type: "text" | "code" | "concept" | "warning" | "tip"
    code_ref?: number[]
  }>
): JSX.Element => {
  if (!explanation || explanation.length === 0) {
    return <div className="text-gray-400">No explanation available</div>
  }

  const typeStyles = {
    text: {
      background: "transparent",
      borderLeft: "none",
      icon: null,
    },
    code: {
      background: "rgba(59, 130, 246, 0.05)",
      borderLeft: "4px solid #3B82F6",
      icon: "💻",
    },
    concept: {
      background: "rgba(139, 92, 246, 0.05)",
      borderLeft: "4px solid #8B5CF6",
      icon: "🎯",
    },
    warning: {
      background: "rgba(239, 68, 68, 0.05)",
      borderLeft: "4px solid #EF4444",
      icon: "⚠️",
    },
    tip: {
      background: "rgba(16, 185, 129, 0.05)",
      borderLeft: "4px solid #10B981",
      icon: "💡",
    },
  }

  return (
    <div className="explanation-container space-y-4">
      {explanation.map((block, index) => {
        const style = typeStyles[block.type] || typeStyles.text

        // Format text with code references
        let formattedText = block.text
        if (block.code_ref && block.code_ref.length > 0) {
          block.code_ref.forEach((ref) => {
            formattedText = formattedText.replace(
              new RegExp(`\\[${ref}\\]`, "g"),
              `<span style="display: inline-block; background: #8B5CF6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.875rem; font-weight: bold; margin: 0 4px;">${ref}</span>`
            )
          })
        }

        return (
          <div
            key={index}
            style={{
              background: style.background,
              borderLeft: style.borderLeft,
              padding: style.background ? "1rem" : "0",
              borderRadius: style.background ? "0 8px 8px 0" : "0",
              marginBottom: "1rem",
            }}
          >
            {style.icon && (
              <span style={{ marginRight: "0.5rem", fontSize: "1.25rem" }}>
                {style.icon}
              </span>
            )}
            {/* FIXED: Use dangerouslySetInnerHTML to render HTML properly */}
            <span
              style={{ color: "#e5e7eb", lineHeight: "1.8" }}
              dangerouslySetInnerHTML={{
                __html: formatTextWithCode(formattedText),
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

// Format code with syntax highlighting - now returns a component
export const formatCode = (
  code: string,
  languageObj: Language
): JSX.Element => {
  return <CodeBlock code={code} language={languageObj.slug} />
}

// FIXED: Format legacy hints with proper HTML rendering
export const formatHints = (hintsText: string): JSX.Element => {
  if (!hintsText) {
    return <div className="text-gray-400">No hints available</div>
  }

  // Handle both numbered string format and newline-separated format
  let hints: string[] = []

  // First try to split by numbered patterns with better regex
  const numberedMatches = hintsText.match(/\d+\.\s+[^0-9]+?(?=\d+\.\s+|$)/g)

  if (numberedMatches && numberedMatches.length > 0) {
    // Use regex matches for numbered format
    hints = numberedMatches
      .map((hint) => hint.replace(/^\d+\.\s*/, "").trim())
      .filter((hint) => hint.length > 0)
  } else if (hintsText.includes(". ")) {
    // Fallback: split by '. ' and try to reconstruct
    const parts = hintsText.split(/\d+\.\s+/).filter((part) => part.trim())
    hints = parts.map((part) => part.trim()).filter((hint) => hint.length > 0)
  } else {
    // Final fallback: newline separation
    hints = hintsText
      .split("\n")
      .filter((line) => line.trim())
      .map((hint) => hint.replace(/^\d+\.\s*/, "").trim())
      .filter((hint) => hint.length > 0)
  }

  // If we still don't have good hints, try a different approach
  if (hints.length === 0 || hints.some((hint) => hint.length < 5)) {
    // Try splitting by periods followed by numbers
    const betterSplit = hintsText.split(/(?<=\.)\s*(?=\d+\.)/)
    if (betterSplit.length > 1) {
      hints = betterSplit
        .map((hint) => hint.replace(/^\d+\.\s*/, "").trim())
        .filter((hint) => hint.length > 5)
    }
  }

  return (
    <div
      className="hints-container"
      style={{
        background: "rgba(59, 130, 246, 0.05)",
        borderRadius: "12px",
        padding: "1.5rem",
        border: "1px solid rgba(59, 130, 246, 0.2)",
      }}
    >
      {hints.map((hint, index) => (
        //eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          key={index}
          className="hint-item"
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: index < hints.length - 1 ? "1rem" : "0",
            padding: "1rem",
            background: "rgba(59, 130, 246, 0.1)",
            borderLeft: "4px solid #3B82F6",
            borderRadius: "0 8px 8px 0",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(4px)"
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.15)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0)"
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)"
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              background: "#3B82F6",
              color: "white",
              borderRadius: "50%",
              marginRight: "12px",
              flexShrink: 0,
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {index + 1}
          </span>
          {/* FIXED: Use dangerouslySetInnerHTML to render HTML properly */}
          <span
            style={{ color: "#e5e7eb", lineHeight: "1.6" }}
            dangerouslySetInnerHTML={{
              __html: formatTextWithCode(hint),
            }}
          />
        </div>
      ))}
    </div>
  )
}

// Format explanation with numbered references and code blocks
export const formatExplanation = (explanationText: string): JSX.Element => {
  if (!explanationText) {
    return <div className="text-gray-400">No explanation available</div>
  }

  // Split by code blocks
  const sections = explanationText.split(/(```[\s\S]*?```)/)

  return (
    <div
      className="explanation-container"
      style={{
        background: "rgba(139, 92, 246, 0.05)",
        borderRadius: "12px",
        padding: "2rem",
        border: "1px solid rgba(139, 92, 246, 0.2)",
      }}
    >
      {sections.map((section, index) => {
        // Check if this is a code block
        if (section.startsWith("```") && section.endsWith("```")) {
          const codeContent = section.slice(3, -3).trim()
          const [, ...codeLines] = codeContent.split("\n")
          const code = codeLines.join("\n")

          return (
            <div key={index} style={{ margin: "1rem 0" }}>
              {formatCode(code)}
            </div>
          )
        }

        // Regular text section
        const paragraphs = section.split("\n\n").filter((p) => p.trim())

        return (
          <div key={index}>
            {paragraphs.map((para, pIndex) => {
              // Check for numbered references
              const formattedPara = para.replace(
                /\[(\d+)\]/g,
                '<span style="display: inline-block; background: #8B5CF6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.875rem; font-weight: bold; margin: 0 4px;">$1</span>'
              )

              return (
                <p
                  key={pIndex}
                  style={{
                    marginBottom: "1rem",
                    lineHeight: "1.8",
                    color: "#e5e7eb",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formatTextWithCode(formattedPara),
                  }}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// Format visual elements (enhanced execution steps with memory states, etc.)
export const formatVisualElements = (
  visualElements: any
): JSX.Element | null => {
  if (!visualElements) return null

  return (
    <div className="visual-elements" style={{ marginTop: "2rem" }}>
      {/* Enhanced Execution Steps with Memory States */}
      {visualElements.execution_steps && (
        <div
          className="execution-visualization"
          style={{
            background: "rgba(245, 158, 11, 0.05)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1rem",
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}
        >
          <h4
            style={{
              color: "#F59E0B",
              marginBottom: "1rem",
              fontSize: "1.125rem",
            }}
          >
            🔄 Execution Steps with Memory States
          </h4>
          {visualElements.execution_steps.map((step: any, index: number) => (
            <div
              key={index}
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                borderLeft: "3px solid #F59E0B",
              }}
            >
              {/* Step Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <span
                  style={{
                    background: "#F59E0B",
                    color: "black",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    marginRight: "1rem",
                  }}
                >
                  Step {step.step}
                </span>
                {step.line_number && (
                  <span
                    style={{
                      background: "rgba(59, 130, 246, 0.3)",
                      color: "#60A5FA",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      marginRight: "1rem",
                    }}
                  >
                    Line {step.line_number}
                  </span>
                )}
                <code style={{ color: "#60A5FA", fontFamily: "monospace" }}>
                  {step.line}
                </code>
              </div>

              {/* Description */}
              <p style={{ color: "#E5E7EB", marginBottom: "0.75rem" }}>
                {step.description}
              </p>

              {/* Output */}
              {step.output && (
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                    color: "#10B981",
                    marginBottom: "0.75rem",
                  }}
                >
                  Output: {step.output}
                </div>
              )}

              {/* Memory State Table */}
              {step.memory_state && step.memory_state.length > 0 && (
                <div style={{ marginTop: "0.75rem" }}>
                  <h6
                    style={{
                      color: "#10B981",
                      marginBottom: "0.5rem",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                  >
                    💾 Memory State:
                  </h6>
                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      background: "rgba(16, 185, 129, 0.05)",
                      borderRadius: "6px",
                      overflow: "hidden",
                      fontSize: "0.875rem",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "rgba(16, 185, 129, 0.15)" }}>
                        <th
                          style={{
                            padding: "0.5rem",
                            textAlign: "left",
                            color: "#10B981",
                            fontWeight: "bold",
                          }}
                        >
                          Variable
                        </th>
                        <th
                          style={{
                            padding: "0.5rem",
                            textAlign: "left",
                            color: "#10B981",
                            fontWeight: "bold",
                          }}
                        >
                          Value
                        </th>
                        <th
                          style={{
                            padding: "0.5rem",
                            textAlign: "left",
                            color: "#10B981",
                            fontWeight: "bold",
                          }}
                        >
                          Type
                        </th>
                        <th
                          style={{
                            padding: "0.5rem",
                            textAlign: "center",
                            color: "#10B981",
                            fontWeight: "bold",
                          }}
                        >
                          Changed
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {step.memory_state.map(
                        (variable: any, vIndex: number) => (
                          <tr
                            key={vIndex}
                            style={{
                              borderTop: "1px solid rgba(16, 185, 129, 0.1)",
                              background: variable.changed
                                ? "rgba(245, 158, 11, 0.1)"
                                : "transparent",
                            }}
                          >
                            <td
                              style={{
                                padding: "0.5rem",
                                fontFamily: "monospace",
                                color: variable.changed ? "#F59E0B" : "#10B981",
                                fontWeight: variable.changed
                                  ? "bold"
                                  : "normal",
                              }}
                            >
                              {variable.name}
                            </td>
                            <td
                              style={{
                                padding: "0.5rem",
                                color: variable.changed ? "#F59E0B" : "#10B981",
                                fontWeight: variable.changed
                                  ? "bold"
                                  : "normal",
                              }}
                            >
                              {variable.value}
                            </td>
                            <td style={{ padding: "0.5rem", color: "#9CA3AF" }}>
                              {variable.type}
                            </td>
                            <td
                              style={{ padding: "0.5rem", textAlign: "center" }}
                            >
                              {variable.changed ? (
                                <span
                                  style={{
                                    color: "#F59E0B",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ✓
                                </span>
                              ) : (
                                <span style={{ color: "#6B7280" }}>-</span>
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Concepts Visualization */}
      {visualElements.concepts && (
        <div
          className="concepts-visualization"
          style={{
            background: "rgba(236, 72, 153, 0.05)",
            borderRadius: "12px",
            padding: "1.5rem",
            border: "1px solid rgba(236, 72, 153, 0.2)",
          }}
        >
          <h4
            style={{
              color: "#EC4899",
              marginBottom: "1rem",
              fontSize: "1.125rem",
            }}
          >
            🎯 Key Concepts
          </h4>
          <div style={{ display: "grid", gap: "1rem" }}>
            {visualElements.concepts.map((concept: any, index: number) => (
              <div
                key={index}
                style={{
                  background: "rgba(0, 0, 0, 0.2)",
                  padding: "1rem",
                  borderRadius: "8px",
                  borderLeft: "3px solid #EC4899",
                }}
              >
                <h5 style={{ color: "#F9A8D4", marginBottom: "0.5rem" }}>
                  {concept.name}
                </h5>
                <p style={{ color: "#E5E7EB", marginBottom: "0.5rem" }}>
                  {concept.description}
                </p>
                {concept.visual_metaphor && (
                  <div
                    style={{
                      background: "rgba(236, 72, 153, 0.1)",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      fontStyle: "italic",
                      color: "#F9A8D4",
                    }}
                  >
                    💭 {concept.visual_metaphor}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Export all formatters
export const exerciseFormatters = {
  formatCode,
  formatHints,
  formatHintsArray,
  formatExplanation,
  formatExplanationArray,
  formatVisualElements,
}
