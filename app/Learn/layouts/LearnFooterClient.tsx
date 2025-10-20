"use client"

import React, { useEffect, useState } from "react"
import { InstagramLogoIcon } from "@radix-ui/react-icons"
import {
  BookOpen,
  Brain,
  Code,
  Github,
  Heart,
  MessageCircle,
  Users,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { FaWhatsapp, FaYoutube } from "react-icons/fa"

interface Language {
  id: number
  title: string
  slug: string
}

const LearnFooterClient = () => {
  const currentYear = new Date().getFullYear()
  const [topLanguages, setTopLanguages] = useState<Language[]>([])

  useEffect(() => {
    // Fetch languages on client side
    const fetchLanguages = async () => {
      try {
        const response = await fetch("/api/languages")
        if (response.ok) {
          const languages = await response.json()
          setTopLanguages(languages.slice(0, 4))
        }
      } catch (error) {
        console.error("Error fetching languages:", error)
      }
    }

    fetchLanguages()
  }, [])

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-3xl font-bold text-transparent">
                CodeHub Learn
              </h3>
              <p className="text-lg leading-relaxed text-slate-300">
                Master programming through interactive tutorials and hands-on
                exercises. From beginner concepts to advanced techniques,
                we&apos;re here to guide your coding journey every step of the
                way.
              </p>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-slate-800/50 p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">50+</div>
                <div className="text-xs text-slate-400">Tutorials</div>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-3 text-center">
                <div className="text-2xl font-bold text-green-400">200+</div>
                <div className="text-xs text-slate-400">Exercises</div>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">10+</div>
                <div className="text-xs text-slate-400">Languages</div>
              </div>
            </div>
          </div>

          {/* Learning Paths */}
          <div>
            <h4 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <BookOpen className="h-5 w-5 text-blue-400" />
              Learning Paths
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/Learn"
                  className="group flex items-center gap-3 text-slate-300 transition-colors hover:text-blue-400"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 transition-colors group-hover:bg-blue-500/20">
                    <BookOpen className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="font-medium">Tutorials</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/Learn/Exercise"
                  className="group flex items-center gap-3 text-slate-300 transition-colors hover:text-green-400"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 transition-colors group-hover:bg-green-500/20">
                    <Code className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="font-medium">Exercises</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/Learn/Vivy"
                  className="group flex items-center gap-3 text-slate-300 transition-colors hover:text-purple-400"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 transition-colors group-hover:bg-purple-500/20">
                    <Brain className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="font-medium">Vivy AI</span>
                </Link>
              </li>
            </ul>

            {topLanguages.length > 0 && (
              <>
                <h5 className="mb-3 mt-6 text-sm font-medium text-slate-400">
                  Popular Languages
                </h5>
                <div className="flex flex-wrap gap-2">
                  {topLanguages.map((lang) => (
                    <Link
                      key={lang.id}
                      href={`/Learn/Tutorials/${lang.slug}`}
                      className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                    >
                      {lang.title}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Support & Community */}
          <div>
            <h4 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <Users className="h-5 w-5 text-green-400" />
              Support & Community
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/CodeHubIndia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 transition-colors hover:text-blue-400"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@CodeHubIndia-uo5ig"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 transition-colors hover:text-red-400"
                >
                  <FaYoutube className="h-4 w-4" />
                  YouTube Channel
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/code.hub.india/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 transition-colors hover:text-pink-400"
                >
                  <InstagramLogoIcon className="h-4 w-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/918637704621?text=I%20Want%20to%20learn%20coding%20and%20be%20successful%20Coder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 transition-colors hover:text-green-400"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  WhatsApp Support
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-lg border border-slate-700 bg-gradient-to-r from-blue-900/30 to-green-900/30 p-4">
              <div className="mb-2 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium">Need Help?</span>
              </div>
              <p className="text-xs text-slate-400">
                Join our community for coding help, tips, and discussions!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                © {currentYear} CodeHub. All rights reserved.
              </div>
              <div className="hidden h-4 w-px bg-slate-600 md:block" />
              <div className="text-sm text-slate-500">
                Empowering the next generation of developers
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>Made with</span>
                <Heart className="h-4 w-4 fill-current text-red-400" />
                <span>for learners</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Keep coding!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Large Brand Text */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-t from-slate-900 to-transparent py-8 text-center">
          <div className="select-none text-4xl font-bold uppercase leading-none tracking-tighter text-slate-800 md:text-6xl lg:text-8xl">
            Learn • Code • Grow
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LearnFooterClient
