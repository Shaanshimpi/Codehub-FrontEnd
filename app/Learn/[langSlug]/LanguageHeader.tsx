"use client"

import React from "react"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Language } from "../types/TutorialTypes"

interface LanguageHeaderProps {
  language: Language
}

const LanguageHeader: React.FC<LanguageHeaderProps> = ({ language }) => {
  const pathname = usePathname()

  const getParentPath = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    pathSegments.pop()
    return "/" + pathSegments.join("/")
  }

  const parentPath = getParentPath()
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-[10vh] text-white dark:from-slate-800 dark:to-slate-900 dark:text-gray-100">
      <div className="mx-auto max-w-6xl">
        <Link
          href={parentPath}
          className="mb-6 inline-flex items-center text-sky-100 transition-colors hover:text-white dark:text-sky-200 dark:hover:text-gray-50"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Learn
        </Link>

        <div className="flex items-center space-x-6">
          {language.logo && (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white p-3 dark:bg-slate-700">
              <Image
                src={language.logo.url}
                alt={language.logo.alt || `${language.title} logo`}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          )}

          <div>
            <h1 className="mb-2 text-5xl font-bold dark:text-gray-100">
              {language.title}
            </h1>
            <p className="text-xl text-sky-100 dark:text-sky-200">
              Master {language.title} programming with our structured learning
              path
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LanguageHeader
