"use client"

import { useState } from "react"
import { useEffect, useRef } from "react"
import { useUser } from "@/app/(payload)/_providers/UserProvider"
import logo from "@/app/assets/logo.png"
import { useTheme } from "@/app/contexts/theme-context"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  ChevronDown,
  Code2,
  Home,
  LogIn,
  Menu,
  Moon,
  SquareGanttChart,
  Sun,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Language } from "../types/TutorialTypes"
import { LanguageSwitcher } from "./LanguageSwitcher"

interface HeaderClientProps {
  className?: string
  languages: Language[]
}

const HeaderClient = ({ className, languages }: HeaderClientProps) => {
  const { user, isLoading } = useUser()
  const { toggleTheme, theme } = useTheme()
  const pathname = usePathname()
  const baseSegment = pathname?.split("/")[1] || "learn"

  const [isTutorialsOpen, setIsTutorialsOpen] = useState(false)
  const [isExercisesOpen, setIsExercisesOpen] = useState(false)
  const [isInteractiveOpen, setIsInteractiveOpen] = useState(false)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isShrunk, setIsShrunk] = useState(false)
  const lastScrollY = useRef(0)

  const setTheme = () => toggleTheme()
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsShrunk(true)
        setIsTutorialsOpen(false)
        setIsExercisesOpen(false)
        setIsInteractiveOpen(false)
        setIsMobileMenuOpen(false)
      } else {
        // Scrolling up
        setIsShrunk(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (
      isTutorialsOpen ||
      isExercisesOpen ||
      isInteractiveOpen ||
      isMobileMenuOpen
    ) {
      setIsShrunk(false)
    }
  }, [isTutorialsOpen, isExercisesOpen, isInteractiveOpen, isMobileMenuOpen])

  return (
    <header
      className={cn(
        "fixed top-0 z-30 w-full transition-all duration-300 ease-in-out",
        "border-b border-slate-700/50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
        isShrunk ? "text-md h-8 opacity-60" : "h-16 text-lg", // shrinking effect
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div
          className={cn(
            "flex items-center justify-between",
            isShrunk ? "h-8" : "h-16"
          )}
        >
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="relative flex min-w-[10vw] items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 opacity-30 blur" />
                <Link href="/">
                  <img
                    src={logo.src}
                    alt="Logo"
                    className={cn("relative", isShrunk ? "h-6" : "h-8")}
                  />
                </Link>
              </div>
              {/* <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full blur opacity-50" />
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-800">
                    <Code className="h-4 w-4 text-white" />
                  </div>
                </div>
                 <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  CodeLearn
                </span> 
              </div> */}
            </div>

            {/* Desktop Navigation */}
            <nav
              className={cn(
                "hidden items-center space-x-1 md:flex",
                isShrunk ? "h-8" : "h-16"
              )}
            >
              <Link
                href={`/${baseSegment}`}
                className={cn(
                  "group flex items-center space-x-2 rounded-lg text-slate-100 transition-all duration-200 hover:bg-white/10 hover:text-white dark:text-slate-300 dark:hover:text-white",
                  isShrunk ? "rounded-sm px-4 py-0" : "rounded-lg px-4 py-4"
                )}
              >
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">Learn</span>
              </Link>

              {/* Tutorials Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsTutorialsOpen(!isTutorialsOpen)
                    setIsExercisesOpen(false)
                    setIsInteractiveOpen(false)
                  }}
                  className={cn(
                    "group flex items-center space-x-2 rounded-lg text-slate-100 transition-all duration-200 hover:bg-white/10 hover:text-white dark:text-slate-300 dark:hover:text-white",
                    isShrunk ? "rounded-sm px-4 py-0" : "rounded-lg px-4 py-4"
                  )}
                >
                  <SquareGanttChart className="h-4 w-4" />
                  <span className="font-medium">Tutorials</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isTutorialsOpen ? "rotate-180" : "rotate-0"
                    )}
                  />
                </button>

                {isTutorialsOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200/50 bg-white/95 shadow-2xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/95">
                    <div className="p-2">
                      <div className="mb-2 px-3 py-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Available Languages
                        </p>
                      </div>
                      {languages.map((language) => (
                        <Link
                          key={language.slug}
                          href={`/${baseSegment}/${language.slug}`}
                          className="group flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                          onClick={() => setIsTutorialsOpen(false)}
                        >
                          {language.logo && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 p-1 dark:bg-slate-700">
                              <img
                                src={language.logo.url}
                                alt={
                                  language.logo.alt || `${language.title} logo`
                                }
                                className="h-5 w-5 object-contain"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                              {language.title}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Interactive tutorials
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Exercises Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsExercisesOpen(!isExercisesOpen)
                    setIsTutorialsOpen(false)
                    setIsInteractiveOpen(false)
                  }}
                  className={cn(
                    "group flex items-center space-x-2 rounded-lg text-slate-100 transition-all duration-200 hover:bg-white/10 hover:text-white dark:text-slate-300 dark:hover:text-white",
                    isShrunk ? "rounded-sm px-4 py-0" : "rounded-lg px-4 py-4"
                  )}
                >
                  <Code2 className="h-4 w-4" />
                  <span className="font-medium">Exercises</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isExercisesOpen ? "rotate-180" : "rotate-0"
                    )}
                  />
                </button>

                {isExercisesOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200/50 bg-white/95 shadow-2xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/95">
                    <div className="p-2">
                      <div className="mb-2 px-3 py-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Practice by Language
                        </p>
                      </div>
                      {languages.map((language) => (
                        <Link
                          key={language.slug}
                          href={`/${baseSegment}/Exercise/${language.slug}`}
                          className="group flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                          onClick={() => setIsExercisesOpen(false)}
                        >
                          {language.logo && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 p-1 dark:bg-slate-700">
                              <img
                                src={language.logo.url}
                                alt={
                                  language.logo.alt || `${language.title} logo`
                                }
                                className="h-5 w-5 object-contain"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                              {language.title} Exercises
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Practice problems & solutions
                            </div>
                          </div>
                        </Link>
                      ))}
                      <div className="mt-2 border-t border-slate-200/50 pt-2 dark:border-slate-700/50">
                        <Link
                          href={`/${baseSegment}/Exercise`}
                          className="group flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                          onClick={() => setIsExercisesOpen(false)}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/50">
                            <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                              All Exercises
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Browse all available exercises
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Dropdown */}
              {false && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsInteractiveOpen(!isInteractiveOpen)
                      setIsTutorialsOpen(false)
                      setIsExercisesOpen(false)
                    }}
                    className={cn(
                      "group flex items-center space-x-2 rounded-lg text-slate-100 transition-all duration-200 hover:bg-white/10 hover:text-white dark:text-slate-300 dark:hover:text-white",
                      isShrunk ? "rounded-sm px-4 py-0" : "rounded-lg px-4 py-4"
                    )}
                  >
                    <SquareGanttChart className="h-4 w-4" />
                    <span className="font-medium">Interactive</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isInteractiveOpen ? "rotate-180" : "rotate-0"
                      )}
                    />
                  </button>

                  {isInteractiveOpen && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-xl border border-slate-200/50 bg-white/95 shadow-2xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/95">
                      <div className="p-2">
                        <Link
                          href={`/${baseSegment}/Interactives/code-review`}
                          className="block rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                          onClick={() => setIsInteractiveOpen(false)}
                        >
                          Code Review
                        </Link>
                        <Link
                          href={`/${baseSegment}/Interactives/code-runner`}
                          className="block rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                          onClick={() => setIsInteractiveOpen(false)}
                        >
                          Code Runner
                        </Link>
                        <Link
                          href={`/${baseSegment}/Interactives/ai-exercise`}
                          className="block rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                          onClick={() => setIsInteractiveOpen(false)}
                        >
                          AI Exercise
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <LanguageSwitcher />
            {/* Auth Button - Desktop Only */}
            <div className="hidden items-center space-x-3 md:flex">
              {isLoading ? (
                <div className="h-10 w-20 animate-pulse rounded-lg bg-white/10" />
              ) : user ? (
                <Link
                  href="/profile"
                  className={cn(
                    "group relative flex h-10 items-center justify-center rounded-lg bg-white/10 px-4 text-white transition-all duration-200 hover:bg-white/20 dark:bg-slate-800/50 dark:hover:bg-slate-700/50",
                    isShrunk
                      ? "hover:scale-80 scale-75"
                      : "scale-100 hover:scale-105"
                  )}
                >
                  Profile
                </Link>
              ) : (
                <Link
                  href="/login"
                  className={cn(
                    "group relative flex h-10 items-center justify-center rounded-lg bg-white/10 px-4 text-white transition-all duration-200 hover:bg-white/20 dark:bg-slate-800/50 dark:hover:bg-slate-700/50",
                    isShrunk
                      ? "hover:scale-80 scale-75"
                      : "scale-100 hover:scale-105"
                  )}
                >
                  Login
                </Link>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={setTheme}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-all duration-200 hover:bg-white/20 dark:bg-slate-800/50 dark:hover:bg-slate-700/50",
                isShrunk
                  ? "hover:scale-80 scale-75"
                  : "scale-100 hover:scale-105"
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  // isShrunk ? "rounded-sm px-4 py-0" : "rounded-lg px-4 py-4"
                )}
              />
              <div className="relative">
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-300" />
                )}
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-all duration-200 hover:bg-white/20 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 md:hidden",
                isShrunk
                  ? "hover:scale-80 scale-75"
                  : "scale-100 hover:scale-105"
              )}
            >
              <Menu className="h-5 w-5 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full z-50 border-t border-slate-700/50 bg-slate-900/95 shadow-2xl backdrop-blur-md md:hidden">
            <div className="space-y-3 px-6 py-4">
              <Link
                href={`/${baseSegment}`}
                className="flex items-center space-x-3 rounded-lg px-4 py-3 text-slate-100 transition-all duration-200 hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </Link>

              <div className="space-y-2">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Tutorials
                  </p>
                </div>
                {languages.map((language) => (
                  <Link
                    key={language.slug}
                    href={`/${baseSegment}/${language.slug}`}
                    className="flex items-center space-x-3 rounded-lg px-4 py-3 text-slate-100 transition-all duration-200 hover:bg-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {language.logo && (
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-700 p-1">
                        <img
                          src={language.logo.url}
                          alt={language.logo.alt || `${language.title} logo`}
                          className="h-4 w-4 object-contain"
                        />
                      </div>
                    )}
                    <span className="font-medium">{language.title}</span>
                  </Link>
                ))}
              </div>

              <div className="space-y-2">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Exercises
                  </p>
                </div>
                <Link
                  href={`/${baseSegment}/Exercise`}
                  className="flex items-center space-x-3 rounded-lg px-4 py-3 text-slate-100 transition-all duration-200 hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600">
                    <Code2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">All Exercises</span>
                </Link>
                {languages.map((language) => (
                  <Link
                    key={`exercise-${language.slug}`}
                    href={`/${baseSegment}/Exercise/${language.slug}`}
                    className="flex items-center space-x-3 rounded-lg px-4 py-3 text-slate-100 transition-all duration-200 hover:bg-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {language.logo && (
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-700 p-1">
                        <img
                          src={language.logo.url}
                          alt={language.logo.alt || `${language.title} logo`}
                          className="h-4 w-4 object-contain"
                        />
                      </div>
                    )}
                    <span className="font-medium">
                      {language.title} Exercises
                    </span>
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Section */}
              <div className="border-t border-slate-700/50 pt-3">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Account
                  </p>
                </div>
                {isLoading ? (
                  <div className="mx-4 h-12 animate-pulse rounded-lg bg-white/10" />
                ) : user ? (
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 rounded-lg px-4 py-3 text-slate-100 transition-all duration-200 hover:bg-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center space-x-3 rounded-lg px-4 py-3 text-slate-100 transition-all duration-200 hover:bg-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5" />
                    <span className="font-medium">Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dropdown Overlay */}
      {(isTutorialsOpen || isExercisesOpen || isInteractiveOpen) && (
        <button
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsTutorialsOpen(false)
            setIsExercisesOpen(false)
            setIsInteractiveOpen(false)
          }}
        />
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  )
}

export default HeaderClient
