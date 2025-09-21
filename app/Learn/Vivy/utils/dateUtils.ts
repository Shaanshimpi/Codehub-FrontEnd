/**
 * Utility functions for date formatting and manipulation
 */

export const formatTimeString = (
  date: Date | string | null | undefined
): string => {
  if (!date) return "Unknown time"

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    // Check if the date is valid
    if (!dateObj || isNaN(dateObj.getTime())) {
      return "Unknown time"
    }

    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.warn("Date formatting error:", error, "Date value:", date)
    return "Unknown time"
  }
}

export const formatDateString = (
  date: Date | string | null | undefined
): string => {
  if (!date) return "Unknown date"

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (!dateObj || isNaN(dateObj.getTime())) {
      return "Unknown date"
    }

    return dateObj.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch (error) {
    console.warn("Date formatting error:", error, "Date value:", date)
    return "Unknown date"
  }
}

export const formatRelativeTime = (
  date: Date | string | null | undefined
): string => {
  if (!date) return "Unknown time"

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (!dateObj || isNaN(dateObj.getTime())) {
      return "Unknown time"
    }

    const now = new Date()
    const diffInMs = now.getTime() - dateObj.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) {
      return "Just now"
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`
    } else {
      return formatDateString(dateObj)
    }
  } catch (error) {
    console.warn("Relative time formatting error:", error, "Date value:", date)
    return "Unknown time"
  }
}

export const formatFullDateTime = (
  date: Date | string | null | undefined
): string => {
  if (!date) return "Unknown date and time"

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (!dateObj || isNaN(dateObj.getTime())) {
      return "Unknown date and time"
    }

    return dateObj.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.warn("Full date time formatting error:", error, "Date value:", date)
    return "Unknown date and time"
  }
}

export const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime())
}

export const parseDate = (
  dateValue: Date | string | null | undefined
): Date | null => {
  if (!dateValue) return null

  try {
    const dateObj =
      typeof dateValue === "string" ? new Date(dateValue) : dateValue
    return isValidDate(dateObj) ? dateObj : null
  } catch (error) {
    console.warn("Date parsing error:", error, "Date value:", dateValue)
    return null
  }
}

export const isSameDay = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)

  if (!d1 || !d2) return false

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

export const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000)
}

export const addHours = (date: Date, hours: number): Date => {
  return addMinutes(date, hours * 60)
}

export const addDays = (date: Date, days: number): Date => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}
