import React from "react"
import ConditionalFooter from "./components/ConditionalFooter"
import Header from "./layouts/Header"

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Custom Header for /Learn routes */}
      <Header className="header" />

      {/* Page Content */}
      <main>{children}</main>

      {/* Conditional Footer - Hidden on Exercise pages */}
      <ConditionalFooter />
    </div>
  )
}
