"use client"

import React from "react"
import { ArrowLeft, BookOpen, Lightbulb, Target } from "lucide-react"
import Link from "next/link"

const TutorialIntroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-20 text-white dark:from-slate-800 dark:to-slate-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-left">
          <Link
            href="/Learn"
            className="inline-flex items-center text-sky-100 transition-colors hover:text-white dark:text-sky-200 dark:hover:text-gray-50"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Learn
          </Link>
        </div>
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
              <BookOpen className="h-12 w-12 text-sky-200" />
            </div>
          </div>

          <h1 className="mb-6 bg-gradient-to-r from-sky-100 to-white bg-clip-text text-5xl font-bold text-transparent dark:from-sky-200 dark:to-slate-100 md:text-6xl">
            Learn Programming
          </h1>
          <p className="mb-8 text-xl leading-relaxed text-sky-100 dark:text-slate-300 md:text-2xl">
            Master coding concepts through comprehensive tutorials and
            interactive lessons
          </p>

          <div className="mx-auto max-w-3xl space-y-6 text-left">
            <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-4 text-2xl font-semibold text-sky-100 dark:text-slate-200">
                Why Learn with Tutorials?
              </h2>
              <p className="text-lg leading-relaxed text-sky-50 dark:text-slate-300">
                {`Learning programming concepts requires structured guidance and comprehensive explanations. 
                Our interactive tutorials provide step-by-step learning paths, visual diagrams, 
                and practical examples to build solid foundations.`}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <div className="mb-3 flex items-center">
                  <BookOpen className="mr-2 h-6 w-6 text-sky-200" />
                  <h3 className="text-lg font-semibold text-sky-100 dark:text-slate-200">
                    Structured Learning
                  </h3>
                </div>
                <p className="text-sky-50 dark:text-slate-300">
                  Follow carefully designed learning paths with progressive
                  difficulty levels
                </p>
              </div>

              <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <div className="mb-3 flex items-center">
                  <Lightbulb className="mr-2 h-6 w-6 text-sky-200" />
                  <h3 className="text-lg font-semibold text-sky-100 dark:text-slate-200">
                    Interactive Content
                  </h3>
                </div>
                <p className="text-sky-50 dark:text-slate-300">
                  Engage with MCQs, code examples, and visual learning aids
                </p>
              </div>

              <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <div className="mb-3 flex items-center">
                  <Target className="mr-2 h-6 w-6 text-sky-200" />
                  <h3 className="text-lg font-semibold text-sky-100 dark:text-slate-200">
                    Comprehensive Coverage
                  </h3>
                </div>
                <p className="text-sky-50 dark:text-slate-300">
                  Learn concepts through detailed explanations and real-world
                  examples
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TutorialIntroSection
