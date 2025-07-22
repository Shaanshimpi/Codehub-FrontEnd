import { Tag } from "lucide-react"

const TagsDisplay = ({ tags }: { tags?: string[] }) => {
  if (!tags || tags.length === 0) {
    return <p className="italic text-gray-500">No tags available</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
        >
          <Tag className="h-3 w-3" />
          {tag}
        </span>
      ))}
    </div>
  )
}

export default TagsDisplay
