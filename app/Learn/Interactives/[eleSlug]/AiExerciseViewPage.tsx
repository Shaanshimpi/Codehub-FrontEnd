import React from "react"
import AiExerciseView from "../AIExercise/AiExerciseView"

const AiExerciseViewPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto">
        <div className="mx-auto mt-16 h-[calc(100vh-4rem)]">
          <AiExerciseView />
        </div>
      </div>
    </div>
  )
}

export default AiExerciseViewPage
