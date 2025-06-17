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
    <Link href={`/Exercise/${slug}`} className="block h-full self-start">
      <div className="relative z-0 flex h-full min-h-[200px] flex-col rounded-lg bg-sky-200 p-3 pb-20 text-gray-800 transition-colors hover:bg-sky-400 dark:bg-[#1E2F53] dark:text-white dark:hover:bg-blue-800">
        {/* hover:bg-[#1E2F53] dark:bg-opacity-30 dark:hover:bg-[#1E293B] dark:hover:bg-opacity-40 */}
        <div className="flex justify-between">
          <span className="flex justify-start text-lg font-bold">
            {post.index + 1}.
          </span>

          {typeof post.difficultyLevel === "number" && (
            <span
              className={`text-s flex justify-end rounded-md px-2 py-1 font-semibold`}
              style={{
                color:
                  post.difficultyLevel === 1
                    ? "#16A34A"
                    : post.difficultyLevel === 2
                      ? "#FACC15"
                      : "#EF4444",
              }}
            >
              {post.difficultyLevel === 1
                ? "Easy"
                : post.difficultyLevel === 2
                  ? "Medium"
                  : "Hard"}
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold">{post?.Title}</h3>

        <div className="meta absolute bottom-0 left-0 right-0 flex items-center justify-between gap-1 pb-2 pr-2">
          <div className="show-answer">
            <button className="m-2 min-w-[120px] rounded-lg bg-blue-600 px-3 py-1 text-lg text-white hover:bg-blue-800 dark:bg-sky-600 dark:hover:bg-blue-900">
              Learn more
            </button>
          </div>

          <div className="flex flex-grow flex-row-reverse flex-wrap gap-2 text-white">
            {post.programming_languages?.slice(0, 2).map((lang: any) => (
              <span
                // className="rounded-md bg-gray-300 bg-opacity-40 p-1 text-center text-xs dark:bg-slate-50 dark:bg-opacity-20"
                className="rounded-md bg-gray-900 bg-opacity-40 p-1 text-xs dark:bg-slate-50 dark:bg-opacity-20"
                key={lang.documentId}
              >
                {lang.Name}
              </span>
            ))}

            {(() => {
              let charLimit = 28
              let totalChars = 0
              const topicsToShow = []

              for (const topic of post.topics || []) {
                const topicLength = topic.Name.length + 2
                if (totalChars + topicLength <= charLimit) {
                  topicsToShow.push(topic)
                  totalChars += topicLength
                } else {
                  break
                }
              }

              return topicsToShow.map((topic: any) => (
                <span
                  className="rounded-md bg-gray-900 bg-opacity-40 p-1 text-xs dark:bg-slate-50 dark:bg-opacity-20"
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
