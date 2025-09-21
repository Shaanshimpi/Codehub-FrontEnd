"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
          <div className="mx-auto max-w-md p-6 text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Something went wrong
            </h2>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="mb-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  Error Details (Development)
                </summary>
                <pre className="overflow-auto rounded bg-slate-100 p-4 text-xs text-red-600 dark:bg-slate-800 dark:text-red-400">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
