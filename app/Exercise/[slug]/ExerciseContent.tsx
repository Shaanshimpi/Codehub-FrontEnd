"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import CodeBlock from "./CodeBlock"

const ExerciseContent = ({ post, codeString, language }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [showExplanation, setShowExplanation] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  // Construct description key dynamically
  const descriptionKey = `Description${
    selectedLanguage === "english"
      ? ""
      : selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
  }`

  const descriptionContent = post[descriptionKey] || "No explanation available."

  return (
    <div className="overflow-hidden rounded-md bg-[#1E293B] px-6 py-[10vh]">
      <h2 className="rounded-md bg-[#0F172A] p-[2vh] text-2xl font-bold text-white dark:text-white">
        {post.Title}
      </h2>

      <div className="text-primary-ch mt-6 min-h-[400px]">
        <h3 className="inline min-h-[10vh] w-[100%] rounded-t-md p-3 text-4xl font-semibold text-white">
          Hints
        </h3>
        <div className="min-h-[40vh] text-wrap bg-[#1E2F53] p-3 text-slate-300">
          <ReactMarkdown>{post.Hints}</ReactMarkdown>
        </div>
      </div>

      {/* Code Toggle Button */}
      <div className="mt-4">
        <button
          className="w-full rounded-md bg-[#0F1729] px-4 py-2 text-white transition-all hover:bg-blue-600"
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
          className="w-full rounded-md bg-[#0F1729] px-4 py-2 text-white transition-all hover:bg-blue-600"
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
              className={`px-4 py-2 text-black transition-all ${
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
          <h3 className="mb-3 text-xl font-semibold">Explanation</h3>
          <div className="ff-expl my-2">
            <ReactMarkdown>
              {descriptionContent.replace("```", "").replace("markdown", "")}
            </ReactMarkdown>
          </div>
        </div>
      )}
      {/* youtube video */}

      {post.VideoLink && (
        <>
          {/* Code Toggle Button */}
          <div className="mt-4">
            <button
              className="w-full rounded-md bg-[#0F1729] px-4 py-2 text-white transition-all hover:bg-blue-600"
              onClick={() => setShowVideo(!showVideo)}
            >
              {showVideo ? "Hide Video" : "Show Video"}
            </button>
          </div>
          {showVideo && (
            <>
              <h3 className="mt-6 min-h-[10vh] w-[100%] rounded-t-md p-3 text-4xl font-semibold text-white">
                Video Explanation
              </h3>
              <div className="relative w-full pt-[56.25%]">
                {" "}
                {/* 16:9 Aspect Ratio */}
                <iframe
                  className="absolute left-0 top-0 h-full w-full"
                  src={post?.VideoLink}
                  title="CodeHub India"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ExerciseContent
