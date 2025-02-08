"use client"

import { useState } from "react"
import CodeBlock from "./CodeBlock"

const ExerciseContent = ({ post, codeString, language }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("english")

  // Safely fetch description array
  const descriptionKey = `Description${
    selectedLanguage === "english"
      ? ""
      : selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
  }`

  const descriptionContent = Array.isArray(post[descriptionKey])
    ? post[descriptionKey]
    : []

  return (
    <div className="overflow-hidden px-5 py-[12vh]">
      <h2 className="bg-primary-ch rounded-md p-3 text-xl text-white">
        {post.Title}
      </h2>
      <div className="mt-4 md:grid md:w-[85vw] md:max-w-[1200px] md:place-items-center">
        <CodeBlock code={codeString} language={language} />
      </div>

      {/* Language Toggle */}
      <div className="mt-6 flex gap-3 md:w-[85vw] md:max-w-[1200px]">
        {["english", "hindi", "marathi"].map((lang) => (
          <button
            key={lang}
            className={`px-4 py-2 transition-all ${
              selectedLanguage === lang
                ? "bg-primary-ch rounded-t-lg text-white" // Outward rounded effect
                : "rounded-sm bg-gray-200"
            }`}
            onClick={() => setSelectedLanguage(lang)}
          >
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </button>
        ))}
      </div>

      {/* Description Section */}
      <div className="bg-primary-ch min-h-[400px] p-4 text-white md:w-[85vw] md:max-w-[1200px]">
        <h3 className="mb-3 text-lg font-semibold">Explanation</h3>
        <div className="max-w-[600px] space-y-2">
          {descriptionContent.length > 0 ? (
            descriptionContent.map((desc, index) => (
              <p key={index}>
                {desc.children.map((child) => child.text).join(" ")}
              </p>
            ))
          ) : (
            <p>No explanation available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExerciseContent
