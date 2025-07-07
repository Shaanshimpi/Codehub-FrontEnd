"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// Function to generate slugs from names
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-") // Replace multiple dashes with a single dash
}

export default function LearnPage({ res }) {
  const languages = res // <-- ✅ no `.data`
  const pathname = usePathname()

  const getParentPath = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    pathSegments.pop()
    return "/" + pathSegments.join("/")
  }

  const parentPath = getParentPath()
  return (
    <div className="p-[10vh]">
      <h1 className="mb-6 text-3xl font-bold">Learn Programming Languages</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {languages.map((lang) => (
          <Link
            href={`/${parentPath}/${generateSlug(lang.Name)}`}
            key={lang.id}
          >
            <div className="rounded-lg border p-6 shadow transition hover:shadow-lg">
              <h2 className="mb-2 text-xl font-semibold">{lang.Name}</h2>
              {lang.logo && (
                <img
                  src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${lang.logo.url}`}
                  alt={lang.Name}
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
