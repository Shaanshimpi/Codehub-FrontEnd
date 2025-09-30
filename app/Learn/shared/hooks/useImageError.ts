/**
 * Custom hooks for handling image loading errors
 */
import { useCallback, useState } from "react"

/**
 * Hook for handling image loading errors with fallback functionality
 */
export const useImageError = () => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  const resetImageError = useCallback(() => {
    setImageError(false)
  }, [])

  return {
    imageError,
    handleImageError,
    resetImageError,
  }
}

/**
 * Hook for handling image loading errors with retry functionality
 */
export const useImageErrorWithRetry = (maxRetries: number = 3) => {
  const [imageError, setImageError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageError = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1)
      setIsLoading(true)

      // Add small delay before retry
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } else {
      setImageError(true)
      setIsLoading(false)
    }
  }, [retryCount, maxRetries])

  const handleImageLoad = useCallback(() => {
    setImageError(false)
    setIsLoading(false)
    setRetryCount(0)
  }, [])

  const resetImageError = useCallback(() => {
    setImageError(false)
    setRetryCount(0)
    setIsLoading(false)
  }, [])

  const canRetry = retryCount < maxRetries && !imageError

  return {
    imageError,
    retryCount,
    isLoading,
    canRetry,
    handleImageError,
    handleImageLoad,
    resetImageError,
  }
}
