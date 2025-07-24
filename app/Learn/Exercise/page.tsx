import React from "react"
import { getLanguages } from "@/lib/getData"
import ExercisePage from "./ExercisePage"

async function page() {
  const languages = await getLanguages()

  return (
    <div>
      <ExercisePage languages={languages} />
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: "Programming Exercises - Practice Coding",
    description:
      "Practice programming with hands-on exercises and coding challenges. Master different programming languages through interactive practice.",
    keywords:
      "programming exercises, coding practice, programming challenges, learn programming, coding tutorials",
  }
}

export default page
