import React from "react"
import { fetchCollection } from "@/lib/FetchDataPayload"
import LearnPage from "./LearnPage"

async function page() {
  const fetchLanguages = async () => {
    try {
      const data = await fetchCollection("programming-languages", {
        sort: "index",
      })
      return data
    } catch (err) {
      console.error("Error fetching languages:", err)
    }
  }

  const languages = await fetchLanguages()
  return (
    <div>
      <LearnPage languages={languages} />
    </div>
  )
}

export default page
