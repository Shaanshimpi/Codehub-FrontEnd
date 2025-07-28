"use client"

import React from "react"
import { X } from "lucide-react"

interface SolutionConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

const SolutionConfirmModal: React.FC<SolutionConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <button
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onCancel}
        onKeyDown={(e) => e.key === "Escape" && onCancel()}
        aria-label="Close modal"
      />
      <div role="dialog" aria-modal="true" className="relative z-10">
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal content */}
          <div className="pr-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              View Solution
            </h2>
            <p className="mb-6 text-slate-600 dark:text-slate-300">
              This will reveal the solution and forfeit your chance to solve it
              independently. Are you sure?
            </p>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Yes, show solution
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolutionConfirmModal
