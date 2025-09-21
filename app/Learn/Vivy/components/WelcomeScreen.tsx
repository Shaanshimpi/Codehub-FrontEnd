import { Bot, Sparkles } from "lucide-react"
import { CONVERSATION_STARTERS } from "../constants/models"

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void
}

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-blue-600/10 p-4 backdrop-blur-sm dark:bg-blue-500/20">
          <Bot className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      <h2 className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:to-blue-300 md:text-5xl">
        Welcome to Vivy
      </h2>

      <p className="mb-8 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-slate-300">
        Hi! I&apos;m Vivy, your AI assistant. I can help you with questions,
        writing, coding, analysis, and much more. What would you like to talk
        about?
      </p>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
        {CONVERSATION_STARTERS.map((starter, index) => (
          <button
            key={index}
            className="group relative w-full cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white/50 p-6 text-left backdrop-blur-sm transition-all duration-200 hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-500"
            onClick={() => onSuggestionClick(starter.prompt)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-900/20 dark:to-transparent" />
            <div className="relative">
              <div className="mb-3 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                  {starter.title}
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-300">
                {starter.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
