import React from "react"
import { getLanguages } from "@/lib/getData"
import TutorialPage from "./TutorialPage"

async function page() {
  try {
    const languages = await getLanguages()
    return (
      <div>
        <TutorialPage languages={languages || []} />
      </div>
    )
  } catch (error) {
    console.error("Error loading tutorials page:", error)
    // Return with empty languages array as fallback
    return (
      <div>
        <TutorialPage languages={[]} />
      </div>
    )
  }
}

export async function generateMetadata() {
  return {
    title: "Programming Tutorials - Learn Step by Step | CodeHub",
    description:
      "Explore comprehensive programming tutorials covering Python, JavaScript, C++, Java, and more. Interactive lessons with code examples, quizzes, and hands-on projects. Free tutorials for all skill levels.",
    keywords:
      "programming tutorials, step by step coding tutorials, learn programming online, interactive programming lessons, coding tutorials with examples, beginner programming tutorials, advanced programming courses",
    openGraph: {
      title: "Programming Tutorials - Learn Step by Step",
      description:
        "Explore comprehensive programming tutorials with interactive lessons and code examples",
      url: "https://codehubindia.in/Learn/Tutorials",
      type: "website",
      siteName: "CodeHub",
      images: [
        {
          url: "https://codehubindia.in/assets/logo-sqr.png",
          width: 1200,
          height: 630,
          alt: "CodeHub Programming Tutorials",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Programming Tutorials - Learn Step by Step",
      description:
        "Explore comprehensive programming tutorials with interactive lessons",
      images: ["https://codehubindia.in/assets/logo-sqr.png"],
    },
    alternates: {
      canonical: "https://codehubindia.in/Learn/Tutorials",
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default page
