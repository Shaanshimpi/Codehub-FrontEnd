"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

function FilterTopic({ topics }: { topics: any }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const topicParam = searchParams.get("topic") // Get the active topic from URL

  const handleFilterClick = (topicId: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("topic", topicId) // Update or add the topic parameter

    router.push(`${pathname}?${params.toString()}`, { scroll: false }) // Update the URL without full reload
  }

  return (
    <div className="topic-bar fixed bottom-0 flex h-[50px] w-[100%] items-center gap-3 overflow-y-visible overflow-x-scroll bg-white p-2 text-lg text-black">
      {topics
        ?.sort((a, b) => a.index - b.index)
        .map((topic) => (
          <button
            key={topic.documentId}
            className={`h-[100%] whitespace-nowrap rounded px-3 py-1 hover:bg-red-300 ${
              topic.documentId === topicParam
                ? "bg-red-500 text-white"
                : "bg-primary-ch text-white"
            }`}
            onClick={() => handleFilterClick(topic.documentId)}
          >
            {topic.Name}
          </button>
        ))}
    </div>
  )
}

export default FilterTopic
