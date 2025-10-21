import React from "react"
import { getLanguages } from "@/lib/getData"
import LearnPage from "./LearnPage"

async function page() {
  try {
    const languages = await getLanguages()
    return (
      <div>
        <LearnPage languages={languages || []} />
      </div>
    )
  } catch (error) {
    console.error("Error loading learn page:", error)
    return (
      <div>
        <LearnPage languages={[]} />
      </div>
    )
  }
}

export async function generateMetadata() {
  return {
    title: "Learn Programming - Interactive Tutorials & Exercises | CodeHub",
    description:
      "Master programming with CodeHub's interactive learning platform. Access comprehensive tutorials, hands-on exercises, and AI-powered coding assistance for Python, JavaScript, C++, Java, and more.",
    keywords:
      "learn programming, coding tutorials, programming exercises, interactive coding, learn to code, programming courses, coding education, CodeHub learning",
    openGraph: {
      title: "Learn Programming - Interactive Tutorials & Exercises",
      description:
        "Master programming with interactive tutorials, exercises, and AI assistance",
      url: "https://codehubindia.in/Learn",
      type: "website",
      siteName: "CodeHub",
      images: [
        {
          url: "https://codehubindia.in/assets/logo-sqr.png",
          width: 1200,
          height: 630,
          alt: "CodeHub Learn Platform",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Learn Programming - Interactive Tutorials & Exercises",
      description:
        "Master programming with interactive tutorials and exercises",
      images: ["https://codehubindia.in/assets/logo-sqr.png"],
    },
    alternates: {
      canonical: "https://codehubindia.in/Learn",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default page
