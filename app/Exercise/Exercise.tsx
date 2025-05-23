"use client"

import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { Search } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Typewriter from "typewriter-effect"
import FilterLang from "./components/FilterLang"
import FilterTopic from "./components/FilterTopic"
import PostCard from "./components/PostCard"

function Exercise({ posts, lang, topics }) {
  const [filteredPosts, setFilteredPosts] = useState([])
  const [typingComplete, setTypingComplete] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)

  const searchParams = useSearchParams()
  const langParam = searchParams.get("lang")
  const topicParam = searchParams.get("topic")

  const inputRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    let filtered = posts

    if (langParam) {
      filtered = filtered.filter((post) =>
        post.programming_languages?.some(
          (lang) => lang.documentId === langParam
        )
      )
    }

    if (topicParam) {
      filtered = filtered.filter((post) =>
        post.topics?.some((topic) => topic.documentId === topicParam)
      )
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.Title?.toLowerCase().includes(term) ||
          post.topics?.some((topic) => topic.name?.toLowerCase().includes(term))
      )
    }

    filtered = filtered.sort((a, b) => a.index - b.index)
    setFilteredPosts(filtered)
  }, [posts, langParam, topicParam, searchTerm])

  const toggleSearch = () => {
    setSearchOpen((prev) => {
      const isOpening = !prev

      if (isOpening) {
        gsap.to(containerRef.current, {
          width: 200,
          opacity: 1,
          duration: 0.4,
          ease: "bounce",
          onComplete: () => inputRef.current?.focus(),
        })
      } else {
        gsap.to(containerRef.current, {
          width: 0,
          opacity: 0,
          duration: 0.3,
          ease: "bounce",
        })
      }

      return isOpening
    })
  }

  if (!typingComplete) {
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
    <div className="exercise flex min-h-[100vh] items-stretch bg-white pb-20 text-black dark:bg-[#070d17] dark:text-white">
      <div className="ex-page flex flex-grow items-stretch pt-[12vh]">
        <FilterLang lang={lang} />

        <div className="z-0 flex min-h-full flex-grow flex-col items-start gap-8 p-3 pl-7 md:grid md:grid-cols-2 md:items-start">
          <div className="mb-1 flex justify-end gap-4 md:col-span-2">
            {/* Ask Exercise Button */}
            <Link href="/Exercise/ask-exercise">
              <button className="rounded-2xl bg-blue-600 px-4 py-2 text-white transition-all duration-200 hover:bg-blue-700 dark:bg-[#0f4c9c] dark:hover:bg-[#002f6d]">
                Try your own Exercise
              </button>
            </Link>

            {/* Animated Search Input with GSAP */}
            <div className="relative flex items-center overflow-hidden">
              <div
                ref={containerRef}
                style={{ width: 0, opacity: 0 }}
                className="overflow-hidden transition-all duration-300"
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mx-2 rounded-2xl border border-gray-300 bg-gray-100 text-black placeholder-gray-600 outline-none dark:border-gray-600 dark:bg-[#0f172a] dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <button
                onClick={toggleSearch}
                className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 dark:bg-[#0f4c9c] dark:hover:bg-[#2563eb]"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

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
