"use client"

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
  return (
    <div className="sidebar min-w-[15vw] pt-[10vh]">
      <ul>
        {tutorials.map((tutorial) => {
          const tutorialSlug = generateSlug(tutorial.Title)
          const isActive = pathname === `/Learn/${langSlug}/${tutorialSlug}`
          return (
            <li key={tutorial.id}>
              <Link href={`/Learn/${langSlug}/${tutorialSlug}`}>
                <div
                  className={`list-item px-4 py-2 text-xl transition-all ${
                    isActive ? "active" : ""
                  }`}
                >
                  {tutorial.Title}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Sidebar
