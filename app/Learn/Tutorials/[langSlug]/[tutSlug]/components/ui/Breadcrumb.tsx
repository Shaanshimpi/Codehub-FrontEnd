/**
 * Enhanced breadcrumb component with proper Next.js navigation
 */
"use client"

import React from "react"
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

  const handleItemClick = (href: string) => {
    router.push(href)
  }

  return (
    <nav
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
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
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {item.icon && <span aria-hidden="true">{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                {item.icon && <span aria-hidden="true">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
