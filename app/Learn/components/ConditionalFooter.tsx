"use client"

import React from "react"
import { usePathname } from "next/navigation"
import LearnFooterClient from "../layouts/LearnFooterClient"

export default function ConditionalFooter() {
  const pathname = usePathname()

  // Hide footer on specific pages
  const shouldHideFooter =
    pathname.includes("/Learn/Exercise/") && // Hide on individual exercise pages
    pathname.split("/").filter(Boolean).length > 3 // But show on /Learn/Exercise listing

  const isTutorialPage =
    pathname.includes("/Learn/Tutorials/") && // Tutorial page
    pathname.split("/").filter(Boolean).length > 3 // Individual tutorial page

  // Hide footer on individual exercise and tutorial pages
  if (shouldHideFooter || isTutorialPage) {
    return null
  }

  return <LearnFooterClient />
}
