import { Bot, Loader2 } from "lucide-react"

export function LoadingMessage() {
  return (
    <div className="flex justify-start gap-4">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500">
        <Bot className="h-5 w-5 text-white" />
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-600 dark:bg-slate-800/80">
        <div className="flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="text-gray-600 dark:text-slate-300">
            Vivy is thinking...
          </span>
        </div>
      </div>
    </div>
  )
}
