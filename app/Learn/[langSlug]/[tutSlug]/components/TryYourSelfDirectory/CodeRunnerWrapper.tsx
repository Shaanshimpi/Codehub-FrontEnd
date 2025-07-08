import { Suspense } from "react"
import TryYourselfButton from "./TryYourselfButton"

interface CodeRunnerWrapperProps {
  language: string
  initialCode?: string
  stdin?: string
  className?: string
}

// Server Component with SSR support for preloading props
const CodeRunnerWrapper = ({
  language,
  initialCode = "",
  stdin = "",
  className = "",
}: CodeRunnerWrapperProps) => {
  return (
    <Suspense fallback={<CodeRunnerSkeleton />}>
      <TryYourselfButton
        language={language}
        initialCode={initialCode}
        stdin={stdin}
        className={className}
      />
    </Suspense>
  )
}

// Loading Skeleton shown during suspense
const CodeRunnerSkeleton = () => (
  <div className="inline-flex animate-pulse items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 text-sm font-medium text-white">
    <div className="h-4 w-4 rounded bg-white/30" />
    <div className="h-4 w-20 rounded bg-white/30" />
  </div>
)

export default CodeRunnerWrapper
