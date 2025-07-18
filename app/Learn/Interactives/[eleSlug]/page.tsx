import React from "react"
import { notFound } from "next/navigation"
import { InteractivePageProps } from "../../types/TutorialTypes"
import AiExerciseViewPage from "./AiExerciseViewPage"
import CodeReviewPage from "./CodeReviewPage"
import CodeRunnerViewPage from "./CodeRunnerViewPage"

async function page({ params }: InteractivePageProps) {
  const { eleSlug } = await params
  if (eleSlug == "code-review") {
    return <CodeReviewPage />
  } else if (eleSlug == "code-runner") {
    return <CodeRunnerViewPage />
  } else if (eleSlug == "ai-exercise") {
    return <AiExerciseViewPage />
  } else {
    return notFound()
  }
}

export default page
