"use client"

import { ArrowLeft, BookOpen, Code2, Home, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-0 h-72 w-72 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-4 bottom-0 h-72 w-72 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-700" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16">
        {/* 404 Large Text */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-[150px] font-bold leading-none text-transparent md:text-[200px]">
            404
          </h1>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl" />
            <h2 className="relative text-3xl font-bold text-white md:text-4xl">
              Page Not Found
            </h2>
          </div>
          <p className="mt-4 text-lg text-slate-400 md:text-xl">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-12 w-full max-w-4xl">
          <h3 className="mb-6 text-center text-xl font-semibold text-white">
            Where would you like to go?
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Learn Link */}
            <Link
              href="/Learn"
              className="group relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-800 hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-all group-hover:scale-110 group-hover:bg-blue-500/20">
                <Home className="h-6 w-6" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">Learn</h4>
              <p className="text-sm text-slate-400">Go to learning hub</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Tutorials Link */}
            <Link
              href="/Learn/Tutorials"
              className="group relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-800 hover:shadow-xl hover:shadow-purple-500/20"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 transition-all group-hover:scale-110 group-hover:bg-purple-500/20">
                <BookOpen className="h-6 w-6" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">
                Tutorials
              </h4>
              <p className="text-sm text-slate-400">
                Learn programming step by step
              </p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Exercises Link */}
            <Link
              href="/Learn/Exercise"
              className="group relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-green-500/50 hover:bg-slate-800 hover:shadow-xl hover:shadow-green-500/20"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400 transition-all group-hover:scale-110 group-hover:bg-green-500/20">
                <Code2 className="h-6 w-6" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">
                Exercises
              </h4>
              <p className="text-sm text-slate-400">
                Practice coding challenges
              </p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Vivy AI Link */}
            <Link
              href="/Learn/Vivy"
              className="group relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-pink-500/50 hover:bg-slate-800 hover:shadow-xl hover:shadow-pink-500/20"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 transition-all group-hover:scale-110 group-hover:bg-pink-500/20">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">Vivy AI</h4>
              <p className="text-sm text-slate-400">Chat with AI assistant</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        </div>

        {/* Popular Languages */}
        <div className="w-full max-w-4xl">
          <h3 className="mb-6 text-center text-xl font-semibold text-white">
            Or explore by language
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/Learn/Tutorials/python"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 font-medium text-blue-400 backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-500/50 hover:bg-slate-800 hover:shadow-lg hover:shadow-blue-500/20"
            >
              Python
            </Link>
            <Link
              href="/Learn/Tutorials/javascript"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 font-medium text-yellow-400 backdrop-blur-sm transition-all hover:scale-105 hover:border-yellow-500/50 hover:bg-slate-800 hover:shadow-lg hover:shadow-yellow-500/20"
            >
              JavaScript
            </Link>
            <Link
              href="/Learn/Tutorials/c"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 font-medium text-purple-400 backdrop-blur-sm transition-all hover:scale-105 hover:border-purple-500/50 hover:bg-slate-800 hover:shadow-lg hover:shadow-purple-500/20"
            >
              C
            </Link>
            <Link
              href="/Learn/Tutorials/cpp"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 font-medium text-pink-400 backdrop-blur-sm transition-all hover:scale-105 hover:border-pink-500/50 hover:bg-slate-800 hover:shadow-lg hover:shadow-pink-500/20"
            >
              C++
            </Link>
            <Link
              href="/Learn/Tutorials/java"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 font-medium text-red-400 backdrop-blur-sm transition-all hover:scale-105 hover:border-red-500/50 hover:bg-slate-800 hover:shadow-lg hover:shadow-red-500/20"
            >
              Java
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mt-12 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 font-medium text-slate-300 backdrop-blur-sm transition-all hover:scale-105 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Go Back
        </button>

        {/* Help Text */}
        <p className="mt-8 text-center text-sm text-slate-500">
          If you believe this is a mistake, please{" "}
          <a
            href="mailto:support@codehubindia.in"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  )
}
