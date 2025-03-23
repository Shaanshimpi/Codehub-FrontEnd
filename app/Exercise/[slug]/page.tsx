// Import the ChatBot component
import { notFound } from "next/navigation"
import { fetchAllPosts } from "../../../lib/FetchData"
import ChatBot from "./ChatBot"
import ExerciseContent from "./ExerciseContent"

function generateSlug(post) {
  if (!post || !post.Title) return "" // Prevent errors if post or Title is undefined

  return `${post.Title.slice(0, 50)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-")}-${post.documentId}` // Replace spaces with hyphens
}

export async function generateStaticParams() {
  const posts = await fetchAllPosts()

  return posts.map((post) => ({
    slug: generateSlug(post),
  }))
}

const extractCodeFromJSON = (codeArray) => {
  return codeArray
    .map((block) => block.children.map((child) => child.text).join(""))
    .join("\n")
}

async function ExercisePage({ params }: { params: { slug: string } }) {
  if (!params?.slug) {
    return notFound()
  }

  const posts = await fetchAllPosts()
  const documentId = params?.slug.split("-").pop() // Extract the documentId from the slug
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
