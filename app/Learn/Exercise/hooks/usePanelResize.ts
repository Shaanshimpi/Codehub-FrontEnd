// Custom hook for managing panel resize functionality
import { useCallback, useState } from "react"

interface UsePanelResizeProps {
  initialWidth?: number
  minWidth?: number
  maxWidth?: number
}

interface UsePanelResizeReturn {
  panelWidth: number
  setPanelWidth: (width: number) => void
  handleMouseDown: (e: React.MouseEvent) => void
  resetWidth: () => void
}

/**
 * Custom hook for managing resizable panels
 */
export const usePanelResize = ({
  initialWidth = 50,
  minWidth = 20,
  maxWidth = 80,
}: UsePanelResizeProps = {}): UsePanelResizeReturn => {
  const [panelWidth, setPanelWidth] = useState(initialWidth)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidth = panelWidth

      const handleMouseMove = (e: MouseEvent) => {
        const containerWidth = window.innerWidth
        const deltaX = e.clientX - startX
        const deltaPercent = (deltaX / containerWidth) * 100
        const newWidth = Math.min(
          Math.max(startWidth + deltaPercent, minWidth),
          maxWidth
        )
        setPanelWidth(newWidth)
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [panelWidth, minWidth, maxWidth]
  )

  const resetWidth = useCallback(() => {
    setPanelWidth(initialWidth)
  }, [initialWidth])

  return {
    panelWidth,
    setPanelWidth,
    handleMouseDown,
    resetWidth,
  }
}
