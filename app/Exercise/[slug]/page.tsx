import { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchAllPosts } from "../../../lib/FetchData"
import PostCard from "../components/PostCard"
import ChatBot from "./ChatBot"
import ExerciseContent from "./ExerciseContent"

// Type for Post
type Post = {
  Title: string
  Code: string
  documentId: string
  programming_languages?: { Name: string }[]
}

function generateSlug(post: Post): string {
  if (!post?.Title) return ""
  return `${post.Title.slice(0, 50)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")}-${post.documentId}`
}

export async function generateStaticParams() {
  const posts = await fetchAllPosts()
  return posts.map((post: Post) => ({
    slug: generateSlug(post),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const posts = await fetchAllPosts()
  const documentId = params.slug?.split("-").pop()
  const post = posts.find((p: Post) => p?.documentId === documentId)

  if (!post) return {}

  const title = `Exercise: ${post.Title} | CodeHub India`
  const description = `Practice this ${post.programming_languages?.[0]?.Name || "C"} coding exercise: "${post.Title}". Get hints, code walkthroughs, and explanations.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://codehubindia.in/Exercise/${params.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    keywords: [
      "coding exercise",
      post.Title,
      post.programming_languages?.[0]?.Name || "",
      "CodeHub India",
      "programming practice",
      "code walkthrough",
      "beginner programming problems",
      ...(post?.topics.map((t) => t.name) ?? "Exercise"),
    ],
  }
}

export default async function ExercisePage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  if (!slug) return notFound()

  const posts = await fetchAllPosts()
  const documentId = slug.split("-").pop()
  const post = posts.find((p: Post) => p?.documentId === documentId)

  if (!post) return <p className="text-red-500">Post not found.</p>

  const codeString = post.Code
  const language = post.programming_languages?.[0]?.Name?.toLowerCase() || "c"

  // Fetch all posts here to find related posts
  const relatedPosts = posts.filter((arrpost) =>
    arrpost.topics?.some((topic) =>
      post.topics?.some(
        (postTopic) => postTopic.documentId === topic.documentId
      )
    )
  )

  return (
    <div className="md: relative bg-white pb-[5vh] text-black dark:bg-[#09090B] dark:text-white md:px-[30vh] md:py-[10vh]">
      {/* Render ExerciseContent */}
      <ExerciseContent
        post={post}
        codeString={codeString}
        language={language}
      />

      {/* Render ChatBot */}
      <ChatBot question={post.Title} code={codeString} />

      {/* Render Related Posts Section Below */}
      {relatedPosts.length > 0 && (
        <div className="related-questions mt-10">
          <h3 className="mb-4 text-2xl font-semibold">Related Questions</h3>
          <div className="grid gap-4 px-5 md:px-0">
            {relatedPosts.slice(0, 5).map((relatedPost, i) => (
              <PostCard key={i} post={{ ...relatedPost, index: i }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
