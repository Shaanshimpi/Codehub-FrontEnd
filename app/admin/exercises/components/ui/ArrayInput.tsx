import React from "react"
import { Plus, Trash2 } from "lucide-react"

interface ArrayInputProps {
  items: string[]
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, value: string) => void
  placeholder: string
  addButtonText: string
  showRemoveButton?: (items: string[], index: number) => boolean
  className?: string
}

export const ArrayInput: React.FC<ArrayInputProps> = ({
  items,
  onAdd,
  onRemove,
  onUpdate,
  placeholder,
  addButtonText,
  showRemoveButton = (items) => items.length > 1,
  className = "",
}) => {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index} className="mb-2 flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
          {showRemoveButton(items, index) && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <Plus className="h-4 w-4" />
        {addButtonText}
      </button>
    </div>
  )
}

interface HintArrayInputProps {
  hints: Array<{ text: string; code_snippet?: string }>
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, text: string) => void
  placeholder: string
  addButtonText: string
  showRemoveButton?: (hints: any[], index: number) => boolean
  className?: string
}

export const HintArrayInput: React.FC<HintArrayInputProps> = ({
  hints,
  onAdd,
  onRemove,
  onUpdate,
  placeholder,
  addButtonText,
  showRemoveButton = (hints) => hints.length > 1,
  className = "",
}) => {
  return (
    <div className={className}>
      {hints.map((hint, index) => (
        <div key={index} className="mb-2 flex gap-2">
          <textarea
            value={hint.text}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
          {showRemoveButton(hints, index) && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <Plus className="h-4 w-4" />
        {addButtonText}
      </button>
    </div>
  )
}
