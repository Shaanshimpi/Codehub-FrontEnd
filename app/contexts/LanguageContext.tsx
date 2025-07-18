// contexts/LanguageContext.tsx
"use client"

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

// contexts/LanguageContext.tsx

// Define supported languages
export type Language = "en" | "hi" | "mr"

// Language configuration
export const LANGUAGES = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिंदी",
    flag: "🇮🇳",
  },
  mr: {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    flag: "🇮🇳",
  },
} as const

// Context type definition
interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  isLoading: boolean
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

// Local storage key
const LANGUAGE_STORAGE_KEY = "preferred-language"

// Default language
const DEFAULT_LANGUAGE: Language = "en"

// Language provider component
interface LanguageProviderProps {
  children: ReactNode
  defaultLanguage?: Language
}

export function LanguageProvider({
  children,
  defaultLanguage = DEFAULT_LANGUAGE,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)
  const [isLoading, setIsLoading] = useState(true)

  // Load language from localStorage on mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem(
        LANGUAGE_STORAGE_KEY
      ) as Language
      if (savedLanguage && Object.keys(LANGUAGES).includes(savedLanguage)) {
        setLanguageState(savedLanguage)
      }
    } catch (error) {
      console.warn("Failed to load language from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save language to localStorage when changed
  const setLanguage = (newLanguage: Language) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage)
      setLanguageState(newLanguage)
    } catch (error) {
      console.warn("Failed to save language to localStorage:", error)
      // Still update state even if localStorage fails
      setLanguageState(newLanguage)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext)

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }

  return context
}

// Language selector component
export function LanguageSelector() {
  const { language, setLanguage, isLoading } = useLanguage()

  if (isLoading) {
    return <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
  }

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {Object.entries(LANGUAGES).map(([code, config]) => (
          <option key={code} value={code}>
            {config.flag} {config.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}
