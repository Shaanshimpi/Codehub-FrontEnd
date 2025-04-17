import { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchAllPosts } from "../../../lib/FetchData"
import ChatBot from "./ChatBot"
import ExerciseContent from "./ExerciseContent"

function generateSlug(post) {
  if (!post || !post.Title) return ""
  return `${post.Title.slice(0, 50)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")}-${post.documentId}`
}

export async function generateStaticParams() {
  const posts = await fetchAllPosts()
  return posts.map((post) => ({
    slug: generateSlug(post),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const posts = await fetchAllPosts()
  const documentId = params?.slug?.split("-").pop()
  const post = posts.find((p) => p?.documentId === documentId)

  if (!post) return {}

  const title = `Exercise: ${post.Title}`
  const description = `Solve this coding exercise on "${post.Title}" using ${post?.programming_languages?.[0]?.Name || "your favorite language"}. Includes hints, code, and explanation.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://codehubindia.in/Exercise/${params.slug}`,
      type: "article",
    },
    keywords: [
      "coding exercise",
      post?.Title,
      post?.programming_languages?.[0]?.Name || "",
      "CodeHub",
      "programming practice",
      "code explanation",
    ],
  }
}

async function ExercisePage({ params }: Promise<{ params: { slug: string } }>) {
  const { slug } = await params
  if (!slug) return notFound()

  const posts = await fetchAllPosts()
  const documentId = params?.slug.split("-").pop()
  const post = posts.find((p) => p?.documentId === documentId)

  if (!post) {
    return <p className="text-red-500">Post not found.</p>
  }

  const codeString = post?.Code
  const language = post?.programming_languages?.[0]?.Name?.toLowerCase() || "c"

  return (
    <div className="relative bg-[#09090B] md:px-[30vh] md:py-[10vh]">
      <ExerciseContent
        post={post}
        codeString={codeString}
        language={language}
      />
      <ChatBot
        question={post?.Title || "No question available"}
        code={codeString}
      />
    </div>
  )
}

export default ExercisePage
