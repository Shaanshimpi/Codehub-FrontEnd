"use client"

import { useEffect, useState } from "react"
import { Icon } from "@/app/Learn/Tutorials/[langSlug]/[tutSlug]/components/ui"
import gsap from "gsap"
import Link from "next/link"

interface NavigationPopupProps {
  onClose: () => void
}

export default function NavigationPopup({ onClose }: NavigationPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show popup after loading screen completes (6 seconds + 1 second buffer)
    const timer = setTimeout(() => {
      setIsVisible(true)
      gsap.fromTo(
        ".nav-popup",
        {
          scale: 0.8,
          opacity: 0,
          y: 20,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        }
      )
    }, 7000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    gsap.to(".nav-popup", {
      scale: 0.8,
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setIsVisible(false)
        onClose()
      },
    })
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="nav-popup relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          <Icon name="x" size="sm" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to CodeHub! 🚀
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose your learning path to get started
          </p>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Link
            href="/Learn/Tutorials"
            onClick={handleClose}
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:from-blue-900/20 dark:to-indigo-900/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white group-hover:bg-blue-600">
              <Icon name="book" size="sm" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Tutorials
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn programming concepts step by step
              </p>
            </div>
            <Icon name="chevronRight" size="sm" className="text-gray-400" />
          </Link>

          <Link
            href="/Learn/Exercise"
            onClick={handleClose}
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 transition-all hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:from-green-900/20 dark:to-emerald-900/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white group-hover:bg-green-600">
              <Icon name="code" size="sm" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Exercises
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Practice coding with hands-on challenges
              </p>
            </div>
            <Icon name="chevronRight" size="sm" className="text-gray-400" />
          </Link>

          <Link
            href="/Learn/Vivy"
            onClick={handleClose}
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4 transition-all hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:from-purple-900/20 dark:to-pink-900/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white group-hover:bg-purple-600">
              <Icon name="bot" size="sm" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Vivy AI
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get instant help from your AI coding mentor
              </p>
            </div>
            <Icon name="chevronRight" size="sm" className="text-gray-400" />
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You can always access these sections from the main menu
          </p>
        </div>
      </div>
    </div>
  )
}
