import React from "react"
import Header from "../layouts/Header"
import { ErrorBoundary } from "./components/ErrorBoundary"
import "./styles/markdown.css"

export default function VivyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <div className="vivy-layout">
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .vivy-layout footer,
            .vivy-layout ~ footer,
            body > footer {
              display: none !important;
            }
            body {
              overflow: hidden !important;
            }
          `,
          }}
        />

        <div className="fixed inset-0 z-50 overflow-hidden bg-white dark:bg-slate-900">
          {/* Custom Header for /Learn routes */}
          <Header className="header" />

          {/* Page Content - No Footer for Vivy */}
          <main className="absolute inset-0 top-16 flex flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}
