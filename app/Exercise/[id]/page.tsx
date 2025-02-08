import { fetchAllPosts } from "../FetchData"
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

async function ExercisePage({ params }) {
  if (!params?.id) {
    return <p className="text-red-500">Invalid post ID.</p> // Fallback UI
  }

  const posts = await fetchAllPosts()
  const post = posts.find((p) => p?.documentId === params.id)

  if (!post) {
    return <p className="text-red-500">Post not found.</p> // Handle missing post gracefully
  }

  const codeString = extractCodeFromJSON(post?.Code || [])
  const language = post?.programming_languages?.[0]?.Name?.toLowerCase() || "c"

  return (
    <ExerciseContent post={post} codeString={codeString} language={language} />
  )
}

export default ExercisePage
