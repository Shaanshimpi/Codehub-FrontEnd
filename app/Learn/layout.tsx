// app/Link/layout.tsx
import React from "react"
import Header from "./layouts/Header"

export default function LinkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Custom Header for /Link routes */}
      <Header />

      {/* Page Content */}
      <main>{children}</main>
    </div>
  )
}
