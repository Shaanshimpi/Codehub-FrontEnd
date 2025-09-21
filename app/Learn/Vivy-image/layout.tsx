import React from "react"
import { ErrorBoundary } from "../Vivy/components/ErrorBoundary"
import Header from "../layouts/Header"

export default function VivyImageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <div className="vivy-image-layout">
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .vivy-image-layout footer,
            .vivy-image-layout ~ footer,
            body > footer {
              display: none !important;
            }
            body {
              overflow-x: hidden !important;
            }
          `,
          }}
        />

        <div className="min-h-screen bg-slate-900">
          {/* Custom Header for /Learn routes */}
          <Header className="header" />

          {/* Page Content */}
          <main className="pt-16">{children}</main>
        </div>
      </div>
    </ErrorBoundary>
  )
}
