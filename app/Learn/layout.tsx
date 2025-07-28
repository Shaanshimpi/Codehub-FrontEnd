import React from "react"
import Header from "./layouts/Header"
import LearnFooter from "./layouts/LearnFooter"

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

      {/* Learn Footer */}
      <LearnFooter />
    </div>
  )
}
