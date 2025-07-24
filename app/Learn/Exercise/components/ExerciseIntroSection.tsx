import React from "react"
import { ArrowLeft, Code, Target, Trophy, Zap } from "lucide-react"
import Link from "next/link"

const ExerciseIntroSection = () => {
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
              <Target className="h-12 w-12 text-sky-200" />
            </div>
          </div>

          <h1 className="mb-6 bg-gradient-to-r from-sky-100 to-white bg-clip-text text-5xl font-bold text-transparent dark:from-sky-200 dark:to-slate-100 md:text-6xl">
            Practice Programming
          </h1>
          <p className="mb-8 text-xl leading-relaxed text-sky-100 dark:text-slate-300 md:text-2xl">
            Master coding through hands-on exercises and interactive challenges
          </p>

          <div className="mx-auto max-w-3xl space-y-6 text-left">
            <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-4 text-2xl font-semibold text-sky-100 dark:text-slate-200">
                Why Practice with Exercises?
              </h2>
              <p className="text-lg leading-relaxed text-sky-50 dark:text-slate-300">
                {`Learning programming is like learning to play an instrument - you need practice! 
              Our interactive exercises help you apply concepts immediately, build muscle memory, 
              and gain confidence through repetition and problem-solving.`}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <div className="mb-3 flex items-center">
                  <Code className="mr-2 h-6 w-6 text-sky-200" />
                  <h3 className="text-lg font-semibold text-sky-100 dark:text-slate-200">
                    Hands-On Coding
                  </h3>
                </div>
                <p className="text-sky-50 dark:text-slate-300">
                  Write real code in an interactive environment with instant
                  feedback
                </p>
              </div>

              <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <div className="mb-3 flex items-center">
                  <Zap className="mr-2 h-6 w-6 text-sky-200" />
                  <h3 className="text-lg font-semibold text-sky-100 dark:text-slate-200">
                    Instant Results
                  </h3>
                </div>
                <p className="text-sky-50 dark:text-slate-300">
                  See your code run immediately and debug problems in real-time
                </p>
              </div>

              <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <div className="mb-3 flex items-center">
                  <Trophy className="mr-2 h-6 w-6 text-sky-200" />
                  <h3 className="text-lg font-semibold text-sky-100 dark:text-slate-200">
                    Build Confidence
                  </h3>
                </div>
                <p className="text-sky-50 dark:text-slate-300">
                  Progress through challenges and celebrate your coding
                  victories
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExerciseIntroSection
