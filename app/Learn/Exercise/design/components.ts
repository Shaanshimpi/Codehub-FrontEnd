// Component utility functions for consistent styling
import { componentStates, designTokens } from "./tokens"

// Type definitions for component variants
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "ghost"
export type ButtonSize = "sm" | "md" | "lg"
export type AlertType = "info" | "success" | "warning" | "error"
export type DifficultyLevel = "beginner" | "intermediate" | "advanced"
export type ProgressState = "notStarted" | "inProgress" | "completed" | "failed"

// Button component class generator
export const getButtonClasses = (
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  disabled: boolean = false,
  loading: boolean = false
): string => {
  const baseClasses = [
    "inline-flex items-center justify-center",
    "font-medium rounded-md transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ]

  // Size classes - Enhanced for mobile touch targets (minimum 44px)
  const sizeClasses = {
    sm: "px-3 py-2.5 text-sm gap-1.5 min-h-[44px] min-w-[44px] touch-manipulation",
    md: "px-4 py-3 text-sm gap-2 min-h-[48px] min-w-[48px] touch-manipulation",
    lg: "px-6 py-4 text-base gap-2.5 min-h-[52px] min-w-[52px] touch-manipulation",
  }

  // Get variant classes
  const variantClasses = disabled
    ? componentStates.button[variant].disabled
    : componentStates.button[variant].base

  // Focus ring color
  const focusRingClasses = {
    primary: "focus:ring-primary-500",
    secondary: "focus:ring-primary-500",
    success: "focus:ring-success-500",
    warning: "focus:ring-warning-500",
    danger: "focus:ring-error-500",
    ghost: "focus:ring-primary-500",
  }

  // Loading state
  const loadingClasses = loading ? "cursor-wait" : ""

  return [
    ...baseClasses,
    sizeClasses[size],
    variantClasses,
    focusRingClasses[variant],
    loadingClasses,
  ]
    .filter(Boolean)
    .join(" ")
}

// Input component class generator
export const getInputClasses = (
  hasError: boolean = false,
  disabled: boolean = false,
  size: ButtonSize = "md"
): string => {
  const baseClasses = [
    "block w-full rounded-md transition-colors duration-200",
    "placeholder-neutral-500",
  ]

  // Size classes - Enhanced for mobile accessibility
  const sizeClasses = {
    sm: "px-3 py-2.5 text-sm min-h-[44px] touch-manipulation",
    md: "px-3 py-3 text-sm min-h-[48px] touch-manipulation",
    lg: "px-4 py-4 text-base min-h-[52px] touch-manipulation",
  }

  // State classes
  let stateClasses = componentStates.input.base
  if (disabled) {
    stateClasses = componentStates.input.disabled
  } else if (hasError) {
    stateClasses = componentStates.input.error
  }

  return [...baseClasses, sizeClasses[size], stateClasses].join(" ")
}

// Tab component class generator
export const getTabClasses = (
  isActive: boolean = false,
  disabled: boolean = false,
  variant: "underline" | "pill" = "underline"
): string => {
  const baseClasses = [
    "inline-flex items-center justify-center px-4 py-3",
    "text-sm font-medium transition-colors duration-200",
    "min-h-[44px] min-w-[44px] touch-manipulation",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
  ]

  // Variant-specific classes
  const variantClasses = {
    underline: [
      "border-b-2 rounded-t-md",
      isActive ? componentStates.tab.active : componentStates.tab.inactive,
    ],
    pill: [
      "rounded-md",
      isActive
        ? "bg-primary-100 text-primary-700 border border-primary-200"
        : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100",
    ],
  }

  // Disabled state
  const disabledClasses = disabled ? componentStates.tab.disabled : ""

  return [...baseClasses, ...variantClasses[variant], disabledClasses]
    .filter(Boolean)
    .join(" ")
}

// Alert component class generator
export const getAlertClasses = (type: AlertType): string => {
  const baseClasses = ["p-4 rounded-md border", "flex items-start gap-3"]

  const typeClasses = componentStates.alert[type]

  return [...baseClasses, typeClasses].join(" ")
}

// Progress bar component class generator
export const getProgressBarClasses = (
  percentage: number,
  variant: "primary" | "success" | "warning" | "error" = "primary",
  size: "sm" | "md" | "lg" = "md"
): { container: string; fill: string; percentage: number } => {
  const containerClasses = [
    "w-full bg-neutral-200 rounded-full overflow-hidden",
  ]

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  const fillClasses = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600",
    success: "bg-gradient-to-r from-success-500 to-success-600",
    warning: "bg-gradient-to-r from-warning-500 to-warning-600",
    error: "bg-gradient-to-r from-error-500 to-error-600",
  }

  return {
    container: [...containerClasses, sizeClasses[size]].join(" "),
    fill: `${fillClasses[variant]} h-full transition-all duration-500 ease-out`,
    percentage: Math.min(Math.max(percentage, 0), 100),
  }
}

// Badge component class generator
export const getBadgeClasses = (
  variant: "primary" | "success" | "warning" | "error" | "neutral" = "neutral",
  size: "sm" | "md" = "md"
): string => {
  const baseClasses = ["inline-flex items-center font-medium rounded-full"]

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  }

  const variantClasses = {
    primary: "bg-primary-100 text-primary-800",
    success: "bg-success-100 text-success-800",
    warning: "bg-warning-100 text-warning-800",
    error: "bg-error-100 text-error-800",
    neutral: "bg-neutral-100 text-neutral-800",
  }

  return [...baseClasses, sizeClasses[size], variantClasses[variant]].join(" ")
}

// Exercise-specific component class generators
export const getDifficultyBadgeClasses = (
  difficulty: DifficultyLevel
): string => {
  const colorMap = {
    beginner: "success",
    intermediate: "warning",
    advanced: "error",
  } as const

  return getBadgeClasses(colorMap[difficulty])
}

export const getProgressStateClasses = (state: ProgressState): string => {
  const stateMap = {
    notStarted: "bg-neutral-100 text-neutral-600 border-neutral-200",
    inProgress: "bg-primary-100 text-primary-700 border-primary-200",
    completed: "bg-success-100 text-success-700 border-success-200",
    failed: "bg-error-100 text-error-700 border-error-200",
  }

  return `px-3 py-1 rounded-md border text-sm font-medium ${stateMap[state]}`
}

// Code editor theme classes
export const getCodeEditorClasses = (
  theme: "light" | "dark" = "dark"
): string => {
  const baseClasses = [
    "font-mono text-sm leading-relaxed",
    "border rounded-md overflow-hidden",
  ]

  const themeClasses = {
    light: "bg-white text-neutral-900 border-neutral-200",
    dark: "bg-neutral-900 text-neutral-100 border-neutral-700",
  }

  return [...baseClasses, themeClasses[theme]].join(" ")
}

// Hint section classes
export const getHintSectionClasses = (revealed: boolean = false): string => {
  const baseClasses = ["border rounded-lg p-4 transition-all duration-300"]

  const stateClasses = revealed
    ? "border-warning-200 bg-warning-50"
    : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100"

  return [...baseClasses, stateClasses].join(" ")
}

// Modal classes
export const getModalClasses = (): { overlay: string; content: string } => {
  return {
    overlay: [
      "fixed inset-0 z-modal",
      "bg-neutral-900 bg-opacity-50",
      "flex items-center justify-center p-4",
    ].join(" "),
    content: [
      "bg-white rounded-lg shadow-xl",
      "max-w-md w-full max-h-[90vh] overflow-y-auto",
      "transform transition-all duration-200",
    ].join(" "),
  }
}

// Loading spinner classes
export const getLoadingSpinnerClasses = (
  size: "sm" | "md" | "lg" = "md",
  color: "primary" | "white" = "primary"
): string => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const colorClasses = {
    primary: "border-primary-200 border-t-primary-600",
    white: "border-white border-opacity-30 border-t-white",
  }

  return [
    "animate-spin rounded-full border-2",
    sizeClasses[size],
    colorClasses[color],
  ].join(" ")
}

// Focus ring utility
export const getFocusRingClasses = (
  color: "primary" | "success" | "warning" | "error" = "primary"
): string => {
  const colorMap = {
    primary: "focus:ring-primary-500",
    success: "focus:ring-success-500",
    warning: "focus:ring-warning-500",
    error: "focus:ring-error-500",
  }

  return `focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorMap[color]}`
}

// Typography utility classes
export const getTypographyClasses = (
  element: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "small" | "tiny"
): string => {
  const typographyMap = {
    h1: designTokens.typography.heading.h1,
    h2: designTokens.typography.heading.h2,
    h3: designTokens.typography.heading.h3,
    h4: designTokens.typography.heading.h4,
    h5: designTokens.typography.heading.h5,
    h6: designTokens.typography.heading.h6,
    body: designTokens.typography.body.normal,
    small: designTokens.typography.body.small,
    tiny: designTokens.typography.body.tiny,
  }

  return typographyMap[element]
}

// Responsive breakpoint utilities
export const getResponsiveClasses = (
  mobile: string,
  tablet?: string,
  desktop?: string
): string => {
  const classes = [mobile]

  if (tablet) {
    classes.push(`md:${tablet}`)
  }

  if (desktop) {
    classes.push(`lg:${desktop}`)
  }

  return classes.join(" ")
}
