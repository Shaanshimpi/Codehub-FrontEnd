// Comprehensive accessibility validation utilities
"use client"

import {
  getContrastRating,
  meetsWCAGAA,
  validateContrast,
} from "./colorContrast"

// Comprehensive accessibility validation utilities

interface AccessibilityIssue {
  element: HTMLElement
  type: "contrast" | "aria" | "keyboard" | "structure"
  severity: "error" | "warning" | "info"
  message: string
  suggestion?: string
}

/**
 * Check color contrast for all text elements
 */
function validateColorContrast(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []

  // Get all text elements
  const textElements = document.querySelectorAll(
    "p, span, h1, h2, h3, h4, h5, h6, a, button, li, td, th, label"
  )

  textElements.forEach((element) => {
    const htmlElement = element as HTMLElement
    const style = window.getComputedStyle(htmlElement)

    const color = style.color
    const backgroundColor = style.backgroundColor

    // Skip if transparent background - check parent backgrounds
    if (
      backgroundColor === "rgba(0, 0, 0, 0)" ||
      backgroundColor === "transparent"
    ) {
      return
    }

    try {
      const rgb = color.match(/rgb\((\d+), (\d+), (\d+)\)/)
      const bgRgb = backgroundColor.match(/rgb\((\d+), (\d+), (\d+)\)/)

      if (rgb && bgRgb) {
        const textHex = `#${[rgb[1], rgb[2], rgb[3]]
          .map((c) => parseInt(c).toString(16).padStart(2, "0"))
          .join("")}`

        const bgHex = `#${[bgRgb[1], bgRgb[2], bgRgb[3]]
          .map((c) => parseInt(c).toString(16).padStart(2, "0"))
          .join("")}`

        const fontSize = parseFloat(style.fontSize)
        const fontWeight = style.fontWeight
        const isLargeText =
          fontSize >= 18 ||
          (fontSize >= 14 &&
            (fontWeight === "bold" || parseInt(fontWeight) >= 700))

        if (!meetsWCAGAA(textHex, bgHex, isLargeText)) {
          const rating = getContrastRating(textHex, bgHex, isLargeText)

          issues.push({
            element: htmlElement,
            type: "contrast",
            severity: "error",
            message: `Poor color contrast: ${rating.ratio}:1 (requires ${isLargeText ? "3:1" : "4.5:1"} for WCAG AA)`,
            suggestion: `Increase contrast between text (${textHex}) and background (${bgHex})`,
          })
        }
      }
    } catch (error) {
      // Skip elements with complex color values
    }
  })

  return issues
}

/**
 * Check ARIA labels and roles
 */
function validateARIA(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []

  // Check for buttons without accessible labels
  const buttons = document.querySelectorAll("button")
  buttons.forEach((button) => {
    const hasText = button.textContent?.trim()
    const hasAriaLabel = button.getAttribute("aria-label")
    const hasAriaLabelledBy = button.getAttribute("aria-labelledby")
    const hasTitle = button.getAttribute("title")

    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
      issues.push({
        element: button,
        type: "aria",
        severity: "error",
        message: "Button lacks accessible name",
        suggestion: "Add aria-label, aria-labelledby, or visible text content",
      })
    }
  })

  // Check for images without alt text
  const images = document.querySelectorAll("img")
  images.forEach((img) => {
    const alt = img.getAttribute("alt")
    const role = img.getAttribute("role")

    if (alt === null && role !== "presentation" && role !== "none") {
      issues.push({
        element: img,
        type: "aria",
        severity: "error",
        message: "Image lacks alt text",
        suggestion:
          'Add descriptive alt text or role="presentation" for decorative images',
      })
    }
  })

  // Check for form inputs without labels
  const inputs = document.querySelectorAll("input, textarea, select")
  inputs.forEach((input) => {
    const id = input.getAttribute("id")
    const ariaLabel = input.getAttribute("aria-label")
    const ariaLabelledBy = input.getAttribute("aria-labelledby")

    if (id) {
      const hasLabel = document.querySelector(`label[for="${id}"]`)
      if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
        issues.push({
          element: input as HTMLElement,
          type: "aria",
          severity: "error",
          message: "Form input lacks associated label",
          suggestion: "Add a <label> element or aria-label attribute",
        })
      }
    }
  })

  // Check for heading hierarchy
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
  let lastLevel = 0
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1))

    if (level > lastLevel + 1 && lastLevel !== 0) {
      issues.push({
        element: heading as HTMLElement,
        type: "structure",
        severity: "warning",
        message: `Heading level skipped (${lastLevel} to ${level})`,
        suggestion: "Use heading levels sequentially (h1, h2, h3, etc.)",
      })
    }

    lastLevel = level
  })

  return issues
}

/**
 * Check keyboard navigation
 */
function validateKeyboardNavigation(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []

  // Check for interactive elements without proper focus
  const interactiveElements = document.querySelectorAll(
    "button, a, input, textarea, select, [tabindex]"
  )

  interactiveElements.forEach((element) => {
    const htmlElement = element as HTMLElement
    const tabIndex = htmlElement.getAttribute("tabindex")

    // Check for positive tabindex (antipattern)
    if (tabIndex && parseInt(tabIndex) > 0) {
      issues.push({
        element: htmlElement,
        type: "keyboard",
        severity: "warning",
        message: "Positive tabindex detected",
        suggestion: 'Use tabindex="0" or rely on natural tab order',
      })
    }

    // Check for focusable elements with tabindex="-1" that might need keyboard access
    if (tabIndex === "-1" && !htmlElement.getAttribute("role")) {
      issues.push({
        element: htmlElement,
        type: "keyboard",
        severity: "info",
        message: "Element removed from tab order",
        suggestion:
          "Ensure element is still accessible via other keyboard navigation",
      })
    }
  })

  // Check for click handlers on non-interactive elements
  const nonInteractiveWithClick = document.querySelectorAll(
    "div[onclick], span[onclick]"
  )
  nonInteractiveWithClick.forEach((element) => {
    const role = element.getAttribute("role")
    const tabIndex = element.getAttribute("tabindex")

    if (role !== "button" && role !== "link" && tabIndex !== "0") {
      issues.push({
        element: element as HTMLElement,
        type: "keyboard",
        severity: "error",
        message: "Non-interactive element with click handler",
        suggestion:
          'Add role="button" and tabindex="0", or use proper <button> element',
      })
    }
  })

  return issues
}

/**
 * Run comprehensive accessibility audit
 */
export function runAccessibilityAudit(): {
  issues: AccessibilityIssue[]
  summary: {
    total: number
    errors: number
    warnings: number
    info: number
    byType: Record<string, number>
  }
} {
  const allIssues = [
    ...validateColorContrast(),
    ...validateARIA(),
    ...validateKeyboardNavigation(),
  ]

  const summary = {
    total: allIssues.length,
    errors: allIssues.filter((i) => i.severity === "error").length,
    warnings: allIssues.filter((i) => i.severity === "warning").length,
    info: allIssues.filter((i) => i.severity === "info").length,
    byType: allIssues.reduce(
      (acc, issue) => {
        acc[issue.type] = (acc[issue.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    ),
  }

  return { issues: allIssues, summary }
}

/**
 * Log accessibility audit results to console (development only)
 */
export function logAccessibilityAudit() {
  if (process.env.NODE_ENV !== "development") return

  const { issues, summary } = runAccessibilityAudit()

  console.log("♿ Accessibility Audit Results:")
  console.log(`Total Issues: ${summary.total}`)
  console.log(`🔴 Errors: ${summary.errors}`)
  console.log(`🟡 Warnings: ${summary.warnings}`)
  console.log(`🔵 Info: ${summary.info}`)

  if (issues.length > 0) {
    console.log("\nDetailed Issues:")
    issues.forEach((issue, index) => {
      const icon =
        issue.severity === "error"
          ? "🔴"
          : issue.severity === "warning"
            ? "🟡"
            : "🔵"
      console.log(`${icon} ${index + 1}. ${issue.message}`)
      if (issue.suggestion) {
        console.log(`   💡 ${issue.suggestion}`)
      }
      console.log(`   📍 Element:`, issue.element)
    })
  } else {
    console.log("✅ No accessibility issues detected!")
  }

  // Also run color contrast validation
  validateContrast()
}

/**
 * Highlight accessibility issues on page (development only)
 */
export function highlightAccessibilityIssues() {
  if (process.env.NODE_ENV !== "development") return

  const { issues } = runAccessibilityAudit()

  // Remove existing highlights
  document.querySelectorAll(".accessibility-issue-highlight").forEach((el) => {
    el.classList.remove("accessibility-issue-highlight")
  })

  // Add highlights for issues
  issues.forEach((issue) => {
    const element = issue.element
    element.classList.add("accessibility-issue-highlight")
    element.style.outline =
      issue.severity === "error"
        ? "2px solid red"
        : issue.severity === "warning"
          ? "2px solid orange"
          : "2px solid blue"
    element.title = `${issue.message}${issue.suggestion ? ` | ${issue.suggestion}` : ""}`
  })
}

/**
 * Auto-run accessibility audit in development
 */
export function initAccessibilityValidator() {
  if (process.env.NODE_ENV === "development") {
    // Run audit when DOM is loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(logAccessibilityAudit, 1000)
      })
    } else {
      setTimeout(logAccessibilityAudit, 1000)
    }

    // Add keyboard shortcut to run audit manually
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault()
        logAccessibilityAudit()
        highlightAccessibilityIssues()
      }
    })
  }
}
