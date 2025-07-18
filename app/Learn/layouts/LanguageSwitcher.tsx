"use client"

import { useState } from "react"
import { Language, useLanguage } from "@/app/contexts/LanguageContext"
import { LANGUAGES } from "@/app/contexts/LanguageContext"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

// Make sure to import cn

interface LanguageSwitcherProps {
  isShrunk?: boolean
  className?: string
}

export const LanguageSwitcher = ({
  isShrunk = false,
  className,
}: LanguageSwitcherProps) => {
  const { language, setLanguage, isLoading } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return <div className="h-10 w-20 animate-pulse rounded-lg bg-white/10" />
  }

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex items-center space-x-2 rounded-lg px-3 py-2 text-slate-100 transition-all duration-200 hover:bg-white/10 hover:text-white dark:text-slate-300 dark:hover:text-white",
          isShrunk ? "rounded-sm px-2 py-0" : "rounded-lg px-3 py-2"
        )}
      >
        <span>{LANGUAGES[language].code}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-slate-200/50 bg-white/95 shadow-2xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/95">
          <div className="p-2">
            {Object.entries(LANGUAGES).map(([code, config]) => (
              <button
                key={code}
                onClick={() => {
                  setLanguage(code as Language)
                  setIsOpen(false)
                }}
                className={`flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-sm ${
                  language === code
                    ? "bg-blue-50 text-blue-600 dark:bg-slate-700/50 dark:text-blue-400"
                    : "text-slate-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                }`}
              >
                <span>{config.code}</span>
                <span>{config.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
