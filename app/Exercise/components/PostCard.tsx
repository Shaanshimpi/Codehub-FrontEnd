import React from "react"
import Link from "next/link"

function generateSlug(post) {
  if (!post || !post.Title) return "" // Prevent errors if post or Title is undefined

  return `${post.Title.slice(0, 50)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-")}-${post.documentId}` // Replace spaces with hyphens
}

function PostCard({ post }: { post: any }) {
  const slug = generateSlug(post)

  return (
    <Link href={`/Exercise/${slug}`} className="block h-full">
      <div className="relative z-0 flex h-full min-h-[200px] flex-col rounded-lg bg-blue-900 bg-opacity-30 p-3 pb-20 text-white transition-colors hover:bg-opacity-40">
        <span className="text-lg font-bold">{post.index + 1}.</span>
        <h3 className="text-xl">{post?.Title}</h3>

        <div className="meta absolute bottom-0 left-0 right-0 flex items-center justify-between gap-1 pb-2 pr-2">
          <div className="show-answer">
            <button className="m-2 min-w-[120px] rounded-lg bg-sky-600 px-3 py-1 text-lg hover:bg-blue-900 md:ml-2">
              Learn more
            </button>
          </div>
          <div className="flex flex-grow flex-row-reverse gap-2 text-gray-200">
            {post.programming_languages?.slice(0, 2).map((lang: object) => (
              <span
                className="rounded-md bg-slate-50 bg-opacity-20 p-1 text-center text-xs md:min-w-[60px]"
                key={lang.documentId}
              >
                {lang.Name}
              </span>
            ))}
            {(() => {
              let charLimit = 28 // Adjust this as needed
              let totalChars = 0
              const topicsToShow = []

              for (const topic of post.topics || []) {
                const topicLength = topic.Name.length + 2 // account for spacing/padding
                if (totalChars + topicLength <= charLimit) {
                  topicsToShow.push(topic)
                  totalChars += topicLength
                } else {
                  break
                }
              }

              return topicsToShow.map((topic: any) => (
                <span
                  className="rounded-md bg-slate-50 bg-opacity-20 p-1 text-xs"
                  key={topic.documentId}
                >
                  {topic.Name}
                </span>
              ))
            })()}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostCard
