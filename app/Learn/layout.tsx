import React from "react"
import Header from "./layouts/Header"

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Custom Header for /Learn routes */}
      <Header className="header" />

      {/* Page Content */}
      <main>{children}</main>
    </div>
  )
}
