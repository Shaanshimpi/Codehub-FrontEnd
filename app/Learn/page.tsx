import React from "react"
import { getLanguages } from "@/lib/getData"
import LearnPage from "./LearnPage"

async function page() {
  try {
    const languages = await getLanguages()
    return (
      <div>
        <LearnPage languages={languages || []} />
      </div>
    )
  } catch (error) {
    console.error("Error loading learn page:", error)
    return (
      <div>
        <LearnPage languages={[]} />
      </div>
    )
  }
}

export default page
