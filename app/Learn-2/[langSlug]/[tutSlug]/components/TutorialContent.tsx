"use client"

import React from "react"
import { TutorialContentProps } from "@/app/Learn-2/types/TutorialTypes"
import "./TutorialContent.css"

const TutorialContent: React.FC<TutorialContentProps> = ({ content }) => {
  return (
    <div className="mb-12">
      <div className="tutorial-content rounded-xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
}

export default TutorialContent
