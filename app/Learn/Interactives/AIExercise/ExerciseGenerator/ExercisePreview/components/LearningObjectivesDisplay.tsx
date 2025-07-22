import { Target } from "lucide-react"

const LearningObjectivesDisplay = ({
  objectives,
}: {
  objectives?: string[]
}) => {
  if (!objectives || objectives.length === 0) {
    return (
      <p className="italic text-gray-500">No learning objectives available</p>
    )
  }

  return (
    <div className="space-y-3">
      {objectives.map((objective, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
            <Target className="h-3 w-3 text-white" />
          </div>
          <p className="leading-relaxed text-gray-300">{objective}</p>
        </div>
      ))}
    </div>
  )
}
export default LearningObjectivesDisplay
