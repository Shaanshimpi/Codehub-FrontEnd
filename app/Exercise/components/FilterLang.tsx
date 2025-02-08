"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

function FilterLang({ lang }: { lang: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const langParam = searchParams.get("lang")
  const pathname = usePathname()

  const handleLangChange = (langId: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("lang", langId) // Update or add the lang parameter
    router.push(`${pathname}?${params.toString()}`, { scroll: false }) // Update the URL without full reload
  }

  const handleClearFilters = () => {
    router.push(pathname, { scroll: false }) // Clears all search params
  }

  return (
    <div className="z-[1000] w-[60px] self-stretch">
      <div className="fixed flex w-[60px] flex-col gap-2">
        {/* Clear Button */}
        <button
          className="block w-full rounded-r-md bg-gray-500 py-2 text-lg font-semibold text-white transition-all hover:bg-gray-700"
          onClick={handleClearFilters}
        >
          All
        </button>

        {/* Language Buttons */}
        {lang?.map((item) => (
          <button
            key={item.documentId}
            className={`block w-[60px] flex-grow rounded-r-md py-2 text-xl text-white transition-all md:hover:w-[100px] ${
              item.documentId === langParam ? "bg-red-500" : "bg-primary-ch"
            }`}
            onClick={() => handleLangChange(item.documentId)}
          >
            {item.Name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterLang
