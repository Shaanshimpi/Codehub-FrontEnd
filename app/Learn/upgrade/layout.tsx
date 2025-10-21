import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gold Membership - Free Premium Access | CodeHub",
  description:
    "Get completely FREE Gold Membership at CodeHub. Access all programming tutorials, exercises, and 60+ AI subscriptions including ChatGPT Plus, Claude Pro, Gemini Advanced. Free for all students.",
  keywords:
    "CodeHub Gold membership, free programming courses, ChatGPT Plus free, Claude Pro free, AI subscriptions free, premium coding tutorials, free coding bootcamp, free programming education",
  openGraph: {
    title: "Gold Membership - Completely FREE | CodeHub",
    description:
      "Get free access to premium tutorials, exercises, and 60+ AI subscriptions",
    url: "https://codehubindia.in/Learn/upgrade",
    type: "website",
    siteName: "CodeHub",
    images: [
      {
        url: "https://codehubindia.in/assets/logo-sqr.png",
        width: 1200,
        height: 630,
        alt: "CodeHub Gold Membership",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gold Membership - Completely FREE",
    description:
      "Get free access to premium tutorials and 60+ AI subscriptions",
    images: ["https://codehubindia.in/assets/logo-sqr.png"],
  },
  alternates: {
    canonical: "https://codehubindia.in/Learn/upgrade",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function UpgradeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
