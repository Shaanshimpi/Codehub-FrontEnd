// Enhanced keyboard navigation utilities for Exercise platform
"use client"

export type NavigationDirection =
  | "up"
  | "down"
  | "left"
  | "right"
  | "first"
  | "last"

interface FocusableElement extends HTMLElement {
  focus(): void
}

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (
  container: HTMLElement
): FocusableElement[] => {
  const focusableSelectors = [
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "a[href]",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(", ")

  return Array.from(
    container.querySelectorAll(focusableSelectors)
  ) as FocusableElement[]
}

/**
 * Enhanced focus trap for modal dialogs and complex components
 */
export class FocusTrap {
  private container: HTMLElement
  private firstFocusable: FocusableElement | null = null
  private lastFocusable: FocusableElement | null = null
  private isActive = false

  constructor(container: HTMLElement) {
    this.container = container
    this.updateFocusableElements()
  }

  private updateFocusableElements() {
    const focusableElements = getFocusableElements(this.container)
    this.firstFocusable = focusableElements[0] || null
    this.lastFocusable = focusableElements[focusableElements.length - 1] || null
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.isActive || event.key !== "Tab") return

    this.updateFocusableElements()

    if (!this.firstFocusable || !this.lastFocusable) return

    if (event.shiftKey) {
      // Backward navigation
      if (document.activeElement === this.firstFocusable) {
        event.preventDefault()
        this.lastFocusable.focus()
      }
    } else {
      // Forward navigation
      if (document.activeElement === this.lastFocusable) {
        event.preventDefault()
        this.firstFocusable.focus()
      }
    }
  }

  activate() {
    this.isActive = true
    document.addEventListener("keydown", this.handleKeyDown)

    // Focus the first focusable element
    if (this.firstFocusable) {
      this.firstFocusable.focus()
    }
  }

  deactivate() {
    this.isActive = false
    document.removeEventListener("keydown", this.handleKeyDown)
  }
}

/**
 * Arrow key navigation for lists and grids
 */
export class ArrowKeyNavigation {
  private container: HTMLElement
  private currentIndex = 0
  private isActive = false
  private orientation: "horizontal" | "vertical" | "grid" = "vertical"

  constructor(
    container: HTMLElement,
    orientation: "horizontal" | "vertical" | "grid" = "vertical"
  ) {
    this.container = container
    this.orientation = orientation
  }

  private getFocusableElements(): FocusableElement[] {
    return getFocusableElements(this.container)
  }

  private getCurrentIndex(): number {
    const elements = this.getFocusableElements()
    const activeElement = document.activeElement as HTMLElement
    const index = elements.findIndex((el) => el === activeElement)
    return index >= 0 ? index : 0
  }

  private focusElement(index: number) {
    const elements = this.getFocusableElements()
    if (elements[index]) {
      elements[index].focus()
      this.currentIndex = index
    }
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.isActive) return

    const elements = this.getFocusableElements()
    if (elements.length === 0) return

    this.currentIndex = this.getCurrentIndex()

    switch (event.key) {
      case "ArrowUp":
        if (this.orientation === "vertical" || this.orientation === "grid") {
          event.preventDefault()
          const newIndex =
            this.currentIndex > 0 ? this.currentIndex - 1 : elements.length - 1
          this.focusElement(newIndex)
        }
        break

      case "ArrowDown":
        if (this.orientation === "vertical" || this.orientation === "grid") {
          event.preventDefault()
          const newIndex =
            this.currentIndex < elements.length - 1 ? this.currentIndex + 1 : 0
          this.focusElement(newIndex)
        }
        break

      case "ArrowLeft":
        if (this.orientation === "horizontal" || this.orientation === "grid") {
          event.preventDefault()
          const newIndex =
            this.currentIndex > 0 ? this.currentIndex - 1 : elements.length - 1
          this.focusElement(newIndex)
        }
        break

      case "ArrowRight":
        if (this.orientation === "horizontal" || this.orientation === "grid") {
          event.preventDefault()
          const newIndex =
            this.currentIndex < elements.length - 1 ? this.currentIndex + 1 : 0
          this.focusElement(newIndex)
        }
        break

      case "Home":
        event.preventDefault()
        this.focusElement(0)
        break

      case "End":
        event.preventDefault()
        this.focusElement(elements.length - 1)
        break
    }
  }

  activate() {
    this.isActive = true
    this.container.addEventListener("keydown", this.handleKeyDown)
  }

  deactivate() {
    this.isActive = false
    this.container.removeEventListener("keydown", this.handleKeyDown)
  }
}

/**
 * Enhanced keyboard shortcuts manager
 */
export class KeyboardShortcuts {
  private shortcuts = new Map<string, (event: KeyboardEvent) => void>()
  private isActive = false

  private getShortcutKey(event: KeyboardEvent): string {
    const modifiers = []
    if (event.ctrlKey) modifiers.push("ctrl")
    if (event.altKey) modifiers.push("alt")
    if (event.shiftKey) modifiers.push("shift")
    if (event.metaKey) modifiers.push("meta")

    modifiers.push(event.key.toLowerCase())
    return modifiers.join("+")
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.isActive) return

    const shortcutKey = this.getShortcutKey(event)
    const handler = this.shortcuts.get(shortcutKey)

    if (handler) {
      event.preventDefault()
      handler(event)
    }
  }

  add(shortcut: string, handler: (event: KeyboardEvent) => void) {
    this.shortcuts.set(shortcut.toLowerCase(), handler)
  }

  remove(shortcut: string) {
    this.shortcuts.delete(shortcut.toLowerCase())
  }

  activate() {
    this.isActive = true
    document.addEventListener("keydown", this.handleKeyDown)
  }

  deactivate() {
    this.isActive = false
    document.removeEventListener("keydown", this.handleKeyDown)
  }

  clear() {
    this.shortcuts.clear()
  }
}

/**
 * Skip links for accessibility navigation
 */
export const createSkipLink = (
  text: string,
  targetId: string,
  insertAfter?: HTMLElement
): HTMLElement => {
  const skipLink = document.createElement("a")
  skipLink.href = `#${targetId}`
  skipLink.textContent = text
  skipLink.className = `
    absolute left-[-9999px] top-auto w-[1px] h-[1px] overflow-hidden
    focus:left-6 focus:top-6 focus:w-auto focus:h-auto focus:overflow-auto
    focus:z-50 focus:p-2 focus:bg-primary-600 focus:text-white focus:rounded-md
    focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
    transition-all duration-200
  `

  // Insert skip link
  const insertTarget =
    insertAfter || (document.body.firstElementChild as HTMLElement)
  if (insertTarget) {
    insertTarget.parentNode?.insertBefore(skipLink, insertTarget)
  } else {
    document.body.prepend(skipLink)
  }

  // Handle click to focus target
  skipLink.addEventListener("click", (event) => {
    event.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  })

  return skipLink
}

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Save current focus and restore it later
   */
  saveFocus(): () => void {
    const activeElement = document.activeElement as HTMLElement
    return () => {
      if (activeElement && activeElement.focus) {
        activeElement.focus()
      }
    }
  },

  /**
   * Focus the first focusable element in container
   */
  focusFirst(container: HTMLElement): boolean {
    const focusable = getFocusableElements(container)
    if (focusable[0]) {
      focusable[0].focus()
      return true
    }
    return false
  },

  /**
   * Focus the last focusable element in container
   */
  focusLast(container: HTMLElement): boolean {
    const focusable = getFocusableElements(container)
    if (focusable.length > 0) {
      focusable[focusable.length - 1].focus()
      return true
    }
    return false
  },

  /**
   * Check if element is currently visible and focusable
   */
  isFocusable(element: HTMLElement): boolean {
    if (
      element.hasAttribute("disabled") ||
      element.getAttribute("aria-hidden") === "true"
    ) {
      return false
    }

    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  },
}

/**
 * Live region announcer for screen readers
 */
export class LiveRegion {
  private politeRegion: HTMLElement
  private assertiveRegion: HTMLElement

  constructor() {
    this.politeRegion = this.createRegion("polite")
    this.assertiveRegion = this.createRegion("assertive")
  }

  private createRegion(priority: "polite" | "assertive"): HTMLElement {
    const region = document.createElement("div")
    region.setAttribute("aria-live", priority)
    region.setAttribute("aria-atomic", "true")
    region.className = "sr-only"
    document.body.appendChild(region)
    return region
  }

  announce(message: string, priority: "polite" | "assertive" = "polite") {
    const region =
      priority === "polite" ? this.politeRegion : this.assertiveRegion

    // Clear and then set the message to ensure it's announced
    region.textContent = ""
    setTimeout(() => {
      region.textContent = message
    }, 100)
  }

  destroy() {
    this.politeRegion.remove()
    this.assertiveRegion.remove()
  }
}
