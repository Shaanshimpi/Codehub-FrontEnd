"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import CodeBlock from "./CodeBlock"

const ExerciseContent = ({ post, codeString, language }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [showExplanation, setShowExplanation] = useState(false)
  const [showCode, setShowCode] = useState(false)

  // Construct description key dynamically
  const descriptionKey = `Description${
    selectedLanguage === "english"
      ? ""
      : selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
  }`

  const descriptionContent = post[descriptionKey] || "No explanation available."

  return (
    <div className="overflow-hidden px-5 py-[12vh]">
      <h2 className="rounded-md bg-gradient-to-tr from-gray-800 to-blue-900 p-3 text-xl text-white">
        {post.Title}
      </h2>

      <div className="text-primary-ch mt-6 min-h-[400px]">
        <h3 className="bg-primary-ch inline min-h-[10vh] w-[100%] rounded-t-md p-3 text-[28px] font-semibold text-white">
          Hints
        </h3>
        <div className="min-h-[40vh] bg-gradient-to-b from-blue-50 to-sky-200 p-3">
          <ReactMarkdown>{post.Hints}</ReactMarkdown>
        </div>
      </div>

      {/* Code Toggle Button */}
      <div className="mt-4">
        <button
          className="rounded-md bg-green-600 px-4 py-2 text-white transition-all hover:bg-green-700"
          onClick={() => setShowCode(!showCode)}
        >
          {showCode ? "Hide Code" : "Show Code"}
        </button>
      </div>

      {/* Code Block (Hidden by Default) */}
      {showCode && (
        <div className="mt-4 md:grid md:place-items-center">
          <CodeBlock code={codeString} language={language} />
        </div>
      )}

      {/* Language Toggle */}

      {/* Explanation Toggle Button */}
      <div className="mt-4">
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {showExplanation ? "Hide Explanation" : "Show Explanation"}
        </button>
      </div>
      {showExplanation && (
        <div className="mt-6 flex gap-3">
          {["english", "hindi", "marathi"].map((lang) => (
            <button
              key={lang}
              className={`px-4 py-2 transition-all ${
                selectedLanguage === lang
                  ? "rounded-t-lg bg-blue-900 text-white"
                  : "rounded-sm bg-gray-200"
              }`}
              onClick={() => setSelectedLanguage(lang)}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Explanation Section (Hidden by Default) */}
      {showExplanation && (
        <div className="ex-desc min-h-[400px] w-full max-w-[85vw] overflow-auto rounded-b-md rounded-tr-md bg-gradient-to-t from-gray-800 to-blue-900 p-4 text-[#E1E4E8]">
          <h3 className="mb-3 text-lg font-semibold">Explanation</h3>
          <div className="ff-expl my-2">
            <ReactMarkdown>
              {descriptionContent.replace("```", "").replace("markdown", "")}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExerciseContent
