"use client"

import React, { useEffect } from "react"
import { TutorialContentProps } from "@/app/Learn/types/TutorialTypes"
import "./TutorialContent.css"

const TutorialContent: React.FC<TutorialContentProps> = ({ content }) => {
  useEffect(() => {
    const tables = document.querySelectorAll(".tutorial-content table")

    tables.forEach((table) => {
      if (!table.parentElement?.classList.contains("table-wrapper")) {
        const wrapper = document.createElement("div")
        wrapper.className = "table-wrapper"
        table.parentElement?.insertBefore(wrapper, table)
        wrapper.appendChild(table)
      }
    })
  }, [])
  return (
    <div className="mb-12">
      <div className="tutorial-content rounded-xl border border-slate-200 bg-white p-8 px-4 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
}

export default TutorialContent
