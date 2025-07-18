import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Header Component
const Header = ({
  onBack,
  onContinue,
}: {
  onBack: () => void
  onContinue: () => void
}) => {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-slate-700 pb-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:bg-slate-700"
      >
        <ChevronLeft size={20} />
        <span className="font-semibold">Back</span>
      </button>

      <h1 className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-center text-2xl font-bold text-transparent">
        Exercise Preview
      </h1>

      <button
        onClick={onContinue}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700"
      >
        <span className="font-semibold">Continue</span>
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

export default Header
