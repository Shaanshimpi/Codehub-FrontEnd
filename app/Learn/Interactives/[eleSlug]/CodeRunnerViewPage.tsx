"use client"

import React from "react"
import { CodeRunnerPageProps } from "../../types/TutorialTypes"
import CodeRunnerView from "../TryYourSelfDirectory/CodeRunnerView"

const CodeRunnerViewPage: React.FC<CodeRunnerPageProps> = ({
  language = "javascript",
  initialCode = "",
  stdin = "",
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto">
        <div className="mx-auto mt-16 h-[calc(100vh-4rem)]">
          <CodeRunnerView
            language={language}
            initialCode={initialCode}
            stdin={stdin}
            showHeader={true}
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  )
}

export default CodeRunnerViewPage
