import { BarChart3, Tag } from "lucide-react"

const Metadata = ({
  difficulty,
  slug,
}: {
  difficulty: string
  slug?: string
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case "beginner":
        return "bg-green-600"
      case "intermediate":
        return "bg-yellow-600"
      case "advanced":
        return "bg-red-600"
      default:
        return "bg-blue-600"
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-700 bg-slate-800 p-4">
      <div className="flex items-center gap-2">
        <BarChart3 size={20} className="text-blue-400" />
        <span className="text-slate-300">Difficulty:</span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${getDifficultyColor(difficulty)}`}
        >
          {difficulty}
        </span>
      </div>

      {slug && (
        <div className="flex items-center gap-2">
          <Tag size={20} className="text-blue-400" />
          <span className="text-slate-300">Slug:</span>
          <span className="rounded bg-slate-700 px-2 py-1 font-mono text-sm text-blue-400">
            {slug}
          </span>
        </div>
      )}
    </div>
  )
}
export default Metadata
