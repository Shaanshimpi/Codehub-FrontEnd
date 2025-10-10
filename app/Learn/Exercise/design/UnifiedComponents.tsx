// Unified component library with consistent design system
"use client"

import React, { forwardRef, memo } from "react"
import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react"
import {
  type AlertType,
  type ButtonSize,
  type ButtonVariant,
  type DifficultyLevel,
  type ProgressState,
  getAlertClasses,
  getBadgeClasses,
  getButtonClasses,
  getDifficultyBadgeClasses,
  getFocusRingClasses,
  getInputClasses,
  getLoadingSpinnerClasses,
  getProgressBarClasses,
  getProgressStateClasses,
  getTabClasses,
  getTypographyClasses,
} from "./components"

// Unified component library with consistent design system

// ===== BUTTON COMPONENT =====
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        variant = "primary",
        size = "md",
        loading = false,
        disabled = false,
        leftIcon,
        rightIcon,
        children,
        className = "",
        ...props
      },
      ref
    ) => {
      const buttonClasses = getButtonClasses(
        variant,
        size,
        disabled || loading,
        loading
      )

      return (
        <button
          ref={ref}
          disabled={disabled || loading}
          className={`${buttonClasses} ${className}`}
          {...props}
        >
          {loading && (
            <LoadingSpinner
              size={size === "lg" ? "md" : "sm"}
              color={variant === "secondary" ? "primary" : "white"}
            />
          )}
          {!loading && leftIcon && leftIcon}
          <span>{children}</span>
          {!loading && rightIcon && rightIcon}
        </button>
      )
    }
  )
)

Button.displayName = "Button"

// ===== INPUT COMPONENT =====
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  inputSize?: ButtonSize
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    (
      {
        label,
        error,
        helpText,
        inputSize = "md",
        leftIcon,
        rightIcon,
        className = "",
        id,
        ...props
      },
      ref
    ) => {
      const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
      const hasError = !!error
      const inputClasses = getInputClasses(hasError, props.disabled, inputSize)

      return (
        <div className="space-y-1">
          {label && (
            <label
              htmlFor={inputId}
              className={
                getTypographyClasses("small") + " font-medium text-neutral-700"
              }
            >
              {label}
            </label>
          )}

          <div className="relative">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-neutral-400">
                {leftIcon}
              </div>
            )}

            <input
              ref={ref}
              id={inputId}
              className={`${inputClasses} ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${className}`}
              {...props}
            />

            {rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 transform text-neutral-400">
                {rightIcon}
              </div>
            )}
          </div>

          {error && (
            <p className={getTypographyClasses("tiny") + " text-error-600"}>
              {error}
            </p>
          )}

          {helpText && !error && (
            <p className={getTypographyClasses("tiny") + " text-neutral-500"}>
              {helpText}
            </p>
          )}
        </div>
      )
    }
  )
)

Input.displayName = "Input"

// ===== TAB COMPONENT =====
interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  badge?: string | number
}

interface TabsProps {
  tabs: TabItem[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  variant?: "underline" | "pill"
  className?: string
}

export const Tabs = memo<TabsProps>(
  ({ tabs, activeTab, onTabChange, variant = "underline", className = "" }) => {
    const [internalActiveTab, setInternalActiveTab] = React.useState(
      tabs[0]?.id || ""
    )
    const currentActiveTab = activeTab || internalActiveTab

    const handleTabChange = (tabId: string) => {
      if (onTabChange) {
        onTabChange(tabId)
      } else {
        setInternalActiveTab(tabId)
      }
    }

    const activeTabContent = tabs.find(
      (tab) => tab.id === currentActiveTab
    )?.content

    return (
      <div className={className}>
        {/* Tab Navigation */}
        <div
          className={`flex ${variant === "underline" ? "border-b border-neutral-200" : "gap-1"}`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              className={getTabClasses(
                currentActiveTab === tab.id,
                tab.disabled,
                variant
              )}
              disabled={tab.disabled}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <Badge variant="primary" size="sm" className="ml-2">
                  {tab.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">{activeTabContent}</div>
      </div>
    )
  }
)

Tabs.displayName = "Tabs"

// ===== ALERT COMPONENT =====
interface AlertProps {
  type: AlertType
  title?: string
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

export const Alert = memo<AlertProps>(
  ({ type, title, children, onClose, className = "" }) => {
    const alertClasses = getAlertClasses(type)

    const iconMap = {
      info: <Info className="h-5 w-5" />,
      success: <CheckCircle className="h-5 w-5" />,
      warning: <AlertTriangle className="h-5 w-5" />,
      error: <XCircle className="h-5 w-5" />,
    }

    return (
      <div className={`${alertClasses} ${className}`}>
        <div className="flex-shrink-0">{iconMap[type]}</div>

        <div className="flex-1">
          {title && (
            <h3
              className={getTypographyClasses("small") + " mb-1 font-semibold"}
            >
              {title}
            </h3>
          )}
          <div className={getTypographyClasses("small")}>{children}</div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black hover:bg-opacity-10"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)

Alert.displayName = "Alert"

// ===== PROGRESS BAR COMPONENT =====
interface ProgressBarProps {
  percentage: number
  variant?: "primary" | "success" | "warning" | "error"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  label?: string
  className?: string
}

export const ProgressBar = memo<ProgressBarProps>(
  ({
    percentage,
    variant = "primary",
    size = "md",
    showLabel = false,
    label,
    className = "",
  }) => {
    const {
      container,
      fill,
      percentage: clampedPercentage,
    } = getProgressBarClasses(percentage, variant, size)

    return (
      <div className={className}>
        {(showLabel || label) && (
          <div className="mb-2 flex items-center justify-between">
            <span
              className={getTypographyClasses("small") + " text-neutral-600"}
            >
              {label || "Progress"}
            </span>
            {showLabel && (
              <span
                className={getTypographyClasses("small") + " text-neutral-600"}
              >
                {clampedPercentage.toFixed(0)}%
              </span>
            )}
          </div>
        )}

        <div className={container}>
          <div className={fill} style={{ width: `${clampedPercentage}%` }} />
        </div>
      </div>
    )
  }
)

ProgressBar.displayName = "ProgressBar"

// ===== BADGE COMPONENT =====
interface BadgeProps {
  variant?: "primary" | "success" | "warning" | "error" | "neutral"
  size?: "sm" | "md"
  children: React.ReactNode
  className?: string
}

export const Badge = memo<BadgeProps>(
  ({ variant = "neutral", size = "md", children, className = "" }) => {
    const badgeClasses = getBadgeClasses(variant, size)

    return <span className={`${badgeClasses} ${className}`}>{children}</span>
  }
)

Badge.displayName = "Badge"

// ===== DIFFICULTY BADGE COMPONENT =====
interface DifficultyBadgeProps {
  difficulty: DifficultyLevel
  className?: string
}

export const DifficultyBadge = memo<DifficultyBadgeProps>(
  ({ difficulty, className = "" }) => {
    const badgeClasses = getDifficultyBadgeClasses(difficulty)

    const labels = {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    }

    return (
      <span className={`${badgeClasses} ${className}`}>
        {labels[difficulty]}
      </span>
    )
  }
)

DifficultyBadge.displayName = "DifficultyBadge"

// ===== PROGRESS STATE INDICATOR =====
interface ProgressStateIndicatorProps {
  state: ProgressState
  className?: string
}

export const ProgressStateIndicator = memo<ProgressStateIndicatorProps>(
  ({ state, className = "" }) => {
    const stateClasses = getProgressStateClasses(state)

    const labels = {
      notStarted: "Not Started",
      inProgress: "In Progress",
      completed: "Completed",
      failed: "Failed",
    }

    return (
      <span className={`${stateClasses} ${className}`}>{labels[state]}</span>
    )
  }
)

ProgressStateIndicator.displayName = "ProgressStateIndicator"

// ===== LOADING SPINNER COMPONENT =====
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "white"
  className?: string
}

export const LoadingSpinner = memo<LoadingSpinnerProps>(
  ({ size = "md", color = "primary", className = "" }) => {
    const spinnerClasses = getLoadingSpinnerClasses(size, color)

    return <div className={`${spinnerClasses} ${className}`} />
  }
)

LoadingSpinner.displayName = "LoadingSpinner"

// ===== HEADING COMPONENT =====
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
}

export const Heading = memo<HeadingProps>(
  ({ level, children, className = "" }) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements
    const headingClasses = getTypographyClasses(`h${level}` as any)

    return React.createElement(
      Component,
      { className: `${headingClasses} ${className}` },
      children
    )
  }
)

Heading.displayName = "Heading"

// ===== TEXT COMPONENT =====
interface TextProps {
  variant?: "body" | "small" | "tiny"
  children: React.ReactNode
  className?: string
}

export const Text = memo<TextProps>(
  ({ variant = "body", children, className = "" }) => {
    const textClasses = getTypographyClasses(variant)

    return <span className={`${textClasses} ${className}`}>{children}</span>
  }
)

Text.displayName = "Text"

// ===== CARD COMPONENT =====
interface CardProps {
  children: React.ReactNode
  padding?: "sm" | "md" | "lg"
  className?: string
}

export const Card = memo<CardProps>(
  ({ children, padding = "md", className = "" }) => {
    const paddingClasses = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    }

    return (
      <div
        className={`rounded-lg border border-neutral-200 bg-white shadow-sm ${paddingClasses[padding]} ${className}`}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

// ===== MODAL COMPONENT =====
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export const Modal = memo<ModalProps>(
  ({ isOpen, onClose, title, children, className = "" }) => {
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose()
        }
      }

      if (isOpen) {
        document.addEventListener("keydown", handleEscape)
        document.body.style.overflow = "hidden"
      }

      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = "unset"
      }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
      <div className="z-modal fixed inset-0 flex items-center justify-center bg-neutral-900 bg-opacity-50 p-4 dark:bg-opacity-70">
        <div
          className={`max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-900 ${className}`}
        >
          {title && (
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-gray-700">
              <Heading level={3}>{title}</Heading>
              <button
                onClick={onClose}
                className={`rounded-md p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-gray-800 ${getFocusRingClasses()}`}
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          )}

          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    )
  }
)

Modal.displayName = "Modal"
