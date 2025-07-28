"use client"

import React from "react"
import { ArrowRight, BookOpen, Code, FileText, Zap } from "lucide-react"
import Link from "next/link"

const LearningPathsSection = () => {
  return (
    <section className="bg-slate-800 px-6 py-16 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Choose Your Learning Path
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-sky-100 dark:text-slate-300">
            Start with comprehensive tutorials or jump into hands-on coding
            exercises
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Tutorials Path */}
          <div
            className="group block cursor-pointer"
            onClick={() =>
              document
                .getElementById("language-grid")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") &&
              document
                .getElementById("language-grid")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            role="button"
            tabIndex={0}
          >
            <div className="h-full rounded-xl border-2 border-blue-600/30 bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-8 transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20 dark:from-blue-900/30 dark:to-blue-800/20">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <ArrowRight className="h-6 w-6 text-blue-400 transition-transform group-hover:translate-x-1" />
              </div>

              <h3 className="mb-4 text-2xl font-bold text-white">
                Learning Tutorials
              </h3>

              <p className="mb-6 text-sky-100 dark:text-slate-300">
                Comprehensive step-by-step guides covering programming concepts,
                syntax, and best practices. Perfect for beginners and those who
                prefer structured learning.
              </p>

              <div className="space-y-3">
                <div className="flex items-center text-sky-200 dark:text-slate-400">
                  <FileText className="mr-2 h-4 w-4" />
                  <span className="text-sm">
                    Detailed explanations and examples
                  </span>
                </div>
                <div className="flex items-center text-sky-200 dark:text-slate-400">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span className="text-sm">Progressive difficulty levels</span>
                </div>
                <div className="flex items-center text-sky-200 dark:text-slate-400">
                  <Code className="mr-2 h-4 w-4" />
                  <span className="text-sm">
                    Code examples and demonstrations
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <span className="inline-flex items-center rounded-full bg-blue-600/20 px-3 py-1 text-sm font-medium text-blue-300 dark:bg-blue-500/20 dark:text-blue-400">
                  Theory + Practice
                </span>
              </div>
            </div>
          </div>

          {/* Exercises Path */}
          <Link href="/Learn/Exercise" className="group block">
            <div className="h-full rounded-xl border-2 border-green-600/30 bg-gradient-to-br from-green-900/50 to-green-800/30 p-8 transition-all duration-300 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/20 dark:from-green-900/30 dark:to-green-800/20">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 dark:bg-green-500">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <ArrowRight className="h-6 w-6 text-green-400 transition-transform group-hover:translate-x-1" />
              </div>

              <h3 className="mb-4 text-2xl font-bold text-white">
                Coding Exercises
              </h3>

              <p className="mb-6 text-green-100 dark:text-slate-300">
                Interactive coding challenges and practical exercises. Learn by
                doing with real-time feedback and step-by-step solutions. Great
                for hands-on learners.
              </p>

              <div className="space-y-3">
                <div className="flex items-center text-green-200 dark:text-slate-400">
                  <Zap className="mr-2 h-4 w-4" />
                  <span className="text-sm">Interactive code editor</span>
                </div>
                <div className="flex items-center text-green-200 dark:text-slate-400">
                  <Code className="mr-2 h-4 w-4" />
                  <span className="text-sm">Real-time code execution</span>
                </div>
                <div className="flex items-center text-green-200 dark:text-slate-400">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span className="text-sm">
                    Detailed solution explanations
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <span className="inline-flex items-center rounded-full bg-green-600/20 px-3 py-1 text-sm font-medium text-green-300 dark:bg-green-500/20 dark:text-green-400">
                  Practice First
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-lg text-sky-100 dark:text-slate-300">
            Not sure where to start? Begin with tutorials to build your
            foundation, then practice with exercises to solidify your skills.
          </p>
        </div>
      </div>
    </section>
  )
}

export default LearningPathsSection
