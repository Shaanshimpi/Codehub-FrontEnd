"use client"

import React from "react"
import { CodeReviewPageProps } from "../../types/TutorialTypes"
import CodeReviewView from "../CodeReviewDirectory/CodeReviewView"

const CodeReviewPage: React.FC<CodeReviewPageProps> = ({
  language = "javascript",
  content,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto">
        <div className="mx-auto mt-16 h-[calc(100vh-4rem)]">
          <CodeReviewView
            language={language}
            content={content}
            showCloseButton={false}
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  )
}

export default CodeReviewPage
