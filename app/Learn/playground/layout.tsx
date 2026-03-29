import React from "react"

/** Playground handles pt-16 offset for fixed Learn header; no extra bottom padding. */
export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-0 w-full overflow-x-hidden overflow-y-hidden">
      {children}
    </div>
  )
}
