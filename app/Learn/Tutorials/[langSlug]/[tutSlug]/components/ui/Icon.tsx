/**
 * Professional icon component with consistent sizing and tooltips
 * Sizes based on CSS custom properties
 */
import React from "react"

interface IconProps {
  name: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
  title?: string
  ariaLabel?: string
}

const Icon: React.FC<IconProps> = ({
  name,
  size = "md",
  className = "",
  title,
  ariaLabel,
}) => {
  const sizeClasses = {
    xs: "h-3 w-3", // 12px - for very small icons
    sm: "h-4 w-4", // 16px - for inline text icons
    md: "h-5 w-5", // 20px - default size
    lg: "h-6 w-6", // 24px - for prominent icons
    xl: "h-8 w-8", // 32px - for large feature icons
  }

  const iconPaths: { [key: string]: string } = {
    home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    book: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    computer:
      "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
    quiz: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    code: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    check: "M5 13l4 4L19 7",
    puzzle:
      "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
    bookmark: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
    notes:
      "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    keyboard:
      "M8 14v.01M12 14v.01M16 14v.01M8 18v.01M12 18v.01M16 18v.01M8 10v.01M12 10v.01M16 10v.01M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z",
    trophy:
      "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    chevronLeft: "M15 19l-7-7 7-7",
    chevronRight: "M9 5l7 7-7 7",
    chevronUp: "M5 15l7-7 7 7",
    chevronDown: "M19 9l-7 7-7-7",
    menu: "M4 6h16M4 12h16M4 18h16",
    x: "M6 18L18 6M6 6l12 12",
    alert:
      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    refresh:
      "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  }

  const iconTitles: { [key: string]: string } = {
    home: "Home",
    book: "Book",
    computer: "Computer",
    quiz: "Quiz",
    code: "Code",
    edit: "Edit",
    star: "Star",
    clock: "Clock",
    check: "Check",
    puzzle: "Puzzle",
    bookmark: "Bookmark",
    notes: "Notes",
    keyboard: "Keyboard",
    trophy: "Trophy",
    chevronLeft: "Previous",
    chevronRight: "Next",
    chevronUp: "Collapse",
    chevronDown: "Expand",
    menu: "Menu",
    x: "Close",
    alert: "Warning",
    info: "Information",
    refresh: "Refresh",
  }

  const path = iconPaths[name]
  if (!path) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  const iconTitle = title || iconTitles[name] || name
  const accessibleLabel = ariaLabel || iconTitle

  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      role="img"
      aria-label={accessibleLabel}
      title={iconTitle}
    >
      <title>{iconTitle}</title>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

export default Icon
