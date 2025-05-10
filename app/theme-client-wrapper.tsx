"use client"

import { useEffect, useState } from "react"
import { ThemeProvider } from "./theme-context"

export default function ThemeClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render children until after mounting to avoid hydration issues
  if (!mounted) return null

  return <ThemeProvider>{children}</ThemeProvider>
}
