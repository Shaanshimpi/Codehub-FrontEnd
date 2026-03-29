import React, { Suspense } from "react"
import { getLanguages } from "@/lib/getData"
import LearnGlobalPlayground from "./components/LearnGlobalPlayground"

function PlaygroundFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
        <span>Loading playground…</span>
      </div>
    </div>
  )
}

export default async function PlaygroundPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const { lang } = await searchParams
  const languages = await getLanguages()

  return (
    <Suspense fallback={<PlaygroundFallback />}>
      <LearnGlobalPlayground
        languages={languages || []}
        initialLangSlug={lang ?? null}
      />
    </Suspense>
  )
}

export async function generateMetadata() {
  return {
    title: "Code Playground | CodeHub Learn",
    description:
      "Run and experiment with code in multiple languages. Your editor and input are saved per language in this browser.",
    alternates: {
      canonical: "https://codehubindia.in/Learn/playground",
    },
  }
}
