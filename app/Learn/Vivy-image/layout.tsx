import type { Metadata } from "next"

// Temporarily hidden from search engines
export const metadata: Metadata = {
  title: "Vivy Image Studio - Coming Soon | CodeHub",
  description: "AI-powered image generation is coming soon to CodeHub.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function VivyImageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
