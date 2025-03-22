"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Typewriter from "typewriter-effect"
import { fetchAllPosts, fetchLang, fetchTopic } from "../../lib/FetchData"
import FilterLang from "./components/FilterLang"
import FilterTopic from "./components/FilterTopic"
import PostCard from "./components/PostCard"

function Exercise() {
  const [topics, setTopics] = useState([])
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [lang, setLang] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [typingComplete, setTypingComplete] = useState(false)

  const searchParams = useSearchParams()
  const langParam = searchParams.get("lang")
  const topicParam = searchParams.get("topic")

  scrollTo({ top: 0, behavior: "smooth" })
  useEffect(() => {
    async function fetchData() {
      const fetchedTopics = await fetchTopic()
      const fetchedPosts = await fetchAllPosts()
      const fetchedLang = await fetchLang()
      // console.log(fetchedPosts)
      setTopics(fetchedTopics)
      setPosts(fetchedPosts)
      setLang(fetchedLang)
      setDataLoaded(true)
    }
    fetchData()
  }, [])

  // Filter posts based on search params
  useEffect(() => {
    let filtered = posts

    // Filter by Language if langParam exists
    if (langParam) {
      filtered = filtered.filter((post) =>
        post.programming_languages
          ?.some((lang) => lang.documentId === langParam)
          .sort((a, b) => a.index > b.index)
      )
    }

    // Filter by Topic if topicParam exists
    if (topicParam) {
      filtered = filtered.filter((post) =>
        post.topics?.some((topic) => topic.documentId === topicParam)
      )
    }

    setFilteredPosts(filtered)
  }, [posts, langParam, topicParam])

  // Until both data is fetched and the typewriter animation is complete, show the loading screen.
  if (!dataLoaded || !typingComplete) {
    return (
      <div className="flex min-h-[100vh] items-center justify-center bg-[#09090B] text-[5vw] text-white">
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .changeDelay(20)
              .changeDeleteSpeed(5)
              .typeString("Keep coding...")
              .pauseFor(500)
              .deleteChars(25)
              .pauseFor(50)
              .typeString("You're closer than you were yesterday....")
              .pauseFor(500)
              .callFunction(() => setTypingComplete(true))
              .start()
          }}
        />
      </div>
    )
  }

  return (
    <div className="exercise flex min-h-[100vh] items-stretch bg-[#070d17] pb-20 text-white">
      <div className="ex-page flex flex-grow items-stretch pt-[12vh]">
        <FilterLang lang={lang} />
        <div className="z-0 flex flex-grow flex-col gap-8 p-3 pl-7 md:grid md:grid-cols-2">
          {filteredPosts?.map((post, i) => (
            <PostCard key={i} post={{ ...post, index: i }} />
          ))}
        </div>
        <FilterTopic topics={topics} />
      </div>
    </div>
  )
}

export default Exercise
