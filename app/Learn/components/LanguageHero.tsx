"use client"

import React from "react"
import { Language } from "@/app/Learn/types/TutorialTypes"
import { ArrowLeft, BookOpen, Target } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type LanguageHeroVariant = "tutorials" | "exercises"

interface BaseVariantConfig {
  parentHref: string
  backLabel: string
  modeLabel: string
  titleSuffix: string
  description: (language: Language) => string
  icon: React.ComponentType<{ className?: string }>
}

const VARIANT_CONFIG: Record<LanguageHeroVariant, BaseVariantConfig> = {
  tutorials: {
    parentHref: "/Learn/Tutorials",
    backLabel: "Back to Tutorials",
    modeLabel: "Learning Mode",
    titleSuffix: "Tutorials",
    description: (language) =>
      `Master ${language.title} programming with comprehensive tutorials and interactive lessons`,
    icon: BookOpen,
  },
  exercises: {
    parentHref: "/Learn/Exercise",
    backLabel: "Back to Exercises",
    modeLabel: "Practice Mode",
    titleSuffix: "Exercises",
    description: (language) =>
      `Master ${language.title} programming with hands-on exercises and coding challenges`,
    icon: Target,
  },
}

export interface LanguageHeroProps {
  language: Language
  variant?: LanguageHeroVariant
  className?: string
}

const LanguageHero: React.FC<LanguageHeroProps> = ({
  language,
  variant = "tutorials",
  className,
}) => {
  const {
    parentHref,
    backLabel,
    modeLabel,
    titleSuffix,
    description,
    icon: VariantIcon,
  } = VARIANT_CONFIG[variant]

  const hasObjectLogo =
    language.logo &&
    typeof language.logo === "object" &&
    !Array.isArray(language.logo)

  const logoSrc = hasObjectLogo
    ? (language.logo as Record<string, any>).url
    : typeof language.logo === "string"
      ? language.logo
      : undefined

  const logoAlt =
    hasObjectLogo && "alt" in (language.logo as Record<string, any>)
      ? (language.logo as Record<string, any>).alt || `${language.title} logo`
      : `${language.title} logo`

  return (
    <div
      className={`bg-gradient-to-br from-blue-600 to-blue-800 px-6 pb-[8vh] pt-[calc(8vh+4rem)] text-white dark:from-slate-800 dark:to-slate-900 dark:text-gray-100 ${className || ""}`}
    >
      <div className="mx-auto max-w-6xl">
        <Link
          href={parentHref}
          className="mb-6 inline-flex items-center text-sky-100 transition-colors hover:text-white dark:text-sky-200 dark:hover:text-gray-50"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {backLabel}
        </Link>

        <div className="flex items-center space-x-6">
          {logoSrc && (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white p-3 dark:bg-slate-700">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          )}

          <div className="flex-1">
            <div className="mb-2 flex items-center space-x-3">
              <VariantIcon className="h-8 w-8 text-sky-200" />
              <span className="text-lg font-medium text-sky-200">
                {modeLabel}
              </span>
            </div>
            <h1 className="mb-2 text-5xl font-bold dark:text-gray-100">
              {language.title} {titleSuffix}
            </h1>
            <p className="text-xl text-sky-100 dark:text-sky-200">
              {description(language)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LanguageHero
