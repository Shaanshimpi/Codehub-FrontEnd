import React from "react"
import { getLanguages } from "@/lib/getData"
import LearnPage from "./LearnPage"

async function page() {
  const languages = await getLanguages()

  return (
    <div>
      <LearnPage languages={languages} />
    </div>
  )
}

export default page
