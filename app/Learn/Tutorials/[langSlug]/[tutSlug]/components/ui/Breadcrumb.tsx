/**
 * Enhanced breadcrumb component with proper Next.js navigation
 */
"use client"

import React, { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

/**
 * Enhanced breadcrumb component with proper Next.js navigation
 */

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loadingHref, setLoadingHref] = useState<string | null>(null)

  // Split items into non-current and current for mobile layout
  const nonCurrentItems = items.filter((item) => !item.current)
  const currentItem = items.find((item) => item.current)

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    setLoadingHref(href)
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <nav className={`text-sm ${className}`} aria-label="Breadcrumb">
      {/* Desktop: Show all items in one line */}
      <ol className="hidden items-center space-x-2 md:flex">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="mx-2 h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}

            {item.current ? (
              <span className="flex items-center gap-1 font-medium text-gray-900 dark:text-white">
                {item.icon && <span aria-hidden="true">{item.icon}</span>}
                <span title={item.label}>{item.label}</span>
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                onClick={(e) => handleNavigation(e, item.href!)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {loadingHref === item.href ? (
                  <Loader2
                    className="h-3 w-3 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  item.icon && <span aria-hidden="true">{item.icon}</span>
                )}
                <span title={item.label}>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                {item.icon && <span aria-hidden="true">{item.icon}</span>}
                <span title={item.label}>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>

      {/* Mobile: Show non-current items on first line, current item below */}
      <div className="flex flex-col gap-2 md:hidden">
        {/* First line: Home > Tutorials > Language */}
        <ol className="flex items-center space-x-2">
          {nonCurrentItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="mx-2 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}

              {item.href ? (
                <Link
                  href={item.href}
                  onClick={(e) => handleNavigation(e, item.href!)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {loadingHref === item.href ? (
                    <Loader2
                      className="h-3 w-3 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    item.icon && <span aria-hidden="true">{item.icon}</span>
                  )}
                  <span className="max-w-[80px] truncate" title={item.label}>
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  {item.icon && <span aria-hidden="true">{item.icon}</span>}
                  <span className="max-w-[80px] truncate" title={item.label}>
                    {item.label}
                  </span>
                </span>
              )}
            </li>
          ))}

          {/* Down arrow indicator */}
          {currentItem && (
            <li className="flex items-center">
              <svg
                className="mx-2 h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </li>
          )}
        </ol>

        {/* Second line: Current tutorial title */}
        {currentItem && (
          <div className="flex items-center gap-2 pl-1">
            {currentItem.icon && (
              <span aria-hidden="true">{currentItem.icon}</span>
            )}
            <span
              className="line-clamp-2 font-medium text-gray-900 dark:text-white"
              title={currentItem.label}
            >
              {currentItem.label}
            </span>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Breadcrumb
