// Enhanced SolutionConfirmModal with better warnings and progress tracking
"use client"

import React, { useEffect, useState } from "react"
import {
  Alert,
  Modal,
  Text,
} from "@/app/Learn/Exercise/design/UnifiedComponents"
import { AlertTriangle, Clock } from "lucide-react"

// Enhanced SolutionConfirmModal with better warnings and progress tracking

interface SolutionConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  exerciseTitle?: string
  attemptCount?: number
  timeSpent?: number // in minutes
  hasUserCode?: boolean
  progressPercentage?: number
}

const SolutionConfirmModal: React.FC<SolutionConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  exerciseTitle: _exerciseTitle = "this exercise",
  attemptCount = 0,
  timeSpent = 0,
  hasUserCode = false,
  progressPercentage = 0,
}) => {
  const [countdown, setCountdown] = useState(5)
  const [canConfirm, setCanConfirm] = useState(false)

  // Reset countdown when modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(5)
      setCanConfirm(false)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanConfirm(true)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Calculate warning level based on progress
  const getWarningLevel = () => {
    if (progressPercentage >= 75 || attemptCount >= 3) return "warning"
    if (progressPercentage >= 50 || attemptCount >= 1) return "info"
    return "error"
  }

  const warningLevel = getWarningLevel()

  // Generate personalized warning message
  const getWarningMessage = () => {
    if (attemptCount === 0 && timeSpent < 5) {
      return "You haven't spent much time on this exercise yet. Consider trying to solve it yourself first - you'll learn more that way!"
    }
    if (hasUserCode && progressPercentage < 25) {
      return "You've started working on this exercise. Viewing the solution now will prevent you from experiencing the satisfaction of solving it yourself."
    }
    if (attemptCount >= 3) {
      return "You've made several attempts - viewing the solution now might help you understand the approach better."
    }
    return "Viewing the solution will end your independent problem-solving session for this exercise."
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="View Solution?"
      className="max-w-lg"
    >
      <div className="space-y-4">
        {/* Warning alert */}
        <Alert type={warningLevel} title="Important Notice">
          {getWarningMessage()}
        </Alert>

        {/* Consequences warning */}
        <div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/20 rounded-lg border p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-warning-600 mt-0.5 h-4 w-4 flex-shrink-0" />
            <div className="space-y-1">
              <Text
                variant="small"
                className="text-warning-800 dark:text-warning-200 font-medium"
              >
                What happens when you view the solution:
              </Text>
              <ul className="text-warning-700 dark:text-warning-300 space-y-0.5 text-xs">
                <li>• Your independent solving session will end</li>
                <li>
                  • This exercise will be marked as &ldquo;solution
                  viewed&rdquo;
                </li>
                <li>
                  • You won&apos;t experience the satisfaction of solving it
                  yourself
                </li>
                <li>• Learning effectiveness may be reduced</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-md border-2 border-gray-300 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition-colors duration-200 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Keep Trying
          </button>

          <button
            onClick={canConfirm ? onConfirm : undefined}
            className={`inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-md border-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              canConfirm
                ? "cursor-pointer border-orange-600 bg-orange-500 text-white hover:bg-orange-600 dark:border-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
                : "cursor-not-allowed border-yellow-600 bg-yellow-500 text-gray-900 dark:border-yellow-700 dark:bg-yellow-600 dark:text-white"
            }`}
          >
            {canConfirm ? (
              "Show Solution"
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 animate-pulse" />
                Wait {countdown}s...
              </span>
            )}
          </button>
        </div>

        {/* Encouragement message */}
        {!canConfirm && (
          <Text
            variant="tiny"
            className="text-center text-neutral-500 dark:text-neutral-400"
          >
            Take a moment to consider if you want to keep trying first
          </Text>
        )}
      </div>
    </Modal>
  )
}

export default SolutionConfirmModal
