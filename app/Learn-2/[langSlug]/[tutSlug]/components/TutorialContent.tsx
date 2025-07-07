"use client"

import React from "react"
import { TutorialContentProps } from "@/app/Learn-2/types/TutorialTypes"
import "./TutorialContent.css"

const TutorialContent: React.FC<TutorialContentProps> = ({ content }) => {
  return (
    <div className="mb-12">
      <div
        className="prose prose-slate dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-gray-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:text-slate-800 dark:prose-code:text-slate-200 prose-pre:bg-slate-900 dark:prose-pre:bg-slate-800 prose-pre:text-slate-100 dark:prose-pre:text-slate-200 prose-blockquote:border-blue-500 dark:prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-slate-800 prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-gray-100 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-li:text-slate-700 dark:prose-li:text-slate-300 max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default TutorialContent
