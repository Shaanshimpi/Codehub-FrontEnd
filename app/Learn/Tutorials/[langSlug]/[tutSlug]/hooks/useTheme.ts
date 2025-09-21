"use client"

import { useEffect, useState } from "react"

export const useTheme = (): "light" | "dark" => {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const detectTheme = () => {
      if (typeof window !== "undefined") {
        // Check for dark class on html element (common in dark mode implementations)
        const isDarkClass = document.documentElement.classList.contains("dark")

        // Check system preference
        const isSystemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches

        // Check for CSS custom properties that might indicate dark mode
        const computedStyle = getComputedStyle(document.documentElement)
        const bgColor = computedStyle.getPropertyValue("background-color")

        // Determine theme based on available indicators
        let detectedTheme: "light" | "dark" = "light"

        if (isDarkClass) {
          detectedTheme = "dark"
        } else if (bgColor && bgColor.includes("rgb")) {
          // Parse RGB values to determine if background is dark
          const rgb = bgColor.match(/\d+/g)
          if (rgb && rgb.length >= 3) {
            const [r, g, b] = rgb.map(Number)
            // Calculate relative luminance
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
            detectedTheme = luminance < 0.5 ? "dark" : "light"
          }
        } else if (isSystemDark) {
          detectedTheme = "dark"
        }

        return detectedTheme
      }
      return "light"
    }

    // Initial theme detection
    setTheme(detectTheme())

    // Listen for theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      setTheme(detectTheme())
    }

    mediaQuery.addEventListener("change", handleChange)

    // Listen for class changes on document element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          setTheme(detectTheme())
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
      observer.disconnect()
    }
  }, [])

  return theme
}
