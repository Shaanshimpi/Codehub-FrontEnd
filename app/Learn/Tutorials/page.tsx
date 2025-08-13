import React from "react"
import { getLanguages } from "@/lib/getData"
import TutorialPage from "./TutorialPage"

async function page() {
  try {
    const languages = await getLanguages()
    return (
      <div>
        <TutorialPage languages={languages || []} />
      </div>
    )
  } catch (error) {
    console.error("Error loading tutorials page:", error)
    // Return with empty languages array as fallback
    return (
      <div>
        <TutorialPage languages={[]} />
      </div>
    )
  }
}

export async function generateMetadata() {
  return {
    title: "Programming Tutorials - Learn Step by Step",
    description:
      "Learn programming concepts through comprehensive tutorials and interactive lessons. Master different programming languages with structured learning paths.",
    keywords:
      "programming tutorials, coding lessons, learn programming, programming concepts, coding education",
  }
}

export default page
