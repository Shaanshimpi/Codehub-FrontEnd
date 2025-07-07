// app/Learn/page.tsx
import { fetchLang } from "@/lib/FetchData"
import { Metadata } from "next"
import Learn from "./Learn"

export const metadata: Metadata = {
  title:
    "Learn Programming | Tutorials for C, C++, Python, Java, JavaScript & More",
  description:
    "Explore beginner to advanced programming tutorials with examples, explanations, and exercises. Learn C, C++, Java, Python, JavaScript, and more at CodeHub.",
  keywords: [
    "learn programming",
    "coding tutorials",
    "C language tutorial",
    "JavaScript guide",
    "Python programming course",
    "Java tutorials",
    "programming for beginners",
    "CodeHub learn",
  ],
  openGraph: {
    title: "CodeHub Learn – Programming Tutorials for Every Language",
    description:
      "Master programming fundamentals and advanced topics with CodeHub’s tutorials. Learn C, C++, Python, Java, JavaScript, and more, all in one place.",
    url: "https://codehubindia.in/Learn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Programming Online | CodeHub",
    description:
      "Free tutorials to help you learn programming languages like C, C++, Python, Java, and JavaScript. Start your coding journey with CodeHub today.",
    site: "@CodeHubIndia",
  },
}

export default async function Page() {
  const res = await fetchLang()
  return (
    <div>
      <Learn res />
    </div>
  )
}
