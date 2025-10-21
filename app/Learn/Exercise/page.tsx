import React from "react"
import { getLanguages } from "@/lib/getData"
import ExercisePage from "./ExercisePage"

async function page() {
  const languages = await getLanguages()

  return (
    <div>
      <ExercisePage languages={languages} />
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: "Programming Exercises - Practice Coding Challenges | CodeHub",
    description:
      "Sharpen your programming skills with 500+ hands-on coding exercises. Practice Python, JavaScript, C++, Java, and more with instant feedback, hints, and detailed solutions. Free coding challenges for all levels.",
    keywords:
      "programming exercises, coding practice, coding challenges, programming practice problems, learn coding by doing, interactive coding exercises, programming drills, code kata, coding workout",
    openGraph: {
      title: "Programming Exercises - Practice Coding Challenges",
      description:
        "Sharpen your programming skills with 500+ hands-on coding exercises",
      url: "https://codehubindia.in/Learn/Exercise",
      type: "website",
      siteName: "CodeHub",
      images: [
        {
          url: "https://codehubindia.in/assets/logo-sqr.png",
          width: 1200,
          height: 630,
          alt: "CodeHub Programming Exercises",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Programming Exercises - Practice Coding Challenges",
      description: "Sharpen your programming skills with hands-on exercises",
      images: ["https://codehubindia.in/assets/logo-sqr.png"],
    },
    alternates: {
      canonical: "https://codehubindia.in/Learn/Exercise",
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default page
