"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function Sidebar({
  tutorials,
  langSlug,
}: {
  tutorials: any[]
  langSlug: string
}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Prevent background scroll on mobile when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <>
      {/* Toggle Button (mobile only) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed left-2 top-[50vh] z-[501] translate-y-[-50%] transform rounded-full border border-gray-300 bg-white p-1 shadow transition-transform duration-300 ease-in-out dark:border-gray-700 dark:bg-slate-900 md:hidden ${isOpen ? "left-[90vw]" : "left-2"}`}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 z-[500] transform bg-white py-[10vh] transition-transform duration-300 ease-in-out dark:bg-slate-900 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:block md:h-full md:w-[15vw] md:min-w-[15vw] md:translate-x-0`}
        style={{ maxHeight: "100vh", overflowY: "auto" }}
        data-lenis-prevent
      >
        <ul className="mt-16 md:mt-0">
          {tutorials.map((tutorial) => {
            const tutorialSlug = generateSlug(tutorial.Title)
            const isActive = pathname === `/Learn/${langSlug}/${tutorialSlug}`
            return (
              <li key={tutorial.id}>
                <Link href={`/Learn/${langSlug}/${tutorialSlug}`}>
                  <button
                    className={`list-item px-4 py-2 text-xl transition-all ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {tutorial.Title}
                  </button>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default Sidebar
