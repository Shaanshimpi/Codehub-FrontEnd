// Performance-optimized component wrappers
"use client"

import React, { memo, useCallback, useMemo } from "react"

// Performance-optimized component wrappers

// Memoized wrapper for expensive components
export const withMemo = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return memo(Component, areEqual)
}

// Custom comparison function for exercise props
export const exercisePropsEqual = (prevProps: any, nextProps: any): boolean => {
  // Only re-render if essential props change
  return (
    prevProps.exercise?.id === nextProps.exercise?.id &&
    prevProps.exercise?.slug === nextProps.exercise?.slug &&
    prevProps.language?.slug === nextProps.language?.slug &&
    prevProps.currentView === nextProps.currentView &&
    prevProps.isFullscreen === nextProps.isFullscreen &&
    prevProps.panelWidth === nextProps.panelWidth
  )
}

// Custom comparison for code editor props
export const codeEditorPropsEqual = (
  prevProps: any,
  nextProps: any
): boolean => {
  return (
    prevProps.code === nextProps.code &&
    prevProps.language?.slug === nextProps.language?.slug &&
    prevProps.isReadOnly === nextProps.isReadOnly &&
    prevProps.fontSize === nextProps.fontSize &&
    prevProps.showLineNumbers === nextProps.showLineNumbers
  )
}

interface LazyLoadWrapperProps {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

/**
 * Lazy loading wrapper using Intersection Observer
 */
export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = memo(
  ({ children, threshold = 0.1, rootMargin = "50px", className = "" }) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const [hasLoaded, setHasLoaded] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true)
            setHasLoaded(true)
            observer.disconnect()
          }
        },
        { threshold, rootMargin }
      )

      if (ref.current) {
        observer.observe(ref.current)
      }

      return () => observer.disconnect()
    }, [threshold, rootMargin, hasLoaded])

    return (
      <div ref={ref} className={className}>
        {isVisible ? (
          children
        ) : (
          <div className="h-32 animate-pulse rounded bg-slate-100" />
        )}
      </div>
    )
  }
)

LazyLoadWrapper.displayName = "LazyLoadWrapper"

interface VirtualizedListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
}

/**
 * Simple virtualized list for large datasets
 */
export const VirtualizedList = memo(
  <T,>({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    overscan = 5,
    className = "",
  }: VirtualizedListProps<T>) => {
    const [scrollTop, setScrollTop] = React.useState(0)

    const visibleRange = useMemo(() => {
      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
      const end = Math.min(
        items.length,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
      )
      return { start, end }
    }, [scrollTop, itemHeight, containerHeight, items.length, overscan])

    const visibleItems = useMemo(() => {
      return items
        .slice(visibleRange.start, visibleRange.end)
        .map((item, index) => ({
          item,
          index: visibleRange.start + index,
        }))
    }, [items, visibleRange])

    const totalHeight = items.length * itemHeight

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop)
    }, [])

    return (
      <div
        className={`overflow-auto ${className}`}
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: index * itemHeight,
                height: itemHeight,
                width: "100%",
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    )
  }
) as <T>(props: VirtualizedListProps<T>) => JSX.Element

VirtualizedList.displayName = "VirtualizedList"

interface MemoizedIconProps {
  icon: React.ComponentType<any>
  className?: string
  size?: number
}

/**
 * Memoized icon wrapper to prevent unnecessary re-renders
 */
export const MemoizedIcon: React.FC<MemoizedIconProps> = memo(
  ({ icon: Icon, className = "", size }) => {
    return <Icon className={className} size={size} />
  }
)

MemoizedIcon.displayName = "MemoizedIcon"

interface ThrottledInputProps {
  value: string
  onChange: (value: string) => void
  delay?: number
  placeholder?: string
  className?: string
}

/**
 * Throttled input to reduce excessive updates
 */
export const ThrottledInput: React.FC<ThrottledInputProps> = memo(
  ({ value, onChange, delay = 300, placeholder = "", className = "" }) => {
    const [localValue, setLocalValue] = React.useState(value)
    const timeoutRef = React.useRef<NodeJS.Timeout>()

    React.useEffect(() => {
      setLocalValue(value)
    }, [value])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setLocalValue(newValue)

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          onChange(newValue)
        }, delay)
      },
      [onChange, delay]
    )

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    return (
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
      />
    )
  }
)

ThrottledInput.displayName = "ThrottledInput"

/**
 * Performance monitoring hook
 */
export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = React.useRef<number>()
  const renderCount = React.useRef(0)

  React.useEffect(() => {
    renderStartTime.current = performance.now()
    renderCount.current++
  })

  React.useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current
      console.log(
        `${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`
      )
    }
  })

  return {
    renderCount: renderCount.current,
  }
}
