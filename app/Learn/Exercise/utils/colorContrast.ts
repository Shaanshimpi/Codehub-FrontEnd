// Color contrast validation utilities for WCAG AA compliance
"use client"

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove the hash if present
  hex = hex.replace(/^#/, "")

  // Convert 3-digit hex to 6-digit hex
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("")
  }

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Calculate relative luminance according to WCAG guidelines
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  // Convert RGB to sRGB
  const [sR, sG, sB] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })

  // Calculate relative luminance
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB
}

/**
 * Calculate contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) {
    throw new Error("Invalid hex color format")
  }

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b)

  // Ensure lighter color is in numerator
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if color combination meets WCAG AA standards
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const contrastRatio = calculateContrastRatio(foreground, background)

  // WCAG AA requirements:
  // Normal text: 4.5:1
  // Large text (18pt+ or 14pt+ bold): 3:1
  const requiredRatio = isLargeText ? 3 : 4.5

  return contrastRatio >= requiredRatio
}

/**
 * Check if color combination meets WCAG AAA standards
 */
export function meetsWCAGAAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const contrastRatio = calculateContrastRatio(foreground, background)

  // WCAG AAA requirements:
  // Normal text: 7:1
  // Large text: 4.5:1
  const requiredRatio = isLargeText ? 4.5 : 7

  return contrastRatio >= requiredRatio
}

/**
 * Get contrast rating for a color combination
 */
export function getContrastRating(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): {
  ratio: number
  level: "fail" | "aa" | "aaa"
  passes: {
    aa: boolean
    aaa: boolean
  }
} {
  const ratio = calculateContrastRatio(foreground, background)
  const passesAA = meetsWCAGAA(foreground, background, isLargeText)
  const passesAAA = meetsWCAGAAA(foreground, background, isLargeText)

  let level: "fail" | "aa" | "aaa" = "fail"
  if (passesAAA) level = "aaa"
  else if (passesAA) level = "aa"

  return {
    ratio: Math.round(ratio * 100) / 100,
    level,
    passes: {
      aa: passesAA,
      aaa: passesAAA,
    },
  }
}

/**
 * Validate our design token color combinations
 */
export const designTokenValidation = {
  // Primary combinations
  primary: {
    "white on primary-600": getContrastRating("#ffffff", "#5b62ec"),
    "primary-700 on primary-50": getContrastRating("#4c52d9", "#f0f4ff"),
    "primary-800 on primary-100": getContrastRating("#3e45b0", "#e0e9ff"),
  },

  // Success combinations
  success: {
    "white on success-600": getContrastRating("#ffffff", "#059669"),
    "success-800 on success-50": getContrastRating("#065f46", "#ecfdf5"),
    "success-900 on success-100": getContrastRating("#064e3b", "#d1fae5"),
  },

  // Error combinations
  error: {
    "white on error-600": getContrastRating("#ffffff", "#e11d48"),
    "error-800 on error-50": getContrastRating("#9f1239", "#fff1f2"),
    "error-900 on error-100": getContrastRating("#881337", "#ffe4e6"),
  },

  // Warning combinations
  warning: {
    "white on warning-600": getContrastRating("#ffffff", "#d97706"),
    "warning-800 on warning-50": getContrastRating("#92400e", "#fffbeb"),
    "warning-900 on warning-100": getContrastRating("#78350f", "#fef3c7"),
  },

  // Neutral combinations
  neutral: {
    "neutral-900 on white": getContrastRating("#0f172a", "#ffffff"),
    "neutral-700 on neutral-50": getContrastRating("#334155", "#f8fafc"),
    "neutral-600 on neutral-100": getContrastRating("#475569", "#f1f5f9"),
    "neutral-500 on white": getContrastRating("#64748b", "#ffffff"),
  },
}

/**
 * Get accessible color for text based on background
 */
export function getAccessibleTextColor(
  backgroundColor: string,
  lightColor: string = "#ffffff",
  darkColor: string = "#0f172a"
): string {
  const lightContrast = calculateContrastRatio(lightColor, backgroundColor)
  const darkContrast = calculateContrastRatio(darkColor, backgroundColor)

  // Return the color with better contrast
  return lightContrast > darkContrast ? lightColor : darkColor
}

/**
 * Generate WCAG compliant color variants
 */
export function generateAccessibleVariant(
  baseColor: string,
  targetBackground: string,
  isLargeText: boolean = false
): string {
  let currentColor = baseColor
  const baseRgb = hexToRgb(baseColor)

  if (!baseRgb) return baseColor

  // Try adjusting lightness to meet contrast requirements
  for (let adjustment = 0; adjustment <= 100; adjustment += 5) {
    // Try making it darker
    const darkerRgb = {
      r: Math.max(0, baseRgb.r - adjustment),
      g: Math.max(0, baseRgb.g - adjustment),
      b: Math.max(0, baseRgb.b - adjustment),
    }

    const darkerHex = `#${[darkerRgb.r, darkerRgb.g, darkerRgb.b]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")}`

    if (meetsWCAGAA(darkerHex, targetBackground, isLargeText)) {
      return darkerHex
    }

    // Try making it lighter
    const lighterRgb = {
      r: Math.min(255, baseRgb.r + adjustment),
      g: Math.min(255, baseRgb.g + adjustment),
      b: Math.min(255, baseRgb.b + adjustment),
    }

    const lighterHex = `#${[lighterRgb.r, lighterRgb.g, lighterRgb.b]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")}`

    if (meetsWCAGAA(lighterHex, targetBackground, isLargeText)) {
      return lighterHex
    }
  }

  // If no accessible variant found, return high contrast fallback
  return getAccessibleTextColor(targetBackground)
}

/**
 * Validate contrast in development mode
 */
export function validateContrast() {
  if (process.env.NODE_ENV === "development") {
    console.log("🎨 WCAG Color Contrast Validation Results:")

    Object.entries(designTokenValidation).forEach(
      ([category, combinations]) => {
        console.log(`\n📊 ${category.toUpperCase()}:`)
        Object.entries(combinations).forEach(([combo, result]) => {
          const emoji =
            result.level === "aaa" ? "🟢" : result.level === "aa" ? "🟡" : "🔴"
          console.log(
            `  ${emoji} ${combo}: ${result.ratio}:1 (${result.level.toUpperCase()})`
          )
        })
      }
    )
  }
}
