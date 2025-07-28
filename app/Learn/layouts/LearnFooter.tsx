import React from "react"
import { InstagramLogoIcon } from "@radix-ui/react-icons"
import {
  BookOpen,
  Github,
  Heart,
  MessageCircle,
  Users,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { FaWhatsapp, FaYoutube } from "react-icons/fa"

const LearnFooter = () => {
  const currentYear = new Date().getFullYear()

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
            <ul className="space-y-3">
              <li>
                <Link
                  href="/Learn"
                  className="flex items-center gap-2 text-slate-300 transition-colors hover:text-blue-400"
                >
                  <span className="h-1 w-1 rounded-full bg-blue-400" />
                  Interactive Tutorials
                </Link>
              </li>
              <li>
                <Link
                  href="/Learn/Exercise"
                  className="flex items-center gap-2 text-slate-300 transition-colors hover:text-green-400"
                >
                  <span className="h-1 w-1 rounded-full bg-green-400" />
                  Coding Exercises
                </Link>
              </li>
              <li>
                <Link
                  href="/Learn/Interactives"
                  className="flex items-center gap-2 text-slate-300 transition-colors hover:text-purple-400"
                >
                  <span className="h-1 w-1 rounded-full bg-purple-400" />
                  Try Yourself
                </Link>
              </li>
            </ul>

            <h5 className="mb-3 mt-6 text-sm font-medium text-slate-400">
              Popular Languages
            </h5>
            <div className="flex flex-wrap gap-2">
              {["Python", "JavaScript", "Java", "C++"].map((lang) => (
                <span
                  key={lang}
                  className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300"
                >
                  {lang}
                </span>
              ))}
            </div>
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

      {/* Large Brand Text (Similar to original EndSection) */}
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

export default LearnFooter
