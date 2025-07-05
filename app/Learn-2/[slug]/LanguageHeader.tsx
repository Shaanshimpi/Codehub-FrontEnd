import React from "react"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface LanguageHeaderProps {
  language: {
    title: string
    slug: string
    logo?: {
      url: string
      alt?: string
    }
  }
}

const LanguageHeader: React.FC<LanguageHeaderProps> = ({ language }) => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-[10vh] text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/learn"
          className="mb-6 inline-flex items-center text-sky-100 transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Learn
        </Link>

        <div className="flex items-center space-x-6">
          {language.logo && (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white p-3">
              <Image
                src={language.logo.url}
                alt={language.logo.alt || `${language.title} logo`}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          )}

          <div>
            <h1 className="mb-2 text-5xl font-bold">{language.title}</h1>
            <p className="text-xl text-sky-100">
              Master {language.title} programming with our structured learning
              path
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LanguageHeader
