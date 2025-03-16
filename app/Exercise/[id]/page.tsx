// Import the ChatBot component
import { notFound } from "next/navigation"
import { fetchAllPosts } from "../../../lib/FetchData"
import ChatBot from "./ChatBot"
import ExerciseContent from "./ExerciseContent"

export async function generateStaticParams() {
  const posts = await fetchAllPosts()
  return posts.map((post) => ({
    id: post.documentId.toString(),
  }))
}

const extractCodeFromJSON = (codeArray) => {
  return codeArray
    .map((block) => block.children.map((child) => child.text).join(""))
    .join("\n")
}

async function ExercisePage({ params }: { params: { id: string } }) {
  if (!params?.id) {
    return notFound()
  }

  const posts = await fetchAllPosts()
  const post = posts.find((p) => p?.documentId === params.id)

  if (!post) {
    return <p className="text-red-500">Post not found.</p>
  }

  // const codeString = extractCodeFromJSON(post?.Code || [])
  const codeString = post?.Code
  const language = post?.programming_languages?.[0]?.Name?.toLowerCase() || "c"

  return (
    <div className="relative md:px-[30vh]">
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
