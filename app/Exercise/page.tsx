// app/Exercise/page.tsx
import { Metadata } from "next"
import { fetchAllPosts, fetchLang, fetchTopic } from "../../lib/FetchData"
import Exercise from "./Exercise"

export const metadata: Metadata = {
  title: "Practice Coding Exercises | CodeHub",
  description:
    "Solve hundreds of coding exercises with hints and explanations in English, Hindi, and Marathi. Filter by topic and programming language.",
  keywords: [
    "coding exercises",
    "practice C language",
    "CodeHub",
    "MERN stack questions",
    "code hints",
    "code explanations",
  ],
  openGraph: {
    title: "Practice Coding with CodeHub",
    description:
      "A growing library of code exercises in C, C++, JavaScript, MERN, and more. Choose topics, filter by language, and practice coding every day.",
    url: "https://codehubindia.in/Exercise",
    type: "website",
  },
}

export default async function ExercisePage() {
  const [posts, lang, topics] = await Promise.all([
    fetchAllPosts(),
    fetchLang(),
    fetchTopic(),
  ])

  return <Exercise posts={posts} lang={lang} topics={topics} />
}
