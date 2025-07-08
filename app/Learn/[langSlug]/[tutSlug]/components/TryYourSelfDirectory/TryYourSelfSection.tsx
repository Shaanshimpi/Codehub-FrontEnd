import React from "react"
import { Language } from "@/app/Learn/types/TutorialTypes"
import { langMap } from "../../../utils"
import CodeRunnerWrapper from "./CodeRunnerWrapper"

// adjust the path accordingly

interface TryYourSelfSectionProps {
  language: Language
}

function TryYourSelfSection({ language }: TryYourSelfSectionProps) {
  // normalize the language key
  const langKey = language.title?.toLowerCase().replace(/\s+/g, " ").trim()

  // check if it's supported
  const isSupported = !!langMap[langKey]

  if (!isSupported) return null

  return (
    <div>
      <div className="my-12 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-gray-100">
          {`Practice What You've Learned`}
        </h3>
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          Try out you code our interactive code editor.
        </p>
        <CodeRunnerWrapper
          language={langKey}
          initialCode={`// Practice ${language.title}\n// Write your code here`}
        />
      </div>
    </div>
  )
}

export default TryYourSelfSection
