"use client"

import React, { useState } from "react"
import CodeReviewView from "./CodeReviewView"

interface CodeReviewModalButtonProps {
  language?: string
  content?: string
}

const CodeReviewModalButton: React.FC<CodeReviewModalButtonProps> = ({
  language = "javascript",
  content,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <div className="relative">
            {isOpen ? (
              <svg
                className="h-6 w-6 transform transition-transform duration-300 group-hover:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            )}
          </div>
          <div className="absolute -top-12 right-0 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Code Review AI
          </div>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-2 backdrop-blur-sm sm:p-4">
          <CodeReviewView
            language={language}
            content={content}
            onClose={() => setIsOpen(false)}
            showCloseButton={true}
            className="h-[80vh] w-full max-w-7xl md:h-[90vh]"
          />
        </div>
      )}
    </>
  )
}

export default CodeReviewModalButton
