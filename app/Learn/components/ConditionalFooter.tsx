"use client"

import React from "react"
import { usePathname } from "next/navigation"
import LearnFooter from "../layouts/LearnFooter"

export default function ConditionalFooter() {
  const pathname = usePathname()

  // Hide footer on Exercise pages for immersive coding experience
  const isExercisePage = pathname.includes("/Learn/Exercise/")

  // Only render footer if not on Exercise page
  if (isExercisePage) {
    return null
  }

  return <LearnFooter />
}
