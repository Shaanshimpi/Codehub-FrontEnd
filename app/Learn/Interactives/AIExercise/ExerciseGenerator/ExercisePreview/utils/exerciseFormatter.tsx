// app/Learn/Interactives/AIExercise/ExerciseGenerator/ExercisePreview/utils/exerciseFormatter.tsx
import React from "react"
import CodeBlock from "../components/CodeBlock"

// Language-specific syntax highlighting configurations
const SYNTAX_CONFIGS = {
  c: {
    keywords:
      /\b(int|char|float|double|void|if|else|for|while|return|struct|typedef|include|define|ifdef|endif|ifndef|main|printf|scanf|malloc|free|sizeof)\b/g,
    types: /\b(FILE|NULL|size_t|bool|true|false)\b/g,
    functions: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,
    preprocessor: /^#.*$/gm,
  },
  cpp: {
    keywords:
      /\b(int|char|float|double|void|if|else|for|while|return|class|public|private|protected|namespace|using|template|typename|const|static|virtual|override|new|delete|try|catch|throw|include|define|ifdef|endif|ifndef)\b/g,
    types:
      /\b(string|vector|map|set|pair|bool|true|false|nullptr|auto|unique_ptr|shared_ptr)\b/g,
    functions: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,
    stl: /\b(std|cout|cin|endl|push_back|size|empty|begin|end)\b/g,
  },
  javascript: {
    keywords:
      /\b(function|const|let|var|if|else|for|while|return|class|extends|import|export|from|default|async|await|try|catch|throw|new|this|super|yield|typeof|instanceof|in|of|break|continue|switch|case)\b/g,
    types:
      /\b(string|number|boolean|object|array|void|null|undefined|any|never|unknown|Promise)\b/g,
    functions:
      /\b(console|log|push|pop|shift|unshift|map|filter|reduce|forEach|find|includes|parseInt|parseFloat|setTimeout|setInterval)\b/g,
    literals: /\b(true|false|null|undefined|NaN|Infinity)\b/g,
  },
  python: {
    keywords:
      /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|lambda|pass|break|continue|global|nonlocal|assert|yield|raise|and|or|not|in|is)\b/g,
    builtins:
      /\b(print|len|range|int|str|float|list|dict|set|tuple|bool|type|input|open|file|sum|min|max|abs|round|sorted|reversed|enumerate|zip|map|filter)\b/g,
    literals: /\b(True|False|None)\b/g,
    decorators: /@\w+/g,
  },
  java: {
    keywords:
      /\b(public|private|protected|class|interface|extends|implements|static|final|void|if|else|for|while|return|try|catch|finally|throw|throws|new|this|super|import|package|abstract|synchronized|volatile|transient)\b/g,
    types:
      /\b(int|long|short|byte|float|double|boolean|char|String|Integer|Double|Float|Boolean|Character|ArrayList|HashMap|HashSet|List|Map|Set)\b/g,
    annotations: /@\w+/g,
    constants: /\b(true|false|null)\b/g,
  },
  html: {
    tags: /<\/?[a-zA-Z][^>]*>/g,
    attributes: /\s([a-zA-Z-]+)(?==)/g,
    strings: /"[^"]*"|'[^']*'/g,
  },
  css: {
    selectors: /[.#]?[a-zA-Z][a-zA-Z0-9-_]*/g,
    properties: /[a-zA-Z-]+(?=:)/g,
    values: /:\s*[^;]+/g,
    units: /\d+(px|em|rem|%|vh|vw|deg|s|ms)/g,
  },
  sql: {
    keywords:
      /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP BY|ORDER BY|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DATABASE|DROP|ALTER|ADD|COLUMN|PRIMARY KEY|FOREIGN KEY|REFERENCES|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|AND|OR|NOT|NULL|IS|IN|BETWEEN|LIKE|EXISTS)\b/gi,
    functions:
      /\b(COUNT|SUM|AVG|MAX|MIN|UPPER|LOWER|LENGTH|SUBSTRING|CONCAT|NOW|DATE|YEAR|MONTH|DAY)\b/gi,
    types:
      /\b(INT|INTEGER|VARCHAR|CHAR|TEXT|DATE|DATETIME|TIMESTAMP|DECIMAL|FLOAT|DOUBLE|BOOLEAN|BLOB)\b/gi,
  },
}

// Create a separate component for the code block
// const CodeBlock: React.FC<{ code: string; language: string }> = ({
//   code,
//   language,
// }) => {
//   const [copied, setCopied] = React.useState(false)

//   const handleCopy = () => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     })
//   }

//   if (!code) {
//     return (
//       <pre className="code-block">
//         <code>No code available</code>
//       </pre>
//     )
//   }

//   const config = SYNTAX_CONFIGS[language as keyof typeof SYNTAX_CONFIGS]

//   // Apply syntax highlighting
//   const lines = code.split("\n")
//   const highlightedLines = lines.map((line, lineIndex) => {
//     let highlightedLine = line
//       .replace(/</g, "&lt;")
//       .replace(/>/g, "&gt;")
//       .replace(/"/g, "&quot;")
//       .replace(/'/g, "&#39;")

//     // Apply language-specific highlighting if config exists
//     if (config) {
//       // Apply highlighting based on language config
//       // This is a simplified version - you can expand this based on your needs
//       Object.entries(config).forEach(([type, regex]) => {
//         if (regex instanceof RegExp) {
//           highlightedLine = highlightedLine.replace(regex, (match) => {
//             const color = getColorForType(type)
//             return `<span style="color: ${color}">${match}</span>`
//           })
//         }
//       })
//     }

//     return `<span>${highlightedLine}</span>`
//   })

//   return (
//     <div style={{ position: "relative" }}>
//       {/* Code toolbar */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           background: "rgba(0, 0, 0, 0.3)",
//           padding: "0.5rem 1rem",
//           borderRadius: "8px 8px 0 0",
//           borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
//         }}
//       >
//         <span
//           style={{
//             color: "#9CA3AF",
//             fontSize: "0.875rem",
//             fontFamily: "monospace",
//           }}
//         >
//           {language.toUpperCase()}
//         </span>

//         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//           {/* Window controls decoration */}
//           <div style={{ display: "flex", gap: "0.5rem" }}>
//             <div
//               style={{
//                 width: "12px",
//                 height: "12px",
//                 borderRadius: "50%",
//                 background: "#EF4444",
//               }}
//             />
//             <div
//               style={{
//                 width: "12px",
//                 height: "12px",
//                 borderRadius: "50%",
//                 background: "#F59E0B",
//               }}
//             />
//             <div
//               style={{
//                 width: "12px",
//                 height: "12px",
//                 borderRadius: "50%",
//                 background: "#10B981",
//               }}
//             />
//           </div>

//           {/* Copy button */}
//           <button
//             onClick={handleCopy}
//             style={{
//               background: copied ? "#10B981" : "rgba(59, 130, 246, 0.2)",
//               border: "1px solid rgba(59, 130, 246, 0.3)",
//               borderRadius: "4px",
//               padding: "0.25rem 0.75rem",
//               color: copied ? "white" : "#60A5FA",
//               fontSize: "0.75rem",
//               cursor: "pointer",
//               transition: "all 0.2s ease",
//               display: "flex",
//               alignItems: "center",
//               gap: "0.25rem",
//             }}
//             onMouseEnter={(e) => {
//               if (!copied) {
//                 e.currentTarget.style.background = "rgba(59, 130, 246, 0.3)"
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (!copied) {
//                 e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)"
//               }
//             }}
//           >
//             {copied ? (
//               <>
//                 <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
//                   <path
//                     d="M6.5 10.5L9 13L14 8"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//                 Copied!
//               </>
//             ) : (
//               <>
//                 <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
//                   <rect
//                     x="5"
//                     y="5"
//                     width="10"
//                     height="12"
//                     rx="2"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                   />
//                   <path
//                     d="M9 5V3C9 1.89543 9.89543 1 11 1H16C17.1046 1 18 1.89543 18 3V11C18 12.1046 17.1046 13 16 13H15"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                   />
//                 </svg>
//                 Copy
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Code content */}
//       <pre
//         style={{
//           background: "linear-gradient(145deg, #111827 0%, #1e293b 100%)",
//           borderRadius: "0 0 8px 8px",
//           padding: "1.5rem",
//           overflowX: "auto",
//           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
//           border: "1px solid rgba(255, 255, 255, 0.1)",
//           borderTop: "none",
//           color: "#e5e7eb",
//           fontFamily: "'Fira Code', 'Consolas', monospace",
//           fontSize: "0.875rem",
//           lineHeight: "1.5",
//           margin: 0,
//         }}
//       >
//         <code
//           dangerouslySetInnerHTML={{
//             __html: highlightedLines.join("<br>"),
//           }}
//         />
//       </pre>
//     </div>
//   )
// }

// Helper function to get colors for syntax highlighting
const getColorForType = (type: string): string => {
  const colorMap: { [key: string]: string } = {
    keywords: "#C678DD",
    types: "#56B6C2",
    functions: "#61AFEF",
    literals: "#E06C75",
    builtins: "#E5C07B",
    preprocessor: "#828997",
    stl: "#56B6C2",
    decorators: "#E5C07B",
    annotations: "#E5C07B",
    constants: "#E06C75",
    tags: "#E06C75",
    attributes: "#E5C07B",
    strings: "#98C379",
    selectors: "#61AFEF",
    properties: "#C678DD",
    values: "#98C379",
    units: "#D19A66",
  }
  return colorMap[type] || "#E5E7EB"
}

// Format code with syntax highlighting - now returns a component
export const formatCode = (code: string, language: string): JSX.Element => {
  return <CodeBlock code={code} />
}

// Format hints with visual styling
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
          <span style={{ color: "#e5e7eb", lineHeight: "1.6" }}>
            {formatTextWithCode(hint)}
          </span>
        </div>
      ))}
    </div>
  )
}

export const formatHintsArray = (
  hints: Array<{ text: string; code_snippet?: string }>
): JSX.Element => {
  if (!hints || hints.length === 0) {
    return <div className="text-gray-400">No hints available</div>
  }

  return (
    <div className="hints-container space-y-3">
      {hints.map((hint, index) => (
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
            <span style={{ color: "#e5e7eb", lineHeight: "1.6", flex: 1 }}>
              {formatTextWithCode(hint.text)}
            </span>
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

// Format explanation from array structure
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
          const [lang, ...codeLines] = codeContent.split("\n")
          const code = codeLines.join("\n")

          return (
            <div key={index} style={{ margin: "1rem 0" }}>
              {formatCode(code, lang || "text")}
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

// Helper function to format inline code
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

// Format visual elements (memory states, execution steps, etc.)
export const formatVisualElements = (
  visualElements: any
): JSX.Element | null => {
  if (!visualElements) return null

  return (
    <div className="visual-elements" style={{ marginTop: "2rem" }}>
      {/* Memory States Visualization */}
      {visualElements.memory_states && (
        <div
          className="memory-visualization"
          style={{
            background: "rgba(16, 185, 129, 0.05)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1rem",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <h4
            style={{
              color: "#10B981",
              marginBottom: "1rem",
              fontSize: "1.125rem",
            }}
          >
            💾 Memory States
          </h4>
          {visualElements.memory_states.map((state: any, index: number) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <h5 style={{ color: "#60A5FA", marginBottom: "0.5rem" }}>
                Step: {state.step}
              </h5>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  background: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ background: "rgba(59, 130, 246, 0.2)" }}>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        color: "#60A5FA",
                      }}
                    >
                      Variable
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        color: "#60A5FA",
                      }}
                    >
                      Value
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        color: "#60A5FA",
                      }}
                    >
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.variables?.map((variable: any, vIndex: number) => (
                    <tr
                      key={vIndex}
                      style={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <td
                        style={{
                          padding: "0.75rem",
                          fontFamily: "monospace",
                          color: "#F59E0B",
                        }}
                      >
                        {variable.name}
                      </td>
                      <td style={{ padding: "0.75rem", color: "#10B981" }}>
                        {variable.value}
                      </td>
                      <td style={{ padding: "0.75rem", color: "#9CA3AF" }}>
                        {variable.type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Execution Steps Visualization */}
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
            🔄 Execution Trace
          </h4>
          {visualElements.execution_steps.map((step: any, index: number) => (
            <div
              key={index}
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "0.75rem",
                borderLeft: "3px solid #F59E0B",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
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
                <code style={{ color: "#60A5FA", fontFamily: "monospace" }}>
                  {step.line}
                </code>
              </div>
              <p style={{ color: "#E5E7EB", marginBottom: "0.5rem" }}>
                {step.description}
              </p>
              {step.output && (
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                    color: "#10B981",
                  }}
                >
                  Output: {step.output}
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
  formatExplanation,
  formatVisualElements,
}
