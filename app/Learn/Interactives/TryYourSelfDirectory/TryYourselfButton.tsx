"use client"

import React, { useEffect, useState } from "react"
import { Code, Maximize2, Minimize2, X } from "lucide-react"
import CodeRunnerView from "./CodeRunnerView"

interface CodeRunnerModalProps {
  language: string
  initialCode?: string
  stdin?: string
  className?: string
  buttonText?: string
  buttonVariant?: "default" | "outline" | "ghost"
}

const CodeRunnerModal: React.FC<CodeRunnerModalProps> = ({
  language,
  initialCode = "",
  stdin = "",
  className = "",
  buttonText = "Try Yourself",
  buttonVariant = "default",
}) => {
  const [isClient, setIsClient] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleHeaderAction = (action: "settings" | "fullscreen" | "close") => {
    if (action === "fullscreen") {
      setIsFullscreen(!isFullscreen)
    } else if (action === "close") {
      setIsOpen(false)
    }
  }

  const getButtonStyles = () => {
    const baseStyles =
      "inline-flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"

    switch (buttonVariant) {
      case "outline":
        return `${baseStyles} border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20`
      case "ghost":
        return `${baseStyles} text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20`
      default:
        return `${baseStyles} bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 dark:from-blue-500 dark:to-blue-700 dark:hover:from-blue-600 dark:hover:to-blue-800`
    }
  }

  if (!isClient) {
    return (
      <div
        className={`inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 text-sm font-medium text-white ${className}`}
      >
        <Code className="h-4 w-4" />
        <span>{buttonText}</span>
      </div>
    )
  }

  const headerActions = (
    <>
      <button
        onClick={() => handleHeaderAction("fullscreen")}
        className="hidden rounded-lg p-1 transition-colors hover:bg-white/20 sm:block"
        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </button>
      <button
        onClick={() => handleHeaderAction("close")}
        className="rounded-lg p-1 transition-colors hover:bg-white/20"
        title="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </>
  )

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${getButtonStyles()} ${className}`}
      >
        <Code className="h-4 w-4" />
        <span>{buttonText}</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 backdrop-blur-sm sm:p-4">
          <div
            className={`w-full max-w-7xl overflow-hidden ${
              isFullscreen ? "h-screen max-h-screen" : "h-[80vh] max-h-[95vh]"
            } ${isMobile ? "max-w-full" : ""}`}
          >
            <CodeRunnerView
              language={language}
              initialCode={initialCode}
              stdin={stdin}
              showHeader={true}
              onHeaderAction={handleHeaderAction}
              headerActions={headerActions}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default CodeRunnerModal
