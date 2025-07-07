"use client"

import React from "react"
import { TutorialBreadcrumbProps } from "@/app/Learn/types/TutorialTypes"
import Link from "next/link"
import { usePathname } from "next/navigation"

const TutorialBreadcrumb: React.FC<TutorialBreadcrumbProps> = ({
  language,
  tutorial,
}) => {
  const pathname = usePathname()

  // Extract base segment (e.g., 'Learn-2') from path like: /Learn-2/c-programming/what-is-c
  const baseSegment = pathname?.split("/")[1] || "Learn"

  return (
    <nav className="mb-8 flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
      <Link
        href={`/${baseSegment}`}
        className="hover:text-blue-600 dark:hover:text-blue-400"
      >
        Learn
      </Link>
      <span>/</span>
      <Link
        href={`/${baseSegment}/${language.slug}`}
        className="hover:text-blue-600 dark:hover:text-blue-400"
      >
        {language.title}
      </Link>
      <span>/</span>
      <span className="text-slate-900 dark:text-slate-100">
        {tutorial.title}
      </span>
    </nav>
  )
}

export default TutorialBreadcrumb
